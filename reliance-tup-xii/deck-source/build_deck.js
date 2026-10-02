// JioMausam 3-minute presentation (elimination round).
// Builds the slides; transitions and animations are added afterwards by add_motion.py.
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const { applyTheme } = require('/root/.claude/skills/synced/3d7cc9ae-5f86-4c3a-8704-db46492bec5e_cb55a847-437e-4193-a077-dac30ae7157e/pptx/scripts/apply_theme.js');

const A = (f) => __dirname + '/assets/' + f;
const D = JSON.parse(fs.readFileSync(A('deck_data.json'), 'utf8'));

const THEME = {
  name: 'JioMausam Night',
  headFontFace: 'Cambria',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '0B1020', lt1: 'FFFFFF', dk2: '1A2246', lt2: 'EEF1F7',
    accent1: 'F5A623', accent2: '3987E5', accent3: 'D95926', accent4: '1BAF7A', accent5: 'E5484D', accent6: '98A2C0',
    hlink: 'F5A623', folHlink: 'C98500',
  },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pres.title = 'JioMausam · Reliance T.U.P XII';
pres.author = 'JioMausam team';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

pres.defineSlideMaster({ title: 'NIGHT', background: { path: A('bg.jpg') }, objects: [] });
pres.defineSlideMaster({ title: 'BLACK', background: { color: '05070D' }, objects: [] });

const W = 13.333, H = 7.5, M = 0.6;
const ink = 'EEF1F7', mute = '98A2C0', sa = 'F5A623';

// shared elements that Morph glides between slides
function brand(s, big) {
  if (big) return;
  s.addText('JioMausam', { x: M, y: 0.32, w: 3, h: 0.4, fontFace: 'Cambria', fontSize: 15, bold: true, color: ink, margin: 0, isTextBox: true, objectName: '!!brand' });
  s.addImage({ path: A('tower.png'), x: W - M - 0.42, y: 0.22, w: 0.42, h: 0.6, objectName: '!!tower' });
}
function kicker(s, text, y = 0.95) {
  s.addText(text.toUpperCase(), { x: M, y, w: 9, h: 0.3, fontFace: 'Calibri', fontSize: 11, bold: true, color: sa, charSpacing: 3, margin: 0, isTextBox: true, objectName: 'kicker' });
}
function title(s, text, y = 1.28, w = 11.5, size = 34) {
  s.addText(text, { x: M, y, w, h: 0.95, fontFace: 'Cambria', fontSize: size, bold: true, color: 'FFFFFF', margin: 0, valign: 'top', isTextBox: true, objectName: 'title' });
}
function foot(s, text) {
  s.addText(text, { x: M, y: H - 0.5, w: W - 2 * M, h: 0.3, fontFace: 'Calibri', fontSize: 9.5, color: '6F7AA0', margin: 0, isTextBox: true, objectName: 'source' });
}
function stat(s, x, y, w, num, label, name, numColor = 'FFFFFF') {
  s.addText([
    { text: num, options: { fontFace: 'Cambria', fontSize: 40, bold: true, color: numColor, breakLine: true } },
    { text: label, options: { fontFace: 'Calibri', fontSize: 14, color: mute } },
  ], { x, y, w, h: 1.25, margin: 0, valign: 'top', paraSpaceAfter: 2, isTextBox: true, objectName: name });
}

pres.addSection({ title: 'Elimination round' });
const sec = { sectionTitle: 'Elimination round' };

