import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, numpy as np, pandas as pd, json, io, xarray as xr
from scipy.spatial import cKDTree
plt.rcParams.update({'svg.fonttype':'none','font.family':'DM Sans','font.size':8.5,'axes.edgecolor':'#BFC3CC','axes.labelcolor':'#5A6480','xtick.color':'#5A6480','ytick.color':'#5A6480',
  'axes.spines.top':False,'axes.spines.right':False,'axes.grid':True,'grid.color':'#ECEAE4','grid.linewidth':0.7,'axes.axisbelow':True,'legend.frameon':False,'axes.titlesize':9,'axes.titleweight':'bold','axes.titlecolor':'#0E1424','axes.titlelocation':'left'})
OURS='#2a78d6'; RAD='#eb6834'; CRIT='#d03b3b'; INK='#0E1424'; MU='#5A6480'; WET='#EAF2FC'; AMB='#D9850F'
D='../datapack/JioMausam_Germany_Data/csv/'; OUT={}
def save(name,fig):
    b=io.StringIO(); fig.savefig(b,format='svg',bbox_inches='tight',transparent=True); plt.close(fig)
    s=b.getvalue(); s=s[s.index('<svg'):]; OUT[name]=s
m=pd.read_csv(D+'three_links_minute_by_minute.csv'); t=m[(m.example=='typical')&(m.minute_utc.str.startswith('2018-05-13'))].reset_index(drop=True)
x=np.arange(len(t))/60
# F1 signal + wobble
fig,(a1,a2)=plt.subplots(2,1,figsize=(6.6,3.5),sharex=True,gridspec_kw={'height_ratios':[2.2,1]})
w=t.wet.values
for ax in (a1,a2):
    st=None
    for i in range(len(w)+1):
        on=i<len(w) and w[i]==1
        if on and st is None: st=i
        if not on and st is not None: ax.axvspan(st/60,i/60,color=WET,lw=0); st=None
a1.plot(x,t.signal_loss_dB,color=INK,lw=0.8,label='Signal loss (sent minus received)')
a1.plot(x,t.dry_baseline_dB,color=AMB,lw=1.4,ls='--',label='Dry baseline')
a1.set_ylabel('dB'); a1.legend(loc='upper left',fontsize=7.5,ncol=2); a1.set_title('Link 359 on 13 May 2018: what the tower sees, minute by minute')
a2.plot(x,t.wobble_60min_std_dB,color=OURS,lw=0.9,label='Wobble: spread of the signal over the surrounding hour')
a2.axhline(t.wet_threshold_dB.iloc[0],color=CRIT,lw=1.1,label=f'Wet threshold {t.wet_threshold_dB.iloc[0]:.2f} dB')
a2.set_ylim(0,1.5); a2.set_ylabel('dB'); a2.legend(loc='upper left',fontsize=7.2,ncol=2)
a2.set_xticks(range(0,25,3)); a2.set_xticklabels([f'{h:02d}:00' for h in range(0,25,3)]); a2.set_xlim(0,24)
save('sig',fig)
# F2 rain hourly link 359
o=pd.read_csv(D+'our_rain_hourly_mm_per_h.csv',index_col=0); r=pd.read_csv(D+'radar_along_links_hourly_mm_per_h.csv',index_col=0)
oo=o.loc['2018-05-13 00:00':'2018-05-13 23:00','link_359'].values; rr=r.loc['2018-05-13 00:00':'2018-05-13 23:00','link_359'].values
fig,ax=plt.subplots(figsize=(6.6,2.1)); h=np.arange(24)
ax.plot(h,rr,color=RAD,lw=2,marker='o',ms=3.2,label='Radar along the path'); ax.plot(h,oo,color=OURS,lw=2,marker='o',ms=3.2,label='Ours, from the signal only')
ax.set_xticks(range(0,24,3)); ax.set_xticklabels([f'{v:02d}:00' for v in range(0,24,3)]); ax.set_ylabel('mm per hour'); ax.legend(loc='upper left',fontsize=7.5); ax.set_xlim(-0.5,23.5); ax.set_ylim(0)
ax.set_title('Link 359, hourly rain on 13 May: our estimate vs radar'); save('rain359',fig)
# F3 network series
n=pd.read_csv(D+'network_average_hourly.csv'); hh=np.arange(len(n))
fig,ax=plt.subplots(figsize=(6.6,2.3)); ax.axvspan(0,72,color='#F3F1EC',lw=0); ax.text(2,1.95,'Tuning days',color=MU,fontsize=7.5,fontweight='bold'); ax.text(75,1.95,'Unseen test days',color=MU,fontsize=7.5,fontweight='bold')
ax.plot(hh,n.radar,color=RAD,lw=1.4,label='Radar'); ax.plot(hh,n.ours_calibrated,color=OURS,lw=1.4,label='Ours, from 500 links')
ax.set_xticks(np.arange(12,264,24)); ax.set_xticklabels([f'{10+i} May' for i in range(11)],fontsize=7); ax.set_ylabel('mm per hour'); ax.set_ylim(0,2.1); ax.set_xlim(0,263)
ax.legend(loc='upper right',fontsize=7.5,ncol=2,bbox_to_anchor=(1,1.02)); ax.set_title('Network average, every hour'); save('net',fig)
# F4 scatter test hours
te=n[n.period=='test']; rv=np.corrcoef(te.ours_calibrated,te.radar)[0,1]
fig,ax=plt.subplots(figsize=(3.1,2.9)); ax.plot([0,2],[0,2],color='#BFC3CC',lw=1,ls='--'); ax.scatter(te.radar,te.ours_calibrated,s=10,color=OURS,alpha=.75,edgecolor='white',lw=.4)
ax.set_xlabel('Radar (mm/h)'); ax.set_ylabel('Ours (mm/h)'); ax.set_xlim(0,2); ax.set_ylim(0,2); ax.set_aspect('equal'); ax.set_title(f'192 test hours, r = {rv:.3f}'); ax.text(1.25,1.05,'perfect\nagreement',color=MU,fontsize=7,rotation=0)
save('scatter',fig)
# F5 histogram of link r
lk=pd.read_csv(D+'links.csv'); rl=lk.r_unseen_days.dropna()
fig,ax=plt.subplots(figsize=(3.3,2.9)); ax.hist(rl,bins=np.arange(0.3,1.0001,0.025),color=OURS,edgecolor='white',lw=.6)
ax.axvline(rl.median(),color=INK,lw=1.2); ax.text(rl.median()-0.01,ax.get_ylim()[1]*0.92,f'median {rl.median():.2f}',ha='right',fontsize=7.5,color=INK)
ax.axvline(0.7,color=CRIT,lw=1,ls='--'); ax.text(0.69,ax.get_ylim()[1]*0.75,f'{(rl>0.7).mean():.0%} of links\nabove 0.7 →',ha='right',fontsize=7.2,color=CRIT)
ax.set_xlabel('Correlation with radar, unseen days'); ax.set_ylabel('Number of links'); ax.set_title(f'{len(rl)} links scored one by one'); save('hist',fig)
# F6 illustrations of r
rng=np.random.default_rng(3); fig,axs=plt.subplots(1,3,figsize=(6.6,2.0))
for ax,(tr,lab) in zip(axs,[(0.95,'r ≈ 0.95'),(0.6,'r ≈ 0.6'),(0.0,'r ≈ 0')]):
    xx=rng.normal(size=80); yy=tr*xx+np.sqrt(1-tr**2)*rng.normal(size=80); ax.scatter(xx,yy,s=8,color=OURS,alpha=.8,edgecolor='white',lw=.3)
    ax.set_xticks([]); ax.set_yticks([]); ax.set_title(f'{lab}  (real r {np.corrcoef(xx,yy)[0,1]:.2f})',fontsize=8)
