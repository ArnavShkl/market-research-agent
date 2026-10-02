"""Stress test for Mausam Kavach: replay every year 2000-2024 as if the product had been sold that year.

Uses the same IMD station reports and cleaning as india_layer.py (run that first to download gsod/).
For each product: price from the 25-year average, then each year's payouts / premiums = that year's loss ratio.
"""
import glob, json
import numpy as np, pandas as pd

ST = {'43003099999': 'Mumbai', '42867099999': 'Nagpur', '42647099999': 'Ahmedabad'}
d = pd.concat([pd.read_csv(f, usecols=['STATION', 'DATE', 'MAX', 'PRCP']) for f in glob.glob('gsod/*.csv')])
d['st'] = d.STATION.astype(str).map(ST); d = d.dropna(subset=['st'])
d['DATE'] = pd.to_datetime(d.DATE); d['y'] = d.DATE.dt.year; d['m'] = d.DATE.dt.month
d['mm'] = np.where(d.PRCP < 99, d.PRCP * 25.4, np.nan)          # inches -> mm, 99.99 = missing
d['tmax'] = np.where(d.MAX < 9999, (d.MAX - 32) * 5 / 9, np.nan)  # F -> C
cov = d.groupby(['st', 'y']).agg(n=('DATE', 'count'), jja=('m', lambda x: ((x >= 6) & (x <= 9)).sum())).reset_index()
d = d.merge(cov[(cov.n >= 330) & (cov.jja >= 110)][['st', 'y']], on=['st', 'y'])   # keep well-covered years only

PAY, LR = 300, 0.6
PRODUCTS = [('Mumbai Basic (>=204.5mm)', 'Mumbai', 'mm', 204.5, 5),
            ('Nagpur Basic (>=47C)', 'Nagpur', 'tmax', 47, 5),
            ('Ahmedabad Basic (>=47C)', 'Ahmedabad', 'tmax', 47, 5),
            ('Mumbai Plus cap5 (>=64.5mm)', 'Mumbai', 'mm', 64.5, 5),
            ('Mumbai Plus cap3 (>=64.5mm)', 'Mumbai', 'mm', 64.5, 3)]
out = {}
for label, city, col, th, cap in PRODUCTS:
    x = d[d.st == city]; yrs = sorted(x.y.unique())
    days = x.groupby('y')[col].apply(lambda s: (s >= th).sum()).reindex(yrs, fill_value=0)
    paid = days.clip(upper=cap)
    prem_year = paid.mean() * PAY / LR                 # premium per person per year
    lr = paid * PAY / prem_year                        # each year's loss ratio
    w = int(days[lr == lr.max()].idxmax())          # worst year; ties go to the year with most extreme days
    out[label] = dict(label=label, mean_days=round(float(days.mean()), 2), mean_capped=round(float(paid.mean()), 2),
                      premium_month=round(prem_year / 12), worst_year=w, worst_days=int(days[w]), worst_paid_days=int(paid[w]),
                      worst_loss_ratio=round(float(lr[w]), 2), years_over_100pct=int((lr > 1).sum()), n_years=len(yrs),
                      max_payout_per_person=cap * PAY)
    print(f"{label}: Rs {prem_year/12:.0f}/month, worst {w} loss ratio {lr[w]:.0%}, {int((lr > 1).sum())} of {len(yrs)} years over 100%")
json.dump(out, open('stress_test.json', 'w'), indent=1)
