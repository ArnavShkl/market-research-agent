"""Export the real datasets for the JioMausam Test Lab (browser re-run of rain_pipeline.py)."""
import xarray as xr, numpy as np, json, gzip, warnings, pycomlink as pycml
from scipy.spatial import cKDTree
warnings.filterwarnings('ignore')
P='/usr/local/lib/python3.11/dist-packages/pycomlink/io/example_data/'
c=xr.open_dataset(P+'example_cml_data.nc').load()
tsl=c.tsl.where(c.tsl!=255.0); rsl=c.rsl.where(c.rsl!=-99.9)
raw=(tsl-rsl).transpose('cml_id','channel_id','time')
q=np.where(np.isfinite(raw.values),np.round(raw.values*10),0).astype(np.uint16)
nL,nC,nT=q.shape
a,b=pycml.processing.k_R_relation.a_b(c.frequency.values.ravel()/1e9,pol=c.polarization.values.ravel(),approx_type='ITU_2005')
a=a.reshape(nL,nC); b=b.reshape(nL,nC)
ref5=xr.open_dataset(P+'example_path_averaged_reference_data.nc').rainfall_amount.load().transpose('cml_id','time')*12
refh=ref5.resample(time='1h').mean()
hours=refh.time.values; nH=len(hours)
assert nH==264 and str(hours[0])[:16]=='2018-05-10T00:00'
ar=xr.open_dataset(P+'example_areal_reference_data.nc')
lat2=ar.latitudes.values; lon2=ar.longitudes.values
f=4; ny,nx=lat2.shape; ny4,nx4=ny//f,nx//f
def coarse(z): return z[:ny4*f,:nx4*f].reshape(ny4,f,nx4,f).mean(axis=(1,3))
clat=coarse(lat2); clon=coarse(lon2)
mlat=((c.site_a_latitude+c.site_b_latitude)/2).values; mlon=((c.site_a_longitude+c.site_b_longitude)/2).values
lat0=np.deg2rad(np.mean(mlat))
def xy(lat,lon): return np.c_[np.asarray(lon).ravel()*111.32*np.cos(lat0), np.asarray(lat).ravel()*110.57]
tree=cKDTree(xy(mlat,mlon)); cells=xy(clat,clon)
dist,idx=tree.query(cells,k=8,distance_upper_bound=20)
cover=dist[:,0]<6
rad=ar.rainfall_amount.resample(time='1h').sum().load()
assert np.array_equal(rad.time.values,hours)
radc=np.stack([coarse(rad.values[t]).ravel() for t in range(nH)])[:,cover]
ci=np.where(cover)[0]
d8=dist[cover]; i8=idx[cover]; ok=np.isfinite(d8)
d8=np.where(ok,d8,-1.0); i8=np.where(ok,i8,0)
# geometry for drawing (km, origin at min)
A=xy(c.site_a_latitude.values,c.site_a_longitude.values); B=xy(c.site_b_latitude.values,c.site_b_longitude.values)
C=cells[cover]; x0=min(A[:,0].min(),B[:,0].min(),C[:,0].min()); y0=min(A[:,1].min(),B[:,1].min(),C[:,1].min())
# binary bundle
parts=[('sig',q.ravel().astype('<u2')),('refh',refh.values.astype('<f4').ravel()),('radc',radc.astype('<f4').ravel()),('d8',d8.astype('<f8').ravel()),('i8',i8.astype('<u2').ravel())]
off=0; layout={}; blob=b''
for name,arr in parts:
    pad=(-off)%8; blob+=b'\0'*pad; off+=pad
    layout[name]=dict(offset=off,length=int(arr.size),dtype=arr.dtype.str); bb=arr.tobytes(); blob+=bb; off+=len(bb)
open('testlab-data.bin','wb').write(gzip.compress(blob,9))
meta=dict(nL=nL,nC=nC,nT=nT,nH=nH,start='2018-05-10T00:00',calDefault=3,nCells=int(cover.sum()),gridShape=[ny4,nx4],
  cellRC=[[int(i//nx4),int(i%nx4)] for i in ci],
  a=a.tolist(),b=b.tolist(),L=c.length.values.astype(float).tolist(),
  fGHz=np.round(c.frequency.values[:,0]/1e9,2).tolist(),
  seg=np.round(np.c_[A[:,0]-x0,A[:,1]-y0,B[:,0]-x0,B[:,1]-y0],2).tolist(),
  cellXY=np.round(np.c_[C[:,0]-x0,C[:,1]-y0],2).tolist(),layout=layout,rawBytes=len(blob))
json.dump(meta,open('testlab-meta.json','w'),separators=(',',':'))
print('bin gz MB',round(len(open('testlab-data.bin','rb').read())/1e6,2),'meta KB',len(json.dumps(meta,separators=(',',':')))//1024,'cells',meta['nCells'],'grid',ny4,nx4)

# Python reference (not shipped): uncalibrated hourly rain per link with default settings, for verifying the browser engine
trsl=(tsl-rsl).interpolate_na(dim='time',method='linear',max_gap='5min')
sd=trsl.rolling(time=60,center=True).std(skipna=False)
wet=sd>sd.quantile(0.8,dim='time')*1.12
bl=pycml.processing.baseline.baseline_constant(trsl=trsl,wet=wet,n_average_last_dry=5)
waa=pycml.processing.wet_antenna.waa_schleiss_2013(rsl=trsl,baseline=bl,wet=wet,waa_max=1.5,delta_t=1,tau=15)
Aa=(trsl-bl-waa); Aa=Aa.where(Aa>=0,0)
R=pycml.processing.k_R_relation.calc_R_from_A(A=Aa,L_km=c.length.astype(float),f_GHz=c.frequency/1e9,pol=c.polarization).mean('channel_id')
Rh=R.resample(time='1h').mean().transpose('cml_id','time')
assert np.array_equal(Rh.time.values,hours)
np.save('py_Rh.npy',Rh.values)
np.save('py_wet_link0.npy',wet.transpose('cml_id','channel_id','time').values[:3])
print('saved reference')