// 1 ---------------------------------------------------------------- cold open
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  s.addImage({ path: A('tower_big.png'), x: 8.55, y: 0.75, w: 3.9, h: 5.9, objectName: '!!tower' });
  s.addText('RELIANCE T.U.P XII  ·  ELIMINATION ROUND', { x: M + 0.1, y: 1.55, w: 7, h: 0.3, fontFace: 'Calibri', fontSize: 12, bold: true, color: sa, charSpacing: 3, margin: 0, isTextBox: true, objectName: 'kicker' });
  s.addText('JioMausam', { x: M + 0.1, y: 1.95, w: 7.6, h: 1.5, fontFace: 'Cambria', fontSize: 80, bold: true, color: 'FFFFFF', margin: 0, isTextBox: true, objectName: '!!brand' });
  s.addText('We don’t build sensors.\nWe become the sensor.', { x: M + 0.1, y: 3.55, w: 7.4, h: 1.3, fontFace: 'Cambria', fontSize: 28, italic: true, color: 'D7DDEA', margin: 0, isTextBox: true, objectName: 'tagline' });
  s.addText('A live, street-level weather map from Jio’s own network, and insurance that pays workers automatically when extreme weather stops their work.', { x: M + 0.1, y: 5.15, w: 6.9, h: 0.9, fontFace: 'Calibri', fontSize: 15, color: mute, margin: 0, isTextBox: true, objectName: 'sub' });
  s.addNotes('[0:00–0:12] You’ve just seen the idea. In the next three minutes: proof that it works on real network data, where we start and why, and exactly what we need from Reliance.');
}

// 2 ---------------------------------------------------------------- live demo screenshot
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  brand(s);
  kicker(s, 'Our working prototype');
  title(s, 'Same storm. Our network vs a radar.');
  s.addImage({ path: A('cr_maps.png'), x: M, y: 2.35, w: 8.6, h: 8.6 * D.cr_ratio, objectName: 'shot' });
  stat(s, 9.75, 2.45, 3.0, '500', 'real tower-to-tower microwave links, 1-minute signal data', 'st1');
  stat(s, 9.75, 3.85, 3.0, '0', 'radars, weather stations or new hardware on our side', 'st2', sa);
  s.addText('Open the live prototype to replay the storm', { x: 9.75, y: 5.35, w: 3.0, h: 0.6, fontFace: 'Calibri', fontSize: 12.5, color: sa, underline: { style: 'sng' }, margin: 0, isTextBox: true, objectName: 'link', hyperlink: { url: D.cr_url, tooltip: 'JioMausam Control Room' } });
  foot(s, 'Real data: 500 commercial microwave links, 13–14 May 2018 storm (OpenSense / pycomlink sample). Reference: German Weather Service radar.');
  s.addNotes('[0:12–0:40] This is our working prototype, the JioMausam Control Room. On the left is rain mapped only from 500 real tower-to-tower radio links. On the right is a national weather radar that costs crores. Same storm, same moment. The shapes and the heavy patches match. We added nothing to the network to get this. (If the call allows, switch to the live prototype tab and press “Replay the storm”.)');
}

// 3 ---------------------------------------------------------------- proof chart
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  brand(s);
  kicker(s, 'The proof');
  title(s, 'Tested on days it had never seen.');
  s.addChart(pres.charts.LINE, [
    { name: 'Weather radar', labels: D.net.labels, values: D.net.r },
    { name: 'JioMausam (network links)', labels: D.net.labels, values: D.net.c },
  ], {
    x: M - 0.1, y: 2.3, w: 8.4, h: 4.2, objectName: 'chart',
    chartColors: ['D95926', '3987E5'], lineSize: 2, lineDataSymbol: 'none',
    showLegend: true, legendPos: 't', legendColor: 'D7DDEA', legendFontSize: 12, legendFontFace: '+mn-lt',
    catAxisLabelColor: '98A2C0', valAxisLabelColor: '98A2C0', catAxisLabelFontSize: 11, valAxisLabelFontSize: 11,
    catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', catAxisLabelFrequency: 24, catAxisLineShow: false, valAxisLineShow: false,
    valGridLine: { color: '2A3357', size: 0.5 }, catGridLine: { style: 'none' },
    showValAxisTitle: true, valAxisTitle: 'mm/h, network average', valAxisTitleColor: '98A2C0', valAxisTitleFontSize: 11, valAxisTitleFontFace: '+mn-lt',
    showTitle: false,
  });
  stat(s, 9.4, 2.35, 3.4, D.m.r_net, 'network-wide match with radar, hour by hour', 'st1');
  stat(s, 9.4, 3.75, 3.4, D.m.r_link, 'typical single link on its own', 'st2');
  stat(s, 9.4, 5.15, 3.4, D.m.day_pod, `of rainy days caught, ${D.m.day_far} false alarms`, 'st3', sa);
  foot(s, `Calibrated once (×${D.m.K}) on days 1–3, tested on days 4–11. Payout rule (10 mm in 3 h) made the same decision as radar ${D.m.bt_agree} of the time.`);
  s.addNotes(`[0:40–1:00] Here’s the honest test. We tuned one number on the first three days, then tested on eight days the model had never seen. Network-wide our rain matched the radar at ${D.m.r_net}. A single link on its own: ${D.m.r_link}. We caught ${D.m.day_pod} of rainy days with only ${D.m.day_far} false alarms. And our payout rule made the same pay or no-pay decision as the radar ${D.m.bt_agree} of the time.`);
}

