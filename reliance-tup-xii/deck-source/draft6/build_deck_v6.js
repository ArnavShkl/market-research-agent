// JioMausam elimination-round presentation, draft 6 (10 slides, 3 minutes).
// Story: a weather-decision problem -> the signal Jio may already carry -> proven science, our own check, and what is not yet proven
// -> let accuracy pick the source mix -> Reliance as proving ground -> the market -> integration as the moat -> Kavach as an option -> pricing -> three gates.
// Transitions and animations are added afterwards by motion_v6.py.
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
const W = 13.333, H = 7.5, M = 0.6, CW = W - 2 * M;
const INK = 'EEF1F7', MUTE = '98A2C0', SOFT = 'B9C2D8', SA = 'F5A623', BLUE = '3987E5', ORANGE = 'D95926', GREEN = '1BAF7A', RED = 'E5484D';
const CARD = '141B36', CARD2 = '1C2447', LINE = '2A3357', DARK = '1A1200', AMBERBG = '2B2208';

async function icon(name, color, size = 256) {
  const C = Fa[name]; if (!C) throw new Error('no icon ' + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(C, { color: '#' + color, size }));
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()).toString('base64');
}

(async () => {
  const I = {};
  const need = {
    drop: ['FaDroplet', BLUE], info: ['FaCircleInfo', SA], tower: ['FaTowerBroadcast', INK], dish: ['FaSatelliteDish', INK], gauge: ['FaGaugeHigh', INK],
    sat: ['FaSatellite', INK], chip: ['FaMicrochip', SA], chipInk: ['FaMicrochip', INK], bike: ['FaMotorcycle', INK], truck: ['FaTruckFast', INK],
    city: ['FaCity', INK], shield: ['FaShieldHalved', INK], bank: ['FaBuildingColumns', SA], wallet: ['FaWallet', INK], temp: ['FaTemperatureHigh', ORANGE],
    rainB: ['FaCloudShowersHeavy', BLUE], rainInk: ['FaCloudShowersHeavy', INK], layers: ['FaLayerGroup', SA], people: ['FaPeopleGroup', INK],
    store: ['FaStore', INK], mobile: ['FaMobileScreen', INK], ads: ['FaBullhorn', INK], heart: ['FaHandHoldingHeart', INK], flask: ['FaFlask', SA],
    scale: ['FaScaleBalanced', SA], check: ['FaCheck', GREEN], xmark: ['FaXmark', RED], seed: ['FaSeedling', INK], map: ['FaMapLocationDot', SA],
    okG: ['FaCircleCheck', GREEN], hour: ['FaHourglassHalf', 'FF8A8D'], towerSA: ['FaTowerBroadcast', SA], xR: ['FaXmark', 'FF8A8D'], wrench: ['FaScrewdriverWrench', INK],
  };
  for (const [k, [n, c]] of Object.entries(need)) I[k] = await icon(n, c);

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'JioMausam · Reliance T.U.P XII · Elimination round';
  pres.author = 'JioMausam team';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.defineSlideMaster({ title: 'NIGHT', background: { path: A('bg.jpg') }, objects: [] });
  pres.addSection({ title: 'Elimination round' });
  const sec = { sectionTitle: 'Elimination round' };

  const T = (s, text, o) => s.addText(text, Object.assign({ margin: 0, isTextBox: true, fontFace: 'Calibri', color: INK, valign: 'top' }, o));
  function head(s, kicker, title) {
    T(s, 'JioMausam', { x: M, y: 0.32, w: 3, h: 0.4, fontFace: 'Cambria', fontSize: 15, bold: true, objectName: '!!brand' });
    s.addImage({ path: A('tower.png'), x: W - M - 0.42, y: 0.22, w: 0.42, h: 0.6, objectName: '!!tower' });
    T(s, kicker.toUpperCase(), { x: M, y: 0.95, w: 10, h: 0.3, fontSize: 11, bold: true, color: SA, charSpacing: 3, objectName: 'kicker' });
    T(s, title, { x: M, y: 1.28, w: CW, h: 0.75, fontFace: 'Cambria', fontSize: 32, bold: true, color: 'FFFFFF', objectName: 'title' });
  }
  const foot = (s, text) => T(s, text, { x: M, y: H - 0.48, w: CW, h: 0.3, fontSize: 10, color: '7A85A8', objectName: 'source' });
  const card = (s, x, y, w, h, name, fill = CARD, line = LINE, lw = 0.75) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: lw }, objectName: name });
  const arrow = (s, x1, y1, x2, y2, name, color = '5A6690') =>
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001, flipH: x2 < x1, flipV: y2 < y1, line: { color, width: 1.5, endArrowType: 'triangle' }, objectName: name });
  const takeaway = (s, text, y = 6.4) => T(s, text, { x: M, y, w: CW, h: 0.5, fontFace: 'Cambria', fontSize: 18, italic: true, bold: true, color: SA, objectName: 'takeaway' });
  const caps = (text, color = SA) => ({ text: text.toUpperCase(), options: { fontSize: 10.5, bold: true, color, charSpacing: 2, breakLine: true } });
  const pill = (s, x, y, w, text, name, fill = AMBERBG, color = SA) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.32, rectRadius: 0.08, fill: { color: fill }, line: { color, width: 0.75 }, objectName: name });
    T(s, text, { x, y, w, h: 0.32, fontSize: 10.5, bold: true, color, align: 'center', valign: 'middle', objectName: name + 'T' });
  };


  // ================= 1 · PROBLEM =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The problem', 'India has a weather-decision problem');
    card(s, M, 2.3, 5.0, 3.8, 'hlCard');
    T(s, [{ text: 'Same city. Different weather.', options: { fontFace: 'Cambria', fontSize: 19, bold: true, color: 'FFFFFF', breakLine: true } },
          { text: 'Rainfall (mm) · IMD · 26 July 2005 · stations 20 km apart', options: { fontSize: 12.5, color: SOFT } }],
      { x: M + 0.3, y: 2.48, w: 4.5, h: 0.8, objectName: 'hlHead' });
    s.addChart(pres.charts.BAR, [{ name: 'Rainfall (mm)', labels: ['Santacruz', 'Colaba'], values: [944, 73] }], {
      x: M + 0.15, y: 3.3, w: 4.7, h: 2.7, objectName: 'hlChart', barDir: 'col', barGapWidthPct: 70, chartColors: [BLUE, BLUE],
      showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: 'FFFFFF', dataLabelFontSize: 18, dataLabelFontBold: true, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0',
      catAxisLabelColor: SOFT, catAxisLabelFontSize: 14, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      catAxisLineShow: false, showLegend: false, valAxisMaxVal: 1150, valAxisMinVal: 0,
    });
    card(s, 5.95, 2.3, 6.78, 1.0, 'knowCard');
    T(s, [caps('What a city-level alert says', MUTE), { text: '“Heavy rain in Mumbai.”', options: { fontFace: 'Cambria', fontSize: 20, italic: true, color: 'FFFFFF' } }], { x: 6.25, y: 2.42, w: 6.3, h: 0.8, objectName: 'knowT' });
    arrow(s, 9.34, 3.3, 9.34, 3.55, 'knowA');
    card(s, 5.95, 3.55, 6.78, 1.0, 'needCard', CARD2, SA, 1.25);
    T(s, [caps('What it needs to decide'), { text: '“Which zones do I act on, right now?”', options: { fontFace: 'Cambria', fontSize: 20, italic: true, color: 'FFFFFF' } }], { x: 6.25, y: 3.67, w: 6.3, h: 0.8, objectName: 'needT' });
    const imp = [[I.bike, 'Businesses decide blind', 'dispatch, incentives, delivery times'], [I.wallet, 'Workers carry the loss', 'income and safety, street by street']];
    imp.forEach((m, i) => {
      const x = 5.95 + i * 3.45;
      card(s, x, 4.8, 3.33, 1.3, 'imp' + i);
      s.addImage({ data: m[0], x: x + 0.22, y: 5.02, w: 0.4, h: 0.4, objectName: 'impI' + i });
      T(s, [{ text: m[1], options: { fontSize: 15.5, bold: true, color: 'FFFFFF', breakLine: true } }, { text: m[2], options: { fontSize: 13, color: SOFT } }], { x: x + 0.78, y: 4.98, w: 2.45, h: 1.0, objectName: 'impT' + i });
    });
    takeaway(s, 'Weather is lived street by street. Decisions are still made city by city.');
    foot(s, 'Rainfall: India Meteorological Department, 26 July 2005.');
    s.addNotes('[0:00–0:17] India doesn’t have a weather-data problem. It has a weather-decision problem. On 26 July 2005, Santacruz got 944 millimetres of rain; Colaba, 20 kilometres away, got 73. A city-level alert can still tell a business only “heavy rain in Mumbai”. It needs to know which zones to act on.');
  }

  // ================= 2 · THE SIGNAL =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The insight', 'Jio’s microwave links may carry a weather signal');
    const tw = 0.92, th = tw * 1.513;
    s.addImage({ path: A('tower_big.png'), x: 0.75, y: 2.5, w: tw, h: th, objectName: 'towerA' });
    s.addImage({ path: A('tower_big.png'), x: 5.4, y: 2.5, w: tw, h: th, objectName: 'towerB' });
    s.addShape(pres.shapes.LINE, { x: 1.21, y: 2.67, w: 4.65, h: 0, line: { color: SA, width: 2.5, dashType: 'dash' }, objectName: 'beam' });
    T(s, 'Microwave link between two sites', { x: 1.5, y: 2.25, w: 4.1, h: 0.3, fontSize: 13, bold: true, color: SA, align: 'center', objectName: 'beamLab' });
    [[2.1, 3.0], [2.75, 3.3], [3.4, 2.95], [4.05, 3.35], [4.7, 3.0], [2.45, 3.65], [3.75, 3.7], [5.0, 3.6]].forEach(([x, y], i) =>
      s.addImage({ data: I.drop, x, y, w: 0.2, h: 0.2, objectName: 'drop' + i }));
    T(s, [{ text: 'Rain weakens the signal. ', options: { bold: true, color: 'FFFFFF' } }, { text: 'Measure the excess loss and estimate path-averaged rainfall along each link, in near-real-time. This technique uses microwave links, not fibre.', options: { color: SOFT } }],
      { x: M, y: 4.08, w: 5.9, h: 0.85, fontSize: 14, objectName: 'how' });
    card(s, 6.85, 2.25, 5.88, 2.6, 'defCard', CARD2, SA, 1.25);
    T(s, [caps('JioMausam is'), { text: 'decision infrastructure, not a weather map', options: { fontFace: 'Cambria', fontSize: 21, bold: true, color: 'FFFFFF' } }],
      { x: 7.15, y: 2.42, w: 5.35, h: 1.0, objectName: 'defT' });
    T(s, [{ text: 'It converts link signals, IMD radar and rain gauges into a high-resolution weather grid, then into decision-ready alerts and triggers for the teams who act on them.', options: { fontSize: 15, color: SOFT } }], { x: 7.15, y: 3.5, w: 5.35, h: 1.25, objectName: 'defT2' });
    const IS = ['Weather intelligence from existing infrastructure', 'Alerts and data for businesses', 'A trigger for future worker protection'];
    const ISNT = ['A new sensor network', 'A consumer weather app', 'An insurer', 'Heat sensing from towers'];
    card(s, M, 5.05, 5.9, 1.25, 'isCard');
    T(s, [caps('It is', GREEN), ...IS.map((t, k) => ({ text: t, options: { fontSize: 13, color: INK, bullet: true, breakLine: k < IS.length - 1 } }))], { x: M + 0.25, y: 5.13, w: 5.5, h: 1.12, objectName: 'isT' });
    card(s, 6.85, 5.05, 5.88, 1.25, 'isntCard');
    T(s, [caps('It isn’t', 'FF8A8D'), { text: ISNT.slice(0, 2).join('  ·  '), options: { fontSize: 13, color: INK, breakLine: true } }, { text: ISNT.slice(2).join('  ·  '), options: { fontSize: 13, color: INK } }], { x: 7.1, y: 5.13, w: 5.45, h: 1.12, objectName: 'isntT' });
    takeaway(s, 'Jio may already own the infrastructure for a new weather-sensing layer.', 6.45);
    s.addNotes('[0:17–0:34] Jio may already own the infrastructure for a new weather-sensing layer. Rain weakens its microwave links, and the excess loss estimates rainfall along each link. JioMausam fuses those signals with radar and gauges into a weather grid, then into decision-ready alerts.');
  }

  // ================= 3 · PROVEN, OUR CHECK, NOT YET PROVEN =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'What’s proven · what we checked · what isn’t', 'Links alone are promising, but fail our accuracy gates');
    const LW = 3.95;
    const LV = [[I.okG, 'Proven · published', GREEN, CARD, GREEN, 'solid', 1.3,
                 ['Physics: rain weakens microwave signals', 'Method: Science 2006 · PNAS 2013', 'Rain mapped across a whole country']],
                [I.flask, 'Our check · public data', SA, AMBERBG, SA, 'solid', 1.2,
                 ['We ran the open-source method ourselves on 500 real links, with radar as the reference']],
                [I.hour, 'Not yet proven · the pilot', 'FF8A8D', '2A1622', RED, 'dash', 1.35,
                 ['Jio’s coverage, Indian accuracy, business value, who pays, insurance-grade triggers']]];
    let y = 2.25;
    LV.forEach((l, i) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: LW, h: l[6], rectRadius: 0.12, fill: { color: l[3] }, line: { color: l[4], width: 1, dashType: l[5] }, objectName: 'pf' + i });
      s.addImage({ data: l[0], x: M + 0.2, y: y + 0.15, w: 0.3, h: 0.3, objectName: 'pfI' + i });
      T(s, l[1].toUpperCase(), { x: M + 0.62, y: y + 0.15, w: LW - 0.8, h: 0.3, fontSize: 10.5, bold: true, color: l[2], charSpacing: 2, valign: 'middle', objectName: 'pfK' + i });
      T(s, l[7].map((t, k, a) => ({ text: t, options: { breakLine: k < a.length - 1 } })), { x: M + 0.2, y: y + 0.5, w: LW - 0.35, h: l[6] - 0.58, fontSize: 12.5, color: i === 1 ? 'FFFFFF' : INK, objectName: 'pfT' + i });
      y += l[6] + 0.1;
    });
    const X = M + LW + 0.25, XW = W - M - X;
    card(s, X, 2.25, XW, 0.42, 'banner', AMBERBG, SA, 0.75);
    T(s, 'OUR CHECK  ·  500 REAL LINKS  ·  PUBLIC RESEARCH DATA, GERMANY  ·  NOT JIO DATA', { x: X, y: 2.25, w: XW, h: 0.42, fontSize: 11.5, bold: true, color: SA, charSpacing: 1, align: 'center', valign: 'middle', objectName: 'bannerT' });
    const tw = (XW - 2 * 0.22) / 3, TY = 2.85, TH = 1.62;
    card(s, X, TY, tw, TH, 'tile0');
    T(s, [caps('Promising', GREEN), { text: '0.95', options: { fontFace: 'Cambria', fontSize: 34, bold: true, color: 'FFFFFF', breakLine: true } }, { text: 'network-wide match with radar: the signal is real', options: { fontSize: 12.5, color: SOFT } }],
      { x: X + 0.22, y: TY + 0.12, w: tw - 0.4, h: TH - 0.2, objectName: 'tileT0' });
    const SX = X + tw + 0.22, SW = XW - tw - 0.22;
    card(s, SX, TY, SW, TH, 'sc', '2A1622', RED, 1);
    T(s, [caps('Links alone vs our accuracy gates', 'FF9A9C')], { x: SX + 0.22, y: TY + 0.12, w: SW - 0.4, h: 0.28, objectName: 'scK' });
    const SC = [['Trigger events caught', '68%', 'gate ≥80%'], ['Rain totals vs radar', '18% low', 'gate ±10%'], ['Our triggers not confirmed by radar', '18%', 'gate <15%']];
    SC.forEach((r, i) => {
      const ry = TY + 0.46 + i * 0.37;
      s.addImage({ data: I.xR, x: SX + 0.22, y: ry + 0.06, w: 0.2, h: 0.2, objectName: 'scX' + i });
      T(s, r[0], { x: SX + 0.52, y: ry, w: 2.5, h: 0.32, fontSize: 12.5, color: INK, valign: 'middle', objectName: 'scL' + i });
      T(s, r[1], { x: SX + 3.0, y: ry, w: 0.95, h: 0.32, fontFace: 'Cambria', fontSize: 16, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle', objectName: 'scV' + i });
      T(s, r[2], { x: SX + 4.05, y: ry, w: SW - 4.2, h: 0.32, fontSize: 12, bold: true, color: GREEN, valign: 'middle', objectName: 'scG' + i });
    });
    s.addChart(pres.charts.LINE, [
      { name: 'Radar', labels: D.net.labels.map((l, i) => (i % 48 === 12 ? l : '')), values: D.net.r },
      { name: 'Links (our check)', labels: D.net.labels.map((l, i) => (i % 48 === 12 ? l : '')), values: D.net.c },
    ], {
      x: X - 0.1, y: 4.55, w: XW + 0.15, h: 1.75, objectName: 'chart', chartColors: [ORANGE, BLUE], lineSize: 2, lineDataSymbol: 'none',
      showLegend: true, legendPos: 'r', legendColor: 'D7DDEA', legendFontSize: 11.5, legendFontFace: '+mn-lt',
      catAxisLabelColor: MUTE, valAxisLabelColor: MUTE, catAxisLabelFontSize: 11, valAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
      catAxisLabelFrequency: 1, catAxisLineShow: false, valAxisLineShow: false, valGridLine: { color: '2A3357', size: 0.5 }, catGridLine: { style: 'none' },
      showValAxisTitle: true, valAxisTitle: 'mm/h', valAxisTitleColor: MUTE, valAxisTitleFontSize: 11, valAxisTitleFontFace: '+mn-lt',
    });
    takeaway(s, 'We didn’t invent the science. We checked it, found where it fails, and built around it.');
    foot(s, 'Messer et al., Science 2006 · Overeem et al., PNAS 2013 · Our check: open pycomlink dataset (KIT) vs German radar; tuned 10–12 May 2018, scored 13–20 May; trigger 10 mm in 3 h per ~4 km cell.');
    s.addNotes('[0:34–0:56] Published science supports the physics, and has mapped rain across a whole country. We tested the method ourselves on 500 real links from a public dataset. The signal is real: 0.95 against radar. But the key finding was where it failed: links alone missed all three of our accuracy gates.');
  }
  // ================= 4 · LET ACCURACY DETERMINE THE MIX =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Raising accuracy', 'Let accuracy determine the mix');
    card(s, M, 2.25, 5.75, 3.95, 'srcCard');
    T(s, [caps('Candidate sources and what each adds')], { x: M + 0.25, y: 2.4, w: 5.3, h: 0.3, objectName: 'srcK' });
    const SRC = [[I.tower, 'Jio microwave links', 'Internal'], [I.wrench, 'Network health: faults, outages, maintenance', 'Internal'], [I.dish, 'IMD Doppler radar: spatial check', 'Low cost'], [I.gauge, 'IMD and BMC gauges: ground truth', 'Free / low'],
                 [I.sat, 'Satellite: coverage fallback', 'Free'], [I.map, 'New gauges on Jio sites, where links are thin', 'Capex'], [I.scale, 'Commercial data, only if it lifts accuracy', 'Paid']];
    SRC.forEach((r, i) => {
      const y = 2.78 + i * 0.47;
      s.addImage({ data: r[0], x: M + 0.25, y: y + 0.07, w: 0.3, h: 0.3, objectName: 'srcI' + i });
      T(s, r[1], { x: M + 0.72, y, w: 3.62, h: 0.44, fontSize: 13, bold: i === 0, color: i === 0 ? 'FFFFFF' : INK, valign: 'middle', objectName: 'srcT' + i });
      pill(s, M + 4.4, y + 0.06, 1.15, r[2], 'srcP' + i, i < 5 ? '13253A' : AMBERBG, i < 5 ? '6FB3FF' : SA);
    });
    const X = 6.65, XW = W - M - X;
    card(s, X, 2.25, XW, 3.95, 'mixCard', CARD2, SA, 1.25);
    T(s, [caps('The pilot scores every mix against held-out rain gauges')], { x: X + 0.25, y: 2.4, w: XW - 0.5, h: 0.3, objectName: 'mixK' });
    const bx = X + 2.25, bw = XW - 2.55, tgt = 0.8;
    const MIX = [['Links only', 0.68, 'Our check: 68%'], ['Links + radar', null, ''], ['Links + radar + gauges', null, ''], ['Radar + gauges, no links', null, 'shows what Jio adds'], ['+ paid data', null, '']];
    MIX.forEach((m, i) => {
      const y = 2.85 + i * 0.58;
      T(s, m[0], { x: X + 0.25, y, w: 1.95, h: 0.42, fontSize: 13, color: i === 3 ? SA : INK, bold: i === 3, valign: 'middle', objectName: 'mixL' + i });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.07, w: bw, h: 0.28, rectRadius: 0.06, fill: { color: '10162C' }, line: { color: '3A4570', width: 0.75, dashType: m[1] ? 'solid' : 'dash' }, objectName: 'mixB' + i });
      if (m[1]) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.07, w: bw * m[1], h: 0.28, rectRadius: 0.06, fill: { color: BLUE }, line: { color: BLUE, width: 0 }, objectName: 'mixF' + i });
      T(s, m[1] ? m[2] : (m[2] || 'measured in the pilot'), { x: bx + 0.12, y: y + 0.07, w: bw - 0.2, h: 0.28, fontSize: 11, bold: !!m[1], color: m[1] ? 'FFFFFF' : MUTE, valign: 'middle', objectName: 'mixV' + i });
    });
    s.addShape(pres.shapes.LINE, { x: bx + bw * tgt, y: 2.8, w: 0, h: 2.9, line: { color: GREEN, width: 1.75, dashType: 'dash' }, objectName: 'tgtLine' });
    T(s, 'gate: 80% of trigger events', { x: bx + bw * tgt - 1.2, y: 5.7, w: 2.4, h: 0.28, fontSize: 11.5, bold: true, color: GREEN, align: 'center', objectName: 'tgtLab' });
    T(s, [{ text: 'Rule: ', options: { bold: true, color: 'FFFFFF' } }, { text: 'pick the lowest-cost mix that clears every accuracy gate: ≥80% of predefined trigger events, totals within ±10%, under 15% unconfirmed.', options: { color: SOFT } }],
      { x: M, y: 6.3, w: CW, h: 0.35, fontSize: 13.5, objectName: 'rule' });
    takeaway(s, 'The pilot ends with a cost-versus-accuracy answer: exactly what to scale.', 6.68);
    s.addNotes('[0:56–1:14] So we never use links alone; accuracy decides the mix. Jio’s links, filtered by network-health data, plus IMD radar, gauges and satellite, with paid data only if it lifts accuracy. The pilot scores every mix against held-out gauges and picks the cheapest that clears every gate.');
  }

  // ================= 5 · RELIANCE AS PROVING GROUND =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Commercial use · inside Reliance', 'Reliance is the first proving ground');
    const HW = 6.75;
    card(s, M, 2.25, HW, 3.85, 'hero', CARD2, SA, 1.5);
    s.addImage({ data: I.towerSA, x: M + 0.3, y: 2.5, w: 0.6, h: 0.6, objectName: 'heroI' });
    T(s, [caps('The hero use case'), { text: 'Jio network operations', options: { fontFace: 'Cambria', fontSize: 23, bold: true, color: 'FFFFFF' } }], { x: M + 1.1, y: 2.44, w: HW - 1.3, h: 0.8, objectName: 'heroH' });
    const HB = ['Can we tell rain-related signal loss from equipment faults before sending a crew?', 'Potentially fewer wasted visits and earlier flood alerts.', 'Jio owns both the data and the decision.'];
    T(s, HB.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < HB.length - 1 } })), { x: M + 0.35, y: 3.4, w: HW - 0.65, h: 1.45, fontSize: 15, color: INK, paraSpaceAfter: 6, objectName: 'heroT' });
    T(s, '“Before Jio sells weather intelligence to anyone, it uses it to understand its own network.”', { x: M + 0.35, y: 4.85, w: HW - 0.65, h: 0.55, fontFace: 'Cambria', fontSize: 14, italic: true, color: SA, objectName: 'heroQ' });
    pill(s, M + 0.35, 5.55, 3.6, 'Tests accuracy and savings', 'heroP');
    const U = [[I.store, 'JioMart and Reliance Retail', 'Rain-aware dispatch, delivery promises and zone pauses.', 'Tests commercial value'],
               [I.mobile, 'MyJio', 'Street-level rain alerts, plus one-tap “is it raining here?” checks.', 'Tests reach at scale']];
    const UX = M + HW + 0.25, UW = W - M - UX;
    U.forEach((u, i) => {
      const y = 2.25 + i * 2.0;
      card(s, UX, y, UW, 1.85, 'use' + i);
      s.addImage({ data: u[0], x: UX + 0.22, y: y + 0.2, w: 0.38, h: 0.38, objectName: 'useI' + i });
      T(s, u[1], { x: UX + 0.75, y: y + 0.18, w: UW - 0.95, h: 0.42, fontSize: 16, bold: true, color: 'FFFFFF', valign: 'middle', objectName: 'useH' + i });
      T(s, [{ text: u[2], options: { fontSize: 13.5, color: SOFT, breakLine: true } }, { text: u[3], options: { fontSize: 12.5, bold: true, color: SA } }], { x: UX + 0.22, y: y + 0.72, w: UW - 0.42, h: 1.05, paraSpaceAfter: 5, objectName: 'useT' + i });
    });
    takeaway(s, 'Prove accuracy and value at home before selling outside.', 6.3);
    s.addNotes('[1:14–1:30] Reliance is the first proving ground. The hero test is Jio’s own network team: can we tell rain from equipment faults before sending a crew? Jio owns the data and the decision. JioMart then tests commercial value; MyJio tests reach at scale.');
  }

  // ================= 6 · THE MARKET =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Commercial use · the market', 'Then sell the same intelligence to the market');
    const P = [['1', 'Delivery, quick commerce, ride-hailing', 'e.g. Swiggy, Zomato, Zepto, Uber, Rapido', 'Alerts'],
               ['2', 'Logistics · cities and transport · insurers', 'e.g. Delhivery, Porter, BMC, railways, insurers', 'Alerts + data'],
               ['3', 'Agriculture · power · construction · retail', 'e.g. crop insurance, discoms, metro projects, FMCG', 'Data + alerts']];
    P.forEach((p, i) => {
      const y = 2.25 + i * 0.9;
      card(s, M, y, 7.75, 0.8, 'mk' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE, i === 0 ? 1.25 : 0.75);
      s.addShape(pres.shapes.OVAL, { x: M + 0.2, y: y + 0.15, w: 0.5, h: 0.5, fill: { color: i === 0 ? SA : '2A3357' }, line: { color: i === 0 ? SA : '2A3357', width: 0 }, objectName: 'mkO' + i });
      T(s, p[0], { x: M + 0.2, y: y + 0.15, w: 0.5, h: 0.5, fontFace: 'Cambria', fontSize: 16, bold: true, color: i === 0 ? DARK : 'FFFFFF', align: 'center', valign: 'middle', objectName: 'mkN' + i });
      T(s, [{ text: p[1], options: { fontSize: 15, bold: true, color: 'FFFFFF', breakLine: true } }, { text: p[2], options: { fontSize: 12.5, color: MUTE } }],
        { x: M + 0.9, y: y + 0.08, w: 4.95, h: 0.64, valign: 'middle', objectName: 'mkT' + i });
      pill(s, M + 6.0, y + 0.24, 1.55, p[3], 'mkP' + i);
    });
    card(s, M, 4.97, 7.75, 1.2, 'dcCard', CARD2, LINE);
    const DC = [['Rain', '9FD0FF', '13253A', '6FB3FF', 'Rain hits Zone A'],
                ['JioMausam', SA, AMBERBG, SA, 'Zone alert + rain estimate'],
                ['Customer decides', 'FFFFFF', CARD, '5A6690', 'Platform adjusts dispatch, ETAs or incentives'],
                ['Value', '5FD3A6', '0F2A22', GREEN, 'Lower disruption']];
    const dg = 0.3, dw = (7.75 - 0.44 - 3 * dg) / 4;
    DC.forEach((d, i) => {
      const x = M + 0.22 + i * (dw + dg);
      T(s, d[0].toUpperCase(), { x, y: 5.06, w: dw, h: 0.24, fontSize: 9.5, bold: true, color: d[1], charSpacing: 1.5, align: 'center', valign: 'middle', objectName: 'dcL' + i });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.33, w: dw, h: 0.72, rectRadius: 0.08, fill: { color: d[2] }, line: { color: d[3], width: 0.75 }, objectName: 'dcB' + i });
      T(s, d[4], { x: x + 0.06, y: 5.33, w: dw - 0.12, h: 0.72, fontSize: 11.5, bold: true, color: d[1], align: 'center', valign: 'middle', objectName: 'dcT' + i });
      if (i < 3) arrow(s, x + dw + 0.04, 5.69, x + dw + dg - 0.04, 5.69, 'dcA' + i);
    });
    card(s, 8.6, 2.25, 4.13, 3.92, 'whyCard');
    T(s, [caps('Why buy from us'), ...['Dense sensing wherever usable microwave links exist', 'Potentially denser than conventional rain gauges', 'Near-real-time monitoring', 'Potentially valuable wherever microwave backhaul is present', 'An auditable weather trigger built on multiple data sources']
          .map((t, k, a) => ({ text: t, options: { fontSize: 13.5, color: INK, bullet: true, breakLine: k < a.length - 1 } }))],
      { x: 8.85, y: 2.4, w: 3.7, h: 3.65, paraSpaceAfter: 9, objectName: 'whyT' });
    takeaway(s, 'Alerts for those who act in real time. Data for those who need proof.', 6.35);
    s.addNotes('[1:30–1:48] Then we sell the same intelligence to the market. Rain hits Zone A: JioMausam sends a zone alert, and the platform decides how to adjust dispatch, delivery times or incentives. Delivery comes first, then logistics, cities and insurers, then agriculture and power.');
  }
  // ================= 7 · WHY JIO: INTEGRATION =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Why Jio · how it creates value', 'The edge is integration, not the sensor');
    const L = [['Sense', 'Jio network', 'Microwave links already in place'], ['Understand', 'JioMausam', 'Links + radar + gauges, turned into alerts and data'],
               ['Reach', 'Reliance ecosystem', 'Enterprise sales, JioMart, MyJio'], ['Protect', 'JFS + licensed insurers', 'Optional; the insurer carries the risk']];
    const g = 0.38, bw = (CW - 3 * g) / 4;
    L.forEach((l, i) => {
      const x = M + i * (bw + g);
      card(s, x, 2.25, bw, 1.6, 'moat' + i, i === 1 ? CARD2 : CARD, i === 1 ? SA : LINE, i === 1 ? 1.25 : 0.75);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.2, y: 2.42, w: 1.6, h: 0.4, rectRadius: 0.08, fill: { color: SA }, line: { color: SA, width: 0 }, objectName: 'moatK' + i });
      T(s, l[0].toUpperCase(), { x: x + 0.2, y: 2.42, w: 1.6, h: 0.4, fontFace: 'Cambria', fontSize: 12.5, bold: true, color: DARK, align: 'center', valign: 'middle', charSpacing: 1, objectName: 'moatKT' + i });
      T(s, [{ text: l[1], options: { fontSize: 15.5, bold: true, color: 'FFFFFF', breakLine: true } }, { text: l[2], options: { fontSize: 12, color: SOFT } }], { x: x + 0.2, y: 2.92, w: bw - 0.35, h: 0.88, objectName: 'moatT' + i });
      if (i < 3) arrow(s, x + bw + 0.05, 3.05, x + bw + g - 0.05, 3.05, 'moatA' + i);
    });
    T(s, 'Reliance can connect all four layers, so Jio earns from the intelligence without carrying insurance risk.', { x: M, y: 3.98, w: CW, h: 0.4, fontSize: 15, bold: true, color: 'FFFFFF', objectName: 'moatLine' });
    T(s, [caps('How Jio creates value')], { x: M, y: 4.55, w: 5, h: 0.3, objectName: 'revK' });
    const S = [['01', 'External revenue', 'Intelligence fees', 'API, alerts and data for businesses', SA],
               ['02', 'External revenue · optional', 'Distribution fees', 'Only if Kavach launches; the insurer carries the risk', MUTE],
               ['03', 'Internal value', 'Savings inside Reliance', 'Network operations, delivery and retail', GREEN]];
    const rw = (CW - 2 * 0.25) / 3;
    S.forEach((st, i) => {
      const x = M + i * (rw + 0.25);
      card(s, x, 4.88, rw, 1.3, 'rev' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : (i === 2 ? '1F5A45' : LINE), i === 0 ? 1.25 : 0.75);
      T(s, st[0], { x: x + 0.2, y: 5.0, w: 0.6, h: 0.5, fontFace: 'Cambria', fontSize: 22, bold: true, color: st[4], objectName: 'revN' + i });
      T(s, [caps(st[1], st[4]), { text: st[2], options: { fontSize: 15, bold: true, color: 'FFFFFF', breakLine: true } }, { text: st[3], options: { fontSize: 12.5, color: SOFT } }], { x: x + 0.82, y: 4.98, w: rw - 1.0, h: 1.14, objectName: 'revT' + i });
    });
    takeaway(s, 'The business stands even if insurance never launches.', 6.38);
    s.addNotes('[1:48–2:04] Our edge isn’t the sensor; it’s integration. Jio senses, JioMausam understands, Reliance reaches customers, licensed partners protect. We sell intelligence outside and create savings inside Reliance; insurance is optional. So the business stands even if insurance never launches.');
  }
  // ================= 8 · KAVACH AS ONE APPLICATION =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Where we started · Mausam Kavach', 'Insurance is one application, not the anchor');
    const F = [[I.rainInk, 'Qualifying weather event in a zone'], [I.chipInk, 'JioMausam supplies the trigger data'], [I.shield, 'A licensed insurer would pay'], [I.bank, 'Fixed benefit to the worker, e.g. ₹300']];
    F.forEach((f, i) => {
      const y = 2.25 + i * 0.95;
      card(s, M, y, 5.9, 0.78, 'fl' + i, i === 3 ? AMBERBG : CARD, i === 3 ? SA : LINE, i === 3 ? 1.25 : 0.75);
      s.addImage({ data: f[0], x: M + 0.22, y: y + 0.19, w: 0.4, h: 0.4, objectName: 'flI' + i });
      T(s, f[1], { x: M + 0.8, y, w: 4.9, h: 0.78, fontSize: 16, bold: true, color: i === 3 ? SA : 'FFFFFF', valign: 'middle', objectName: 'flT' + i });
      if (i < 3) arrow(s, M + 0.42, y + 0.78, M + 0.42, y + 0.95, 'flA' + i);
    });
    T(s, 'No claim, no proof of loss. Eligible = already active in the zone before the event began (predefined rules). ₹300 is a prototype assumption.', { x: M, y: 6.02, w: CW, h: 0.35, fontSize: 13, color: MUTE, objectName: 'flNote' });
    card(s, 6.85, 2.25, 5.88, 3.6, 'gateCard', CARD2, SA, 1.25);
    T(s, [caps('Why it’s an option, not the anchor'),
          ...[['Only after the accuracy and actuarial gates', 'shadow payouts until then'], ['Who pays is still unproven', 'platform, co-funded or individual: the pilot tests it'], ['A licensed insurer carries the risk', 'never Jio'], ['If it doesn’t work, nothing breaks', 'the intelligence business is untouched']]
            .flatMap(([a, b], k, arr) => [{ text: a, options: { fontSize: 16, bold: true, color: 'FFFFFF', breakLine: true, paraSpaceBefore: 14 } }, { text: b, options: { fontSize: 13.5, color: SOFT, breakLine: k < arr.length - 1 } }])],
      { x: 7.15, y: 2.42, w: 5.35, h: 3.35, paraSpaceAfter: 2, objectName: 'gateT' });
    takeaway(s, 'High impact if it works. Zero damage if it doesn’t.', 6.5);
    s.addNotes('[2:04–2:22] Our original idea was Kavach. Stress-testing showed the stronger business is the intelligence underneath it. Insurance becomes one application: JioMausam supplies trigger data, and a licensed insurer would pay a fixed benefit, only after the accuracy and actuarial gates. If it never launches, nothing breaks.');
  }

  // ================= 9 · PRICING (OPTIONAL APPLICATION) =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Optional application · city-specific weather protection', 'If we offer Kavach, Indian weather sets the price');
    const hdr = (t) => ({ text: t, options: { bold: true, color: SA, fontSize: 11, fill: { color: CARD2 } } });
    const row = (cells, f, hi) => cells.map((t, k) => ({ text: t, options: { fill: { color: f }, color: k === 4 ? (hi ? SA : 'FFFFFF') : (k === 0 ? 'FFFFFF' : INK), bold: k === 0 || k === 4, fontSize: 13 } }));
    s.addTable([
      [hdr('City · product'), hdr('Trigger'), hdr('Raw days a year'), hdr('Expected paid days'), hdr('Illustrative price a month')],
      row(['Mumbai · Basic', '≥204.5 mm rain a day', '1.1', '1.1', '₹45'], CARD),
      row(['Nagpur · Basic', '≥47°C', '2.2', '~1.2', '₹52'], '111830'),
      row(['Ahmedabad · Basic', '≥47°C', '0.7', '~0.6', '₹29 floor'], CARD),
      row(['Mumbai · Plus (platform)', '≥64.5 mm rain a day', '11.9', '5.0 (cap)', '₹208'], '1E2547', true),
    ], { x: M, y: 2.25, w: 7.7, colW: [2.15, 1.85, 1.1, 1.25, 1.35], rowH: 0.5, fontFace: 'Calibri', valign: 'middle', margin: [0.04, 0.1, 0.04, 0.1], border: { type: 'solid', color: LINE, pt: 0.75 }, objectName: 'table' });
    T(s, 'Price = expected paid days × ₹300 ÷ 60% ÷ 12', { x: M, y: 4.88, w: 7.7, h: 0.38, fontSize: 15, bold: true, color: SA, objectName: 'formula' });
    T(s, 'Basic covers rare extremes for individuals. Plus is priced from ~12 historical heavy-rain days a year, with payouts capped at 5 days a year, for platforms to sponsor. The pilot recalibrates the live trigger.', { x: M, y: 5.3, w: 7.7, h: 0.75, fontSize: 13, color: SOFT, objectName: 'plusNote' });
    const CI = [[I.rainB, 'Mumbai · rain', '11.9 heavy-rain days a year', 'Phase 1'], [I.temp, 'Nagpur · heat', '9.7 days at 45°C or more a year', 'Phase 2'], [I.temp, 'Ahmedabad · heat', '5.4 days at 45°C or more a year', 'Phase 2']];
    CI.forEach((c, i) => {
      const y = 2.25 + i * 1.08;
      card(s, 8.6, y, 4.13, 0.95, 'city' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE);
      s.addImage({ data: c[0], x: 8.82, y: y + 0.27, w: 0.4, h: 0.4, objectName: 'cityI' + i });
      T(s, [{ text: c[1], options: { fontSize: 15, bold: true, color: 'FFFFFF', breakLine: true } }, { text: c[2], options: { fontSize: 12.5, color: SOFT } }], { x: 9.38, y: y + 0.13, w: 2.3, h: 0.72, objectName: 'cityT' + i });
      T(s, c[3], { x: 11.6, y, w: 1.0, h: 0.95, fontFace: 'Cambria', fontSize: 15, bold: true, color: SA, align: 'right', valign: 'middle', objectName: 'cityP' + i });
    });
    T(s, 'Rain: Jio’s own sensing. Heat: IMD stations and satellite, through the same engine.', { x: 8.6, y: 5.55, w: 4.13, h: 0.6, fontSize: 12.5, color: SOFT, objectName: 'heatNote' });
    takeaway(s, 'One flat price can’t fit India’s different weather risks.', 6.4);
    foot(s, 'IMD station data 2000–2024 · ₹300 payout · 5-day annual cap · illustrative 60% loss ratio · final pricing subject to actuarial validation.');
    s.addNotes('[2:22–2:38] If we offer Kavach, Indian weather sets the price. From 25 years of IMD records: Basic about 45 rupees a month in Mumbai, 52 in Nagpur, 29 in Ahmedabad. Plus is priced from twelve historical heavy-rain days, capped at five paid days: 208.');
  }

  // ================= 10 · THREE GATES, ROADMAP, CLOSE =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The ask', 'Don’t believe us. Test it in 90 days');
    const R = [['Days 1–30', 'Coverage', 'Audit Jio’s microwave links and data readiness in Mumbai and candidate NE-monsoon cities.', 'GATE 1 · COVERAGE', 'enough usable coverage?'],
               ['Days 15–60', 'Accuracy', 'Back-test archived Mumbai monsoon data; score every source mix against held-out gauges.', 'GATE 2 · ACCURACY', 'fused system clears every gate?'],
               ['Days 61–90', 'Value', 'Live shadow test in one Reliance operation, in the city the audit selects. Compare matched zones with and without JioMausam.', 'GATE 3 · VALUE', 'improves a real Reliance operation?']];
    R.forEach((r, i) => {
      const y = 2.2 + i * 1.12;
      card(s, M, y, 7.15, 1.0, 'pr' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE, i === 0 ? 1.25 : 0.75);
      T(s, [caps(r[0], MUTE), { text: r[1], options: { fontFace: 'Cambria', fontSize: 17, bold: true, color: 'FFFFFF' } }], { x: M + 0.22, y: y + 0.12, w: 1.55, h: 0.78, objectName: 'prH' + i });
      T(s, r[2], { x: M + 1.85, y: y + 0.06, w: 3.42, h: 0.88, fontSize: 12, color: SOFT, valign: 'middle', objectName: 'prT' + i });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 5.35, y: y + 0.13, w: 1.65, h: 0.74, rectRadius: 0.1, fill: { color: AMBERBG }, line: { color: SA, width: 0.75 }, objectName: 'prG' + i });
      T(s, [{ text: r[3], options: { fontSize: 10.5, bold: true, color: SA, breakLine: true } }, { text: r[4], options: { fontSize: 10.5, color: INK } }], { x: M + 5.42, y: y + 0.13, w: 1.51, h: 0.74, align: 'center', valign: 'middle', objectName: 'prGT' + i });
    });
    T(s, 'ROADMAP', { x: 8.05, y: 2.2, w: 4.68, h: 0.3, fontSize: 11, bold: true, color: SA, charSpacing: 2, objectName: 'rmK' });
    const h2 = (t) => ({ text: t, options: { bold: true, color: SA, fontSize: 11, fill: { color: CARD2 } } });
    const rr = (a, f) => a.map((t, k) => ({ text: t, options: { fill: { color: f }, color: k === 0 ? MUTE : (k === 1 ? 'FFFFFF' : INK), bold: k === 0, fontSize: 12 } }));
    s.addTable([
      [h2(''), h2('Intelligence (core)'), h2('Kavach (optional)')],
      rr(['0–3 m', 'Three gates (pilot)', 'Shadow payouts'], '1E2547'),
      rr(['4–12 m', 'Reliance live + first clients', 'Sandbox + heat'], CARD),
      rr(['Year 2', 'Cities + enterprises', 'Basic at recharge'], '111830'),
      rr(['Year 3', 'National weather API', 'National scale'], CARD),
    ], { x: 8.05, y: 2.55, w: 4.68, colW: [0.8, 2.05, 1.83], rowH: 0.48, fontFace: 'Calibri', valign: 'middle', margin: [0.03, 0.08, 0.03, 0.08], border: { type: 'solid', color: LINE, pt: 0.75 }, objectName: 'rmTable' });
    T(s, 'Only after all three gates pass do we scale externally.', { x: 8.05, y: 5.03, w: 4.68, h: 0.36, fontSize: 13, bold: true, color: GREEN, objectName: 'gatesLine' });
    T(s, [{ text: 'We aren’t asking Jio to build another weather network. ', options: { color: 'FFFFFF' } }, { text: 'We’re asking it to discover what its existing network can tell us, and turn that signal into decisions.', options: { color: SA } }],
      { x: M, y: 5.55, w: CW, h: 0.78, fontFace: 'Cambria', fontSize: 19, italic: true, bold: true, align: 'center', valign: 'middle', objectName: 'close' });
    T(s, 'First prove the signal.  Then sell the intelligence.  Protection comes last.', { x: M, y: 6.4, w: CW, h: 0.38, fontFace: 'Cambria', fontSize: 17, bold: true, color: GREEN, align: 'center', valign: 'middle', objectName: 'tag' });
    T(s, 'Gate 2: ≥80% of predefined trigger events caught · totals within ±10% of gauges · under 15% of triggers unconfirmed.  Gate 3 KPIs: site visits · fault-resolution time · delivery delays · rider availability · incentive spend.',
      { x: M, y: 6.9, w: CW, h: 0.42, fontSize: 9.5, color: '7A85A8', objectName: 'source' });
    s.addNotes('[2:38–3:00] Don’t believe us; test it. Ninety days, three gates: coverage, accuracy, value. We don’t pre-select the city; the audit does. We aren’t asking Jio to build a weather network, but to discover what its network can tell us. First prove the signal. Then sell the intelligence. Protection comes last.');
  }

  await pres.writeFile({ fileName: __dirname + '/JioMausam_Elimination_Draft6_raw.pptx' });
  await applyTheme(__dirname + '/JioMausam_Elimination_Draft6_raw.pptx', THEME);
  console.log('written');
})().catch(e => { console.error(e); process.exit(1); });
