// JioMausam elimination-round presentation, draft 2 (9 slides, 3 minutes).
// Story: problem -> insight -> proof and its limit -> insurance-grade engine -> product -> who pays -> money -> ask -> vision.
// Transitions and animations are added afterwards by motion_v2.py.
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const Fa = require('react-icons/fa6');
const { applyTheme } = require('/root/.claude/skills/synced/3d7cc9ae-5f86-4c3a-8704-db46492bec5e_cb55a847-437e-4193-a077-dac30ae7157e/pptx/scripts/apply_theme.js');

const A = (f) => __dirname + '/assets/' + f;
const D = JSON.parse(fs.readFileSync(A('deck_data.json'), 'utf8'));

const THEME = {
  name: 'JioMausam Night', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: { dk1: '0B1020', lt1: 'FFFFFF', dk2: '1A2246', lt2: 'EEF1F7', accent1: 'F5A623', accent2: '3987E5', accent3: 'D95926', accent4: '1BAF7A', accent5: 'E5484D', accent6: '98A2C0', hlink: 'F5A623', folHlink: 'C98500' },
};
const W = 13.333, H = 7.5, M = 0.6;
const INK = 'EEF1F7', MUTE = '98A2C0', SOFT = 'B9C2D8', SA = 'F5A623', BLUE = '3987E5', ORANGE = 'D95926', GREEN = '1BAF7A', RED = 'E5484D';
const CARD = '141B36', CARD2 = '1C2447', LINE = '2A3357', DARKTXT = '1A1200';

async function icon(name, color, size = 256) {
  const C = Fa[name]; if (!C) throw new Error('no icon ' + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(C, { color: '#' + color, size }));
  const png = await sharp(Buffer.from(svg)).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return 'image/png;base64,' + png.toString('base64');
}