// 4 ---------------------------------------------------------------- India layer
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  brand(s);
  kicker(s, 'The India layer');
  title(s, 'Indian weather tells us where to start.');
  s.addChart(pres.charts.BAR, [
    { name: 'Mumbai', labels: D.india.labels, values: D.india.Mumbai },
    { name: 'Nagpur', labels: D.india.labels, values: D.india.Nagpur },
    { name: 'Ahmedabad', labels: D.india.labels, values: D.india.Ahmedabad },
  ], {
    x: M - 0.1, y: 2.3, w: 7.9, h: 4.25, objectName: 'chart', barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 60,
    chartColors: ['3987E5', 'D95926', '1BAF7A'], showLegend: true, legendPos: 't', legendColor: 'D7DDEA', legendFontSize: 12, legendFontFace: '+mn-lt',
    showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: 'EEF1F7', dataLabelFontSize: 10, dataLabelFormatCode: '0.0', dataLabelFontFace: '+mn-lt',
    catAxisLabelColor: 'B9C2D8', valAxisLabelColor: '98A2C0', catAxisLabelFontSize: 11, valAxisLabelFontSize: 10, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
    valGridLine: { color: '2A3357', size: 0.5 }, catGridLine: { style: 'none' }, catAxisLineShow: false, valAxisLineShow: false,
    showValAxisTitle: true, valAxisTitle: 'days per year (2000–2024 average)', valAxisTitleColor: '98A2C0', valAxisTitleFontSize: 11, valAxisTitleFontFace: '+mn-lt',
  });
  s.addText([
    { text: 'Start where the triggers are.', options: { fontFace: 'Cambria', fontSize: 22, bold: true, color: 'FFFFFF', breakLine: true } },
    { text: 'Mumbai has about 12 heavy-rain days a year, so rain and riders come first. Nagpur’s and Ahmedabad’s danger is heat: that’s phase two.', options: { fontFace: 'Calibri', fontSize: 13, color: 'B9C2D8' } },
  ], { x: 8.85, y: 2.3, w: 3.9, h: 1.7, margin: 0, valign: 'top', paraSpaceAfter: 4, isTextBox: true, objectName: 'insight' });
  const cities = [['Mumbai', 'Phase 1', `rain · ${D.india.Mumbai[0].toFixed(1)} heavy days a year`], ['Nagpur', 'Phase 2', `heat · ${D.india.Nagpur[3].toFixed(1)} days ≥45°C`], ['Ahmedabad', 'Phase 2', `heat · ${D.india.Ahmedabad[3].toFixed(1)} days ≥45°C`]];
  cities.forEach((c, i) => {
    const y = 4.2 + i * 0.78;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.85, y, w: 3.9, h: 0.66, rectRadius: 0.1, fill: { color: '172038' }, line: { color: '2A3357', width: 0.75 }, objectName: 'city' + i });
    s.addText([{ text: c[0] + '  ', options: { bold: true, color: 'FFFFFF' } }, { text: c[2], options: { color: '98A2C0' } }], { x: 9.05, y, w: 2.45, h: 0.66, fontFace: 'Calibri', fontSize: 12.5, valign: 'middle', margin: 0, isTextBox: true, objectName: 'cityT' + i });
    s.addText(c[1], { x: 11.45, y, w: 1.15, h: 0.66, fontFace: 'Cambria', fontSize: 17, bold: true, color: sa, align: 'right', valign: 'middle', margin: 0, isTextBox: true, objectName: 'cityP' + i });
  });
  foot(s, `IMD station reports 2000–2024 via NOAA. City prices for Kavach Basic: Mumbai ₹${D.price.Mumbai}, Nagpur ₹${D.price.Nagpur}, Ahmedabad ₹${D.price.Ahmedabad} a month (₹300 a payout, max 5 days a year).`);
  s.addNotes(`[1:00–1:25] Indian operators don’t publish link data, so we went to 25 years of IMD station records. Two findings. Rain really is hyperlocal: on a third of Mumbai’s heavy-rain days, a station 20 km away got less than half as much. And each city has a different danger. Mumbai sees about ${D.india.Mumbai[0].toFixed(0)} heavy-rain days a year, so that’s where we start: rain, riders, Mumbai. Nagpur and Ahmedabad face heat, which is our phase two.`);
}

