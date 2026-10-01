import xarray as xr, numpy as np, json, warnings, base64, pycomlink as pycml
from scipy.spatial import cKDTree
warnings.filterwarnings('ignore')
P='/usr/local/lib/python3.11/dist-packages/pycomlink/io/example_data/'
OUT='./out/'; __import__('os').makedirs(OUT,exist_ok=True)
c=xr.open_dataset(P+'example_cml_data.nc').load()
c['tsl']=c.tsl.where(c.tsl!=255.0); c['rsl']=c.rsl.where(c.rsl!=-99.9)
trsl=(c.tsl-c.rsl).interpolate_na(dim='time',method='linear',max_gap='5min')
sd=trsl.rolling(time=60,center=True).std(skipna=False)
thr=sd.quantile(0.8,dim='time')*1.12
wet=sd>thr
bl=pycml.processing.baseline.baseline_constant(trsl=trsl,wet=wet,n_average_last_dry=5)
waa=pycml.processing.wet_antenna.waa_schleiss_2013(rsl=trsl,baseline=bl,wet=wet,waa_max=1.5,delta_t=1,tau=15)
A=(trsl-bl-waa); A=A.where(A>=0,0)
R=pycml.processing.k_R_relation.calc_R_from_A(A=A,L_km=c.length.astype(float),f_GHz=c.frequency/1e9,pol=c.polarization).mean('channel_id')
ref5=xr.open_dataset(P+'example_path_averaged_reference_data.nc').rainfall_amount.load().transpose('cml_id','time')*12  # mm/h
refh=ref5.resample(time='1h').mean()
Rh=R.resample(time='1h').mean(); Rh,refh=xr.align(Rh,refh,join='inner')
cal=(Rh.time<np.datetime64('2018-05-13')).values; val=~cal
K=float(np.nansum(refh.values[:,cal])/np.nansum(Rh.values[:,cal])); print('K',K)
Rc=R*K; Rhc=Rh*K
def pooled(a,b):
    a=a.ravel(); b=b.ravel(); m=np.isfinite(a)&np.isfinite(b); a,b=a[m],b[m]; o=dict(r=float(np.corrcoef(a,b)[0,1]),bias=float(a.sum()/b.sum()))
    for T in (0.1,1,5):
        h=np.sum((a>=T)&(b>=T)); mi=np.sum((a<T)&(b>=T)); f=np.sum((a>=T)&(b<T)); o[f'pod{T}']=float(h/(h+mi)); o[f'far{T}']=float(f/(h+f)); o[f'n{T}']=int(h+mi)
    return o
hv=pooled(Rhc.values[:,val],refh.values[:,val])
# daily totals per link (validation days)
Dc=Rhc[:,val].resample(time='1D').sum(min_count=18); Dr=refh[:,val].resample(time='1D').sum(min_count=18)
dv=pooled(Dc.values,Dr.values)
for T in (10,20):
    a=Dc.values.ravel(); b=Dr.values.ravel(); m=np.isfinite(a)&np.isfinite(b); a,b=a[m],b[m]
    h=np.sum((a>=T)&(b>=T)); mi=np.sum((a<T)&(b>=T)); f=np.sum((a>=T)&(b<T)); dv[f'pod{T}']=float(h/(h+mi)) if h+mi else None; dv[f'far{T}']=float(f/(h+f)) if h+f else None; dv[f'n{T}']=int(h+mi)
netc=Rhc.mean('cml_id'); netr=refh.mean('cml_id'); rnet=float(np.corrcoef(netc[val],netr[val])[0,1])
rl=[]
for i in range(Rhc.sizes['cml_id']):
    x=Rhc.values[i,val]; y=refh.values[i,val]; mm=np.isfinite(x)&np.isfinite(y)
    if mm.sum()>100 and y[mm].sum()>5:
        v=np.corrcoef(x[mm],y[mm])[0,1]
        if np.isfinite(v): rl.append(v)
