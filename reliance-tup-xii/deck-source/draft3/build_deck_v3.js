// JioMausam elimination-round presentation, draft 3 (10 slides, 3 minutes).
// Intelligence-first story: problem -> insight -> proof and limit -> engine -> decisions (core business)
// -> Kavach (application) -> India layer -> who pays + money -> why Jio -> 90-day pilot, roadmap, close.
// Transitions and animations are added afterwards by motion_v3.py.
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
    rain: ['FaCloudShowersHeavy', BLUE], rainInk: ['FaCloudShowersHeavy', INK], drop: ['FaDroplet', BLUE], info: ['FaCircleInfo', SA],
    tower: ['FaTowerBroadcast', INK], dish: ['FaSatelliteDish', INK], gauge: ['FaGaugeHigh', INK], sat: ['FaSatellite', INK], chip: ['FaMicrochip', SA],
    grid: ['FaTableCells', INK], bolt: ['FaBolt', INK], bike: ['FaMotorcycle', INK], truck: ['FaTruckFast', INK], city: ['FaCity', INK],
    user: ['FaUserShield', INK], shield: ['FaShieldHalved', INK], bank: ['FaBuildingColumns', SA], chipInk: ['FaMicrochip', INK],
    temp: ['FaTemperatureHigh', ORANGE], rainB: ['FaCloudShowersHeavy', BLUE], warn: ['FaTriangleExclamation', ORANGE], ok: ['FaCircleCheck', GREEN],
    map: ['FaMapLocationDot', SA], target: ['FaBullseye', SA], chart: ['FaChartLine', SA], layers: ['FaLayerGroup', SA], wallet: ['FaWallet', INK],
    people: ['FaPeopleGroup', INK],
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
  const takeaway = (s, text, y = 6.38) => T(s, text, { x: M, y, w: CW, h: 0.5, fontFace: 'Cambria', fontSize: 18, italic: true, bold: true, color: SA, objectName: 'takeaway' });
  const caps = (text, color = SA) => ({ text: text.toUpperCase(), options: { fontSize: 10.5, bold: true, color, charSpacing: 2, breakLine: true } });

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
    T(s, [caps('What a business knows', MUTE), { text: '“Heavy rain in Mumbai.”', options: { fontFace: 'Cambria', fontSize: 20, italic: true, color: 'FFFFFF' } }],
      { x: 6.25, y: 2.42, w: 6.3, h: 0.8, objectName: 'knowT' });
    arrow(s, 9.34, 3.3, 9.34, 3.55, 'knowA');
    card(s, 5.95, 3.55, 6.78, 1.0, 'needCard', CARD2, SA, 1.25);
    T(s, [caps('What it needs to know'), { text: '“Where exactly is rain hitting operations right now?”', options: { fontFace: 'Cambria', fontSize: 20, italic: true, color: 'FFFFFF' } }],
      { x: 6.25, y: 3.67, w: 6.3, h: 0.8, objectName: 'needT' });
    const imp = [[I.bike, 'Businesses decide blind', 'incentives, dispatch, delivery promises'], [I.wallet, 'Workers carry the loss', 'income and safety, street by street']];
    imp.forEach((m, i) => {
      const x = 5.95 + i * 3.45;
      card(s, x, 4.8, 3.33, 1.3, 'imp' + i);
      s.addImage({ data: m[0], x: x + 0.22, y: 5.02, w: 0.4, h: 0.4, objectName: 'impI' + i });
      T(s, [{ text: m[1], options: { fontSize: 15.5, bold: true, color: 'FFFFFF', breakLine: true } }, { text: m[2], options: { fontSize: 13, color: SOFT } }],
        { x: x + 0.78, y: 4.98, w: 2.45, h: 1.0, objectName: 'impT' + i });
    });
    takeaway(s, 'Weather is lived street by street. Most actionable weather information is still too coarse to act on at that level.');
    foot(s, 'Rainfall: India Meteorological Department, 26 July 2005.');
    s.addNotes('[0:00–0:18] Our video showed that Jio’s network can see rain. Since then we stress-tested coverage, accuracy and who pays. The problem: on 26 July 2005, Santacruz got 944 millimetres and Colaba just 73. Weather changes street by street, but business decisions are still made city by city.');
  }

  // ================= 2 · INSIGHT =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The Jio insight', 'What if the network itself could sense the rain?');
    const tw = 0.92, th = tw * 1.513;
    s.addImage({ path: A('tower_big.png'), x: 0.75, y: 2.45, w: tw, h: th, objectName: 'towerA' });
    s.addImage({ path: A('tower_big.png'), x: 5.55, y: 2.45, w: tw, h: th, objectName: 'towerB' });
    s.addShape(pres.shapes.LINE, { x: 1.21, y: 2.62, w: 4.8, h: 0, line: { color: SA, width: 2.5, dashType: 'dash' }, objectName: 'beam' });
    T(s, 'Microwave link between two sites', { x: 1.6, y: 2.2, w: 4.1, h: 0.3, fontSize: 13, bold: true, color: SA, align: 'center', objectName: 'beamLab' });
    [[2.1, 2.95], [2.75, 3.25], [3.4, 2.9], [4.05, 3.3], [4.7, 2.95], [2.45, 3.6], [3.75, 3.65], [5.05, 3.55]].forEach(([x, y], i) =>
      s.addImage({ data: I.drop, x, y, w: 0.2, h: 0.2, objectName: 'drop' + i }));
    T(s, 'Rain along the path weakens the signal', { x: 1.5, y: 4.05, w: 4.3, h: 0.35, fontSize: 13, color: SOFT, align: 'center', objectName: 'absorb' });
    const P = [['Signal strength changes', 'logged by the network'], ['Path-average rainfall', 'standard ITU-R formula'], ['1 km rain estimate', 'with a confidence score']];
    P.forEach((p, i) => {
      const y = 2.3 + i * 0.82;
      card(s, 7.35, y, 5.38, 0.66, 'pb' + i, i === 2 ? CARD2 : CARD, i === 2 ? SA : LINE);
      T(s, [{ text: `${i + 1}  ${p[0]}`, options: { fontSize: 16, bold: true, color: 'FFFFFF' } }, { text: '   ' + p[1], options: { fontSize: 13, color: SOFT } }],
        { x: 7.6, y, w: 5.0, h: 0.66, valign: 'middle', objectName: 'pt' + i });
      if (i < 2) arrow(s, 10.04, y + 0.66, 10.04, y + 0.82, 'pa' + i);
    });
    T(s, 'We don’t build a new weather-sensor network.\nWe turn an existing telecom network into an additional sensing layer.', { x: M, y: 4.7, w: CW, h: 1.0, fontFace: 'Cambria', fontSize: 23, bold: true, color: 'FFFFFF', objectName: 'core' });
    card(s, M, 5.95, CW, 0.66, 'cautionCard');
    s.addImage({ data: I.info, x: M + 0.22, y: 6.1, w: 0.36, h: 0.36, objectName: 'cautionIcon' });
    T(s, 'We use microwave links, not fibre, as the sensing layer. How many usable links Jio has is what our pilot measures first.', { x: M + 0.75, y: 5.95, w: 11.2, h: 0.66, fontSize: 15, color: SOFT, valign: 'middle', objectName: 'caution' });
    foot(s, 'Established method: Messer, Zinevich & Alpert, Science (2006), doi:10.1126/science.1120034 · Overeem, Leijnse & Uijlenhoet, PNAS (2013), doi:10.1073/pnas.1217961110');
    s.addNotes('[0:18–0:33] The insight: rain weakens the microwave links between telecom sites, and how much it weakens tells you how hard it’s raining. That’s established science. We don’t build a new sensor network; we turn an existing one into an extra sensing layer.');
  }

  // ================= 3 · PROOF AND LIMIT =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The proof', 'The sensing works. It isn’t insurance-grade yet');
    card(s, M, 2.12, CW, 0.42, 'banner', AMBERBG, SA, 0.75);
    T(s, 'PUBLIC RESEARCH DATASET  ·  GERMANY  ·  11-DAY TEST  ·  NOT JIO NETWORK DATA', { x: M, y: 2.12, w: CW, h: 0.42, fontSize: 12, bold: true, color: SA, charSpacing: 2, align: 'center', valign: 'middle', objectName: 'bannerT' });
    const tw = (CW - 3 * 0.25) / 4;
    const tiles = [['500', 'real commercial microwave links'], ['0.95', 'network-wide match with radar, on unseen days'], ['0.88', 'typical single link on its own']];
    tiles.forEach((t, i) => {
      const x = M + i * (tw + 0.25);
      card(s, x, 2.75, tw, 1.5, 'tile' + i);
      T(s, [{ text: t[0], options: { fontFace: 'Cambria', fontSize: 36, bold: true, color: 'FFFFFF', breakLine: true } }, { text: t[1], options: { fontSize: 13, color: SOFT } }],
        { x: x + 0.25, y: 2.85, w: tw - 0.45, h: 1.3, objectName: 'tileT' + i });
    });
    const x4 = M + 3 * (tw + 0.25);
    card(s, x4, 2.75, tw, 1.5, 'tile3', '2A1622', RED, 1);
    T(s, [{ text: '68%', options: { fontFace: 'Cambria', fontSize: 36, bold: true, color: 'FFFFFF', breakLine: true } }, { text: 'of radar trigger events caught', options: { fontSize: 13, color: INK, breakLine: true } },
          { text: '18% of our triggers not confirmed by radar', options: { fontSize: 11.5, color: 'FF9A9C' } }],
      { x: x4 + 0.25, y: 2.85, w: tw - 0.45, h: 1.35, objectName: 'tileT3' });
    s.addChart(pres.charts.LINE, [
      { name: 'Weather radar', labels: D.net.labels.map((l, i) => (i % 24 === 12 ? l : '')), values: D.net.r },
      { name: 'Rain from the 500 links', labels: D.net.labels.map((l, i) => (i % 24 === 12 ? l : '')), values: D.net.c },
    ], {
      x: M - 0.15, y: 4.4, w: CW + 0.2, h: 1.9, objectName: 'chart', chartColors: [ORANGE, BLUE], lineSize: 2, lineDataSymbol: 'none',
      showLegend: true, legendPos: 'r', legendColor: 'D7DDEA', legendFontSize: 12, legendFontFace: '+mn-lt',
      catAxisLabelColor: MUTE, valAxisLabelColor: MUTE, catAxisLabelFontSize: 11, valAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
      catAxisLabelFrequency: 1, catAxisLineShow: false, valAxisLineShow: false, valGridLine: { color: '2A3357', size: 0.5 }, catGridLine: { style: 'none' },
      showValAxisTitle: true, valAxisTitle: 'mm/h', valAxisTitleColor: MUTE, valAxisTitleFontSize: 11, valAxisTitleFontFace: '+mn-lt',
    });
    takeaway(s, 'Links detect rain well, but links alone aren’t reliable enough for automatic payouts.');
    foot(s, 'Tuned once (×1.17) on 10–12 May 2018, scored on 13–20 May. Trigger events: 10 mm or more in 3 hours per ~4 km square. Reference: German Weather Service radar.');
    s.addNotes('[0:33–0:53] We tested on 500 real links from a public German dataset, not Jio’s network. Network-wide we matched radar at 0.95, a single link at 0.88. But links alone caught 68% of radar’s trigger events: promising for operational intelligence, not enough to pay claims. So intelligence comes first.');
  }

  // ================= 4 · ENGINE =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The solution', 'From network signals to weather intelligence');
    const cw = (CW - 4 * 0.3) / 5;
    const C = [
      ['Sense', [I.tower], 'Jio microwave links', ['Signal loss along every link, minute by minute']],
      ['Validate', [I.dish, I.gauge, I.sat], 'Radar · gauges · satellite', ['IMD and city data calibrate and fill gaps']],
      ['Engine', [I.chip], 'JioMausam', ['Fuses all sources, weighing each by measured accuracy']],
      ['Output', [I.grid], 'Weather view', ['1 km weather grid', 'Rain intensity', 'Confidence score', 'Trigger detection']],
      ['Action', [I.bolt], 'Where it’s used', ['Business decisions', 'Insurance triggers', 'Enterprise APIs']],
    ];
    C.forEach((c, i) => {
      const x = M + i * (cw + 0.3), hi = i === 2;
      card(s, x, 2.3, cw, 2.8, 'col' + i, hi ? CARD2 : CARD, hi ? SA : LINE, hi ? 1.25 : 0.75);
      c[1].forEach((img, k) => s.addImage({ data: img, x: x + 0.22 + k * 0.5, y: 2.5, w: 0.4, h: 0.4, objectName: `colI${i}_${k}` }));
      const body = c[3].length > 1 ? c[3].map((t, k) => ({ text: t, options: { fontSize: 13, color: SOFT, bullet: true, breakLine: k < c[3].length - 1 } })) : [{ text: c[3][0], options: { fontSize: 13, color: SOFT } }];
      T(s, [caps(c[0]), { text: c[2], options: { fontSize: 16, bold: true, color: 'FFFFFF', breakLine: true } }, ...body],
        { x: x + 0.22, y: 3.05, w: cw - 0.4, h: 1.95, paraSpaceAfter: 4, objectName: 'colT' + i });
      if (i < 4) arrow(s, x + cw, 3.7, x + cw + 0.3, 3.7, 'colA' + i);
    });
    T(s, 'No single sensor decides. JioMausam combines sources into one confidence-weighted view.', { x: M, y: 5.4, w: CW, h: 0.5, fontFace: 'Cambria', fontSize: 18, bold: true, color: 'FFFFFF', objectName: 'core' });
    T(s, 'Where Jio’s links are sparse, the same engine runs on radar, gauges and satellite, cheapest sources first.', { x: M, y: 6.0, w: CW, h: 0.4, fontSize: 15, color: SOFT, objectName: 'sparse' });
    s.addNotes('[0:53–1:08] So JioMausam never relies on one sensor. Jio’s links are the dense layer; IMD radar, rain gauges and satellite validate them. The engine produces a one-kilometre grid with a confidence score, and feeds business decisions, insurance triggers and enterprise APIs.');
  }

  // ================= 5 · DECISIONS (CORE BUSINESS) =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'First business: weather intelligence', 'First product: better decisions, not insurance');
    card(s, M, 2.25, 5.9, 2.1, 'before');
    T(s, [caps('Before', MUTE), { text: '“Heavy rain in Mumbai.” The business reacts broadly:', options: { fontFace: 'Cambria', fontSize: 16, italic: true, color: 'FFFFFF' } }],
      { x: M + 0.3, y: 2.38, w: 5.4, h: 0.75, objectName: 'beforeH' });
    T(s, [{ text: 'Incentives paid in dry zones', options: { bullet: true, breakLine: true } }, { text: 'Riders sent into affected zones', options: { bullet: true } }],
      { x: M + 0.3, y: 3.25, w: 2.75, h: 1.0, fontSize: 13.5, color: INK, paraSpaceAfter: 5, objectName: 'beforeL' });
    T(s, [{ text: 'Late deliveries', options: { bullet: true, breakLine: true } }, { text: 'Poor capacity planning', options: { bullet: true } }],
      { x: M + 3.1, y: 3.25, w: 2.6, h: 1.0, fontSize: 13.5, color: INK, paraSpaceAfter: 5, objectName: 'beforeR' });
    card(s, 6.83, 2.25, 5.9, 2.1, 'after', CARD2, SA, 1.25);
    T(s, 'WITH JIOMAUSAM', { x: 7.13, y: 2.38, w: 5.4, h: 0.3, fontSize: 10.5, bold: true, color: SA, charSpacing: 2, objectName: 'afterK' });
    const Z = [['Zone A · heavy', '1C5CAB', 'FFFFFF'], ['Zone B · moderate', '3E7FD6', 'FFFFFF'], ['Zone C · clear', '232D4E', SOFT]];
    Z.forEach((z, i) => {
      const x = 7.13 + i * 1.82;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.78, w: 1.72, h: 0.48, rectRadius: 0.1, fill: { color: z[1] }, line: { color: z[1], width: 0 }, objectName: 'zone' + i });
      T(s, z[0], { x, y: 2.78, w: 1.72, h: 0.48, fontSize: 12.5, bold: true, color: z[2], align: 'center', valign: 'middle', objectName: 'zoneT' + i });
    });
    T(s, 'The business acts precisely: the right zone, the right time, the right action.', { x: 7.13, y: 3.45, w: 5.4, h: 0.8, fontFace: 'Cambria', fontSize: 16, italic: true, color: 'FFFFFF', objectName: 'afterT' });
    const AP = [[I.bike, 'Delivery', ['Incentives only in affected zones', 'Dispatch away from severe zones', 'Weather-linked pricing, where applicable', 'Pause alerts in dangerous zones']],
                [I.truck, 'Logistics', ['Route decisions', 'Delivery-time (ETA) adjustments', 'Capacity planning']],
                [I.city, 'Cities', ['Localised rainfall alerts', 'Flood response where it’s needed']]];
    const aw = (CW - 2 * 0.25) / 3;
    AP.forEach((a, i) => {
      const x = M + i * (aw + 0.25);
      card(s, x, 4.6, aw, 1.62, 'app' + i);
      s.addImage({ data: a[0], x: x + 0.22, y: 4.74, w: 0.34, h: 0.34, objectName: 'appI' + i });
      T(s, a[1], { x: x + 0.68, y: 4.72, w: aw - 0.9, h: 0.38, fontFace: 'Cambria', fontSize: 16, bold: true, color: 'FFFFFF', objectName: 'appH' + i });
      T(s, a[2].map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < a[2].length - 1 } })), { x: x + 0.22, y: 5.15, w: aw - 0.4, h: 1.02, fontSize: 12.5, color: SOFT, paraSpaceAfter: 1, objectName: 'appT' + i });
    });
    takeaway(s, 'JioMausam sells actionable weather intelligence, not just a weather map.', 6.42);
    s.addNotes('[1:08–1:30] Our first product is better decisions. Today a business hears “heavy rain in Mumbai” and reacts broadly: incentives in dry zones, riders sent into flooded ones, late deliveries. With JioMausam it knows Zone A is heavy, B moderate, C clear, and acts precisely: dispatch, incentives, weather-linked pricing, pause alerts. Logistics and cities use the same signal.');
  }

  // ================= 6 · KAVACH =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Second business: Mausam Kavach', 'The same intelligence can protect the worker');
    const fw = (CW - 3 * 0.4) / 4;
    const F = [[I.rainInk, 'Qualifying weather event', 'in the worker’s zone'], [I.chipInk, 'JioMausam verifies the trigger', 'confidence-checked against radar and gauges'],
               [I.shield, 'A licensed insurer pays', 'it carries the risk, not Jio'], [I.bank, 'Fixed benefit, e.g. ₹300', 'to the eligible worker’s bank or UPI']];
    F.forEach((f, i) => {
      const x = M + i * (fw + 0.4), hi = i === 3;
      card(s, x, 2.3, fw, 1.75, 'fl' + i, hi ? AMBERBG : CARD, hi ? SA : LINE, hi ? 1.25 : 0.75);
      s.addImage({ data: f[0], x: x + 0.25, y: 2.5, w: 0.42, h: 0.42, objectName: 'flI' + i });
      T(s, [{ text: f[1], options: { fontSize: 16, bold: true, color: hi ? SA : 'FFFFFF', breakLine: true } }, { text: f[2], options: { fontSize: 12.5, color: SOFT } }],
        { x: x + 0.25, y: 3.02, w: fw - 0.45, h: 0.98, objectName: 'flT' + i });
      if (i < 3) arrow(s, x + fw, 3.17, x + fw + 0.4, 3.17, 'flA' + i);
    });
    const cmp = [['Traditional insurance', 'Loss  →  claim  →  assessment  →  payout', CARD, LINE, SOFT], ['Mausam Kavach', 'Weather trigger  →  predefined benefit, target within 6 hours', CARD2, SA, 'FFFFFF']];
    cmp.forEach((c, i) => {
      const y = 4.3 + i * 0.75;
      card(s, M, y, CW, 0.62, 'cmp' + i, c[2], c[3], i ? 1.25 : 0.75);
      T(s, [{ text: c[0], options: { fontFace: 'Cambria', fontSize: 16, bold: true, color: i ? SA : MUTE } }], { x: M + 0.3, y, w: 3.0, h: 0.62, valign: 'middle', objectName: 'cmpH' + i });
      T(s, c[1], { x: M + 3.35, y, w: 8.5, h: 0.62, fontSize: 15, color: c[4], valign: 'middle', objectName: 'cmpT' + i });
    });
    T(s, [{ text: 'Eligible worker = active in the affected zone when the qualifying event began.', options: { breakLine: true } },
          { text: '₹300 and the trigger threshold are prototype assumptions; final parameters are actuarially calibrated in the pilot.' }],
      { x: M, y: 5.85, w: CW, h: 0.55, fontSize: 12.5, color: MUTE, objectName: 'note' });
    takeaway(s, 'The worker doesn’t prove the loss. The weather event triggers the benefit.', 6.48);
    s.addNotes('[1:30–1:48] The same intelligence can protect workers. When a qualifying event hits a zone, JioMausam verifies it and a licensed insurer pays a fixed benefit, say 300 rupees, to workers active there when it began. No claim, no proof of loss, once accuracy reaches 80%.');
  }

  // ================= 7 · INDIA LAYER =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The India layer', 'Different cities, different risks, different prices');
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
      T(s, [{ text: c[1], options: { fontSize: 15, bold: true, color: 'FFFFFF', breakLine: true } }, { text: c[2], options: { fontSize: 12.5, color: SOFT } }],
        { x: 9.38, y: y + 0.13, w: 2.3, h: 0.72, objectName: 'cityT' + i });
      T(s, c[3], { x: 11.6, y: y, w: 1.0, h: 0.95, fontFace: 'Cambria', fontSize: 15, bold: true, color: SA, align: 'right', valign: 'middle', objectName: 'cityP' + i });
    });
    T(s, 'Rain: Jio’s own sensing. Heat: IMD stations and satellite, through the same engine.', { x: 8.6, y: 5.55, w: 4.13, h: 0.6, fontSize: 12.5, color: SOFT, objectName: 'heatNote' });
    takeaway(s, 'One flat price can’t fit India’s different weather risks.', 6.4);
    foot(s, 'IMD station data 2000–2024 · ₹300 payout · 5-day annual cap · illustrative 60% loss ratio · final pricing subject to actuarial validation.');
    s.addNotes('[1:48–2:08] IMD data shows risk differs by city. Kavach Basic covers rare extremes: about 45 rupees a month in Mumbai, 52 in Nagpur, 29 in Ahmedabad. Kavach Plus, platform-sponsored, covers Mumbai’s twelve heavy-rain days at about 208. Rain first; heat follows, from IMD data.');
  }

  // ================= 8 · WHO PAYS + MONEY =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Who pays, and how Jio earns', 'Monetise the intelligence. Carry no insurance risk');
    const hdr = (t) => ({ text: t, options: { bold: true, color: SA, fontSize: 11, fill: { color: CARD2 } } });
    const r = (a, f) => a.map((t, k) => ({ text: t, options: { fill: { color: f }, color: k === 0 ? 'FFFFFF' : INK, bold: k === 0, fontSize: 12.5 } }));
    s.addTable([
      [hdr('Model'), hdr('Who pays'), hdr('Why')],
      r(['Enterprise intelligence', 'Business', 'Better weather-sensitive decisions'], '1E2547'),
      r(['Platform-sponsored Kavach', 'Delivery or logistics platform', 'Partner protection and resilience'], CARD),
      r(['Co-funded Kavach', 'Platform + worker', 'Shared protection cost'], '111830'),
      r(['Individual Kavach', 'Worker', 'Optional protection'], CARD),
    ], { x: M, y: 2.25, w: 6.4, colW: [2.1, 2.0, 2.3], rowH: 0.56, fontFace: 'Calibri', valign: 'middle', margin: [0.04, 0.1, 0.04, 0.1], border: { type: 'solid', color: LINE, pt: 0.75 }, objectName: 'payTable' });
    T(s, [{ text: 'The pilot identifies the commercially viable payer model.', options: { bold: true, color: 'FFFFFF', breakLine: true } }, { text: 'Jio’s core revenue doesn’t depend on insurance adoption.', options: { color: SA } }],
      { x: M, y: 5.2, w: 6.4, h: 0.75, fontSize: 14.5, objectName: 'payNote' });
    const S = [['01', 'Decision and data fees', 'Weather API, alerts and operational intelligence: recurring B2B revenue', 0.98],
               ['02', 'Kavach distribution', 'The insurer carries the risk; Jio earns data, technology and distribution fees. Example: 50,000 riders × ₹208 × 12 = ₹12.5 Cr premium pool (illustrative, not Jio revenue)', 1.38],
               ['03', 'Reliance and enterprise applications', 'Reliance operations first, then enterprises, cities and insurers', 0.98]];
    let y = 2.25;
    S.forEach((st, i) => {
      card(s, 7.3, y, 5.43, st[3], 'rev' + i, i === 0 ? CARD2 : CARD, i === 0 ? SA : LINE, i === 0 ? 1.25 : 0.75);
      T(s, st[0], { x: 7.5, y: y + 0.12, w: 0.6, h: 0.5, fontFace: 'Cambria', fontSize: 22, bold: true, color: SA, objectName: 'revN' + i });
      T(s, [{ text: st[1], options: { fontSize: 15.5, bold: true, color: 'FFFFFF', breakLine: true } }, { text: st[2], options: { fontSize: 12.5, color: SOFT } }],
        { x: 8.15, y: y + 0.12, w: 4.4, h: st[3] - 0.2, objectName: 'revT' + i });
      y += st[3] + 0.15;
    });
    takeaway(s, 'The weather-intelligence business stands even if insurance isn’t adopted.', 6.4);
    s.addNotes('[2:08–2:28] Who pays? We don’t assume. Businesses pay for intelligence first; for Kavach, the pilot tests platform, co-funded and individual models. Jio earns decision and data fees, plus distribution fees on Kavach, while the insurer carries the risk. Fifty thousand riders is a 12.5 crore premium pool, not Jio revenue.');
  }

  // ================= 9 · WHY JIO =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Why Jio', 'The moat isn’t the sensor. It’s the ecosystem');
    const L = [['Sense', I.tower, 'Jio network', 'existing telecom infrastructure'], ['Understand', I.chipInk, 'JioMausam', 'the weather-intelligence engine'],
               ['Reach', I.people, 'Reliance ecosystem', 'consumer and enterprise distribution'], ['Protect', I.shield, 'JFS + licensed insurers', 'the financial and insurance layer']];
    L.forEach((l, i) => {
      const y = 2.25 + i * 0.95;
      card(s, M, y, 7.7, 0.8, 'lay' + i, i === 1 ? CARD2 : CARD, i === 1 ? SA : LINE, i === 1 ? 1.25 : 0.75);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 0.15, y: y + 0.15, w: 1.7, h: 0.5, rectRadius: 0.1, fill: { color: SA }, line: { color: SA, width: 0 }, objectName: 'layK' + i });
      T(s, l[0].toUpperCase(), { x: M + 0.15, y: y + 0.15, w: 1.7, h: 0.5, fontFace: 'Cambria', fontSize: 14, bold: true, color: DARK, align: 'center', valign: 'middle', charSpacing: 2, objectName: 'layKT' + i });
      s.addImage({ data: l[1], x: M + 2.1, y: y + 0.2, w: 0.4, h: 0.4, objectName: 'layI' + i });
      T(s, [{ text: l[2], options: { fontSize: 17, bold: true, color: 'FFFFFF' } }, { text: '   ' + l[3], options: { fontSize: 14, color: SOFT } }],
        { x: M + 2.7, y, w: 4.9, h: 0.8, valign: 'middle', objectName: 'layT' + i });
    });
    card(s, 8.65, 2.25, 4.08, 3.65, 'claim', CARD2, SA, 1.25);
    s.addImage({ data: I.layers, x: 8.95, y: 2.5, w: 0.45, h: 0.45, objectName: 'claimI' });
    T(s, [{ text: 'Reliance can connect every layer.', options: { fontFace: 'Cambria', fontSize: 22, bold: true, color: 'FFFFFF', breakLine: true } },
          { text: 'A startup can sense but can’t reach. An insurer can pay but can’t sense. A network alone can’t insure.', options: { fontSize: 14, color: SOFT, breakLine: true } },
          { text: 'First users: Jio network operations, JioMart, MyJio.', options: { fontSize: 14, color: SA } }],
      { x: 8.95, y: 3.1, w: 3.55, h: 2.7, paraSpaceAfter: 8, objectName: 'claimT' });
    T(s, 'Jio doesn’t need to build a new weather network. It can connect sensing, intelligence, distribution and financial services.', { x: M, y: 6.15, w: CW, h: 0.75, fontFace: 'Cambria', fontSize: 18, italic: true, bold: true, color: SA, objectName: 'takeaway' });
    s.addNotes('[2:28–2:40] Why Jio? The moat isn’t the sensor; it’s the ecosystem. Jio senses, JioMausam understands, Reliance reaches customers and businesses, and JFS with licensed insurers protects. Reliance can connect every layer.');
  }

  // ================= 10 · 90-DAY PILOT, ROADMAP, CLOSE =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'The ask', 'Don’t believe us. Test it in 90 days');
    const R = [['Days 1–30', 'Coverage', 'Audit Jio’s Mumbai microwave links: frequency, path geometry, telemetry availability.', 'Gate 1 · enough usable links?'],
               ['Days 31–60', 'Accuracy', 'Back-test archived Mumbai monsoon data against IMD radar and gauges.', 'Gate 2 · ≥80% of events, ±10% totals'],
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
      [h2(''), h2('Intelligence (core)'), h2('Kavach (application)')],
      rr(['0–3 m', 'Coverage + back-test (Mumbai)', 'Shadow payouts'], '1E2547'),
      rr(['4–12 m', 'External pilot customers', 'Sandbox + heat'], CARD),
      rr(['Year 2', 'Cities + enterprises', 'Basic at recharge'], '111830'),
      rr(['Year 3', 'National API', 'National scale'], CARD),
    ], { x: 8.05, y: 2.55, w: 4.68, colW: [0.8, 2.05, 1.83], rowH: 0.56, fontFace: 'Calibri', valign: 'middle', margin: [0.03, 0.08, 0.03, 0.08], border: { type: 'solid', color: LINE, pt: 0.75 }, objectName: 'rmTable' });
    T(s, [{ text: 'We aren’t asking Jio to build another weather network. ', options: { color: 'FFFFFF' } }, { text: 'We’re asking it to discover what its existing network can already tell us.', options: { color: SA } }],
      { x: M, y: 5.9, w: CW, h: 0.8, fontFace: 'Cambria', fontSize: 19, italic: true, bold: true, align: 'center', valign: 'middle', objectName: 'close' });
    foot(s, 'Gate 2 also requires under 15% of our triggers to go unconfirmed by radar. Months 4–12 include Mumbai’s 2027 monsoon and the April–June heat season.');
    s.addNotes('[2:40–3:00] So don’t believe us: test it. Ninety days: audit Mumbai’s links, back-test archived monsoon data, then a shadow-mode pilot with one Reliance operation. We aren’t asking Jio to build another weather network. We’re asking it to discover what its network can already tell us.');
  }

  await pres.writeFile({ fileName: __dirname + '/JioMausam_Elimination_Draft3_raw.pptx' });
  await applyTheme(__dirname + '/JioMausam_Elimination_Draft3_raw.pptx', THEME);
  console.log('written');
})().catch(e => { console.error(e); process.exit(1); });
