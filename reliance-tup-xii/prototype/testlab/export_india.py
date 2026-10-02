import glob, json, numpy as np, pandas as pd
G='../india/gsod/'
ST={'43003099999':'Mumbai','43057099999':'Colaba','42867099999':'Nagpur','42647099999':'Ahmedabad'}
d=pd.concat([pd.read_csv(f,usecols=['STATION','DATE','MAX','PRCP','PRCP_ATTRIBUTES']) for f in glob.glob(G+'*.csv')])
d['st']=d.STATION.astype(str).map(ST); d=d.dropna(subset=['st'])
d['DATE']=pd.to_datetime(d.DATE); d['y']=d.DATE.dt.year; d['m']=d.DATE.dt.month; d['doy']=d.DATE.dt.dayofyear-1
cov=d.groupby(['st','y']).agg(n=('DATE','count'),jja=('m',lambda x:((x>=6)&(x<=9)).sum())).reset_index()
keep=d.merge(cov[(cov.n>=330)&(cov.jja>=110)][['st','y']],on=['st','y'])
out={'stations':{}}
for city in ['Mumbai','Nagpur','Ahmedabad']:
    x=keep[keep.st==city]; yrs=sorted(int(v) for v in x.y.unique())
    P=[]; T=[]
    for y in yrs:
        p=[None]*366; t=[None]*366
        for r in x[x.y==y].itertuples():
            if r.PRCP<99: p[r.doy]=int(round(r.PRCP*100))
            if r.MAX<9999: t[r.doy]=int(round(r.MAX*10))
        P.append(p); T.append(t)
    out['stations'][city]=dict(years=yrs,prcp=P,tmax=T)
# Santacruz vs Colaba, monsoon days where both stations filed a complete rain report
OKF=['G','D','E','F','C','B','A','H']
a=d[d.st=='Mumbai'].set_index('DATE'); b=d[d.st=='Colaba'].set_index('DATE')
for z in (a,b): z['ok']=z.PRCP_ATTRIBUTES.fillna('').str.strip().isin(OKF)&(z.PRCP<99)
m=a[['PRCP','ok']].join(b[['PRCP','ok']],lsuffix='_s',rsuffix='_c',how='inner')
m=m[(m.index.month>=6)&(m.index.month<=9)&m.ok_s&m.ok_c]
out['pairs']=[[str(i.date()),int(round(r.PRCP_s*100)),int(round(r.PRCP_c*100))] for i,r in m.iterrows()]
s=json.dumps(out,separators=(',',':')); open('india-data.json','w').write(s)
print('KB',len(s)//1024,'pairs',len(out['pairs']))