(async () => {
  const I = {};
  const need = {
    rain: ['FaCloudShowersHeavy', BLUE], flood: ['FaHouseFloodWater', BLUE], bike: ['FaMotorcycle', BLUE], wallet: ['FaWallet', SA],
    drop: ['FaDroplet', BLUE], info: ['FaCircleInfo', SA], tower: ['FaTowerBroadcast', SA], dish: ['FaSatelliteDish', INK], gauge: ['FaGaugeHigh', INK],
    sat: ['FaSatellite', INK], chip: ['FaMicrochip', SA], store: ['FaStore', INK], user: ['FaUserCheck', INK], shield: ['FaShieldHalved', INK],
    bank: ['FaBuildingColumns', INK], warn: ['FaTriangleExclamation', ORANGE], ok: ['FaCircleCheck', GREEN], chart: ['FaChartLine', SA],
    map: ['FaMapLocationDot', SA], target: ['FaBullseye', SA], bolt: ['FaBolt', SA], flag: ['FaFlagCheckered', SA], cart: ['FaCartShopping', INK],
    towerInk: ['FaTowerBroadcast', INK], chipInk: ['FaMicrochip', INK], rupee: ['FaIndianRupeeSign', DARKTXT], rainInk: ['FaCloudShowersHeavy', INK],
  };
  for (const [k, [n, c]] of Object.entries(need)) I[k] = await icon(n, c);

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'JioMausam · Reliance T.U.P XII · Elimination round';
  pres.author = 'JioMausam team';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.defineSlideMaster({ title: 'NIGHT', background: { path: A('bg.jpg') }, objects: [] });
  pres.defineSlideMaster({ title: 'BLACK', background: { color: '05070D' }, objects: [] });
  pres.addSection({ title: 'Elimination round' });
  const sec = { sectionTitle: 'Elimination round' };

  // ---------- shared pieces ----------
  const T = (s, text, o) => s.addText(text, Object.assign({ margin: 0, isTextBox: true, fontFace: 'Calibri', color: INK, valign: 'top' }, o));
  function brand(s) {
    T(s, 'JioMausam', { x: M, y: 0.32, w: 3, h: 0.4, fontFace: 'Cambria', fontSize: 15, bold: true, objectName: '!!brand' });
    s.addImage({ path: A('tower.png'), x: W - M - 0.42, y: 0.22, w: 0.42, h: 0.6, objectName: '!!tower' });
  }
  function head(s, kicker, title) {
    brand(s);
    T(s, kicker.toUpperCase(), { x: M, y: 0.95, w: 9, h: 0.3, fontSize: 11, bold: true, color: SA, charSpacing: 3, objectName: 'kicker' });
    T(s, title, { x: M, y: 1.28, w: W - 2 * M, h: 0.75, fontFace: 'Cambria', fontSize: 32, bold: true, color: 'FFFFFF', objectName: 'title' });
  }
  const foot = (s, text) => T(s, text, { x: M, y: H - 0.48, w: W - 2 * M, h: 0.3, fontSize: 10, color: '6F7AA0', objectName: 'source' });
  const card = (s, x, y, w, h, name, fill = CARD, line = LINE, lw = 0.75) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: lw }, objectName: name });
  function iconDot(s, img, x, y, d, name, fill = CARD2) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: LINE, width: 0.75 }, objectName: name + 'c' });
    s.addImage({ data: img, x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52, objectName: name + 'i' });
  }
  const arrow = (s, x1, y1, x2, y2, name, color = '5A6690') =>
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001, flipH: x2 < x1, flipV: y2 < y1, line: { color, width: 1.5, endArrowType: 'triangle' }, objectName: name });

  // ================= 1 · PROBLEM =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The problem', 'When the rain stops work, the income stops too');
    const steps = [
      [I.rain, 'A cloudburst hits Andheri', 'The sky opens mid-shift'],
      [I.flood, 'Roads flood, orders stall', 'Riding on becomes unsafe'],
      [I.bike, 'Ravi goes offline', 'He is a delivery rider in Mumbai'],
      [I.wallet, 'The day’s income is gone', 'Accident cover exists. Nothing covers a lost day.'],
    ];
    steps.forEach((st, i) => {
      const y = 2.35 + i * 0.9;
      iconDot(s, st[0], M, y, 0.66, 'j' + i);
      T(s, [{ text: st[1], options: { fontSize: 18, bold: true, color: 'FFFFFF', breakLine: true } }, { text: st[2], options: { fontSize: 14, color: SOFT } }],
        { x: M + 0.9, y: y + 0.02, w: 5.9, h: 0.75, objectName: 'jt' + i });
    });
    card(s, 7.55, 2.3, 5.18, 3.95, 'hlCard');
    T(s, [{ text: 'Weather is local (rain, mm)', options: { fontFace: 'Cambria', fontSize: 20, bold: true, color: 'FFFFFF', breakLine: true } },
          { text: '26 July 2005 · two IMD stations, 20 km apart', options: { fontSize: 13, color: SOFT } }],
      { x: 7.85, y: 2.5, w: 4.6, h: 0.85, objectName: 'hlHead' });
    s.addChart(pres.charts.BAR, [{ name: 'Rainfall (mm)', labels: ['Santacruz', 'Colaba'], values: [944, 73] }], {
      x: 7.75, y: 3.35, w: 4.8, h: 2.75, objectName: 'hlChart', barDir: 'col', barGapWidthPct: 70, chartColors: [BLUE, BLUE],
      showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: 'FFFFFF', dataLabelFontSize: 16, dataLabelFontBold: true, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0',
      catAxisLabelColor: SOFT, catAxisLabelFontSize: 14, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      catAxisLineShow: false, showLegend: false, valAxisMaxVal: 1150, valAxisMinVal: 0,
    });
    T(s, 'A city-wide alert can’t decide a rider-level payout.', { x: M, y: 6.42, w: 12.1, h: 0.45, fontFace: 'Cambria', fontSize: 20, italic: true, bold: true, color: SA, objectName: 'insight' });
    foot(s, 'Rainfall: India Meteorological Department, 26 July 2005.');
    s.addNotes('[0:00–0:20] Meet Ravi, a delivery rider in Andheri. A cloudburst floods the roads, he goes offline, and that day’s income is gone. Nothing pays him for it. And rain is fiercely local: on 26 July 2005, Santacruz got 944 millimetres, Colaba just 73. A city-wide alert can’t decide Ravi’s payout.');
  }

  // ================= 2 · INSIGHT =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The insight', 'What if the network itself could sense the rain?');
    const tw = 0.92, th = tw * 1.513;
    s.addImage({ path: A('tower_big.png'), x: 0.75, y: 2.45, w: tw, h: th, objectName: 'towerA' });
    s.addImage({ path: A('tower_big.png'), x: 5.55, y: 2.45, w: tw, h: th, objectName: 'towerB' });
    s.addShape(pres.shapes.LINE, { x: 1.21, y: 2.62, w: 4.8, h: 0, line: { color: SA, width: 2.5, dashType: 'dash' }, objectName: 'beam' });
    T(s, 'Microwave link between two sites', { x: 1.6, y: 2.2, w: 4.1, h: 0.3, fontSize: 13, bold: true, color: SA, align: 'center', objectName: 'beamLab' });
    [[2.1, 2.95], [2.75, 3.25], [3.4, 2.9], [4.05, 3.3], [4.7, 2.95], [2.45, 3.6], [3.75, 3.65], [5.05, 3.55]].forEach(([x, y], i) =>
      s.addImage({ data: I.drop, x, y, w: 0.2, h: 0.2, objectName: 'drop' + i }));
    T(s, 'Rain absorbs the beam: about 25 dB weaker in a downpour', { x: 1.5, y: 4.05, w: 4.3, h: 0.5, fontSize: 13, color: SOFT, align: 'center', objectName: 'absorb' });
    const P = [['Signal loss, every minute', 'from network logs'], ['Rain rate', 'ITU-R standard formula'], ['1 km rain map', 'with a confidence score']];
    P.forEach((p, i) => {
      const y = 2.3 + i * 0.82;
      card(s, 7.35, y, 5.38, 0.66, 'pb' + i, i === 2 ? CARD2 : CARD, i === 2 ? SA : LINE);
      T(s, [{ text: `${i + 1}  ${p[0]}`, options: { fontSize: 16, bold: true, color: 'FFFFFF' } }, { text: '   ' + p[1], options: { fontSize: 13, color: SOFT } }],
        { x: 7.6, y, w: 5.0, h: 0.66, valign: 'middle', objectName: 'pt' + i });
      if (i < 2) arrow(s, 10.04, y + 0.66, 10.04, y + 0.82, 'pa' + i);
    });
    T(s, 'We don’t build a new sensor network.\nWe turn existing network signals into one.', { x: M, y: 4.75, w: 12.1, h: 1.0, fontFace: 'Cambria', fontSize: 24, bold: true, color: 'FFFFFF', objectName: 'core' });
    card(s, M, 5.95, 12.13, 0.72, 'cautionCard');
    s.addImage({ data: I.info, x: M + 0.22, y: 6.13, w: 0.36, h: 0.36, objectName: 'cautionIcon' });
    T(s, 'Microwave links sense rain; fibre doesn’t. How many usable links Jio has in Mumbai is the first thing our pilot measures.', { x: M + 0.75, y: 5.95, w: 11.2, h: 0.72, fontSize: 15, color: SOFT, valign: 'middle', objectName: 'caution' });
    s.addNotes('[0:20–0:40] Our insight: Jio’s microwave links, the radio beams between sites, lose signal when rain falls between them. Measure that loss, apply the standard ITU formula, and you get rain, street by street. No new sensors. One caveat: fibre doesn’t sense rain, so usable coverage is what we test first.');
  }

  // ================= 3 · PROOF AND ITS LIMIT =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The proof', 'We tested the physics before the business');
    T(s, 'Public research dataset  ·  500 real microwave links in Germany  ·  11 days  ·  not Jio data', { x: M, y: 2.12, w: 8.2, h: 0.3, fontSize: 12.5, bold: true, color: SA, objectName: 'dataLab' });
    s.addChart(pres.charts.LINE, [
      { name: 'Weather radar', labels: D.net.labels.map((l, i) => (i % 24 === 12 ? l : '')), values: D.net.r },
      { name: 'Rain from the 500 links', labels: D.net.labels.map((l, i) => (i % 24 === 12 ? l : '')), values: D.net.c },
    ], {
      x: M - 0.15, y: 2.45, w: 8.0, h: 3.85, objectName: 'chart', chartColors: [ORANGE, BLUE], lineSize: 2, lineDataSymbol: 'none',
      showLegend: true, legendPos: 't', legendColor: 'D7DDEA', legendFontSize: 13, legendFontFace: '+mn-lt',
      catAxisLabelColor: MUTE, valAxisLabelColor: MUTE, catAxisLabelFontSize: 12, valAxisLabelFontSize: 12, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
      catAxisLabelFrequency: 1, catAxisLineShow: false, valAxisLineShow: false, valGridLine: { color: '2A3357', size: 0.5 }, catGridLine: { style: 'none' },
      showValAxisTitle: true, valAxisTitle: 'mm per hour, network average', valAxisTitleColor: MUTE, valAxisTitleFontSize: 12, valAxisTitleFontFace: '+mn-lt',
    });
    const stat = (x, y, num, lab, name) => T(s, [{ text: num, options: { fontFace: 'Cambria', fontSize: 40, bold: true, color: 'FFFFFF', breakLine: true } }, { text: lab, options: { fontSize: 14, color: SOFT } }],
      { x, y, w: 3.9, h: 1.15, objectName: name });
    stat(8.85, 2.15, '0.95', 'network-wide match with radar, hour by hour, on unseen days', 'st1');
    stat(8.85, 3.3, '0.88', 'typical single link on its own', 'st2');
    card(s, 8.75, 4.5, 3.98, 1.85, 'gapCard', '2A1622', RED, 1);
    T(s, 'BUT TO PAY CLAIMS', { x: 9.0, y: 4.62, w: 3.5, h: 0.28, fontSize: 11, bold: true, color: 'FF8A8D', charSpacing: 2, objectName: 'gapK' });
    T(s, [{ text: '68%', options: { fontFace: 'Cambria', fontSize: 32, bold: true, color: 'FFFFFF' } }, { text: '  payout events caught', options: { fontSize: 14, color: SOFT, breakLine: true } },
          { text: '18%', options: { fontFace: 'Cambria', fontSize: 32, bold: true, color: 'FFFFFF' } }, { text: '  false triggers', options: { fontSize: 14, color: SOFT } }],
      { x: 9.0, y: 4.9, w: 3.6, h: 1.4, objectName: 'gapT' });
    T(s, 'The sensing works. It isn’t insurance-grade yet. That’s what we fix next.', { x: M, y: 6.48, w: 12.1, h: 0.42, fontFace: 'Cambria', fontSize: 19, italic: true, bold: true, color: SA, objectName: 'bridge' });
    foot(s, 'Tuned once (×1.17) on 10–12 May 2018, scored on 13–20 May. Payout events: 10 mm in 3 hours per 4 km square. Reference: German Weather Service radar.');
    s.addNotes('[0:40–1:02] We tested the physics first, on 500 real microwave links from a public research dataset in Germany, not Jio’s network. On unseen days the network matched radar at 0.95, a single link at 0.88. But for insurance, links alone caught 68% of payout events, with 18% false triggers. The sensing works; it isn’t insurance-grade yet.');
  }

  // ================= 4 · INSURANCE-GRADE ENGINE =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Insurance-grade by design', 'No single sensor decides a payout');
    const S = [[I.towerInk, 'Jio microwave links', 'Primary: dense, every minute'], [I.dish, 'IMD Doppler radar', 'Validation over the whole city'],
               [I.gauge, 'IMD and BMC rain gauges', 'Calibration: ground truth'], [I.sat, 'Satellite', 'Fallback if the network is down']];
    S.forEach((st, i) => {
      const y = 2.3 + i * 0.95;
      card(s, M, y, 4.45, 0.8, 'src' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE);
      s.addImage({ data: st[0], x: M + 0.2, y: y + 0.2, w: 0.4, h: 0.4, objectName: 'srcI' + i });
      T(s, [{ text: st[1], options: { fontSize: 15, bold: true, color: 'FFFFFF', breakLine: true } }, { text: st[2], options: { fontSize: 13, color: SOFT } }],
        { x: M + 0.8, y: y + 0.08, w: 3.55, h: 0.66, objectName: 'srcT' + i });
      arrow(s, M + 4.45, y + 0.4, 5.75, 3.95, 'srcA' + i);
    });
    card(s, 5.75, 2.55, 3.0, 2.85, 'engine', CARD2, SA, 1.25);
    s.addImage({ data: I.chip, x: 6.05, y: 2.78, w: 0.45, h: 0.45, objectName: 'engIcon' });
    T(s, [{ text: 'JioMausam engine', options: { fontFace: 'Cambria', fontSize: 18, bold: true, color: 'FFFFFF', breakLine: true } },
          { text: '1 km rain grid', options: { fontSize: 15, color: INK, bullet: true, breakLine: true } },
          { text: 'Confidence score', options: { fontSize: 15, color: INK, bullet: true, breakLine: true } },
          { text: 'Trigger decision', options: { fontSize: 15, color: INK, bullet: true } }],
      { x: 6.05, y: 3.35, w: 2.55, h: 1.9, paraSpaceAfter: 4, objectName: 'engT' });
    T(s, 'PILOT TARGETS', { x: 9.15, y: 2.3, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: SA, charSpacing: 2, objectName: 'tgtK' });
    const G = [['≥80%', 'heavy-rain events caught'], ['±10%', 'rain totals vs gauges'], ['<15%', 'false triggers'], ['<6 h', 'storm to payout (simulated)']];
    G.forEach((g, i) => {
      const x = 9.15 + (i % 2) * 1.83, y = 2.68 + Math.floor(i / 2) * 1.38;
      card(s, x, y, 1.73, 1.24, 'tg' + i);
      T(s, [{ text: g[0], options: { fontFace: 'Cambria', fontSize: 26, bold: true, color: 'FFFFFF', breakLine: true } }, { text: g[1], options: { fontSize: 12.5, color: SOFT } }],
        { x: x + 0.15, y: y + 0.12, w: 1.48, h: 1.05, objectName: 'tgT' + i });
    });
    T(s, 'Low confidence never auto-denies: the day is checked against gauges and radar. Sources are weighed by their measured accuracy, not by a vote.', { x: M, y: 6.25, w: 12.1, h: 0.6, fontSize: 15, color: SOFT, objectName: 'rule' });
    s.addNotes('[1:02–1:22] So no single sensor decides a payout. Jio’s links are the dense primary signal; IMD radar validates, gauges calibrate, satellite covers outages. The engine fuses them into a one-kilometre grid with a confidence score. Our pilot targets: 80% of events caught, under 15% false triggers, payouts within six hours.');
  }

  // ================= 5 · PRODUCT =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The product', 'From weather intelligence to income protection');
    const F = [[I.store, 'The delivery platform buys Kavach Plus', 'for every active rider in its Mumbai fleet'],
               [I.user, 'Ravi is covered automatically', 'active rider, his usual 1 km zone; nothing to buy'],
               [I.rainInk, 'Very heavy rain hits his zone', 'IMD level: 115.6 mm or more in a day'],
               [I.shield, 'A licensed insurer pays', 'it carries the risk, not Jio and not the rider'],
               [I.bank, '₹300 reaches Ravi within 6 hours', 'to his bank or UPI; no claim form, no need to ride']];
    F.forEach((f, i) => {
      const y = 2.25 + i * 0.8;
      iconDot(s, f[0], M, y, 0.62, 'f' + i, i === 4 ? '3A2C0A' : CARD2);
      T(s, [{ text: f[1], options: { fontSize: 17, bold: true, color: i === 4 ? SA : 'FFFFFF', breakLine: true } }, { text: f[2], options: { fontSize: 13.5, color: SOFT } }],
        { x: M + 0.85, y: y + 0.0, w: 6.9, h: 0.72, objectName: 'ft' + i });
      if (i < 4) arrow(s, M + 0.31, y + 0.62, M + 0.31, y + 0.8, 'fa' + i);
    });
    // phone notification mock
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.75, y: 2.2, w: 3.3, h: 4.05, rectRadius: 0.35, fill: { color: '0B1024' }, line: { color: '3A4570', width: 3 }, objectName: 'phone' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.95, y: 2.35, w: 0.9, h: 0.16, rectRadius: 0.08, fill: { color: '000000' }, line: { color: '000000', width: 0 }, objectName: 'notch' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.95, y: 2.75, w: 2.9, h: 1.95, rectRadius: 0.14, fill: { color: 'F4F6FB' }, line: { color: 'F4F6FB', width: 0 }, objectName: 'notif' });
    T(s, [{ text: 'MAUSAM KAVACH · now', options: { fontSize: 9.5, bold: true, color: '6A7590', breakLine: true } },
          { text: '₹300 credited to your bank account', options: { fontSize: 14, bold: true, color: '0E1424', breakLine: true } },
          { text: 'Very heavy rain in Andheri East: 128 mm today. Paid by your insurer. Nothing to file. Stay safe.', options: { fontSize: 11.5, color: '3A4560' } }],
      { x: 9.12, y: 2.88, w: 2.6, h: 1.75, paraSpaceAfter: 3, objectName: 'notifT' });
    T(s, [{ text: 'Covered by your app', options: { fontSize: 12, bold: true, color: INK, breakLine: true } }, { text: 'Payout days this year: 1 of 5', options: { fontSize: 12, color: MUTE } }],
      { x: 9.05, y: 4.95, w: 2.75, h: 0.7, objectName: 'phoneMeta' });
    T(s, 'Illustration', { x: 8.75, y: 6.3, w: 3.3, h: 0.25, fontSize: 10, color: '6F7AA0', align: 'center', objectName: 'illus' });
    const chips = [['₹165', 'a rider a month'], ['~4 days', 'a year in Mumbai'], ['Up to 5', 'payouts a year']];
    chips.forEach((c, i) => {
      const x = M + i * 2.62;
      card(s, x, 6.33, 2.5, 0.62, 'chip' + i, '2B2208', SA, 0.75);
      T(s, [{ text: c[0] + ' ', options: { fontFace: 'Cambria', fontSize: 16, bold: true, color: SA } }, { text: c[1], options: { fontSize: 11.5, color: INK } }],
        { x: x + 0.15, y: 6.33, w: 2.25, h: 0.62, valign: 'middle', objectName: 'chipT' + i });
    });
    foot(s, 'Priced on IMD Santacruz records, 2000–2024. The pilot calibrates an equivalent 3-hour trigger. Jio Payments Bank is optional.');
    s.addNotes('[1:22–1:45] The product. A delivery platform buys Kavach Plus, so Ravi is covered automatically. When very heavy rain, 115 millimetres in a day, hits his zone, a licensed insurer sends 300 rupees to his bank within six hours. No claim form, and he needn’t ride into the storm to qualify. It costs 165 rupees a rider a month.');
  }

  // ================= 6 · WHY THE PLATFORM PAYS =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Who pays, and why', 'We start with the platform, not the worker');
    const col = (x, title, img, items, name, hi) => {
      card(s, x, 2.3, 5.95, 3.15, name, hi ? CARD2 : CARD, hi ? SA : LINE, hi ? 1.25 : 0.75);
      s.addImage({ data: img, x: x + 0.3, y: 2.52, w: 0.42, h: 0.42, objectName: name + 'I' });
      T(s, title, { x: x + 0.85, y: 2.5, w: 4.8, h: 0.45, fontFace: 'Cambria', fontSize: 21, bold: true, color: 'FFFFFF', objectName: name + 'H' });
      T(s, items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })), { x: x + 0.35, y: 3.2, w: 5.35, h: 2.15, fontSize: 18, color: INK, paraSpaceAfter: 12, objectName: name + 'T' });
    };
    col(M, 'Today, in a storm', I.warn, ['Riders go offline, orders fail', 'Rain surge pay rewards riding into danger', 'Customers wait; service levels drop', 'The weather bill is unpredictable'], 'today', false);
    col(6.78, 'With Kavach Plus', I.ok, ['A fixed premium, budgeted per rider', 'An automatic benefit, whether or not they ride', 'Riders stay safe, and stay with the app', 'Supports gig-worker welfare duties'], 'kavach', true);
    card(s, M, 5.8, 12.13, 0.85, 'measure');
    s.addImage({ data: I.chart, x: M + 0.25, y: 6.03, w: 0.4, h: 0.4, objectName: 'measureI' });
    T(s, [{ text: 'The pilot measures the return in the partner’s own data: ', options: { bold: true, color: 'FFFFFF' } }, { text: 'orders lost · rider online rate · rain incentive spend · rider churn', options: { color: SOFT } }],
      { x: M + 0.85, y: 5.8, w: 11.1, h: 0.85, fontSize: 15, valign: 'middle', objectName: 'measureT' });
    foot(s, 'We don’t claim the platform’s return yet. The shadow pilot measures it before anyone signs a cheque.');
    s.addNotes('[1:45–2:05] Why would a platform pay? Today a storm means riders offline, failed orders, and rain surge pay that rewards riding into danger. Kavach turns that into a fixed, budgeted benefit that keeps riders safe and loyal. We don’t claim the return yet; the pilot measures it in their own data.');
  }

  // ================= 7 · THE MONEY =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The money', 'Jio earns from intelligence, not insurance risk');
    const node = (x, y, w, img, title, sub, name, hi) => {
      card(s, x, y, w, 1.05, name, hi ? CARD2 : CARD, hi ? SA : LINE, hi ? 1.25 : 0.75);
      s.addImage({ data: img, x: x + 0.22, y: y + 0.3, w: 0.42, h: 0.42, objectName: name + 'I' });
      T(s, [{ text: title, options: { fontSize: 16, bold: true, color: 'FFFFFF', breakLine: true } }, { text: sub, options: { fontSize: 12.5, color: SOFT } }],
        { x: x + 0.8, y: y + 0.12, w: w - 0.95, h: 0.85, objectName: name + 'T' });
    };
    node(M, 2.35, 3.0, I.store, 'Delivery app', 'buys cover for riders', 'nP');
    node(4.95, 2.35, 3.4, I.shield, 'Licensed insurer', 'holds premiums, carries risk', 'nI');
    node(9.73, 2.35, 3.0, I.bike, 'Riders', 'get ₹300 automatically', 'nR');
    node(4.95, 4.15, 3.4, I.towerInk, 'Jio', 'distribution + data fees', 'nJ', true);
    arrow(s, 3.6, 2.87, 4.95, 2.87, 'a1'); T(s, '₹165 / rider / month', { x: 3.6, y: 2.45, w: 1.32, h: 0.4, fontSize: 10.5, color: SA, align: 'center', objectName: 'a1L' });
    arrow(s, 8.35, 2.87, 9.73, 2.87, 'a2'); T(s, '₹300 payouts', { x: 8.35, y: 2.5, w: 1.38, h: 0.35, fontSize: 11, color: SA, align: 'center', objectName: 'a2L' });
    arrow(s, 6.65, 3.4, 6.65, 4.15, 'a3'); T(s, '15–25% fees', { x: 6.75, y: 3.6, w: 1.4, h: 0.35, fontSize: 11, color: SA, objectName: 'a3L' });
    T(s, [{ text: 'Plus: weather data and API revenue that is Jio’s own', options: { fontSize: 14, color: SOFT } }], { x: M, y: 4.3, w: 4.0, h: 0.8, objectName: 'dataRev' });
    card(s, 8.75, 3.85, 3.98, 1.75, 'numCard');
    T(s, [{ text: '50,000 Mumbai riders', options: { fontSize: 13, color: SOFT, breakLine: true } },
          { text: '₹9.9 Cr', options: { fontFace: 'Cambria', fontSize: 28, bold: true, color: 'FFFFFF' } }, { text: '  premium pool a year (the insurer’s)', options: { fontSize: 12.5, color: SOFT, breakLine: true } },
          { text: '₹1.5–2.5 Cr', options: { fontFace: 'Cambria', fontSize: 24, bold: true, color: SA } }, { text: '  Jio fees a year', options: { fontSize: 12.5, color: SOFT } }],
      { x: 9.0, y: 3.95, w: 3.6, h: 1.6, paraSpaceAfter: 2, objectName: 'numT' });
    // ecosystem chain
    T(s, 'Reliance can connect the whole chain', { x: M, y: 5.62, w: 6, h: 0.35, fontFace: 'Cambria', fontSize: 16, bold: true, color: 'FFFFFF', objectName: 'chainH' });
    const CH = [['Sense', 'Jio network'], ['Decide', 'JioMausam'], ['Insure', 'JFS partners'], ['Pay', 'bank / UPI rails'], ['Use', 'JioMart and more']];
    CH.forEach((c, i) => {
      const x = M + i * 2.47;
      card(s, x, 6.05, 2.2, 0.6, 'ch' + i);
      T(s, [{ text: c[0] + '  ', options: { fontFace: 'Cambria', fontSize: 14, bold: true, color: SA } }, { text: c[1], options: { fontSize: 12, color: INK } }],
        { x: x + 0.14, y: 6.05, w: 2.0, h: 0.6, valign: 'middle', objectName: 'chT' + i });
      if (i < 4) arrow(s, x + 2.2, 6.35, x + 2.47, 6.35, 'chA' + i);
    });
    foot(s, 'Illustrative: 50,000 × ₹165 × 12. Every 1 lakh riders ≈ ₹20 Cr of premiums. India had 77 lakh gig workers in 2020–21, projected 2.35 crore by 2029–30 (NITI Aayog, 2022).');
    s.addNotes('[2:05–2:25] The money: the platform pays premiums to a licensed insurer, which carries the risk. Fifty thousand riders is a 9.9 crore premium pool; Jio earns fifteen to twenty-five percent in fees, with no insurance risk, plus its own data revenue. Reliance can connect the whole chain, from sensing to payment.');
  }

  // ================= 8 · THE ASK =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Our ask', 'No new network. Just proof that ours is usable');
    const TL = [[I.map, 'Days 0–30', 'Coverage audit', 'Usable links in every 1 km cell; how often Jio logs them'],
                [I.target, 'Days 31–60', 'Accuracy', 'Rain against IMD gauges and radar'],
                [I.bolt, 'Days 61–90', 'Triggers and payouts', 'Simulated payouts for real riders; false triggers'],
                [I.flag, 'Day 90', 'Go / no-go', 'Enough coverage? ≥80% caught? <15% false? <6 h?']];
    TL.forEach((t, i) => {
      const x = M + i * 3.07;
      card(s, x, 2.3, 2.92, 2.2, 'tl' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE, i === 0 ? 1.25 : 0.75);
      s.addImage({ data: t[0], x: x + 0.22, y: 2.5, w: 0.38, h: 0.38, objectName: 'tlI' + i });
      T(s, [{ text: t[1].toUpperCase(), options: { fontSize: 10.5, bold: true, color: MUTE, charSpacing: 2, breakLine: true } }, { text: t[2], options: { fontFace: 'Cambria', fontSize: 18, bold: true, color: 'FFFFFF', breakLine: true } }, { text: t[3], options: { fontSize: 13, color: SOFT } }],
        { x: x + 0.22, y: 3.0, w: 2.55, h: 1.45, paraSpaceAfter: 3, objectName: 'tlT' + i });
      if (i < 3) arrow(s, x + 2.92, 3.4, x + 3.07, 3.4, 'tlA' + i);
    });
    card(s, M, 4.8, 12.13, 1.8, 'askBox', SA, SA, 0);
    T(s, [{ text: 'What we need from Jio', options: { fontFace: 'Cambria', fontSize: 19, bold: true, color: DARKTXT, breakLine: true } },
          { text: 'Microwave-link telemetry for Mumbai, for 90 days', options: { bullet: true, breakLine: true } },
          { text: 'JioMart’s own delivery riders as the first customer', options: { bullet: true, breakLine: true } },
          { text: 'One JFS insurance partner and a five-person team', options: { bullet: true } }],
      { x: M + 0.35, y: 4.98, w: 7.0, h: 1.7, fontSize: 15, color: DARKTXT, paraSpaceAfter: 4, objectName: 'askT' });
    T(s, [{ text: 'What it costs', options: { fontFace: 'Cambria', fontSize: 19, bold: true, color: DARKTXT, breakLine: true } },
          { text: 'Under ₹1 crore. No new hardware. No money moves in shadow mode.', options: { fontSize: 15, color: DARKTXT } }],
      { x: 8.3, y: 4.98, w: 4.2, h: 1.7, objectName: 'costT' });
    s.addNotes('[2:25–2:47] Our ask: a 90-day Mumbai pilot in shadow mode, so no money moves. First, a coverage audit: how much of Mumbai Jio’s links can see. Then accuracy, triggers and simulated payouts, and a go or no-go at day ninety. We need link data, JioMart’s riders, one insurance partner and five people: under a crore.');
  }

  // ================= 9 · VISION AND CLOSE =================
  {
    const s = pres.addSlide({ masterName: 'BLACK', ...sec });
    const PH = [['1', 'Mumbai rain + riders'], ['2', 'Real payouts, more cities and risks'], ['3', 'Kavach for everyone, at recharge'], ['4', 'National weather intelligence + API']];
    PH.forEach((p, i) => {
      const x = M + i * 3.07;
      card(s, x, 0.8, 2.82, 1.05, 'phB' + i, i === 0 ? '2B2208' : '10152A', i === 0 ? SA : '232B4A');
      T(s, [{ text: p[0], options: { fontFace: 'Cambria', fontSize: 20, bold: true, color: i === 0 ? SA : '8A95B8', breakLine: true } }, { text: p[1], options: { fontSize: 13, color: i === 0 ? INK : MUTE } }],
        { x: x + 0.2, y: 0.88, w: 2.5, h: 0.92, objectName: 'ph' + i });
      if (i < 3) arrow(s, x + 2.82, 1.32, x + 3.07, 1.32, 'phA' + i, '3A4570');
    });
    T(s, 'We aren’t asking Jio to build another weather network.', { x: M, y: 2.75, w: 12.13, h: 0.6, fontFace: 'Cambria', fontSize: 26, color: SOFT, align: 'center', objectName: 'line1' });
    T(s, 'We’re asking it to discover what its network can already tell us.', { x: M, y: 3.4, w: 12.13, h: 0.6, fontFace: 'Cambria', fontSize: 26, bold: true, color: 'FFFFFF', align: 'center', objectName: 'line2' });
    T(s, 'JioMausam', { x: 4.4, y: 4.75, w: 4.53, h: 0.85, fontFace: 'Cambria', fontSize: 40, bold: true, color: SA, align: 'center', objectName: '!!brand' });
    T(s, 'Turn the network into intelligence. Turn intelligence into protection.', { x: M, y: 5.65, w: 12.13, h: 0.4, fontSize: 15, color: MUTE, align: 'center', objectName: 'tag' });
    s.addNotes('[2:47–3:00] Rain first, then more cities and risks, then everyone, then a national weather layer. We aren’t asking Jio to build another weather network. We’re asking it to discover what its network can already tell us. Thank you.');
  }

  await pres.writeFile({ fileName: __dirname + '/JioMausam_Elimination_Draft2_raw.pptx' });
  await applyTheme(__dirname + '/JioMausam_Elimination_Draft2_raw.pptx', THEME);
  console.log('written');
})().catch(e => { console.error(e); process.exit(1); });
