INDIA = r"""
<h3>6.1 The data</h3>
<ul><li><b>Source:</b> NOAA’s Global Summary of the Day, the public archive of daily reports from IMD’s weather (synoptic) stations: <i>noaa-gsod-pds.s3.amazonaws.com/{year}/{station}.csv</i>. Public domain.</li>
<li><b>Stations:</b> Mumbai Santacruz 43003099999 · Mumbai Colaba 43057099999 · Nagpur Sonegaon 42867099999 · Ahmedabad airport 42647099999. Years 2000–2024.</li>
<li><b>Fields:</b> daily rainfall (inches × 25.4 = mm) and daily maximum temperature ((°F − 32) × 5/9 = °C). Codes 99.99 and 9999.9 mean missing.</li>
<li><b>Quality rule:</b> keep a year only if it has ≥330 days of reports and ≥110 in June–September. All 25 years passed for every city: 27,103 days in total.</li>
<li><b>Caveat:</b> a missing day counts as “no trigger”, so if anything we slightly undercount events.</li></ul>

<h3>6.2 The triggers</h3>
<table class="small"><tr><th>Trigger</th><th>Where it comes from</th></tr>
<tr><td>≥64.5 mm in a day</td><td>IMD’s “heavy rain” category</td></tr>
<tr><td>≥115.6 mm in a day</td><td>IMD’s “very heavy rain” category</td></tr>
<tr><td>≥204.5 mm in a day</td><td>IMD’s “extremely heavy rain” category</td></tr>
<tr><td>≥47°C maximum</td><td>Our choice of a rare-heat level (45°C, close to IMD’s heatwave level, happens too often to insure cheaply)</td></tr></table>
<p>Median yearly rainfall for context: Mumbai 2,666 mm · Nagpur 1,047 mm · Ahmedabad 859 mm.</p>

<h3>6.3 Counting days and the price formula</h3>
<p>For each year, count the days at or above the trigger. Paid days are capped at 5 a year. Average over 25 years = expected paid days. Then:</p>
<div class="formula">Monthly price = expected paid days × ₹300 ÷ 0.60 ÷ 12</div>
<ul><li><b>₹300</b> = the fixed payout per trigger day (prototype assumption, about part of a day’s earnings).</li>
<li><b>0.60</b> = target loss ratio: of every ₹100 of premium, ₹60 goes back as payouts, ₹40 covers the insurer’s costs and margin (assumption).</li>
<li><b>÷ 12</b> turns a yearly premium into a monthly one.</li></ul>
<table class="small"><tr><th>Product</th><th>Trigger</th><th>Days a year</th><th>Paid days</th><th>Working</th><th>Price a month</th></tr>
<tr><td>Mumbai Basic</td><td>≥204.5 mm</td><td>1.08</td><td>1.08</td><td>1.08 × 300 = 324 → ÷ 0.6 = 540 → ÷ 12</td><td><b>₹45</b></td></tr>
<tr><td>Nagpur Basic</td><td>≥47°C</td><td>2.20</td><td>1.24</td><td>1.24 × 300 = 372 → 620 → ÷ 12 (2013 alone had 14 hot days; only 5 count)</td><td><b>₹52</b></td></tr>
<tr><td>Ahmedabad Basic</td><td>≥47°C</td><td>0.72</td><td>0.64</td><td>0.64 × 300 = 192 → 320 → ÷ 12 = ₹27 → raised to our minimum</td><td><b>₹29</b></td></tr>
<tr><td>Mumbai Plus</td><td>≥64.5 mm</td><td>11.88</td><td>5.00</td><td>Every year has ≥5 heavy days: 5 × 300 = 1,500 → 2,500 → ÷ 12</td><td><b>₹208</b></td></tr></table>
{fig:mumbai}
<table class="small"><tr><th>What if…</th><th>Price</th><th>Why we didn’t choose it</th></tr>
<tr><td>Plus with a 3-day cap</td><td>₹125</td><td>A cheaper option to offer platforms; kept as a variant</td></tr>
<tr><td>Mumbai at “very heavy” (≥115.6 mm, 4.4 days a year)</td><td>₹165</td><td>A middle option</td></tr>
<tr><td>Nagpur at 45°C (9.7 days a year)</td><td>₹168</td><td>Too expensive for individuals</td></tr>
<tr><td>Ahmedabad at 45°C (5.4 days a year)</td><td>₹100</td><td>Too expensive for individuals</td></tr></table>

<h3>6.4 The stress test: would it survive bad years?</h3>
<p>We fixed each price from the 25-year average, then replayed every year 2000–2024 as if we had sold the product that year. That year’s <b>loss ratio</b> = payouts ÷ premiums (100% = break-even).</p>
<table class="small"><tr><th>Product</th><th>Worst year</th><th>Loss ratio that year</th><th>Years above 100%</th><th>Max payout per person a year</th></tr>
<tr><td>Mumbai Basic</td><td>2019 (4 days)</td><td>222%</td><td>7 of 25</td><td>₹1,500</td></tr>
<tr><td>Nagpur Basic</td><td>2013 (14 days, 5 paid)</td><td>242%</td><td>5 of 25</td><td>₹1,500</td></tr>
<tr><td>Ahmedabad Basic</td><td>2018 (7 days, 5 paid)</td><td>469%</td><td>4 of 25</td><td>₹1,500</td></tr>
<tr><td>Mumbai Plus (5-day cap)</td><td>2010 (19 days, 5 paid)</td><td>60%</td><td>0 of 25</td><td>₹1,500</td></tr></table>
{fig:stress}
<p><b>Meaning:</b> Basic is lumpy (bad years cost 2–5× the premiums), so only a licensed insurer pooling cities and years, with reinsurance, can carry it, never Jio. Plus always hits its cap, so it is perfectly predictable: more like a pre-paid weather allowance than insurance.</p>

<h3>6.5 The Mumbai street-by-street check</h3>
<p>Same source, Santacruz vs Colaba (about 20 km apart), 2020–2024 monsoons: 89 days when both reported. On 15 of them at least one station had heavy rain (64.5 mm+), and on 5 of those 15 the other station got less than half. Plus the famous day: 26 July 2005, 944 mm vs 73 mm (IMD).</p>

<h3>6.6 Business numbers (Q&A only)</h3>
<table class="small"><tr><th>Number</th><th>Working</th><th>What it is</th></tr>
<tr><td>₹12.5 crore a year</td><td>50,000 Mumbai riders × ₹208 × 12</td><td>Plus premium pool: the insurer’s money, not Jio revenue</td></tr>
<tr><td>₹1.9–3.1 crore a year</td><td>15–25% of ₹12.5 crore</td><td>Illustrative distribution fees for Jio</td></tr>
<tr><td>₹174 crore a year</td><td>50 crore users × 1% × ₹29 × 12</td><td>The video’s B2C pool (shown as ≈ ₹170 crore); removed because uptake is a guess</td></tr></table>
"""
