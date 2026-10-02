const fs=require('fs'), zlib=require('zlib'), E=require('./engine.js');
const M=JSON.parse(fs.readFileSync('testlab-meta.json'));
const D=E.decode(zlib.gunzipSync(fs.readFileSync('testlab-data.bin')),M);
let t=Date.now();
const Rh=E.runAll(D.sig,M,{thrMult:1.12,waaMax:1.5});
console.log('pipeline ms',Date.now()-t);
const py=new Float64Array(fs.readFileSync('py_Rh.f64').buffer.slice(0));
let maxd=0,nd=0,worst=-1; for(let i=0;i<py.length;i++){const d=Math.abs(Rh[i]-py[i]); if(d>1e-9){nd++;} if(d>maxd){maxd=d;worst=i;}}
console.log('hourly values differing >1e-9:',nd,'of',py.length,'max diff',maxd,'at link',Math.floor(worst/M.nH));
t=Date.now(); const S=E.score(Rh,M,D,{calDays:3,trigger:10}); console.log('score ms',Date.now()-t);
const r3=v=>Math.round(v*1000)/1000;
console.log({K:r3(S.K),r_hourly:r3(S.rHourly),bias:r3(S.bias),r_net:r3(S.rNet),med_link:r3(S.medLink),share07:r3(S.share07),n:S.nLinksR,r_areal:r3(S.rAreal),bt:S.bt});
for (const T of [5,15]) { const s=E.score(Rh,M,D,{calDays:3,trigger:T}); console.log(T, s.bt); }
