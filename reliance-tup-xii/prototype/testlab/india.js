// Mausam Kavach pricing and stress test: port of prototype/india/india_layer.py and stress_test.py
const India = (() => {
  const mm = v => v == null ? NaN : (v / 100) * 25.4;          // inches -> mm
  const degC = v => v == null ? NaN : ((v / 10) - 32) * 5 / 9;  // F -> C
  function triggerDays(st, peril, th) {
    const src = peril === 'rain' ? st.prcp : st.tmax, f = peril === 'rain' ? mm : degC;
    return src.map(yr => { let n = 0; for (const v of yr) if (f(v) >= th) n++; return n; });
  }
  function price(st, peril, th, cap, pay, lr) {
    const days = triggerDays(st, peril, th), paid = days.map(n => Math.min(n, cap));
    const meanDays = days.reduce((s, v) => s + v, 0) / days.length, meanPaid = paid.reduce((s, v) => s + v, 0) / paid.length;
    const premYear = meanPaid * pay / lr;
    const ratio = paid.map(p => premYear > 0 ? p * pay / premYear : 0);
    let w = -1; ratio.forEach((r, i) => { if (w < 0 || r > ratio[w] || (r === ratio[w] && days[i] > days[w])) w = i; });
    return { years: st.years, days, paid, meanDays, meanPaid, premYear, premMonth: premYear / 12, ratio,
      worst: { year: st.years[w], days: days[w], paid: paid[w], ratio: ratio[w] }, over100: ratio.filter(r => r > 1).length, maxPayout: cap * pay };
  }
  function hyperlocal(pairs, th) {
    let heavy = 0, lt = 0;
    for (const [, s, c] of pairs) { const a = mm(s), b = mm(c); if (a >= th || b >= th) { heavy++; if (Math.min(a, b) / Math.max(a, b) < 0.5) lt++; } }
    return { days: pairs.length, heavy, lt, share: heavy ? lt / heavy : 0 };
  }
  return { price, hyperlocal, mm, degC, triggerDays };
})();
if (typeof module !== 'undefined') module.exports = India;
