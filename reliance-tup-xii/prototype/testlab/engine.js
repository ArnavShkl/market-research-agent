// JioMausam rain engine: a line-by-line port of prototype/pipeline/rain_pipeline.py (pycomlink steps included).
// Runs in the page, in a Web Worker, and under Node for verification against the Python results.
const Engine = (() => {
  const WIN = 60, HALF = 30, GAP = 5, NLAST = 5, TAU = 15, DT = 1, RMIN = 0.1;

  // numba's min(): keep the first value unless a later one is strictly smaller (NaN-aware like the Python run)
  const nmin2 = (x, y) => (y < x ? y : x);
  const nmin3 = (x, y, z) => { let r = x; if (y < r) r = y; if (z < r) r = z; return r; };

  // numpy quantile, method 'linear' (same virtual index and lerp as numpy)
  function select(arr, k) { // in-place quickselect, returns k-th smallest
    let lo = 0, hi = arr.length - 1;
    while (hi > lo) {
      const p = arr[(lo + hi) >> 1]; let i = lo, j = hi;
      while (i <= j) { while (arr[i] < p) i++; while (arr[j] > p) j--; if (i <= j) { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; i++; j--; } }
      if (k <= j) hi = j; else if (k >= i) lo = i; else return arr[k];
    }
    return arr[k];
  }
  function quantile(vals, n, q) {
    const vi = n * q + (1 + q * (1 - 1 - 1)) - 1;
    const lo = Math.floor(vi), g = vi - lo, hi = Math.min(lo + 1, n - 1);
    const a = select(vals, lo); let b = a;
    if (hi !== lo) { b = Infinity; for (let i = lo + 1; i < n; i++) if (vals[i] < b) b = vals[i]; }
    const d = b - a;
    return g >= 0.5 ? b - d * (1 - g) : a + d * g;
  }

  // One channel, one link: raw TRSL (x10 dB, 0 = missing) -> rain rate per minute
  function channel(q, aa, bb, L, P, out) {
    const n = q.length, trsl = new Float64Array(n);
    for (let i = 0; i < n; i++) trsl[i] = q[i] === 0 ? NaN : q[i] / 10;
    // fill gaps of up to 5 minutes by straight lines (xarray interpolate_na, max_gap='5min')
    let last = -1;
    for (let i = 0; i < n; i++) {
      if (trsl[i] === trsl[i]) {
        if (last >= 0 && i - last > 1 && i - last <= GAP) {
          const y0 = trsl[last], y1 = trsl[i];
          for (let k = last + 1; k < i; k++) trsl[k] = y0 + (y1 - y0) * (k - last) / (i - last);
        }
        last = i;
      }
    }
    // rolling standard deviation over 60 minutes, centred (window i-30 .. i+29), NaN if any reading missing.
    // Windows of original readings use exact integer sums (readings are whole tenths of a dB);
    // windows that include gap-filled readings are computed directly.
    const sd = new Float64Array(n).fill(NaN), filled = new Uint8Array(n);
    for (let i = 0; i < n; i++) filled[i] = q[i] === 0 && trsl[i] === trsl[i] ? 1 : 0;
    let s1 = 0, s2 = 0, bad = 0, nf = 0;
    const add = (i, sg) => { const v = trsl[i]; if (v !== v) bad += sg; else if (filled[i]) nf += sg; else { const Q = q[i]; s1 += sg * Q; s2 += sg * Q * Q; } };
    for (let i = 0; i < WIN && i < n; i++) add(i, 1);
    for (let c = HALF; c + WIN - HALF <= n; c++) {
      if (c > HALF) { add(c - HALF - 1, -1); add(c + WIN - HALF - 1, 1); }
      if (bad !== 0) continue;
      if (nf === 0) { sd[c] = Math.sqrt((s2 - s1 * s1 / WIN) / WIN) / 10; continue; }
      let s = 0, m = 0;
      for (let k = c - HALF; k < c + WIN - HALF; k++) m += trsl[k];
      m /= WIN;
      for (let k = c - HALF; k < c + WIN - HALF; k++) { const d = trsl[k] - m; s += d * d; }
      sd[c] = Math.sqrt(s / WIN);
    }
    // wet if the wobble beats (multiplier x the 80th percentile of this channel's wobble)
    const tmp = new Float64Array(n); let m = 0;
    for (let i = 0; i < n; i++) if (sd[i] === sd[i]) tmp[m++] = sd[i];
    const thr = quantile(tmp.subarray(0, m), m, 0.8) * P.thrMult;
    const wet = new Uint8Array(n);
    for (let i = 0; i < n; i++) wet[i] = sd[i] > thr ? 1 : 0;
    // dry baseline held constant through each wet spell (pycomlink baseline_constant, last 5 dry values)
    const bl = new Float64Array(n);
    for (let i = 0; i < NLAST; i++) bl[i] = trsl[i];
    for (let i = NLAST; i < n; i++) {
      if (wet[i] && !wet[i - 1]) { let s = 0; for (let k = i - NLAST; k < i; k++) s += bl[k]; bl[i] = s / NLAST; }
      else if (wet[i] && wet[i - 1]) bl[i] = bl[i - 1];
      else bl[i] = trsl[i];
    }
    // wet-antenna attenuation (Schleiss et al. 2013)
    const waa = new Float64Array(n), wm = P.waaMax;
    for (let i = 1; i < n; i++) {
      const Aw = trsl[i] - bl[i];
      waa[i] = wet[i] ? nmin3(Aw, wm, waa[i - 1] + (wm - waa[i - 1]) * 3 * DT / TAU) : nmin2(Aw, wm);
    }
    // rain attenuation -> rain rate with the ITU-R k-R power law
    const R = out || new Float64Array(n), aL = aa * L, ib = 1 / bb;
    for (let i = 0; i < n; i++) {
      let A = trsl[i] - bl[i] - waa[i];
      if (!(A > 0)) { R[i] = 0; continue; }
      const r = Math.pow(A / aL, ib);
      R[i] = r < RMIN ? 0 : r;
    }
    return { trsl, sd, thr, wet, bl, waa, R };
  }

  // Whole link: mean of its channels, then hourly means. Returns Float64Array(nH)
  function link(sig, M, li, P, detail) {
    const nT = M.nT, nC = M.nC, nH = M.nH, Rsum = new Float64Array(nT), ch = [];
    for (let c = 0; c < nC; c++) {
      const q = sig.subarray((li * nC + c) * nT, (li * nC + c + 1) * nT);
      const r = channel(q, M.a[li][c], M.b[li][c], M.L[li], P);
      for (let i = 0; i < nT; i++) Rsum[i] += r.R[i];
      if (detail) ch.push(r);
    }
    const Rm = new Float64Array(nT); for (let i = 0; i < nT; i++) Rm[i] = Rsum[i] / nC;
    const h = new Float64Array(nH);
    for (let k = 0; k < nH; k++) { let s = 0; for (let i = k * 60; i < k * 60 + 60; i++) s += Rm[i]; h[k] = s / 60; }
    return detail ? { hourly: h, minute: Rm, ch } : h;
  }

  function runAll(sig, M, P, progress) {
    const Rh = new Float64Array(M.nL * M.nH);
    for (let li = 0; li < M.nL; li++) {
      Rh.set(link(sig, M, li, P), li * M.nH);
      if (progress && li % 25 === 24) progress((li + 1) / M.nL);
    }
    return Rh;
  }

  // ---------- scoring (same definitions as rain_pipeline.py) ----------
  function corr(x, y) {
    const n = x.length; if (n < 2) return NaN;
    let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { const dx = x[i] - mx, dy = y[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
    return sxy / Math.sqrt(sxx * syy);
  }
  const fin = v => v === v && v !== Infinity && v !== -Infinity;

  // IDW map from link midpoints to covered 4 km squares (8 nearest links within 20 km, weight 1/d^2)
  function idw(vals, M, D, out) {
    const nc = M.nCells;
    for (let j = 0; j < nc; j++) {
      let sw = 0, swv = 0;
      for (let k = 0; k < 8; k++) {
        const d = D.d8[j * 8 + k]; if (d < 0) continue;
        const v = vals[D.i8[j * 8 + k]]; if (!fin(v)) continue;
        const w = 1 / Math.pow(Math.max(d, 0.5), 2); sw += w; swv += w * v;
      }
      out[j] = sw > 0 ? swv / sw : NaN;
    }
    return out;
  }

  function score(Rh, M, D, opt) {
    const nL = M.nL, nH = M.nH, calH = opt.calDays * 24, T = opt.trigger;
    // one network-wide scale factor from the calibration days only
    let sr = 0, sc = 0;
    for (let l = 0; l < nL; l++) for (let h = 0; h < calH; h++) {
      const r = D.refh[l * nH + h], c = Rh[l * nH + h];
      if (fin(r)) sr += r; if (fin(c)) sc += c;
    }
    const K = sr / sc;
    // pooled hourly comparison on the unseen days
    const xa = [], ya = [];
    for (let l = 0; l < nL; l++) for (let h = calH; h < nH; h++) {
      const c = Rh[l * nH + h] * K, r = D.refh[l * nH + h];
      if (fin(c) && fin(r)) { xa.push(c); ya.push(r); }
    }
    let sa = 0, sb = 0; for (let i = 0; i < xa.length; i++) { sa += xa[i]; sb += ya[i]; }
    const rHourly = corr(xa, ya), bias = sa / sb;
    // network average
    const nx = [], ny = [];
    for (let h = calH; h < nH; h++) {
      let s = 0, n = 0, t = 0;
      for (let l = 0; l < nL; l++) { s += Rh[l * nH + h] * K; const r = D.refh[l * nH + h]; if (fin(r)) { t += r; n++; } }
      nx.push(s / nL); ny.push(n ? t / n : NaN);
    }
    const rNet = corr(nx, ny);
    // each link on its own
    const rl = [], linkR = new Float64Array(nL).fill(NaN);
    for (let l = 0; l < nL; l++) {
      const x = [], y = []; let ys = 0;
      for (let h = calH; h < nH; h++) { const c = Rh[l * nH + h] * K, r = D.refh[l * nH + h]; if (fin(c) && fin(r)) { x.push(c); y.push(r); ys += r; } }
      if (x.length > 100 && ys > 5) { const v = corr(x, y); if (fin(v)) { rl.push(v); linkR[l] = v; } }
    }
    const srt = rl.slice().sort((p, q) => p - q), mid = srt.length >> 1;
    const medLink = srt.length % 2 ? srt[mid] : (srt[mid - 1] + srt[mid]) / 2;
    const share07 = rl.filter(v => v > 0.7).length / rl.length;
    // street-level map vs radar map
    const nc = M.nCells, cml = new Float64Array(nH * nc), tmpV = new Float64Array(nL), tmpO = new Float64Array(nc);
    for (let h = 0; h < nH; h++) {
      for (let l = 0; l < nL; l++) tmpV[l] = Rh[l * nH + h] * K;
      idw(tmpV, M, D, tmpO); cml.set(tmpO, h * nc);
    }
    const ax = [], ay = [];
    for (let h = calH; h < nH; h++) for (let j = 0; j < nc; j++) { const c = cml[h * nc + j], r = D.radc[h * nc + j]; if (fin(c) && fin(r)) { ax.push(c); ay.push(r); } }
    const rAreal = corr(ax, ay);
    // payout trigger: >= T mm in any 3-hour window ending that day, per square; compare our decision with radar's
    const days = Math.floor(nH / 24), trig = (src) => {
      const out = new Uint8Array(days * nc);
      for (let j = 0; j < nc; j++) {
        const cs = new Float64Array(nH + 1);
        for (let h = 0; h < nH; h++) { const v = src[h * nc + j]; cs[h + 1] = cs[h] + (fin(v) ? v : 0); }
        for (let e = 2; e < nH; e++) if (cs[e + 1] - cs[e - 2] >= T) out[Math.floor(e / 24) * nc + j] = 1;
      }
      return out;
    };
    const tc = trig(cml), tr = trig(D.radc);
    let hit = 0, miss = 0, fa = 0, cn = 0;
    for (let d = opt.calDays; d < days; d++) for (let j = 0; j < nc; j++) {
      const a = tc[d * nc + j], b = tr[d * nc + j];
      if (a && b) hit++; else if (!a && b) miss++; else if (a && !b) fa++; else cn++;
    }
    const tot = hit + miss + fa + cn;
    return { K, rHourly, bias, rNet, medLink, share07, nLinksR: rl.length, rAreal, linkR, cml, tc, tr, days,
      bt: { cellDays: tot, events: hit + miss, hit, miss, fa, agree: (hit + cn) / tot, pod: hit / (hit + miss), far: fa / (hit + fa) } };
  }

  function decode(bytes, M) {
    const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), L = M.layout;
    const mk = (k, C) => new C(buf, L[k].offset, L[k].length);
    return { sig: mk('sig', Uint16Array), refh: mk('refh', Float32Array), radc: mk('radc', Float32Array), d8: mk('d8', Float64Array), i8: mk('i8', Uint16Array) };
  }

  return { channel, link, runAll, score, idw, decode, corr };
})();
if (typeof module !== 'undefined') module.exports = Engine;