save('illus',fig)
# F7 maps at the storm hour
P='/usr/local/lib/python3.11/dist-packages/pycomlink/io/example_data/'
c=xr.open_dataset(P+'example_cml_data.nc'); ar=xr.open_dataset(P+'example_areal_reference_data.nc')
lat2=ar.latitudes.values; lon2=ar.longitudes.values; f=4; ny,nx=lat2.shape; ny4,nx4=ny//f,nx//f
coarse=lambda z: z[:ny4*f,:nx4*f].reshape(ny4,f,nx4,f).mean(axis=(1,3))
clat=coarse(lat2); clon=coarse(lon2); mlat=((c.site_a_latitude+c.site_b_latitude)/2).values; mlon=((c.site_a_longitude+c.site_b_longitude)/2).values
lat0=np.deg2rad(np.mean(mlat)); xy=lambda la,lo: np.c_[np.asarray(lo).ravel()*111.32*np.cos(lat0), np.asarray(la).ravel()*110.57]
tree=cKDTree(xy(mlat,mlon)); cells=xy(clat,clon); dist,idx=tree.query(cells,k=8,distance_upper_bound=20); cover=dist[:,0]<6
K=json.load(open('../datapack/pack_meta.json'))['K']; Rh=np.load('../lab/py_Rh.npy')*K
H=list(n.hour_utc).index('2018-05-13 21:00')
def idw(v):
    d=dist.copy(); ii=idx.copy(); ok=np.isfinite(d); ii[~ok]=0; vv=v[ii]; okv=ok&np.isfinite(vv); wgt=np.where(okv,1/np.maximum(d,0.5)**2,0); vv=np.where(okv,vv,0); s=wgt.sum(1); return np.where(s>0,(wgt*vv).sum(1)/np.where(s>0,s,1),np.nan)