// 5 ---------------------------------------------------------------- the phone
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  brand(s);
  kicker(s, 'The product');
  title(s, 'What a worker actually sees.');
  const ph = [['app_home.png', '1  Covered from their recharge. The ring fills as rain builds.'], ['app_paid.png', '2  The network crosses the trigger. ₹300 lands in JioPay.'], ['app_plan.png', '3  City prices, set from 25 years of IMD records.']];
  const pw = 2.35, phh = pw * D.phone_ratio, gap = 1.55, x0 = 1.15;
  ph.forEach((p, i) => {
    const x = x0 + i * (pw + gap);
    s.addImage({ path: A(p[0]), x, y: 2.25, w: pw, h: phh, objectName: 'phone' + i });
    s.addText(p[1], { x: x + pw + 0.2, y: 2.25 + phh - 1.55, w: 1.3, h: 1.5, fontFace: 'Calibri', fontSize: 12.5, color: 'D7DDEA', margin: 0, valign: 'bottom', isTextBox: true, objectName: 'cap' + i });
  });
  s.addNotes('[1:25–1:50] This is the Mausam Kavach app. Ravi, a delivery rider in Andheri, is covered: his delivery app pays for it. As the towers around him measure the rain, the ring fills. The moment it crosses ten millimetres in three hours, three hundred rupees lands in his JioPay wallet, with the exact reading that triggered it. No form, no surveyor. It works in Hindi too.');
}

// 6 ---------------------------------------------------------------- business
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  brand(s);
  kicker(s, 'The business');
  title(s, 'Riders first. Then everyone.');
  s.addText([
    { text: `₹${D.plus_cr} Cr`, options: { fontFace: 'Cambria', fontSize: 72, bold: true, color: sa, breakLine: true } },
    { text: `a year from one delivery app covering 50,000 Mumbai riders on Kavach Plus (₹${D.price.MumbaiPlus} a rider a month)`, options: { fontFace: 'Calibri', fontSize: 16, color: 'D7DDEA' } },
  ], { x: M, y: 2.3, w: 4.9, h: 2.6, margin: 0, valign: 'top', isTextBox: true, objectName: 'bignum' });
  s.addText('Riders first: one platform deal covers thousands of workers at once. Settlement is automatic, so most of the premium goes back to people.', { x: M, y: 5.0, w: 4.6, h: 0.9, fontFace: 'Calibri', fontSize: 13, color: mute, margin: 0, isTextBox: true, objectName: 'why' });
  const cols = [
    ['Kavach Plus · first', `Delivery apps buy it for riders: ₹${D.price.MumbaiPlus} a rider a month in Mumbai, any work-stopping day, up to 5 a year.`],
    ['Kavach Basic · phase 3', 'Individuals add it at recharge for ₹29–52 a month by city. 1% of Jio’s users = ₹174 Cr a year.'],
    ['Data + customer zero', 'Insurers and state disaster agencies license the map. JioMart, New Energy and Jio use it first.'],
  ];
  cols.forEach((c, i) => {
    const y = 2.35 + i * 1.32;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.1, y, w: 6.6, h: 1.12, rectRadius: 0.12, fill: { color: '141B36' }, line: { color: '2A3357', width: 0.75 }, objectName: 'col' + i });
    s.addText([{ text: c[0], options: { fontFace: 'Cambria', fontSize: 18, bold: true, color: 'FFFFFF', breakLine: true } }, { text: c[1], options: { fontFace: 'Calibri', fontSize: 13.5, color: 'B9C2D8' } }],
      { x: 6.4, y: y + 0.12, w: 6.1, h: 0.9, margin: 0, valign: 'top', isTextBox: true, objectName: 'colT' + i });
  });
  foot(s, 'Illustrative. A licensed insurer underwrites through Jio Financial Services’ partners; Jio earns distribution and data fees and carries no insurance risk.');
  s.addNotes(`[1:50–2:15] We start with riders, because one deal with one delivery app covers thousands of workers. Kavach Plus in Mumbai costs about ₹${D.price.MumbaiPlus} a rider a month, so fifty thousand riders is about ${D.plus_cr} crore a year. In phase three, anyone can add Kavach Basic at recharge, ₹29 to ₹52 by city; one percent of Jio’s users is 174 crore a year. And insurers, states, JioMart and New Energy use the data.`);
}

