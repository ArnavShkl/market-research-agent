// JioMausam elimination-round presentation, draft 4 (10 slides, 3 minutes).
// Story: problem -> what we're building -> tried and tested (and its limit) -> raising accuracy by combining sources
// -> Reliance first -> then the market -> how Jio earns -> insurance as one application -> India layer -> pilot, roadmap, close.
// Transitions and animations are added afterwards by motion_v4.py.
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
    head(s, 'The problem', 'Weather changes street by street. Decisions don’t');
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
    T(s, [caps('What a business knows', MUTE), { text: '“Heavy rain in Mumbai.”', options: { fontFace: 'Cambria', fontSize: 20, italic: true, color: 'FFFFFF' } }], { x: 6.25, y: 2.42, w: 6.3, h: 0.8, objectName: 'knowT' });
    arrow(s, 9.34, 3.3, 9.34, 3.55, 'knowA');
    card(s, 5.95, 3.55, 6.78, 1.0, 'needCard', CARD2, SA, 1.25);
    T(s, [caps('What it needs to know'), { text: '“Where exactly is rain hitting operations right now?”', options: { fontFace: 'Cambria', fontSize: 20, italic: true, color: 'FFFFFF' } }], { x: 6.25, y: 3.67, w: 6.3, h: 0.8, objectName: 'needT' });
    const imp = [[I.bike, 'Businesses decide blind', 'incentives, dispatch, delivery times'], [I.wallet, 'Workers carry the loss', 'income and safety, street by street']];
    imp.forEach((m, i) => {
      const x = 5.95 + i * 3.45;
      card(s, x, 4.8, 3.33, 1.3, 'imp' + i);
      s.addImage({ data: m[0], x: x + 0.22, y: 5.02, w: 0.4, h: 0.4, objectName: 'impI' + i });
      T(s, [{ text: m[1], options: { fontSize: 15.5, bold: true, color: 'FFFFFF', breakLine: true } }, { text: m[2], options: { fontSize: 13, color: SOFT } }], { x: x + 0.78, y: 4.98, w: 2.45, h: 1.0, objectName: 'impT' + i });
    });
    takeaway(s, 'Weather is lived street by street. Most actionable weather information is still too coarse to act on at that level.');
    foot(s, 'Rainfall: India Meteorological Department, 26 July 2005.');
    s.addNotes('[0:00–0:18] Since our video, we stress-tested coverage, accuracy and who pays. Here’s the problem: on 26 July 2005, Santacruz got 944 millimetres of rain and Colaba just 73. Weather changes street by street, but businesses still decide city by city, and workers carry the loss.');
  }

  // ================= 2 · WHAT WE'RE BUILDING =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'What we’re building', 'A street-level weather layer from Jio’s network');
    const tw = 0.92, th = tw * 1.513;
    s.addImage({ path: A('tower_big.png'), x: 0.75, y: 2.5, w: tw, h: th, objectName: 'towerA' });
    s.addImage({ path: A('tower_big.png'), x: 5.4, y: 2.5, w: tw, h: th, objectName: 'towerB' });
    s.addShape(pres.shapes.LINE, { x: 1.21, y: 2.67, w: 4.65, h: 0, line: { color: SA, width: 2.5, dashType: 'dash' }, objectName: 'beam' });
    T(s, 'Microwave link between two sites', { x: 1.5, y: 2.25, w: 4.1, h: 0.3, fontSize: 13, bold: true, color: SA, align: 'center', objectName: 'beamLab' });
    [[2.1, 3.0], [2.75, 3.3], [3.4, 2.95], [4.05, 3.35], [4.7, 3.0], [2.45, 3.65], [3.75, 3.7], [5.0, 3.6]].forEach(([x, y], i) =>
      s.addImage({ data: I.drop, x, y, w: 0.2, h: 0.2, objectName: 'drop' + i }));
    T(s, [{ text: 'Rain weakens the signal. ', options: { bold: true, color: 'FFFFFF' } }, { text: 'Measure the loss and you get rainfall along every link, every minute.', options: { color: SOFT } }],
      { x: M, y: 4.15, w: 5.9, h: 0.7, fontSize: 14.5, objectName: 'how' });
    card(s, 6.85, 2.25, 5.88, 2.6, 'defCard', CARD2, SA, 1.25);
    T(s, [caps('JioMausam is'), { text: 'a weather-intelligence layer: a minute-by-minute, 1 km picture of rain for Reliance and for businesses.', options: { fontFace: 'Cambria', fontSize: 19, bold: true, color: 'FFFFFF' } }],
      { x: 7.15, y: 2.42, w: 5.35, h: 1.35, objectName: 'defT' });
    T(s, [{ text: 'Built from the network Jio already runs, checked against IMD radar and rain gauges.', options: { fontSize: 13.5, color: SOFT } }], { x: 7.15, y: 3.95, w: 5.35, h: 0.8, objectName: 'defT2' });
    const IS = ['Rain intelligence from existing infrastructure', 'Decisions and data for businesses', 'A trigger for future worker protection'];
    const ISNT = ['A new sensor network', 'A consumer weather app', 'An insurer', 'Heat sensing from towers'];
    card(s, M, 5.05, 5.9, 1.25, 'isCard');
    T(s, [caps('It is', GREEN), ...IS.map((t, k) => ({ text: t, options: { fontSize: 13, color: INK, bullet: true, breakLine: k < IS.length - 1 } }))], { x: M + 0.25, y: 5.13, w: 5.5, h: 1.12, objectName: 'isT' });
    card(s, 6.85, 5.05, 5.88, 1.25, 'isntCard');
    T(s, [caps('It isn’t', 'FF8A8D'), { text: ISNT.join('  ·  '), options: { fontSize: 13, color: INK } }], { x: 7.1, y: 5.13, w: 5.45, h: 1.12, objectName: 'isntT' });
    T(s, 'We use microwave links, not fibre. How many usable links Jio has is the first thing our pilot measures.', { x: M, y: 6.48, w: CW, h: 0.4, fontSize: 14, color: SOFT, objectName: 'caveat' });
    s.addNotes('[0:18–0:34] So we’re building JioMausam: a street-level weather layer from Jio’s own network. Rain weakens the microwave links between sites; measuring that loss gives rainfall along every link, every minute. It isn’t a new sensor network or an insurer, and fibre doesn’t count.');
  }

  // ================= 3 · TRIED AND TESTED, AND ITS LIMIT =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Tried and tested', 'Proven science, tested by us, with a clear limit');
    card(s, M, 2.25, 3.55, 4.05, 'sciCard');
    s.addImage({ data: I.flask, x: M + 0.25, y: 2.45, w: 0.4, h: 0.4, objectName: 'sciI' });
    T(s, [caps('Proven elsewhere'), { text: 'Published, and proven country-wide', options: { fontFace: 'Cambria', fontSize: 17, bold: true, color: 'FFFFFF', breakLine: true } },
          { text: 'Science (2006): rain measured from a cellular network in Israel', options: { fontSize: 13, color: SOFT, bullet: true, breakLine: true } },
          { text: 'PNAS (2013): country-wide rain maps of the Netherlands from phone networks', options: { fontSize: 13, color: SOFT, bullet: true, breakLine: true } },
          { text: 'Open-source tools (pycomlink, KIT Germany)', options: { fontSize: 13, color: SOFT, bullet: true } }],
      { x: M + 0.25, y: 2.98, w: 3.1, h: 3.2, paraSpaceAfter: 6, objectName: 'sciT' });
    const X = 4.4, XW = W - M - X;
    card(s, X, 2.25, XW, 0.42, 'banner', AMBERBG, SA, 0.75);
    T(s, 'TESTED BY US  ·  500 REAL LINKS  ·  PUBLIC DATASET, GERMANY  ·  11 DAYS  ·  NOT JIO DATA', { x: X, y: 2.25, w: XW, h: 0.42, fontSize: 11.5, bold: true, color: SA, charSpacing: 1, align: 'center', valign: 'middle', objectName: 'bannerT' });
    const tw = (XW - 2 * 0.22) / 3;
    [['0.95', 'network-wide match with radar, on unseen days'], ['0.88', 'typical single link on its own']].forEach((t, i) => {
      const x = X + i * (tw + 0.22);
      card(s, x, 2.85, tw, 1.4, 'tile' + i);
      T(s, [{ text: t[0], options: { fontFace: 'Cambria', fontSize: 34, bold: true, color: 'FFFFFF', breakLine: true } }, { text: t[1], options: { fontSize: 12.5, color: SOFT } }], { x: x + 0.22, y: 2.93, w: tw - 0.4, h: 1.25, objectName: 'tileT' + i });
    });
    const x3 = X + 2 * (tw + 0.22);
    card(s, x3, 2.85, tw, 1.4, 'tile2', '2A1622', RED, 1);
    T(s, [{ text: '68%', options: { fontFace: 'Cambria', fontSize: 34, bold: true, color: 'FFFFFF', breakLine: true } }, { text: 'of radar trigger events caught', options: { fontSize: 12.5, color: INK, breakLine: true } },
          { text: '18% of our triggers not confirmed', options: { fontSize: 11.5, color: 'FF9A9C' } }], { x: x3 + 0.22, y: 2.93, w: tw - 0.4, h: 1.3, objectName: 'tileT2' });
    s.addChart(pres.charts.LINE, [
      { name: 'Radar', labels: D.net.labels.map((l, i) => (i % 48 === 12 ? l : '')), values: D.net.r },
      { name: 'Our 500 links', labels: D.net.labels.map((l, i) => (i % 48 === 12 ? l : '')), values: D.net.c },
    ], {
      x: X - 0.1, y: 4.35, w: XW + 0.15, h: 1.95, objectName: 'chart', chartColors: [ORANGE, BLUE], lineSize: 2, lineDataSymbol: 'none',
      showLegend: true, legendPos: 'r', legendColor: 'D7DDEA', legendFontSize: 11.5, legendFontFace: '+mn-lt',
      catAxisLabelColor: MUTE, valAxisLabelColor: MUTE, catAxisLabelFontSize: 11, valAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
      catAxisLabelFrequency: 1, catAxisLineShow: false, valAxisLineShow: false, valGridLine: { color: '2A3357', size: 0.5 }, catGridLine: { style: 'none' },
      showValAxisTitle: true, valAxisTitle: 'mm/h', valAxisTitleColor: MUTE, valAxisTitleFontSize: 11, valAxisTitleFontFace: '+mn-lt',
    });
    takeaway(s, 'It works. But links alone aren’t accurate enough to pay claims on, and we say so.');
    foot(s, 'Messer et al., Science 2006 · Overeem et al., PNAS 2013 · Our test: tuned on 10–12 May 2018, scored on 13–20 May; trigger = 10 mm in 3 h per ~4 km square; reference: German radar.');
    s.addNotes('[0:34–0:56] This is proven science, published in Science and PNAS, and used to map rain across a whole country. We tested it ourselves on 500 real links from a public German dataset: 0.95 against radar network-wide, 0.88 for a single link. But links alone caught only 68% of radar’s trigger events. That’s our honest limit.');
  }

  // ================= 4 · RAISING ACCURACY =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Raising accuracy', 'Combine sources, then let the data pick the best mix');
    card(s, M, 2.25, 5.75, 3.95, 'srcCard');
    T(s, [caps('Layer the sources, cheapest first')], { x: M + 0.25, y: 2.4, w: 5.3, h: 0.3, objectName: 'srcK' });
    const SRC = [[I.tower, 'Jio microwave links', 'Internal'], [I.dish, 'IMD Doppler radar', 'Low cost'], [I.gauge, 'IMD and BMC rain gauges', 'Free / low'],
                 [I.sat, 'Satellite (outage fallback)', 'Free'], [I.map, 'New gauges on Jio sites, where links are thin', 'Capex'], [I.scale, 'Commercial weather data, only for gaps', 'Paid']];
    SRC.forEach((r, i) => {
      const y = 2.8 + i * 0.55;
      s.addImage({ data: r[0], x: M + 0.25, y: y + 0.06, w: 0.32, h: 0.32, objectName: 'srcI' + i });
      T(s, r[1], { x: M + 0.72, y, w: 3.55, h: 0.45, fontSize: 14, bold: i === 0, color: i === 0 ? 'FFFFFF' : INK, valign: 'middle', objectName: 'srcT' + i });
      pill(s, M + 4.4, y + 0.07, 1.15, r[2], 'srcP' + i, i < 4 ? '13253A' : AMBERBG, i < 4 ? '6FB3FF' : SA);
    });
    const X = 6.65, XW = W - M - X;
    card(s, X, 2.25, XW, 3.95, 'mixCard', CARD2, SA, 1.25);
    T(s, [caps('The pilot scores every mix against hidden rain gauges')], { x: X + 0.25, y: 2.4, w: XW - 0.5, h: 0.3, objectName: 'mixK' });
    const bx = X + 2.25, bw = XW - 2.55, tgt = 0.8;
    const MIX = [['Links only', 0.68, 'German test: 68%'], ['Links + radar', null, ''], ['Links + radar + gauges', null, ''], ['Radar + gauges, no links', null, 'shows what Jio adds'], ['+ paid data', null, '']];
    MIX.forEach((m, i) => {
      const y = 2.85 + i * 0.58;
      T(s, m[0], { x: X + 0.25, y, w: 1.95, h: 0.42, fontSize: 13, color: i === 3 ? SA : INK, bold: i === 3, valign: 'middle', objectName: 'mixL' + i });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.07, w: bw, h: 0.28, rectRadius: 0.06, fill: { color: '10162C' }, line: { color: '3A4570', width: 0.75, dashType: m[1] ? 'solid' : 'dash' }, objectName: 'mixB' + i });
      if (m[1]) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.07, w: bw * m[1], h: 0.28, rectRadius: 0.06, fill: { color: BLUE }, line: { color: BLUE, width: 0 }, objectName: 'mixF' + i });
      T(s, m[1] ? m[2] : (m[2] || 'measured in the pilot'), { x: bx + 0.12, y: y + 0.07, w: bw - 0.2, h: 0.28, fontSize: 11, bold: !!m[1], color: m[1] ? 'FFFFFF' : MUTE, valign: 'middle', objectName: 'mixV' + i });
    });
    s.addShape(pres.shapes.LINE, { x: bx + bw * tgt, y: 2.8, w: 0, h: 2.9, line: { color: GREEN, width: 1.75, dashType: 'dash' }, objectName: 'tgtLine' });
    T(s, 'target 80%', { x: bx + bw * tgt - 0.6, y: 5.7, w: 1.2, h: 0.28, fontSize: 11.5, bold: true, color: GREEN, align: 'center', objectName: 'tgtLab' });
    T(s, 'A paid source joins only if it lifts accuracy enough per rupee.', { x: M, y: 6.3, w: CW, h: 0.35, fontSize: 14, color: SOFT, objectName: 'rule' });
    takeaway(s, 'The pilot ends with a cost-versus-accuracy answer: exactly what to scale.', 6.68);
    s.addNotes('[0:56–1:18] So we combine sources, cheapest first: Jio’s links, IMD radar, rain gauges and satellite, with paid data only where gaps remain. The pilot doesn’t guess the best mix; it scores each combination against hidden gauges, and even measures what Jio’s links add on their own. Target: 80% of events caught.');
  }

  // ================= 5 · RELIANCE FIRST =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Commercial use · inside Reliance', 'Reliance is the first customer');
    const U = [[I.tower, 'Jio network operations', 'Tell rain fade from equipment faults; fewer wasted site visits; flood alerts for sites.', 'Proves accuracy and saves money'],
               [I.store, 'JioMart and Reliance Retail', 'Rain-aware dispatch, delivery promises and zone pauses; stock for rain-driven demand.', 'Proves the delivery case'],
               [I.mobile, 'MyJio', 'Street-level rain alerts for users, plus one-tap “is it raining here?” checks.', 'Proves scale; crowd confirmation'],
               [I.ads, 'JioAds', 'Weather-triggered ads: tea, cabs, umbrellas when it rains.', 'New revenue'],
               [I.heart, 'Reliance Foundation', 'Flood and heavy-rain warnings for communities.', 'Social impact'],
               [I.shield, 'Jio Financial Services', 'Prepares the insurance option with a licensed insurer.', 'Readiness, not dependence']];
    const cw = (CW - 2 * 0.25) / 3;
    U.forEach((u, i) => {
      const x = M + (i % 3) * (cw + 0.25), y = 2.25 + Math.floor(i / 3) * 1.98;
      card(s, x, y, cw, 1.82, 'use' + i, i < 2 ? CARD2 : CARD, i < 2 ? SA : LINE, i < 2 ? 1.25 : 0.75);
      s.addImage({ data: u[0], x: x + 0.22, y: y + 0.2, w: 0.38, h: 0.38, objectName: 'useI' + i });
      T(s, u[1], { x: x + 0.75, y: y + 0.18, w: cw - 0.95, h: 0.42, fontSize: 15.5, bold: true, color: 'FFFFFF', valign: 'middle', objectName: 'useH' + i });
      T(s, [{ text: u[2], options: { fontSize: 13, color: SOFT, breakLine: true } }, { text: u[3], options: { fontSize: 12, bold: true, color: SA } }], { x: x + 0.22, y: y + 0.72, w: cw - 0.42, h: 1.02, paraSpaceAfter: 4, objectName: 'useT' + i });
    });
    takeaway(s, 'Prove accuracy and value at home before selling outside.', 6.3);
    s.addNotes('[1:18–1:34] Reliance is the first customer. Jio’s network teams can tell rain from faults and avoid wasted site visits; JioMart can dispatch and promise deliveries by zone; MyJio can send street-level alerts. We prove accuracy and value at home first.');
  }

  // ================= 6 · THEN THE MARKET =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Commercial use · the market', 'Then sell decisions and data to the market');
    const P = [['1', 'Delivery, quick commerce, ride-hailing', 'e.g. Swiggy, Zomato, Zepto, Uber, Rapido', 'Decisions', 'Dispatch, incentives, weather-linked pricing, pause alerts'],
               ['2', 'Logistics · cities and transport · insurers', 'e.g. Delhivery, Porter, BMC, railways, insurers', 'Decisions + data', 'Routes, flood response, auditable rain records'],
               ['3', 'Agriculture · power · construction · retail', 'e.g. crop insurance, discoms, metro projects, FMCG', 'Data + decisions', 'Crop cover, storm outages, work pauses, demand']];
    P.forEach((p, i) => {
      const y = 2.25 + i * 1.33;
      card(s, M, y, 7.75, 1.2, 'mk' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE, i === 0 ? 1.25 : 0.75);
      s.addShape(pres.shapes.OVAL, { x: M + 0.22, y: y + 0.32, w: 0.56, h: 0.56, fill: { color: i === 0 ? SA : '2A3357' }, line: { color: i === 0 ? SA : '2A3357', width: 0 }, objectName: 'mkO' + i });
      T(s, p[0], { x: M + 0.22, y: y + 0.32, w: 0.56, h: 0.56, fontFace: 'Cambria', fontSize: 18, bold: true, color: i === 0 ? DARK : 'FFFFFF', align: 'center', valign: 'middle', objectName: 'mkN' + i });
      T(s, [{ text: p[1], options: { fontSize: 15.5, bold: true, color: 'FFFFFF', breakLine: true } }, { text: p[2], options: { fontSize: 12, color: MUTE, breakLine: true } }, { text: p[4], options: { fontSize: 13, color: SOFT } }],
        { x: M + 1.0, y: y + 0.1, w: 4.85, h: 1.02, objectName: 'mkT' + i });
      pill(s, M + 6.0, y + 0.44, 1.55, p[3], 'mkP' + i);
    });
    card(s, 8.6, 2.25, 4.13, 3.86, 'whyCard');
    T(s, [caps('Why buy from us'), ...['A sensor on every link: far denser than gauges', 'Minute by minute, with short-term early warning', 'Ground-level rain, where people are', 'Strongest in rural areas, where microwave links dominate', 'One national supplier, via Jio’s enterprise sales', 'An independent trigger that no party controls']
          .map((t, k, a) => ({ text: t, options: { fontSize: 13, color: INK, bullet: true, breakLine: k < a.length - 1 } }))],
      { x: 8.85, y: 2.4, w: 3.7, h: 3.6, paraSpaceAfter: 6, objectName: 'whyT' });
    takeaway(s, 'Decisions for those who act in real time. Data for those who need proof.', 6.35);
    s.addNotes('[1:34–1:52] Then the market. Delivery and ride-hailing platforms buy decisions: where to dispatch, where incentives are needed, when to pause. Logistics, cities and insurers follow, then agriculture and power. Decisions for those who act in real time; data for those who need proof.');
  }

  // ================= 7 · HOW JIO EARNS =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'How Jio earns', 'Earn from intelligence, carry no insurance risk');
    const S = [['01', 'Decision and data fees', 'Weather API, alerts and operational decisions: recurring B2B revenue'],
               ['02', 'Savings and new revenue inside Reliance', 'Fewer wasted network site visits, better delivery operations, weather-triggered ads'],
               ['03', 'Insurance distribution fees (optional)', 'If Kavach launches: the insurer carries the risk; Jio earns data, technology and distribution fees']];
    S.forEach((st, i) => {
      const y = 2.25 + i * 1.3;
      card(s, M, y, 7.0, 1.15, 'rev' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE, i === 0 ? 1.25 : 0.75);
      T(s, st[0], { x: M + 0.22, y: y + 0.18, w: 0.65, h: 0.6, fontFace: 'Cambria', fontSize: 24, bold: true, color: i === 2 ? MUTE : SA, objectName: 'revN' + i });
      T(s, [{ text: st[1], options: { fontSize: 16, bold: true, color: 'FFFFFF', breakLine: true } }, { text: st[2], options: { fontSize: 13, color: SOFT } }], { x: M + 0.95, y: y + 0.14, w: 5.9, h: 0.92, objectName: 'revT' + i });
    });
    const L = [['Sense', 'Jio network'], ['Understand', 'JioMausam'], ['Reach', 'Reliance ecosystem'], ['Protect', 'JFS + licensed insurers']];
    T(s, [caps('Why Jio: Reliance can connect every layer')], { x: 7.95, y: 2.3, w: 4.78, h: 0.3, objectName: 'moatK' });
    L.forEach((l, i) => {
      const y = 2.75 + i * 0.86;
      card(s, 7.95, y, 4.78, 0.7, 'moat' + i, i === 1 ? CARD2 : CARD, i === 1 ? SA : LINE);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: y + 0.13, w: 1.55, h: 0.44, rectRadius: 0.08, fill: { color: SA }, line: { color: SA, width: 0 }, objectName: 'moatK' + i });
      T(s, l[0].toUpperCase(), { x: 8.1, y: y + 0.13, w: 1.55, h: 0.44, fontFace: 'Cambria', fontSize: 12.5, bold: true, color: DARK, align: 'center', valign: 'middle', charSpacing: 1, objectName: 'moatKT' + i });
      T(s, l[1], { x: 9.85, y, w: 2.8, h: 0.7, fontSize: 15, bold: true, color: 'FFFFFF', valign: 'middle', objectName: 'moatT' + i });
      if (i < 3) arrow(s, 8.87, y + 0.7, 8.87, y + 0.86, 'moatA' + i);
    });
    takeaway(s, 'The business stands even if insurance never launches.', 6.3);
    s.addNotes('[1:52–2:06] Jio earns decision and data fees, plus savings inside Reliance, and carries no insurance risk. Jio senses, JioMausam understands, Reliance reaches, partners protect. The business stands even if insurance never launches.');
  }

  // ================= 8 · INSURANCE AS ONE APPLICATION =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'One application: Mausam Kavach', 'Insurance is one application, not the anchor');
    const F = [[I.rainInk, 'Qualifying weather event in a zone'], [I.chipInk, 'JioMausam verifies the trigger'], [I.shield, 'A licensed insurer pays'], [I.bank, 'Fixed benefit to the worker, e.g. ₹300']];
    F.forEach((f, i) => {
      const y = 2.25 + i * 0.95;
      card(s, M, y, 5.9, 0.78, 'fl' + i, i === 3 ? AMBERBG : CARD, i === 3 ? SA : LINE, i === 3 ? 1.25 : 0.75);
      s.addImage({ data: f[0], x: M + 0.22, y: y + 0.19, w: 0.4, h: 0.4, objectName: 'flI' + i });
      T(s, f[1], { x: M + 0.8, y, w: 4.9, h: 0.78, fontSize: 16, bold: true, color: i === 3 ? SA : 'FFFFFF', valign: 'middle', objectName: 'flT' + i });
      if (i < 3) arrow(s, M + 0.42, y + 0.78, M + 0.42, y + 0.95, 'flA' + i);
    });
    T(s, 'No claim, no proof of loss. Eligible = active in the zone when the event began. ₹300 is a prototype assumption.', { x: M, y: 6.02, w: CW, h: 0.35, fontSize: 13, color: MUTE, objectName: 'flNote' });
    card(s, 6.85, 2.25, 5.88, 3.6, 'gateCard', CARD2, SA, 1.25);
    T(s, [caps('Why it’s an option, not the anchor'),
          ...[['Launches only after accuracy passes 80%', 'shadow payouts until then'], ['Who pays is still unproven', 'platform, co-funded or individual: the pilot tests it'], ['A licensed insurer carries the risk', 'never Jio'], ['If it doesn’t work, nothing breaks', 'the intelligence business is untouched']]
            .flatMap(([a, b], k, arr) => [{ text: a, options: { fontSize: 16, bold: true, color: 'FFFFFF', breakLine: true } }, { text: b, options: { fontSize: 13.5, color: SOFT, breakLine: k < arr.length - 1 } }])],
      { x: 7.15, y: 2.42, w: 5.35, h: 3.35, paraSpaceAfter: 5, objectName: 'gateT' });
    takeaway(s, 'High impact if it works. Zero damage if it doesn’t.', 6.5);
    s.addNotes('[2:06–2:26] Insurance is one application, not our anchor. Once accuracy passes 80%, a verified trigger lets a licensed insurer pay workers a fixed benefit automatically, say 300 rupees. Who pays is still unproven, so the pilot tests it. If it doesn’t work, the core business is untouched.');
  }

  // ================= 9 · INDIA LAYER =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The India layer', 'If we offer it, Indian data sets the price');
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
    T(s, 'Basic covers rare extremes for individuals. Plus covers Mumbai’s ~12 heavy-rain days a year, sponsored by platforms; its 10 mm in 3 h live trigger is a prototype the pilot recalibrates.', { x: M, y: 5.3, w: 7.7, h: 0.75, fontSize: 13, color: SOFT, objectName: 'plusNote' });
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
    s.addNotes('[2:26–2:42] If we offer it, Indian data sets the price. Twenty-five years of IMD records: Kavach Basic about 45 rupees a month in Mumbai, 52 in Nagpur, 29 in Ahmedabad; platform-sponsored Plus about 208. Rain first; heat follows, from IMD data.');
  }

  // ================= 10 · PILOT, ROADMAP, CLOSE =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The ask', 'Don’t believe us. Test it in 90 days');
    const R = [['Days 1–30', 'Coverage', 'Audit Jio’s Mumbai microwave links: frequency, path geometry, telemetry availability.', 'Gate 1 · enough usable links?'],
               ['Days 31–60', 'Accuracy', 'Back-test archived Mumbai monsoon data; score every source mix against IMD radar and gauges.', 'Gate 2 · ≥80% of events, ±10% totals'],
               ['Days 61–90', 'Business value', 'Live test with one Reliance operation in a NE-monsoon city with enough coverage. Shadow Kavach: no money moves.', 'Measure · disruptions, incentives, rider availability']];
    R.forEach((r, i) => {
      const y = 2.2 + i * 1.18;
      card(s, M, y, 7.15, 1.05, 'pr' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE, i === 0 ? 1.25 : 0.75);
      T(s, [caps(r[0], MUTE), { text: r[1], options: { fontFace: 'Cambria', fontSize: 17, bold: true, color: 'FFFFFF' } }], { x: M + 0.22, y: y + 0.14, w: 1.55, h: 0.8, objectName: 'prH' + i });
      T(s, r[2], { x: M + 1.85, y: y + 0.08, w: 3.4, h: 0.9, fontSize: 12.5, color: SOFT, valign: 'middle', objectName: 'prT' + i });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 5.35, y: y + 0.18, w: 1.65, h: 0.7, rectRadius: 0.1, fill: { color: AMBERBG }, line: { color: SA, width: 0.75 }, objectName: 'prG' + i });
      T(s, r[3], { x: M + 5.42, y: y + 0.18, w: 1.51, h: 0.7, fontSize: 10.5, bold: true, color: SA, align: 'center', valign: 'middle', objectName: 'prGT' + i });
    });
    T(s, 'ROADMAP', { x: 8.05, y: 2.2, w: 4.68, h: 0.3, fontSize: 11, bold: true, color: SA, charSpacing: 2, objectName: 'rmK' });
    const h2 = (t) => ({ text: t, options: { bold: true, color: SA, fontSize: 11, fill: { color: CARD2 } } });
    const rr = (a, f) => a.map((t, k) => ({ text: t, options: { fill: { color: f }, color: k === 0 ? MUTE : (k === 1 ? 'FFFFFF' : INK), bold: k === 0, fontSize: 12 } }));
    s.addTable([
      [h2(''), h2('Intelligence (core)'), h2('Kavach (optional)')],
      rr(['0–3 m', 'Coverage + back-test (Mumbai)', 'Shadow payouts'], '1E2547'),
      rr(['4–12 m', 'Reliance live + first clients', 'Sandbox + heat'], CARD),
      rr(['Year 2', 'Cities + enterprises', 'Basic at recharge'], '111830'),
      rr(['Year 3', 'National weather API', 'National scale'], CARD),
    ], { x: 8.05, y: 2.55, w: 4.68, colW: [0.8, 2.05, 1.83], rowH: 0.56, fontFace: 'Calibri', valign: 'middle', margin: [0.03, 0.08, 0.03, 0.08], border: { type: 'solid', color: LINE, pt: 0.75 }, objectName: 'rmTable' });
    T(s, [{ text: 'We aren’t asking Jio to build another weather network. ', options: { color: 'FFFFFF' } }, { text: 'We’re asking it to discover what its existing network can already tell us.', options: { color: SA } }],
      { x: M, y: 5.9, w: CW, h: 0.8, fontFace: 'Cambria', fontSize: 19, italic: true, bold: true, align: 'center', valign: 'middle', objectName: 'close' });
    foot(s, 'Gate 2 also requires under 15% of our triggers to go unconfirmed by radar. Months 4–12 include Mumbai’s 2027 monsoon and the April–June heat season.');
    s.addNotes('[2:42–3:00] So don’t believe us; test it. Ninety days: audit Mumbai’s links, back-test archived monsoon data to find the best source mix, then a shadow pilot inside Reliance. We aren’t asking Jio to build another weather network. We’re asking it to discover what its network can already tell us.');
  }

  await pres.writeFile({ fileName: __dirname + '/JioMausam_Elimination_Draft4_raw.pptx' });
  await applyTheme(__dirname + '/JioMausam_Elimination_Draft4_raw.pptx', THEME);
  console.log('written');
})().catch(e => { console.error(e); process.exit(1); });