ours=idw(Rh[:,H]); rad=coarse(ar.rainfall_amount.resample(time='1h').sum().values[H]).ravel()
from matplotlib.colors import BoundaryNorm, ListedColormap
cm=ListedColormap(['#F1F3F7','#cde2fb','#9ec5f4','#6da7ec','#3987e5','#1c5cab','#0d366b']); nb=BoundaryNorm([0,0.1,0.5,1,2,5,10,100],cm.N)
fig,axs=plt.subplots(1,2,figsize=(6.6,3.2)); C=cells[cover]
A=xy(c.site_a_latitude.values,c.site_a_longitude.values); B=xy(c.site_b_latitude.values,c.site_b_longitude.values)
for ax,v,tt in [(axs[0],ours[cover],'Our map, from 500 links only'),(axs[1],rad[cover],'Radar (the answer key)')]:
    sc=ax.scatter(C[:,0],C[:,1],c=np.nan_to_num(v),cmap=cm,norm=nb,marker='s',s=9.5,lw=0)
    ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([]); ax.grid(False); [s.set_visible(False) for s in ax.spines.values()]; ax.set_title(tt,fontsize=8.5)
for i in range(500): axs[0].plot([A[i,0],B[i,0]],[A[i,1],B[i,1]],color=INK,lw=0.35,alpha=.35)
cb=fig.colorbar(sc,ax=axs,orientation='horizontal',fraction=0.05,pad=0.03,ticks=[0.1,0.5,1,2,5,10]); cb.set_label('Rain, mm per hour (13 May 2018, 21:00 UTC)',color=MU); cb.outline.set_visible(False)
save('maps',fig)
# F8 trade-off
p=pd.read_csv(D+'payout_decisions_test_days.csv'); Ts=np.arange(3,20.5,0.5); pod=[];far=[];agr=[]
for T in Ts:
    a_=p.ours_max_3h_rain_mm>=T; b_=p.radar_max_3h_rain_mm>=T; hit=(a_&b_).sum(); mi=(~a_&b_).sum(); fa=(a_&~b_).sum(); pod.append(hit/(hit+mi)); far.append(fa/(hit+fa)); agr.append((a_==b_).mean())
fig,ax=plt.subplots(figsize=(6.6,2.3)); ax.plot(Ts,np.array(agr)*100,color=MU,lw=1.4,label='Decisions that agree'); ax.plot(Ts,np.array(pod)*100,color=OURS,lw=2,label='Radar events caught'); ax.plot(Ts,np.array(far)*100,color=CRIT,lw=2,label='Our triggers radar did not confirm')
ax.axvline(10,color=INK,lw=1,ls=':'); ax.text(10.2,8,'our trigger: 10 mm in 3 h',fontsize=7.2,color=INK)
ax.set_xlabel('Trigger: rain in any 3 hours (mm)'); ax.set_ylabel('%'); ax.set_ylim(0,100); ax.legend(loc='upper center',bbox_to_anchor=(0.5,-0.28),ncol=3,fontsize=7.4); ax.set_title('Moving the trigger trades events caught against false triggers'); save('trade',fig)
# F9 Mumbai trigger days per year
d=pd.read_csv('../datapack/india_daily_imd.csv'); mu=d[d.city=='Mumbai']; per=mu.groupby('year').rain_mm.apply(lambda s:(s>=64.5).sum())
fig,ax=plt.subplots(figsize=(6.6,2.3)); ax.bar(per.index,per.values,color=OURS,width=0.72); ax.axhline(5,color=CRIT,lw=1.3); ax.text(1999.6,5.6,'cap: 5 paid days a year',color=CRIT,fontsize=7.4)
ax.axhline(per.mean(),color=INK,lw=1,ls='--'); ax.text(1999.6,per.mean()+0.6,f'average {per.mean():.1f} days',fontsize=7.4,color=INK)
ax.set_xticks(range(2000,2025,4)); ax.set_ylabel('days'); ax.set_title('Mumbai (Santacruz): days with 64.5 mm or more of rain, each year'); save('mumbai',fig)
# F10 stress small multiples
S=[('Mumbai Basic · 204.5 mm+','Mumbai','rain_mm',204.5),('Nagpur heat · 47°C+','Nagpur','max_temp_C',47),('Ahmedabad heat · 47°C+','Ahmedabad','max_temp_C',47)]
fig,axs=plt.subplots(1,3,figsize=(6.6,2.2),sharey=True)
for ax,(lab,city,col,th) in zip(axs,S):
    x_=d[d.city==city]; dd=x_.groupby('year')[col].apply(lambda s:(s>=th).sum()); pdy=dd.clip(upper=5); prem=pdy.mean()*300/0.6; lr=pdy*300/prem
    ax.bar(lr.index,lr.values*100,color=[CRIT if v>1 else OURS for v in lr.values],width=0.75); ax.axhline(100,color=INK,lw=1); ax.axhline(60,color=AMB,lw=1,ls='--')
    ax.set_title(lab,fontsize=8); ax.set_xticks([2000,2012,2024]); ax.tick_params(labelsize=7)
axs[0].set_ylabel('claims ÷ premiums (%)')
save('stress',fig)
json.dump(OUT,open('charts.json','w')); print({k:len(v)//1024 for k,v in OUT.items()})
