const fs=require('fs'), I=require('./india.js'), D=JSON.parse(fs.readFileSync('india-data.json'));
const R='/home/user/market-research-agent/reliance-tup-xii/prototype/india/';
const L=JSON.parse(fs.readFileSync(R+'india_layer.json')), S=JSON.parse(fs.readFileSync(R+'stress_test.json'));
let bad=0;
for (const c of ['Mumbai','Nagpur','Ahmedabad']) for (const row of L[c].rows) {
  const p=I.price(D.stations[c],row.kind,row.th,5,300,0.6);
  const got=[+p.meanDays.toFixed(2),+p.meanPaid.toFixed(2),Math.round(p.premMonth)], want=[row.days,row.days_capped,row.prem_month];
  if (JSON.stringify(got)!==JSON.stringify(want)) { bad++; console.log('MISMATCH',c,row.kind,row.th,got,want); }
}
const P=[['Mumbai Basic (>=204.5mm)','Mumbai','rain',204.5,5],['Nagpur Basic (>=47C)','Nagpur','heat',47,5],['Ahmedabad Basic (>=47C)','Ahmedabad','heat',47,5],['Mumbai Plus cap5 (>=64.5mm)','Mumbai','rain',64.5,5],['Mumbai Plus cap3 (>=64.5mm)','Mumbai','rain',64.5,3]];
for (const [k,c,per,th,cap] of P) { const p=I.price(D.stations[c],per,th,cap,300,0.6), s=S[k];
  const got=[Math.round(p.premMonth),p.worst.year,p.worst.days,p.worst.paid,+p.worst.ratio.toFixed(2),p.over100,p.years.length], want=[s.premium_month,s.worst_year,s.worst_days,s.worst_paid_days,s.worst_loss_ratio,s.years_over_100pct,s.n_years];
  if (JSON.stringify(got)!==JSON.stringify(want)) { bad++; console.log('MISMATCH',k,got,want);} }
const h=I.hyperlocal(D.pairs,64.5); console.log('hyperlocal',h,'published: 89 days, 15 heavy, 0.333');
console.log(bad?bad+' mismatches':'all India prices and stress results match the published numbers');