// 7 ---------------------------------------------------------------- moat + ask
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  brand(s);
  kicker(s, 'Why Reliance, and our ask');
  title(s, 'Only Reliance holds every layer.');
  const L = [['Sense', 'Jio network, lakhs of sites'], ['Reach', '500M+ users who recharge'], ['Pay', 'JioPay and JioFinance'], ['Insure', 'Jio Financial Services partners'], ['Use', 'JioMart, New Energy, Jio']];
  L.forEach((l, i) => {
    const y = 2.3 + i * 0.78;
    s.addText([{ text: l[0] + '   ', options: { fontFace: 'Cambria', bold: true, fontSize: 19, color: sa } }, { text: l[1], options: { fontFace: 'Calibri', fontSize: 16, color: 'EEF1F7' } }],
      { x: M, y, w: 6.0, h: 0.62, margin: 0, valign: 'middle', isTextBox: true, objectName: 'layer' + i });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.1, y: 2.3, w: 5.63, h: 4.25, rectRadius: 0.14, fill: { color: 'F5A623' }, line: { color: 'F5A623', width: 0 }, objectName: 'askBox' });
  s.addText([
    { text: 'The ask: a 90-day pilot', options: { fontFace: 'Cambria', fontSize: 22, bold: true, color: '1A1200', breakLine: true } },
    { text: 'Mumbai monsoon: rain, riders, one delivery app.', options: { fontFace: 'Calibri', fontSize: 15, color: '1A1200', breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: 'Jio link logs for Mumbai', options: { fontFace: 'Calibri', fontSize: 14.5, color: '1A1200', bullet: true, breakLine: true } },
    { text: 'One JFS insurance partner and one delivery app', options: { fontFace: 'Calibri', fontSize: 14.5, color: '1A1200', bullet: true, breakLine: true } },
    { text: 'A five-person team. No new hardware.', options: { fontFace: 'Calibri', fontSize: 14.5, color: '1A1200', bullet: true, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: 'Success: r ≥ 0.8 against IMD gauges, 80% of heavy-rain events caught, money in wallets within 6 hours.', options: { fontFace: 'Calibri', fontSize: 13, italic: true, color: '3A2A00' } },
  ], { x: 7.4, y: 2.55, w: 5.05, h: 3.8, margin: 0, valign: 'top', paraSpaceAfter: 4, isTextBox: true, objectName: 'askText' });
  s.addNotes('[2:15–2:35] Why only Reliance? It takes five layers: a network to sense, half a billion people to reach, a way to pay, an insurer, and businesses that use the data. Reliance is the only company with all five. Our ask is small: a ninety-day Mumbai monsoon pilot with Jio’s link logs for Mumbai, one insurance partner, one delivery app and a five-person team. No new hardware. It tests our two riskiest assumptions: link coverage and payout accuracy.');
}

// 8 ---------------------------------------------------------------- phases
{
  const s = pres.addSlide({ masterName: 'NIGHT', ...sec });
  brand(s);
  kicker(s, 'The roadmap');
  title(s, 'Four phases. Rain first.');
  const P = [
    ['1', 'Mumbai monsoon pilot', 'Months 0–3', 'Rain, riders, one delivery app. Measure link coverage and accuracy against IMD.'],
    ['2', 'Heatwaves', 'Months 4–12', 'Nagpur and Ahmedabad. Heat from phone and tower-site sensors.'],
    ['3', 'Kavach Basic', 'Year 2', 'At every recharge, priced city by city: ₹29–52 a month.'],
    ['4', 'National map', 'Year 3', 'Every district. Data API for insurers, states and Reliance.'],
  ];
  const cw = 2.85, gap = 0.21;
  P.forEach((p, i) => {
    const x = M + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.45, w: cw, h: 3.7, rectRadius: 0.14, fill: { color: i === 0 ? 'F5A623' : '141B36' }, line: { color: i === 0 ? 'F5A623' : '2A3357', width: 0.75 }, objectName: 'phB' + i });
    s.addText([
      { text: p[0], options: { fontFace: 'Cambria', fontSize: 54, bold: true, color: i === 0 ? '1A1200' : sa, breakLine: true } },
      { text: p[2].toUpperCase(), options: { fontFace: 'Calibri', fontSize: 10.5, bold: true, charSpacing: 2, color: i === 0 ? '3A2A00' : '98A2C0', breakLine: true } },
      { text: p[1], options: { fontFace: 'Cambria', fontSize: 19, bold: true, color: i === 0 ? '1A1200' : 'FFFFFF', breakLine: true } },
      { text: p[3], options: { fontFace: 'Calibri', fontSize: 13, color: i === 0 ? '2A1E00' : 'B9C2D8' } },
    ], { x: x + 0.25, y: 2.6, w: cw - 0.5, h: 3.4, margin: 0, valign: 'top', paraSpaceAfter: 4, isTextBox: true, objectName: 'phT' + i });
  });
  s.addNotes('[2:35–2:52] Four phases. Phase one is the Mumbai monsoon pilot: rain, riders, one delivery app. Phase two adds heatwaves in Nagpur and Ahmedabad. Phase three puts Kavach Basic on every recharge. Phase four is a national map with data for insurers and states.');
}

