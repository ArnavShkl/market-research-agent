// JioMausam · 4-slide condensed version of the final elimination deck (white background, dense).
// Slides: 1 problem + insight · 2 proof + accuracy · 3 business model · 4 Kavach, pricing and the 90-day ask.
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const Fa = require('react-icons/fa6');
const { applyTheme } = require('/root/.claude/skills/synced/3d7cc9ae-5f86-4c3a-8704-db46492bec5e_cb55a847-437e-4193-a077-dac30ae7157e/pptx/scripts/apply_theme.js');

const THEME = {
  name: 'JioMausam Daylight', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: { dk1: '0B1530', lt1: 'FFFFFF', dk2: '4A5578', lt2: 'F2F4F8', accent1: 'C77700', accent2: '2A78D6', accent3: '14915F',
            accent4: 'C8463D', accent5: 'F5A623', accent6: '8A94B0', hlink: '2A78D6', folHlink: '6B4FBB' },
};
const HEX = { navy: '0B1530', mute: '4A5578', amber: 'C77700', blue: '2A78D6', green: '14915F', red: 'C8463D', grid: 'E3E6EE', orange: 'D95926' };
const SCRIPT = JSON.parse(fs.readFileSync(__dirname + '/script4.json', 'utf8'));
const NET = JSON.parse(fs.readFileSync(__dirname + '/../deck2/assets/deck_data.json', 'utf8')).net;
const W = 13.333, H = 7.5, M = 0.5, CW = W - 2 * M;

async function icon(name, color, size = 256) {
  const C = Fa[name]; if (!C) throw new Error('no icon ' + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(C, { color: '#' + color, size }));
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()).toString('base64');
}