rl=np.array(rl)
# ---------- areal comparison + trigger backtest ----------
ar=xr.open_dataset(P+'example_areal_reference_data.nc')
lat2=ar.latitudes.values; lon2=ar.longitudes.values
f=4; ny,nx=lat2.shape; ny4,nx4=ny//f,nx//f
def coarse(z): return z[:ny4*f,:nx4*f].reshape(ny4,f,nx4,f).mean(axis=(1,3))
clat=coarse(lat2); clon=coarse(lon2)
mlat=((c.site_a_latitude+c.site_b_latitude)/2).values; mlon=((c.site_a_longitude+c.site_b_longitude)/2).values
lat0=np.deg2rad(np.mean(mlat))
def xy(lat,lon): return np.c_[lon.ravel()*111.32*np.cos(lat0), lat.ravel()*110.57]
tree=cKDTree(xy(mlat,mlon)); cells=xy(clat,clon)
dist,idx=tree.query(cells,k=8,distance_upper_bound=20)
cover=dist[:,0]<6   # cells within 6 km of a link midpoint
print('covered cells',int(cover.sum()),'of',len(cells))
def idw(vals):  # vals: (n_links,) -> (ncells,)
    d=dist.copy(); ii=idx.copy(); ok=np.isfinite(d)
    ii[~ok]=0; v=vals[ii]; okv=ok&np.isfinite(v); w=np.where(okv,1/np.maximum(d,0.5)**2,0); v=np.where(okv,v,0)
    s=w.sum(1); return np.where(s>0,(w*v).sum(1)/np.where(s>0,s,1),np.nan)
# hourly radar areal (mm/h) coarse
rad=ar.rainfall_amount.resample(time='1h').sum().load()   # mm per hour (5-min amounts summed)
rad,_=xr.align(rad,Rhc.isel(cml_id=0),join='inner')
radc=np.stack([coarse(rad.values[t]).ravel() for t in range(rad.sizes['time'])])     # (T,ncells)
cmlc=np.stack([idw(Rhc.sel(time=t).values) for t in rad.time.values])              # (T,ncells)
tt=rad.time.values; vmask=tt>=np.datetime64('2018-05-13')
# areal correlation over covered cells, validation hours
a=cmlc[vmask][:,cover].ravel(); b=radc[vmask][:,cover].ravel(); m=np.isfinite(a)&np.isfinite(b)
r_areal=float(np.corrcoef(a[m],b[m])[0,1])
# trigger: >=T mm in any rolling 3h window within a calendar day, per covered cell
def trig(z,T):
    s=np.nan_to_num(z); r3=np.convolve(np.ones(3),np.ones(1))  # placeholder
    cs=np.cumsum(np.vstack([np.zeros((1,s.shape[1])),s]),0); w3=cs[3:]-cs[:-3]   # (T-2,ncells) window ending at t+2
    days=(tt[2:].astype('datetime64[D]'))
    ud=np.unique(days); out=np.zeros((len(ud),s.shape[1]),bool)
    for k,d in enumerate(ud): out[k]=(w3[days==d]>=T).any(0)
    return ud,out
bt={}
for T in (5,10,15):
    ud,tc=trig(cmlc[:,cover],T); _,tr=trig(radc[:,cover],T)
    vd=ud>=np.datetime64('2018-05-13'); tc=tc[vd]; tr=tr[vd]
    h=int((tc&tr).sum()); mi=int((~tc&tr).sum()); fa=int((tc&~tr).sum()); cn=int((~tc&~tr).sum())
    bt[T]=dict(cell_days=int(tc.size),radar_events=h+mi,hits=h,misses=mi,false=fa,agree=round((h+cn)/tc.size,3),pod=round(h/(h+mi),3) if h+mi else None,far=round(fa/(h+fa),3) if h+fa else None)
print('backtest',json.dumps(bt))
metrics=dict(K=round(K,3),hourly_val={k:round(v,3) if isinstance(v,float) else v for k,v in hv.items()},daily_val={k:(round(v,3) if isinstance(v,float) else v) for k,v in dv.items()},
  r_network_mean_val=round(rnet,3),median_r_link_val=round(float(np.median(rl)),3),n_links_r=int(len(rl)),share_links_r_gt_0_7=round(float((rl>0.7).mean()),3),
  r_areal_val=round(r_areal,3),covered_cells=int(cover.sum()),cell_km=round(float(np.median(np.diff(np.sort(cells[:,0])))) ,2),backtest=bt,
  n_links=500,freq_ghz=[round(float(c.frequency.min())/1e9,1),round(float(c.frequency.max())/1e9,1)],len_km=[round(float(c.length.min()),1),round(float(c.length.max()),1)],
  cal_period='2018-05-10..12',val_period='2018-05-13..20')
