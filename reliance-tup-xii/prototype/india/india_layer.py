"""India layer for JioMausam: trigger frequencies and city pricing from 25 years of IMD station reports.

Data: NOAA Global Summary of the Day (GSOD), which archives IMD synoptic station reports, via NOAA open data on AWS:
  https://noaa-gsod-pds.s3.amazonaws.com/{year}/{station}.csv
Stations: Mumbai Santacruz 43003099999, Mumbai Colaba 43057099999, Nagpur 42867099999, Ahmedabad 42647099999.
Pricing: payout Rs 300 per trigger day, capped at 5 days a year, 60% target loss ratio.
"""
import glob, json, os, urllib.request
import numpy as np, pandas as pd

ST = {'43003099999': 'Mumbai', '43057099999': 'Colaba', '42867099999': 'Nagpur', '42647099999': 'Ahmedabad'}
os.makedirs('gsod', exist_ok=True)
for s in ST:
    for y in range(2000, 2025):
        f = f'gsod/{s}-{y}.csv'
        if not os.path.exists(f):
            try: urllib.request.urlretrieve(f'https://noaa-gsod-pds.s3.amazonaws.com/{y}/{s}.csv', f)
            except Exception: pass

d = pd.concat([pd.read_csv(f, usecols=['STATION', 'DATE', 'MAX', 'PRCP', 'PRCP_ATTRIBUTES']) for f in glob.glob('gsod/*.csv')])
d['DATE'] = pd.to_datetime(d.DATE); d['y'] = d.DATE.dt.year; d['m'] = d.DATE.dt.month
d['mm'] = np.where(d.PRCP < 99, d.PRCP * 25.4, np.nan)          # inches -> mm, 99.99 = missing
d['tmax'] = np.where(d.MAX < 9999, (d.MAX - 32) * 5 / 9, np.nan)  # F -> C
d['st'] = d.STATION.astype(str).map(ST)
cov = d.groupby(['st', 'y']).agg(n=('DATE', 'count'), jja=('m', lambda x: ((x >= 6) & (x <= 9)).sum())).reset_index()
d = d.merge(cov[(cov.n >= 330) & (cov.jja >= 110)][['st', 'y']], on=['st', 'y'])   # keep well-covered years only

PAY, CAP, LR = 300, 5, 0.6
for city in ['Mumbai', 'Nagpur', 'Ahmedabad']:
    x = d[d.st == city]; yrs = sorted(x.y.unique())
    print(city, f'{yrs[0]}-{yrs[-1]}', 'median annual rain', round(x.groupby('y').mm.sum().median()), 'mm')
    for kind, col, ths in [('rain', 'mm', [64.5, 115.6, 204.5]), ('heat', 'tmax', [44, 45, 46, 47])]:
        for th in ths:
            per = x.groupby('y')[col].apply(lambda s: (s >= th).sum()).reindex(yrs, fill_value=0)
            prem = per.clip(upper=CAP).mean() * PAY / LR / 12
            print(f'  {kind} >= {th}: {per.mean():.2f} days/yr -> Rs {prem:.0f}/month')
