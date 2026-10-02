import xarray as xr, numpy as np, pandas as pd, json, glob
from scipy.spatial import cKDTree
P='/usr/local/lib/python3.11/dist-packages/pycomlink/io/example_data/'; OUT='JioMausam_Germany_Data/csv/'
c=xr.open_dataset(P+'example_cml_data.nc')
Rh=np.load('../lab/py_Rh.npy'); K=json.load(open('pack_meta.json'))['K']; Rhc=Rh*K
ar=xr.open_dataset(P+'example_areal_reference_data.nc'); lat2=ar.latitudes.values; lon2=ar.longitudes.values
f=4; ny,nx=lat2.shape; ny4,nx4=ny//f,nx//f
def coarse(z): return z[:ny4*f,:nx4*f].reshape(ny4,f,nx4,f).mean(axis=(1,3))
clat=coarse(lat2); clon=coarse(lon2)
mlat=((c.site_a_latitude+c.site_b_latitude)/2).values; mlon=((c.site_a_longitude+c.site_b_longitude)/2).values
lat0=np.deg2rad(np.mean(mlat))
def xy(lat,lon): return np.c_[lon.ravel()*111.32*np.cos(lat0), lat.ravel()*110.57]
tree=cKDTree(xy(mlat,mlon)); cells=xy(clat,clon); dist,idx=tree.query(cells,k=8,distance_upper_bound=20); cover=dist[:,0]<6
def idw(vals):
    d=dist.copy(); ii=idx.copy(); ok=np.isfinite(d); ii[~ok]=0; v=vals[ii]; okv=ok&np.isfinite(v); w=np.where(okv,1/np.maximum(d,0.5)**2,0); v=np.where(okv,v,0)
    s=w.sum(1); return np.where(s>0,(w*v).sum(1)/np.where(s>0,s,1),np.nan)
rad=ar.rainfall_amount.resample(time='1h').sum().load(); tt=rad.time.values
radc=np.stack([coarse(rad.values[t]).ravel() for t in range(len(tt))])[:,cover]
cmlc=np.stack([idw(Rhc[:,t]) for t in range(len(tt))])[:,cover]
def max3(z):
    s=np.nan_to_num(z); cs=np.cumsum(np.vstack([np.zeros((1,s.shape[1])),s]),0); w3=cs[3:]-cs[:-3]; days=tt[2:].astype('datetime64[D]')
    ud=np.unique(days); return ud,np.stack([w3[days==d].max(0) for d in ud])
ud,mo=max3(cmlc); _,mr=max3(radc); keep=ud>=np.datetime64('2018-05-13')
ci=np.where(cover)[0]; rows=[]
for k in np.where(keep)[0]:
    for j in range(len(ci)): rows.append((int(ci[j]),int(ci[j]//nx4),int(ci[j]%nx4),str(ud[k]),mo[k,j],mr[k,j]))
df=pd.DataFrame(rows,columns=['square_id','grid_row','grid_col','day','ours_max_3h_rain_mm','radar_max_3h_rain_mm'])
df.to_csv(OUT+'payout_decisions_test_days.csv',index=False,float_format='%.17g')
for T in (5,10,15):
    o=df.ours_max_3h_rain_mm>=T; r=df.radar_max_3h_rain_mm>=T; h=(o&r).sum(); mi=(~o&r).sum(); fa=(o&~r).sum()
    print(T,'rows',len(df),'hit',h,'miss',mi,'false',fa,'agree',round(((o==r).mean()),3),'pod',round(h/(h+mi),3),'far',round(fa/(h+fa),3))
# India daily IMD records (cleaned, well-covered years)
G='../india/gsod/'; ST={'43003099999':'Mumbai','42867099999':'Nagpur','42647099999':'Ahmedabad','43057099999':'Mumbai Colaba'}
d=pd.concat([pd.read_csv(f,usecols=['STATION','DATE','MAX','PRCP','PRCP_ATTRIBUTES']) for f in glob.glob(G+'*.csv')])
d['city']=d.STATION.astype(str).map(ST); d=d.dropna(subset=['city']); d['DATE']=pd.to_datetime(d.DATE); d['year']=d.DATE.dt.year; d['m']=d.DATE.dt.month
d['rain_mm']=np.where(d.PRCP<99,d.PRCP*25.4,np.nan); d['max_temp_C']=np.where(d.MAX<9999,(d.MAX-32)*5/9,np.nan)
cov=d.groupby(['city','year']).agg(n=('DATE','count'),jja=('m',lambda x:((x>=6)&(x<=9)).sum())).reset_index()
d=d.merge(cov[(cov.n>=330)&(cov.jja>=110)][['city','year']],on=['city','year'])
d=d[d.city!='Mumbai Colaba'].sort_values(['city','DATE'])
d['station']=d.STATION.astype(str); d['date']=d.DATE.dt.strftime('%Y-%m-%d')
d[['city','station','date','year','rain_mm','max_temp_C','PRCP','MAX']].rename(columns={'PRCP':'raw_rain_inches','MAX':'raw_max_temp_F'}).to_csv('../datapack/india_daily_imd.csv',index=False,float_format='%.17g')
print('india rows',len(d))