(async () => {
  const I = {};
  const need = {
    tower: ['FaTowerBroadcast', HEX.amber], towerN: ['FaTowerBroadcast', HEX.navy], drop: ['FaDroplet', HEX.blue], ok: ['FaCircleCheck', HEX.green], no: ['FaCircleXmark', HEX.red],
    flask: ['FaFlask', HEX.amber], hour: ['FaHourglassHalf', HEX.red], bike: ['FaMotorcycle', HEX.navy], wallet: ['FaWallet', HEX.navy],
    wrench: ['FaScrewdriverWrench', HEX.navy], dish: ['FaSatelliteDish', HEX.navy], gauge: ['FaGaugeHigh', HEX.navy], sat: ['FaSatellite', HEX.navy],
    map: ['FaMapLocationDot', HEX.navy], scale: ['FaScaleBalanced', HEX.navy], store: ['FaStore', HEX.navy], mobile: ['FaMobileScreen', HEX.navy],
    rain: ['FaCloudShowersHeavy', HEX.blue], shield: ['FaShieldHalved', HEX.navy], bank: ['FaBuildingColumns', HEX.amber], chip: ['FaMicrochip', HEX.navy],
  };
  for (const [k, [n, c]] of Object.entries(need)) I[k] = await icon(n, c);

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'JioMausam · 4-slide pitch';
  pres.author = 'JioMausam team';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  pres.defineSlideMaster({
    title: 'CONTENT', background: { color: 'FFFFFF' },
    objects: [
      { image: { data: I.tower, x: W - M - 0.3, y: 0.3, w: 0.3, h: 0.3 } },
      { text: { text: 'JioMausam', options: { x: W - M - 2.45, y: 0.3, w: 2.05, h: 0.3, fontSize: 13, bold: true, color: C.text1, align: 'right', valign: 'middle', margin: 0 } } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.62, w: CW, h: 0.58, fontSize: 24, bold: true, color: C.text1, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: W - M - 0.6, y: H - 0.42, w: 0.6, h: 0.25, fontSize: 9.5, color: C.text2, align: 'right' },
  });
  pres.addSection({ title: 'Pitch' });
  const sec = { masterName: 'CONTENT', sectionTitle: 'Pitch' };

  const T = (s, text, o) => s.addText(text, Object.assign({ margin: 0, isTextBox: true, color: C.text1, valign: 'top', fontSize: 11.5 }, o));
  const kicker = (s, t) => T(s, t.toUpperCase(), { x: M, y: 0.32, w: 9, h: 0.26, fontSize: 11, bold: true, color: C.accent1, charSpacing: 2, objectName: 'kicker' });
  const foot = (s, t) => T(s, t, { x: M, y: H - 0.42, w: CW - 0.8, h: 0.26, fontSize: 9.5, color: C.text2, objectName: 'source' });
  const card = (s, x, y, w, h, name, color = C.background2, tr = 0) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color, transparency: tr }, line: { type: 'none' }, objectName: name });
  const lab = (t, color = C.accent1) => ({ text: t.toUpperCase(), options: { fontSize: 9.5, bold: true, color, charSpacing: 1.5, breakLine: true } });
  const arrowR = (s, x, y, w, name, color = HEX.mute) => s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 1.25, endArrowType: 'triangle' }, objectName: name });
  const arrowD = (s, x, y, h, name, color = HEX.mute) => s.addShape(pres.shapes.LINE, { x, y, w: 0, h, line: { color, width: 1.25, endArrowType: 'triangle' }, objectName: name });
  const pill = (s, x, y, w, h, text, name, color = C.accent1, size = 9.5) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color, transparency: 86 }, line: { type: 'none' }, objectName: name });
    T(s, text, { x, y, w, h, fontSize: size, bold: true, color, align: 'center', valign: 'middle', objectName: name + 'T' });
  };
  const callout = (s, x, y, w, h, runs, name) => { card(s, x, y, w, h, name, C.text1); T(s, runs, { x: x + 0.2, y, w: w - 0.4, h, valign: 'middle', color: C.background1, objectName: name + 'T' }); };
  const notes = (s, i) => s.addNotes(`[${SCRIPT[i].start}–${SCRIPT[i].end}] ${SCRIPT[i].text}`);

  // ============ 1 · PROBLEM + INSIGHT ============
  {
    const s = pres.addSlide(sec); kicker(s, '1 · The problem and the insight');
    s.addText('A weather-decision problem, and a signal Jio may already carry', { placeholder: 'title' });
    const LX = M, LW = 5.95, RX = M + LW + 0.3, RW = CW - LW - 0.3;
    // left: Mumbai example
    card(s, LX, 1.4, LW, 2.85, 'mumCard');
    T(s, [lab('Same city, different weather'), { text: 'Rainfall (mm) · 26 July 2005 · IMD', options: { fontSize: 10, color: C.text2 } }], { x: LX + 0.2, y: 1.52, w: 3.0, h: 0.5, objectName: 'mumH' });
    s.addChart(pres.charts.BAR, [{ name: 'Rainfall (mm)', labels: ['Santacruz', 'Colaba'], values: [944, 73] }], {
      x: LX + 0.05, y: 2.0, w: 2.9, h: 2.2, objectName: 'mumChart', barDir: 'col', barGapWidthPct: 60, chartColors: [HEX.blue],
      showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: HEX.navy, dataLabelFontSize: 14, dataLabelFontBold: true, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0',
      catAxisLabelColor: HEX.mute, catAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      catAxisLineShow: false, showLegend: false, valAxisMaxVal: 1150, valAxisMinVal: 0,
    });
    const AX = LX + 3.1, AW = LW - 3.3;
    card(s, AX, 1.55, AW, 0.95, 'alert', C.background1);
    T(s, [lab('What a city-level alert says', C.text2), { text: '“Heavy rain in Mumbai.”', options: { fontFace: '+mj-lt', fontSize: 13, italic: true, bold: true } }], { x: AX + 0.15, y: 1.63, w: AW - 0.3, h: 0.8, objectName: 'alertT' });
    arrowD(s, AX + AW / 2, 2.52, 0.16, 'alertA');
    card(s, AX, 2.7, AW, 0.95, 'need', C.accent1, 86);
    T(s, [lab('What it needs to decide'), { text: '“Which zones do I act on, right now?”', options: { fontFace: '+mj-lt', fontSize: 13, italic: true, bold: true } }], { x: AX + 0.15, y: 2.77, w: AW - 0.3, h: 0.85, objectName: 'needT' });
    T(s, 'Stations ~20 km apart. In 2020–24, on 5 of 15 heavy-rain days the other station got less than half.', { x: AX, y: 3.72, w: AW, h: 0.48, fontSize: 9.5, color: C.text2, objectName: 'mumNote' });
    // left: impact
    card(s, LX, 4.4, LW, 1.05, 'imp');
    [[I.bike, 'Businesses decide blind', 'dispatch, incentives, delivery promises'], [I.wallet, 'Workers carry the loss', 'income and safety, street by street']].forEach((m, i) => {
      const x = LX + 0.2 + i * 2.95;
      s.addImage({ data: m[0], x, y: 4.74, w: 0.36, h: 0.36, objectName: 'impI' + i });
      T(s, [{ text: m[1], options: { bold: true, fontSize: 12, breakLine: true } }, { text: m[2], options: { fontSize: 10.5, color: C.text2 } }], { x: x + 0.5, y: 4.6, w: 2.3, h: 0.65, valign: 'middle', objectName: 'impT' + i });
    });
    callout(s, LX, 5.6, LW, 1.3, [{ text: 'India doesn’t have a weather-data problem.', options: { fontSize: 13, color: C.background1, breakLine: true } },
      { text: 'It has a weather-decision problem.', options: { fontFace: '+mj-lt', fontSize: 17, bold: true, color: C.accent5 } }], 'take1');
    // right: the signal
    card(s, RX, 1.4, RW, 2.2, 'sigCard');
    T(s, [lab('The insight: Jio’s microwave links may carry a weather signal')], { x: RX + 0.2, y: 1.52, w: RW - 0.4, h: 0.3, objectName: 'sigH' });
    s.addImage({ data: I.towerN, x: RX + 0.3, y: 1.95, w: 0.55, h: 0.55, objectName: 'twA' });
    s.addImage({ data: I.towerN, x: RX + 2.75, y: 1.95, w: 0.55, h: 0.55, objectName: 'twB' });
    s.addShape(pres.shapes.LINE, { x: RX + 0.85, y: 2.05, w: 1.9, h: 0, line: { color: HEX.amber, width: 2, dashType: 'dash' }, objectName: 'beam' });
    [[1.15, 2.2], [1.55, 2.38], [1.95, 2.18], [2.35, 2.36]].forEach(([x, y], i) => s.addImage({ data: I.drop, x: RX + x, y, w: 0.17, h: 0.17, objectName: 'drop' + i }));
    T(s, 'microwave link between two sites', { x: RX + 0.3, y: 2.6, w: 3.0, h: 0.25, fontSize: 9.5, color: C.text2, align: 'center', objectName: 'beamL' });
    T(s, [{ text: 'Rain weakens the signal. ', options: { bold: true } }, { text: 'Measure the excess loss and estimate path-averaged rainfall along each link, in near-real-time.', options: { color: C.text2 } }],
      { x: RX + 3.55, y: 1.92, w: RW - 3.75, h: 1.0, fontSize: 11.5, objectName: 'sigT' });
    s.addImage({ data: I.ok, x: RX + 0.3, y: 3.08, w: 0.24, h: 0.24, objectName: 'okI' });
    T(s, 'Microwave links: usable', { x: RX + 0.6, y: 3.06, w: 2.2, h: 0.28, fontSize: 11, bold: true, valign: 'middle', objectName: 'okT' });
    s.addImage({ data: I.no, x: RX + 2.85, y: 3.08, w: 0.24, h: 0.24, objectName: 'noI' });
    T(s, 'Fibre: no rain signal', { x: RX + 3.15, y: 3.06, w: 2.4, h: 0.28, fontSize: 11, bold: true, valign: 'middle', objectName: 'noT' });
    // right: definition and flow
    card(s, RX, 3.75, RW, 1.7, 'defCard', C.accent1, 88);
    T(s, [lab('JioMausam is'), { text: 'decision infrastructure, not a weather map', options: { fontFace: '+mj-lt', fontSize: 15, bold: true } }], { x: RX + 0.2, y: 3.86, w: RW - 0.4, h: 0.6, objectName: 'defT' });
    const FL = ['Link signals + IMD radar + rain gauges', 'Spatial weather grid', 'Decision-ready alerts and triggers'];
    const fw = (RW - 0.4 - 2 * 0.35) / 3;
    FL.forEach((f, i) => {
      const x = RX + 0.2 + i * (fw + 0.35);
      card(s, x, 4.6, fw, 0.68, 'fl' + i, C.background1);
      T(s, f, { x: x + 0.08, y: 4.6, w: fw - 0.16, h: 0.68, fontSize: 10.5, bold: true, align: 'center', valign: 'middle', objectName: 'flT' + i });
      if (i < 2) arrowR(s, x + fw + 0.04, 4.94, 0.27, 'flA' + i);
    });
    // right: is / isn't
    card(s, RX, 5.6, RW, 1.3, 'isCard');
    T(s, [lab('It is', C.accent3), ...['Weather intelligence from existing infrastructure', 'Alerts and data for businesses', 'A trigger for future worker protection'].map((t, k, a) => ({ text: t, options: { bullet: true, fontSize: 10.5, breakLine: k < a.length - 1 } }))],
      { x: RX + 0.2, y: 5.7, w: RW / 2 - 0.2, h: 1.15, objectName: 'isT' });
    T(s, [lab('It isn’t', C.accent4), ...['A new sensor network', 'A consumer weather app', 'An insurer, or heat sensing from towers'].map((t, k, a) => ({ text: t, options: { bullet: true, fontSize: 10.5, breakLine: k < a.length - 1 } }))],
      { x: RX + RW / 2 + 0.1, y: 5.7, w: RW / 2 - 0.3, h: 1.15, objectName: 'isntT' });
    foot(s, 'Rainfall: India Meteorological Department records (26 July 2005); Santacruz vs Colaba daily station reports 2020–24 (NOAA GSOD archive of IMD reports).');
    notes(s, 0);
  }

  // ============ 2 · PROOF + ACCURACY ============
  {
    const s = pres.addSlide(sec); kicker(s, '2 · What we checked, and how we fix the limit');
    s.addText('Links alone fall short of our bar, so accuracy decides the mix', { placeholder: 'title' });
    const LX = M, LW = 6.0, RX = M + LW + 0.3, RW = CW - LW - 0.3;
    card(s, LX, 1.4, LW, 1.75, 'tiers');
    const TI = [[I.ok, 'Proven · published', C.accent3, 'Physics: rain weakens microwave signals. Method: Science 2006, PNAS 2013 (country-wide maps).'],
                [I.flask, 'Our check · public data', C.accent1, 'We ran the open-source method on 500 real links (Germany), radar as reference. Not Jio data.'],
                [I.hour, 'Not yet proven · the pilot', C.accent4, 'Jio’s coverage, Indian accuracy, business value, who pays, insurance-grade triggers.']];
    TI.forEach((r, i) => {
      const y = 1.52 + i * 0.53;
      s.addImage({ data: r[0], x: LX + 0.2, y: y + 0.04, w: 0.26, h: 0.26, objectName: 'tiI' + i });
      T(s, [{ text: r[1].toUpperCase() + '  ', options: { fontSize: 9.5, bold: true, color: r[2], charSpacing: 1 } }, { text: r[3], options: { fontSize: 10.5 } }], { x: LX + 0.58, y, w: LW - 0.75, h: 0.48, objectName: 'tiT' + i });
    });
    card(s, LX, 3.3, LW, 1.95, 'res', C.accent4, 90);
    T(s, '68%', { x: LX + 0.2, y: 3.4, w: 1.6, h: 0.75, fontFace: '+mj-lt', fontSize: 40, bold: true, valign: 'middle', objectName: 'resN' });
    T(s, [{ text: 'of rain events caught by links alone', options: { bold: true, fontSize: 12, breakLine: true } }, { text: '1,120 of 1,639 radar events · 8 unseen test days', options: { fontSize: 10, color: C.text2 } }], { x: LX + 1.85, y: 3.48, w: LW - 2.05, h: 0.62, objectName: 'resL' });
    const bx = LX + 0.2, bw = LW - 0.4, by = 4.42;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: by, w: bw, h: 0.3, rectRadius: 0.05, fill: { color: C.background1 }, line: { color: HEX.grid, width: 0.75 }, objectName: 'resB' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: by, w: bw * 0.68, h: 0.3, rectRadius: 0.05, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: 'resF' });
    T(s, 'links alone: 68%', { x: bx + 0.1, y: by, w: 2.5, h: 0.3, fontSize: 10, bold: true, color: C.background1, valign: 'middle', objectName: 'resFT' });
    s.addShape(pres.shapes.LINE, { x: bx + bw * 0.8, y: by - 0.12, w: 0, h: 0.54, line: { color: HEX.green, width: 1.75, dashType: 'dash' }, objectName: 'resG' });
    T(s, 'our bar: 80%', { x: bx + bw * 0.8 + 0.06, y: by + 0.02, w: 1.2, h: 0.26, fontSize: 10, bold: true, color: C.accent3, valign: 'middle', objectName: 'resGT' });
    T(s, [{ text: 'Event = 10 mm+ of rain in 3 hours in a ~4 km zone. ', options: { color: C.text2 } }, { text: 'Below our bar, so we never use links alone.', options: { bold: true, color: C.accent4 } }], { x: bx, y: 4.8, w: bw, h: 0.4, fontSize: 10.5, objectName: 'resS' });
    s.addChart(pres.charts.LINE, [
      { name: 'Radar', labels: NET.labels.map((l, i) => (i % 48 === 12 ? l : '')), values: NET.r },
      { name: 'Links (our check)', labels: NET.labels.map((l, i) => (i % 48 === 12 ? l : '')), values: NET.c },
    ], {
      x: LX - 0.05, y: 5.32, w: LW + 0.1, h: 1.62, objectName: 'chart', chartColors: [HEX.orange, HEX.blue], lineSize: 1.5, lineDataSymbol: 'none',
      showTitle: true, title: 'Network average, hourly (mm/h): links tracked radar closely', titleColor: HEX.mute, titleFontSize: 10, titleFontFace: '+mn-lt',
      showLegend: true, legendPos: 'r', legendColor: HEX.mute, legendFontSize: 9.5, legendFontFace: '+mn-lt',
      catAxisLabelColor: HEX.mute, valAxisLabelColor: HEX.mute, catAxisLabelFontSize: 9, valAxisLabelFontSize: 9, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
      catAxisLabelFrequency: 1, catAxisLineShow: false, valAxisLineShow: false, valGridLine: { color: HEX.grid, size: 0.5 }, catGridLine: { style: 'none' }, valAxisMaxVal: 2, valAxisMajorUnit: 1,
    });
    // right: sources
    card(s, RX, 1.4, RW, 2.95, 'src');
    T(s, [lab('Candidate sources and who provides them')], { x: RX + 0.2, y: 1.5, w: RW - 0.4, h: 0.28, objectName: 'srcH' });
    const SRC = [[I.towerN, 'Jio microwave links', 'Jio-owned', C.accent2], [I.wrench, 'Network health: faults, outages, maintenance', 'Jio-owned', C.accent2], [I.dish, 'Doppler radar: spatial check', 'IMD (govt)', C.accent2],
                 [I.gauge, 'Rain gauges: ground truth', 'IMD · BMC', C.accent2], [I.sat, 'Satellite: coverage fallback', 'External', C.accent2],
                 [I.map, 'New gauges on Jio sites, only where links are thin', 'New install', C.accent1], [I.scale, 'Commercial data, only if it lifts accuracy', 'Commercial', C.accent1]];
    SRC.forEach((r, i) => {
      const y = 1.85 + i * 0.35;
      s.addImage({ data: r[0], x: RX + 0.22, y: y + 0.04, w: 0.22, h: 0.22, objectName: 'srcI' + i });
      T(s, r[1], { x: RX + 0.58, y, w: RW - 2.05, h: 0.3, fontSize: 11, bold: i === 0, valign: 'middle', objectName: 'srcT' + i });
      pill(s, RX + RW - 1.42, y + 0.02, 1.22, 0.26, r[2], 'srcP' + i, r[3], 9);
    });
    // right: mix scoring
    card(s, RX, 4.5, RW, 1.6, 'mix', C.accent2, 90);
    T(s, [lab('The pilot scores every mix against held-out rain gauges', C.accent2)], { x: RX + 0.2, y: 4.6, w: RW - 0.4, h: 0.28, objectName: 'mixH' });
    const MIX = [['Links only', 0.68, 'our check: 68%'], ['Links + radar + gauges', null, 'measured in the pilot'], ['Radar + gauges, no links', null, 'shows what Jio adds']];
    const mbx = RX + 2.3, mbw = RW - 2.55;
    MIX.forEach((m, i) => {
      const y = 4.98 + i * 0.35;
      T(s, m[0], { x: RX + 0.2, y, w: 2.05, h: 0.28, fontSize: 10.5, bold: i === 2, color: i === 2 ? C.accent1 : C.text1, valign: 'middle', objectName: 'mixL' + i });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mbx, y: y + 0.02, w: mbw, h: 0.24, rectRadius: 0.05, fill: { color: C.background1 }, line: { color: HEX.grid, width: 0.75, dashType: m[1] ? 'solid' : 'dash' }, objectName: 'mixB' + i });
      if (m[1]) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mbx, y: y + 0.02, w: mbw * m[1], h: 0.24, rectRadius: 0.05, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: 'mixF' + i });
      T(s, m[2], { x: mbx + 0.1, y: y + 0.02, w: mbw - 0.2, h: 0.24, fontSize: 9.5, bold: !!m[1], color: m[1] ? C.background1 : C.text2, valign: 'middle', objectName: 'mixV' + i });
    });
    s.addShape(pres.shapes.LINE, { x: mbx + mbw * 0.8, y: 4.93, w: 0, h: 1.1, line: { color: HEX.green, width: 1.5, dashType: 'dash' }, objectName: 'mixG' });
    callout(s, RX, 6.25, RW, 0.65, [{ text: 'Rule: ', options: { bold: true, color: C.accent5, fontSize: 11.5 } },
      { text: 'the lowest-cost mix that clears every gate: ≥80% of trigger events · totals within ±10% · under 15% unconfirmed', options: { fontSize: 11, color: C.background1 } }], 'rule');
    foot(s, 'Messer et al., Science 2006 · Overeem et al., PNAS 2013 · Our check: public pycomlink dataset (KIT), 10–20 May 2018, German Weather Service radar as reference. Not Jio data.');
    notes(s, 1);
  }

  // ============ 3 · BUSINESS MODEL ============
  {
    const s = pres.addSlide(sec); kicker(s, '3 · Business model');
    s.addText('Prove it inside Reliance, then sell the same intelligence', { placeholder: 'title' });
    const cw = (CW - 2 * 0.3) / 3, X = [M, M + cw + 0.3, M + 2 * (cw + 0.3)];
    // column 1: Reliance
    T(s, [lab('1 · First proving ground: Reliance')], { x: X[0], y: 1.4, w: cw, h: 0.28, objectName: 'c1H' });
    card(s, X[0], 1.75, cw, 2.15, 'hero', C.accent1, 88);
    s.addImage({ data: I.tower, x: X[0] + 0.2, y: 1.9, w: 0.42, h: 0.42, objectName: 'heroI' });
    T(s, [{ text: 'THE HERO TEST', options: { fontSize: 9, bold: true, color: C.accent1, charSpacing: 1.5, breakLine: true } }, { text: 'Jio network operations', options: { fontFace: '+mj-lt', fontSize: 14, bold: true } }], { x: X[0] + 0.75, y: 1.88, w: cw - 0.9, h: 0.55, objectName: 'heroH' });
    T(s, ['Can we tell rain-related signal loss from equipment faults before sending a crew?', 'Potentially fewer wasted visits and earlier flood alerts', 'Jio owns the network data and controls the decision'].map((t, k, a) => ({ text: t, options: { bullet: true, breakLine: k < a.length - 1 } })),
      { x: X[0] + 0.2, y: 2.55, w: cw - 0.35, h: 1.25, fontSize: 10.5, paraSpaceAfter: 3, objectName: 'heroT' });
    pill(s, X[0] + 0.2, 3.5, 2.2, 0.26, 'Tests accuracy and savings', 'heroP', C.accent1, 9);
    [[I.store, 'JioMart and Reliance Retail', 'Rain-aware dispatch, delivery promises, zone pauses', 'Tests commercial value'], [I.mobile, 'MyJio', 'Street-level rain alerts for users', 'Tests reach at scale']].forEach((u, i) => {
      const y = 4.05 + i * 1.03;
      card(s, X[0], y, cw, 0.9, 'use' + i);
      s.addImage({ data: u[0], x: X[0] + 0.2, y: y + 0.14, w: 0.3, h: 0.3, objectName: 'useI' + i });
      T(s, [{ text: u[1], options: { bold: true, fontSize: 11.5, breakLine: true } }, { text: u[2], options: { fontSize: 10, color: C.text2, breakLine: true } }, { text: u[3], options: { fontSize: 9.5, bold: true, color: C.accent1 } }],
        { x: X[0] + 0.62, y: y + 0.08, w: cw - 0.75, h: 0.75, objectName: 'useT' + i });
    });
    T(s, 'Every internal use is a hypothesis the pilot tests.', { x: X[0], y: 6.25, w: cw, h: 0.5, fontSize: 10, italic: true, color: C.text2, objectName: 'c1N' });
    // column 2: market
    T(s, [lab('2 · Then sell the same intelligence')], { x: X[1], y: 1.4, w: cw, h: 0.28, objectName: 'c2H' });
    const DC = [[I.rain, 'Rain hits Zone A', C.accent2], [I.chip, 'JioMausam sends a zone alert + rain estimate', C.accent1], [I.bike, 'The customer decides: reroute, update ETAs, adjust incentives', C.text2], [I.ok, 'Lower disruption', C.accent3]];
    DC.forEach((d, i) => {
      const y = 1.75 + i * 0.6;
      card(s, X[1], y, cw, 0.46, 'dc' + i, d[2], 88);
      s.addImage({ data: d[0], x: X[1] + 0.15, y: y + 0.1, w: 0.26, h: 0.26, objectName: 'dcI' + i });
      T(s, d[1], { x: X[1] + 0.52, y, w: cw - 0.62, h: 0.46, fontSize: 10.5, bold: true, valign: 'middle', objectName: 'dcT' + i });
      if (i < 3) arrowD(s, X[1] + 0.28, y + 0.46, 0.14, 'dcA' + i);
    });
    card(s, X[1], 4.25, cw, 1.88, 'tiersM');
    T(s, [lab('Who buys, and what', C.text2)], { x: X[1] + 0.2, y: 4.33, w: cw - 0.4, h: 0.26, objectName: 'tmH' });
    [['1', 'Delivery and quick commerce', 'Alerts'], ['2', 'Logistics, cities, insurers', 'Alerts + data'], ['3', 'Agriculture, power, retail', 'Data + alerts']].forEach((t, i) => {
      const y = 4.65 + i * 0.47;
      s.addShape(pres.shapes.OVAL, { x: X[1] + 0.2, y: y + 0.05, w: 0.3, h: 0.3, fill: { color: i === 0 ? C.accent5 : C.accent6 }, line: { type: 'none' }, objectName: 'tmO' + i });
      T(s, t[0], { x: X[1] + 0.2, y: y + 0.05, w: 0.3, h: 0.3, fontSize: 10, bold: true, align: 'center', valign: 'middle', color: C.background1, objectName: 'tmN' + i });
      T(s, t[1], { x: X[1] + 0.6, y, w: cw - 1.95, h: 0.4, fontSize: 10.5, valign: 'middle', objectName: 'tmT' + i });
      pill(s, X[1] + cw - 1.3, y + 0.07, 1.12, 0.26, t[2], 'tmP' + i, C.accent1, 9);
    });
    T(s, [{ text: 'We sell: ', options: { bold: true } }, { text: 'zone alerts · a live rain feed (API) · auditable rain records · trigger data for insurers. Not a weather map.', options: { color: C.text2 } }],
      { x: X[1], y: 6.25, w: cw, h: 0.6, fontSize: 10.5, objectName: 'sell' });
    // column 3: moat and value
    T(s, [lab('3 · Why Jio: integration, not the sensor')], { x: X[2], y: 1.4, w: cw, h: 0.28, objectName: 'c3H' });
    const MO = [['SENSE', 'Jio network'], ['UNDERSTAND', 'JioMausam'], ['REACH', 'Reliance ecosystem'], ['PROTECT', 'JFS + licensed insurers (optional)']];
    MO.forEach((m, i) => {
      const y = 1.75 + i * 0.6;
      card(s, X[2], y, cw, 0.46, 'mo' + i, i === 1 ? C.accent1 : C.background2, i === 1 ? 86 : 0);
      pill(s, X[2] + 0.12, y + 0.09, 1.25, 0.28, m[0], 'moK' + i, C.accent1, 9);
      T(s, m[1], { x: X[2] + 1.5, y, w: cw - 1.6, h: 0.46, fontSize: 11, bold: true, valign: 'middle', objectName: 'moT' + i });
      if (i < 3) arrowD(s, X[2] + 0.74, y + 0.46, 0.14, 'moA' + i);
    });
    card(s, X[2], 4.25, cw, 1.88, 'val');
    T(s, [lab('How Jio creates value', C.text2)], { x: X[2] + 0.2, y: 4.33, w: cw - 0.4, h: 0.26, objectName: 'valH' });
    [['01', 'Intelligence fees', 'External: API, alerts and data', C.accent1], ['02', 'Savings inside Reliance', 'Internal: network ops, delivery, retail', C.accent3], ['03', 'Distribution fees', 'Optional: only if Kavach launches', C.accent6]].forEach((v, i) => {
      const y = 4.65 + i * 0.47;
      T(s, v[0], { x: X[2] + 0.2, y, w: 0.45, h: 0.4, fontFace: '+mj-lt', fontSize: 15, bold: true, color: v[3], valign: 'middle', objectName: 'valN' + i });
      T(s, [{ text: v[1] + '  ', options: { bold: true, fontSize: 11 } }, { text: v[2], options: { fontSize: 10, color: C.text2 } }], { x: X[2] + 0.7, y, w: cw - 0.85, h: 0.4, valign: 'middle', objectName: 'valT' + i });
    });
    callout(s, X[2], 6.25, cw, 0.62, [{ text: 'The business stands even if insurance never launches.', options: { fontSize: 11.5, bold: true, color: C.accent5 } }], 'take3');
    foot(s, 'Company names are examples of potential buyers, not customers we have spoken to. Jio sells intelligence; each customer owns its decisions.');
    notes(s, 2);
  }

  // ============ 4 · KAVACH, PRICING, THE ASK ============
  {
    const s = pres.addSlide(sec); kicker(s, '4 · Kavach, pricing and the ask');
    s.addText('Insurance comes last. Test the rest in 90 days', { placeholder: 'title' });
    const LX = M, LW = 6.15, RX = M + LW + 0.3, RW = CW - LW - 0.3;
    // Kavach flow
    card(s, LX, 1.4, LW, 2.4, 'kav');
    T(s, [lab('Where we started: Mausam Kavach, one application, not the anchor')], { x: LX + 0.2, y: 1.5, w: LW - 0.4, h: 0.28, objectName: 'kavH' });
    const KF = [[I.rain, 'Weather event in a zone'], [I.chip, 'JioMausam supplies trigger data'], [I.shield, 'A licensed insurer would underwrite and pay'], [I.bank, 'Fixed benefit, e.g. ₹300 (prototype)']];
    const kw = (LW - 0.4 - 3 * 0.22) / 4;
    KF.forEach((k, i) => {
      const x = LX + 0.2 + i * (kw + 0.22);
      card(s, x, 1.88, kw, 0.95, 'kf' + i, i === 3 ? C.accent1 : C.background1, i === 3 ? 86 : 0);
      s.addImage({ data: k[0], x: x + kw / 2 - 0.13, y: 1.96, w: 0.26, h: 0.26, objectName: 'kfI' + i });
      T(s, k[1], { x: x + 0.06, y: 2.25, w: kw - 0.12, h: 0.55, fontSize: 9.5, bold: true, align: 'center', valign: 'middle', objectName: 'kfT' + i });
      if (i < 3) arrowR(s, x + kw + 0.02, 2.35, 0.18, 'kfA' + i);
    });
    T(s, [{ text: 'Why optional: ', options: { bold: true, color: C.accent4 } },
      { text: 'only after the accuracy and actuarial gates (shadow payouts until then) · who pays is still unproven · the insurer carries the risk, never Jio · if it fails, nothing breaks. Eligible = already active in the zone before the event began.', options: { color: C.text1 } }],
      { x: LX + 0.2, y: 2.95, w: LW - 0.4, h: 0.8, fontSize: 10.5, objectName: 'kavWhy' });
    // pricing
    card(s, LX, 3.95, LW, 2.95, 'price');
    T(s, [lab('If we offer it, weather risk sets the starting price')], { x: LX + 0.2, y: 4.05, w: LW - 0.4, h: 0.28, objectName: 'priceH' });
    const hd = (t) => ({ text: t, options: { bold: true, fontSize: 9.5, color: C.accent1, fill: { color: C.background1 } } });
    const row = (c, hi) => c.map((t, k) => ({ text: t, options: { fontSize: 10.5, bold: k === 0 || k === 4, color: k === 4 && hi ? C.accent1 : C.text1, fill: { color: C.background1 } } }));
    s.addTable([
      [hd('City · product'), hd('Trigger'), hd('Days a year'), hd('Paid days'), hd('₹ a month')],
      row(['Mumbai · Basic', '≥204.5 mm rain a day', '1.1', '1.1', '₹45']),
      row(['Nagpur · Basic', '≥47°C', '2.2', '~1.2', '₹52']),
      row(['Ahmedabad · Basic', '≥47°C', '0.7', '~0.6', '₹29 (min)']),
      row(['Mumbai · Plus', '≥64.5 mm rain a day', '11.9', '5 (cap)', '₹208'], true),
    ], { x: LX + 0.2, y: 4.4, w: LW - 0.4, colW: [1.55, 1.65, 0.85, 0.8, 0.9], rowH: 0.3, valign: 'middle', margin: [0.02, 0.06, 0.02, 0.06], border: { type: 'solid', color: HEX.grid, pt: 0.75 }, objectName: 'ptable' });
    T(s, [{ text: 'Price = expected paid days × ₹300 ÷ 60% ÷ 12', options: { bold: true, color: C.accent1, fontSize: 11.5, breakLine: true } },
      { text: '25 years of IMD records (2000–24). ₹300 and 60% are prototype assumptions; final pricing after actuarial validation. One flat price can’t fit India’s risks.', options: { fontSize: 10, color: C.text2 } }],
      { x: LX + 0.2, y: 6.0, w: LW - 0.4, h: 0.82, objectName: 'formula' });
    // the ask
    card(s, RX, 1.4, RW, 3.4, 'ask', C.accent3, 90);
    T(s, [lab('The ask: three gates in 90 days', C.accent3)], { x: RX + 0.2, y: 1.5, w: RW - 0.4, h: 0.28, objectName: 'askH' });
    const G = [['Days 1–30', 'Coverage', 'Audit Jio’s microwave links and data readiness; the audit picks the live city', 'Gate 1: enough usable coverage?'],
               ['Days 15–60', 'Accuracy', 'Back-test archived Mumbai monsoon data against held-out IMD and BMC gauges', 'Gate 2: does the fused system clear every gate?'],
               ['Days 61–90', 'Value', 'Live shadow test in one Reliance operation, matched zones with vs without', 'Gate 3: does it improve a real operation?']];
    G.forEach((g, i) => {
      const y = 1.86 + i * 0.81;
      card(s, RX + 0.2, y, RW - 0.4, 0.72, 'g' + i, C.background1);
      T(s, [{ text: g[0].toUpperCase(), options: { fontSize: 8.5, bold: true, color: C.text2, charSpacing: 1, breakLine: true } }, { text: g[1], options: { fontFace: '+mj-lt', fontSize: 13, bold: true } }], { x: RX + 0.32, y: y + 0.07, w: 1.15, h: 0.6, objectName: 'gH' + i });
      T(s, [{ text: g[2], options: { fontSize: 10, color: C.text2, breakLine: true } }, { text: g[3], options: { fontSize: 10, bold: true, color: C.accent3 } }], { x: RX + 1.5, y: y + 0.04, w: RW - 1.85, h: 0.64, valign: 'middle', objectName: 'gT' + i });
    });
    T(s, 'Only after all three gates pass do we scale externally. If not, we stop.', { x: RX + 0.2, y: 4.33, w: RW - 0.4, h: 0.4, fontSize: 11, bold: true, color: C.accent3, valign: 'middle', objectName: 'askStop' });
    // roadmap
    const h2 = (t) => ({ text: t, options: { bold: true, fontSize: 9.5, color: C.accent1, fill: { color: C.background2 } } });
    const rr = (a) => a.map((t, k) => ({ text: t, options: { fontSize: 9.5, bold: k === 0, color: k === 0 ? C.text2 : C.text1, fill: { color: C.background1 } } }));
    s.addTable([
      [h2(''), h2('0–3 months'), h2('4–12 months'), h2('Year 2'), h2('Year 3')],
      rr(['Intelligence', 'Three gates', 'Reliance live + first clients', 'Cities + enterprises', 'National weather API']),
      rr(['Kavach (optional)', 'Shadow payouts', 'Sandbox + heat', 'Basic at recharge', 'National scale']),
    ], { x: RX, y: 4.93, w: RW, colW: [1.25, 1.0, 1.45, 1.2, RW - 4.9], rowH: 0.27, valign: 'middle', margin: [0.02, 0.05, 0.02, 0.05], border: { type: 'solid', color: HEX.grid, pt: 0.75 }, objectName: 'road' });
    callout(s, RX, 5.85, RW, 1.05, [{ text: 'We aren’t asking Jio to build another weather network, just to discover what its existing one can tell us.', options: { fontSize: 10.5, color: C.background1, breakLine: true } },
      { text: 'First prove the signal. Then sell the intelligence. Protection comes last.', options: { fontFace: '+mj-lt', fontSize: 13, bold: true, color: C.accent5 } }], 'close');
    foot(s, 'IMD station data 2000–2024 (NOAA GSOD) · 5-day annual cap · Gate 3 KPIs: site visits, fault-resolution time, delivery delays, rider availability, incentive spend.');
    notes(s, 3);
  }

  await pres.writeFile({ fileName: __dirname + '/JioMausam_4Slide_Pitch.pptx' });
  await applyTheme(__dirname + '/JioMausam_4Slide_Pitch.pptx', THEME);
  console.log('written');
})().catch(e => { console.error(e); process.exit(1); });
