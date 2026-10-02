"""Readable CSV copies of the German test data and of every stage of rain_pipeline.py."""
import xarray as xr, numpy as np, pandas as pd, json, os, shutil, warnings, pycomlink as pycml
from scipy.spatial import cKDTree
warnings.filterwarnings('ignore')
P='/usr/local/lib/python3.11/dist-packages/pycomlink/io/example_data/'
OUT='JioMausam_Germany_Data/'; os.makedirs(OUT+'original',exist_ok=True); os.makedirs(OUT+'csv',exist_ok=True)
for f in ['example_cml_data.nc','example_path_averaged_reference_data.nc','example_areal_reference_data.nc']: shutil.copy(P+f,OUT+'original/'+f)
c=xr.open_dataset(P+'example_cml_data.nc').load()
tsl=c.tsl.where(c.tsl!=255.0); rsl=c.rsl.where(c.rsl!=-99.9)
trsl=(tsl-rsl).interpolate_na(dim='time',method='linear',max_gap='5min')
sd=trsl.rolling(time=60,center=True).std(skipna=False)
thr=sd.quantile(0.8,dim='time')*1.12
wet=sd>thr
bl=pycml.processing.baseline.baseline_constant(trsl=trsl,wet=wet,n_average_last_dry=5)
waa=pycml.processing.wet_antenna.waa_schleiss_2013(rsl=trsl,baseline=bl,wet=wet,waa_max=1.5,delta_t=1,tau=15)
A=(trsl-bl-waa); A=A.where(A>=0,0)
Rch=pycml.processing.k_R_relation.calc_R_from_A(A=A,L_km=c.length.astype(float),f_GHz=c.frequency/1e9,pol=c.polarization)
R=Rch.mean('channel_id')
ref5=xr.open_dataset(P+'example_path_averaged_reference_data.nc').rainfall_amount.load().transpose('cml_id','time')*12
refh=ref5.resample(time='1h').mean()
Rh=R.resample(time='1h').mean(); Rh,refh=xr.align(Rh,refh,join='inner'); Rh=Rh.transpose('cml_id','time')
hours=pd.to_datetime(Rh.time.values); cal=hours<'2018-05-13'; val=~cal
K=float(np.nansum(refh.values[:,cal])/np.nansum(Rh.values[:,cal]))
Rhc=Rh.values*K; ref=refh.values
a,b=pycml.processing.k_R_relation.a_b(c.frequency.values.ravel()/1e9,pol=c.polarization.values.ravel(),approx_type='ITU_2005'); a=a.reshape(500,2); b=b.reshape(500,2)
# per-link scores on unseen days
rl=np.full(500,np.nan)
for i in range(500):
    x=Rhc[i,val]; y=ref[i,val]; m=np.isfinite(x)&np.isfinite(y)
    if m.sum()>100 and y[m].sum()>5:
        v=np.corrcoef(x[m],y[m])[0,1]
        if np.isfinite(v): rl[i]=v
links=pd.DataFrame(dict(link_id=np.arange(500),length_km=c.length.values,freq_ch1_GHz=c.frequency.values[:,0]/1e9,freq_ch2_GHz=c.frequency.values[:,1]/1e9,
  polarization_ch1=c.polarization.values[:,0],polarization_ch2=c.polarization.values[:,1],
  site_a_lat=c.site_a_latitude.values,site_a_lon=c.site_a_longitude.values,site_b_lat=c.site_b_latitude.values,site_b_lon=c.site_b_longitude.values,
  itu_a_ch1=a[:,0],itu_b_ch1=b[:,0],itu_a_ch2=a[:,1],itu_b_ch2=b[:,1],
  wet_threshold_ch1_dB=thr.values[:,0] if thr.dims[0]=='cml_id' else thr.transpose('cml_id','channel_id').values[:,0],
  r_unseen_days=rl,ours_mm_unseen=np.nansum(Rhc[:,val],1),radar_mm_unseen=np.nansum(ref[:,val],1),
  ours_uncal_mm_tuning=np.nansum(Rh.values[:,cal],1),radar_mm_tuning=np.nansum(ref[:,cal],1)))
links.round(6).to_csv(OUT+'csv/links.csv',index=False)
print('K',round(K,4),'median r',round(np.nanmedian(rl),3),'share>0.7',round(np.nanmean(rl[np.isfinite(rl)]>0.7),3),'n',np.isfinite(rl).sum())
# hourly tables
ts=[h.strftime('%Y-%m-%d %H:00') for h in hours]
pd.DataFrame(Rhc.T,index=ts,columns=[f'link_{i}' for i in range(500)]).rename_axis('hour_utc').round(4).to_csv(OUT+'csv/our_rain_hourly_mm_per_h.csv')
pd.DataFrame(ref.T,index=ts,columns=[f'link_{i}' for i in range(500)]).rename_axis('hour_utc').round(4).to_csv(OUT+'csv/radar_along_links_hourly_mm_per_h.csv')
net=pd.DataFrame(dict(hour_utc=ts,period=np.where(cal,'tuning','test'),ours_uncalibrated=Rh.values.mean(0),ours_calibrated=Rhc.mean(0),radar=np.nanmean(ref,0)))
net.to_csv(OUT+'csv/network_average_hourly.csv',index=False)
print('network r test',round(np.corrcoef(net.ours_calibrated[val],net.radar[val])[0,1],4))
# minute-by-minute steps for three example links (channel 1)
srt=np.argsort(np.where(np.isfinite(rl),rl,9)); ok=srt[:np.isfinite(rl).sum()]
ex={'best':int(ok[-1]),'typical':int(ok[int(0.5*(len(ok)-1))]),'weak':int(ok[int(0.1*(len(ok)-1))])}
print('example links',ex)
rows=[]
T=pd.to_datetime(c.time.values).strftime('%Y-%m-%d %H:%M')
for lab,i in ex.items():
    g=lambda da: da.transpose('cml_id','channel_id','time').values[i,0] if 'channel_id' in da.dims else da.values[i]
    rows.append(pd.DataFrame(dict(link_id=i,example=lab,minute_utc=T,tsl_dBm=c.tsl.values[0,i] if c.tsl.dims[0]=='channel_id' else c.tsl.values[i,0],
      rsl_dBm=c.rsl.values[0,i] if c.rsl.dims[0]=='channel_id' else c.rsl.values[i,0],
      signal_loss_dB=g(trsl),wobble_60min_std_dB=g(sd),wet_threshold_dB=float(thr.transpose('cml_id','channel_id').values[i,0]),wet=g(wet).astype(int),
      dry_baseline_dB=g(bl),wet_antenna_dB=g(waa),rain_attenuation_dB=g(A),rain_rate_ch1_mm_per_h=g(Rch),link_rain_both_channels_mm_per_h=R.values[i] if R.dims[0]=='cml_id' else R.transpose('cml_id','time').values[i])))
pd.concat(rows).round(4).to_csv(OUT+'csv/three_links_minute_by_minute.csv',index=False)
json.dump(dict(K=K,examples=ex),open('pack_meta.json','w'))