// 9 ---------------------------------------------------------------- close
{
  const s = pres.addSlide({ masterName: 'BLACK', ...sec });
  s.addText('India won’t adapt to climate change by building more.', { x: 0.6, y: 2.2, w: 12.13, h: 0.8, fontFace: 'Cambria', fontSize: 28, color: 'B9C2D8', align: 'center', margin: 0, isTextBox: true, objectName: 'line1' });
  s.addText('It will adapt by listening to what it already has.', { x: 0.6, y: 3.05, w: 12.13, h: 0.8, fontFace: 'Cambria', fontSize: 28, bold: true, color: 'FFFFFF', align: 'center', margin: 0, isTextBox: true, objectName: 'line2' });
  s.addText('JioMausam', { x: 4.4, y: 4.65, w: 4.5, h: 0.9, fontFace: 'Cambria', fontSize: 40, bold: true, color: sa, align: 'center', margin: 0, isTextBox: true, objectName: '!!brand' });
  s.addText('DIFFERENT BY DESIGN', { x: 4.4, y: 5.5, w: 4.5, h: 0.35, fontFace: 'Calibri', fontSize: 12, bold: true, color: '98A2C0', charSpacing: 4, align: 'center', margin: 0, isTextBox: true, objectName: 'tag' });
  s.addNotes('[2:52–3:00] India won’t adapt to climate change by building more. It will adapt by listening to what it already has. This is JioMausam. Thank you.');
}

(async () => {
  await pres.writeFile({ fileName: __dirname + '/JioMausam_3min_Presentation_raw.pptx' });
  await applyTheme(__dirname + '/JioMausam_3min_Presentation_raw.pptx', THEME);
  console.log('written');
})();