print(json.dumps(metrics,indent=1))
json.dump(metrics,open(OUT+'final_metrics.json','w'),indent=1)
# save arrays for figures/export
np.savez_compressed(OUT+'areal.npz',tt=tt.astype('datetime64[m]').astype(str),cmlc=cmlc.astype(np.float32),radc=radc.astype(np.float32),cover=cover,clat=clat,clon=clon,mlat=mlat,mlon=mlon)
xr.Dataset(dict(Rhc=Rhc,refh=refh)).to_netcdf(OUT+'hourly.nc')
# storm window (24 h) by network-mean radar
roll=netr.rolling(time=24).sum(); tend=roll.idxmax().values; tstart=tend-np.timedelta64(23,'h')
print('storm',tstart,tend)
R10=Rc.sel(time=slice(tstart-np.timedelta64(59,'m'),tend)).resample(time='10min',label='right',closed='right').mean()
ref10=ref5.sel(time=slice(tstart-np.timedelta64(55,'m'),tend)).resample(time='10min',label='right',closed='right').mean()
R10,ref10=xr.align(R10,ref10,join='inner')
ar10=ar.rainfall_amount.sel(time=slice(tstart-np.timedelta64(55,'m'),tend)).resample(time='10min',label='right',closed='right').sum().load()*6  # mm/h
ar10,_=xr.align(ar10,R10.isel(cml_id=0),join='inner')
# pick a showcase link: heavy rain + high r in storm window
x=R10.values; y=ref10.values; best=None
for i in range(x.shape[0]):
    mm=np.isfinite(x[i])&np.isfinite(y[i])
    if mm.sum()>100 and np.nansum(y[i])>60:
        r=np.corrcoef(x[i][mm],y[i][mm])[0,1]
        if np.isfinite(r) and (best is None or r>best[1]): best=(i,r)
li=best[0]; print('showcase link',li,round(best[1],3),float(c.length[li]),float(c.frequency[li,0])/1e9)
sl=slice(tstart-np.timedelta64(59,'m'),tend)
def ser(da,n=2): return [None if not np.isfinite(v) else round(float(v),n) for v in da]
one=dict(id=str(c.cml_id.values[li]),length=round(float(c.length[li]),2),f=round(float(c.frequency[li,0])/1e9,1),pol=str(c.polarization.values[li,0]),
  t=[str(t)[11:16] for t in trsl.time.sel(time=sl).values[::2]],
  trsl=ser(trsl.isel(cml_id=li,channel_id=0).sel(time=sl).values[::2],1),bl=ser(bl.isel(cml_id=li,channel_id=0).sel(time=sl).values[::2],1),
  wet=[int(v) for v in wet.isel(cml_id=li,channel_id=0).sel(time=sl).values[::2]],
  R=ser(Rc.isel(cml_id=li).sel(time=sl).values[::2],1),
  rt=[str(t)[11:16] for t in ref5.time.sel(time=sl).values],ref=ser(ref5.isel(cml_id=li).sel(time=sl).values,1),
  r_storm=round(float(best[1]),3))
q=lambda arr: base64.b64encode(np.clip(np.rint(np.sqrt(np.nan_to_num(arr,nan=0)/80)*255),0,255).astype(np.uint8).tobytes()).decode()  # sqrt scale 0..80 mm/h
radar_grid=np.stack([coarse(ar10.values[t]) for t in range(ar10.sizes['time'])])
exp=dict(metrics=metrics,
  links=[[round(float(v),4) for v in (c.site_a_latitude[i],c.site_a_longitude[i],c.site_b_latitude[i],c.site_b_longitude[i])]+[round(float(c.length[i]),1),round(float(c.frequency[i,0])/1e9,1)] for i in range(500)],
  t10=[str(t)[:16].replace('T',' ') for t in R10.time.values],
  cml10=q(R10.values.T), ref10=q(ref10.values.T),
  grid=dict(ny=int(ny4),nx=int(nx4),lat=[round(float(v),4) for v in clat.ravel()],lon=[round(float(v),4) for v in clon.ravel()],cover=[int(v) for v in cover]),
  radar10=q(radar_grid.reshape(len(radar_grid),-1)),
  one=one,
  net=dict(t=[str(t)[:13] for t in netc.time.values],c=ser(netc.values,2),r=ser(netr.values,2)),
  scatter=None)
# scatter sample (hourly, validation, either>0.1)
a=Rhc.values[:,val].ravel(); b=refh.values[:,val].ravel(); m=np.isfinite(a)&np.isfinite(b)&((a>0.1)|(b>0.1))
rng=np.random.default_rng(7); sel=rng.choice(np.where(m)[0],size=min(1500,m.sum()),replace=False)
exp['scatter']=[[round(float(a[i]),2),round(float(b[i]),2)] for i in sel]
json.dump(exp,open(OUT+'export.json','w'),separators=(',',':'))
import os; print('export KB',os.path.getsize(OUT+'export.json')//1024)
