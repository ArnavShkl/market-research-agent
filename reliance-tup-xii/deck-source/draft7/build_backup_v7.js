// JioMausam Q&A backup slides for draft 7: proof hierarchy, limitations defence wall, tough questions.
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
    okG: ['FaCircleCheck', GREEN], hour: ['FaHourglassHalf', 'FF8A8D'], towerSA: ['FaTowerBroadcast', SA],
  };
  for (const [k, [n, c]] of Object.entries(need)) I[k] = await icon(n, c);

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'JioMausam · Q&A backup';
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

  // ================= B1 · PROOF HIERARCHY =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Q&A backup · proof hierarchy', 'What’s proven, what we checked, what isn’t');
    const C = [[I.okG, 'Proven · published', GREEN, CARD, GREEN, 'solid',
                ['Physics: rain weakens microwave signals (ITU-R P.838)', 'Method: rain from a phone network (Science 2006)', 'Scale: country-wide rain maps (PNAS 2013)', 'Open-source tools exist (pycomlink, KIT Germany)']],
               [I.flask, 'Our check · public data', SA, AMBERBG, SA, 'solid',
                ['500 real links, Germany, 11 days, radar as reference', '0.95 network-wide match; 0.88 typical link; 0.78 map level', 'Rain / no-rain days: 91% detected, 5% false', 'Links alone failed all three accuracy gates: 68% of trigger events (≥80%), totals 18% low (±10%), 18% unconfirmed (<15%)']],
               [I.hour, 'Not yet proven · the pilot', 'FF8A8D', '2A1622', RED, 'dash',
                ['Jio’s usable coverage → Gate 1', 'Accuracy in Indian monsoon → Gate 2', 'Business value inside Reliance → Gate 3', 'Who pays → payer test in the pilot', 'Insurance-grade triggers → accuracy + actuarial gates, shadow payouts']]];
    const cw = (CW - 2 * 0.25) / 3;
    C.forEach((c, i) => {
      const x = M + i * (cw + 0.25);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.25, w: cw, h: 3.9, rectRadius: 0.12, fill: { color: c[3] }, line: { color: c[4], width: 1, dashType: c[5] }, objectName: 'col' + i });
      s.addImage({ data: c[0], x: x + 0.25, y: 2.45, w: 0.36, h: 0.36, objectName: 'colI' + i });
      T(s, c[1].toUpperCase(), { x: x + 0.72, y: 2.45, w: cw - 0.9, h: 0.36, fontSize: 11, bold: true, color: c[2], charSpacing: 2, valign: 'middle', objectName: 'colK' + i });
      T(s, c[6].map((t, k, a) => ({ text: t, options: { bullet: true, breakLine: k < a.length - 1 } })), { x: x + 0.25, y: 3.0, w: cw - 0.45, h: 3.0, fontSize: 13.5, color: i === 1 ? 'FFFFFF' : INK, paraSpaceAfter: 8, objectName: 'colT' + i });
    });
    takeaway(s, 'We know what is proven. We know what isn’t. The pilot is built around the unknowns.', 6.35);
    foot(s, 'Our check: our pipeline on the open pycomlink example dataset (KIT, BSD licence), German DWD radar as reference; tuned 10–12 May 2018, scored 13–20 May. Not Jio data.');
  }

  // ================= B2 · DEFENCE WALL =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Q&A backup · defence wall', 'Every limit we know of, and our answer');
    const R = [['Jio may not have enough usable microwave links', 'Coverage audit is Gate 1; radar, gauges and satellite still work without links'],
               ['Fibre doesn’t sense rain', 'We only use microwave links'],
               ['A link measures path-averaged rain, not a point', 'Fusion with radar and gauges turns it into grid estimates'],
               ['Links alone failed all three accuracy gates', 'We never use links alone; accuracy picks the mix'],
               ['18% of our triggers weren’t confirmed by radar', 'Multi-source confirmation and local calibration'],
               ['Rain can be confused with equipment faults', 'Network-health flags (faults, outages, maintenance) and cross-link checks'],
               ['Performance in India is unknown', 'Back-test Jio’s archived Mumbai monsoon data (Gate 2)'],
               ['1 km resolution isn’t guaranteed', 'Resolution depends on link density and fusion; reported per area'],
               ['Platforms’ willingness to pay is unknown', 'Prove value inside Reliance first (Gate 3, matched zones), then sell'],
               ['Insurance basis risk', 'Small zones, multi-source trigger, review process'],
               ['₹300 payout is arbitrary today', 'Prototype assumption; set by actuarial calibration'],
               ['₹208 isn’t priced on the 10 mm in 3 h trigger', 'Priced on 25 years of daily IMD risk; the pilot recalibrates the trigger'],
               ['Towers don’t sense heat', 'IMD stations and satellite feed the same engine'],
               ['Insurance may never launch', 'The intelligence business stands on its own']];
    const hdr = (t) => ({ text: t, options: { bold: true, color: SA, fontSize: 11.5, fill: { color: CARD2 } } });
    s.addTable([[hdr('Limitation'), hdr('Our answer')], ...R.map((r, i) => r.map((t, k) => ({ text: t, options: { fill: { color: i % 2 ? '111830' : CARD }, color: k === 0 ? 'FFFFFF' : INK, bold: k === 0, fontSize: 12 } })))],
      { x: M, y: 2.2, w: CW, colW: [4.9, CW - 4.9], rowH: 0.32, fontFace: 'Calibri', valign: 'middle', margin: [0.02, 0.1, 0.02, 0.1], border: { type: 'solid', color: LINE, pt: 0.75 }, objectName: 'wall' });
  }

  // ================= B3 · TOUGH QUESTIONS =================
  {
    const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
    head(s, 'Q&A backup · tough questions', 'The questions we expect, and short answers');
    const Q = [['“How closely did links track radar?” / “Why only 68%?”', 'Network-wide hourly match 0.95; a typical single link 0.88; map level 0.78. The trigger test is harsher: a 9 mm estimate against an 11 mm event is a miss, and links read 18% low. So 68%.'],
               ['“Mumbai already has hyperlocal weather.”', 'Exactly: BMC gauges and IMD radar are inputs we fuse, not rivals. The pilot’s “radar + gauges, no links” run measures what Jio’s links add.'],
               ['“Jio already knows rain fade.”', 'It may. Then Gate 1 confirms cheaply what weather information is available. If it doesn’t, the same telemetry is a new signal.'],
               ['“What if it doesn’t rain in days 61–90?”', 'The back-test replays archived monsoon events, including network-ops value. The full live test runs in Mumbai’s 2027 monsoon (months 4–12).'],
               ['“Why ₹208 if the live trigger is 10 mm in 3 h?”', '₹208 isn’t priced from that prototype trigger. It uses 25 years of daily IMD heavy-rain history, capped at five paid days. The pilot measures the 3-hour trigger’s real frequency and recalibrates before launch.'],
               ['“Did you build the model?”', 'We didn’t invent the method; it’s published research. We implemented it with open-source tools, ran it ourselves on real link data, and measured where it fails.'],
               ['“Germany isn’t India.”', 'Agreed. Gate 2 back-tests Jio’s archived Mumbai monsoon data against held-out IMD and BMC gauges. Nothing scales until it passes.'],
               ['“Who decides whether Jio’s own system pays?”', 'Jio only supplies the trigger data. A licensed insurer owns the contract, the rules and the payout; the trigger is multi-source and auditable.']];
    const hdr = (t) => ({ text: t, options: { bold: true, color: SA, fontSize: 11.5, fill: { color: CARD2 } } });
    s.addTable([[hdr('If a judge asks'), hdr('Say')], ...Q.map((r, i) => r.map((t, k) => ({ text: t, options: { fill: { color: i % 2 ? '111830' : CARD }, color: k === 0 ? 'FFFFFF' : INK, bold: k === 0, fontSize: 11.5 } })))],
      { x: M, y: 2.15, w: CW, colW: [3.75, CW - 3.75], rowH: [0.32, ...Q.map(() => 0.52)], fontFace: 'Calibri', valign: 'middle', margin: [0.03, 0.1, 0.03, 0.1], border: { type: 'solid', color: LINE, pt: 0.75 }, objectName: 'qa' });
  }

  await pres.writeFile({ fileName: __dirname + '/JioMausam_Draft7_QA_Backup.pptx' });
  await applyTheme(__dirname + '/JioMausam_Draft7_QA_Backup.pptx', THEME);
  console.log('written');
})().catch(e => { console.error(e); process.exit(1); });
