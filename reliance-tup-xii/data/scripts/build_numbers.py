"""How We Got Our Numbers: a deep explainer PDF built from the real data and the pipeline outputs."""
import json, re, os, numpy as np, pandas as pd
from playwright.sync_api import sync_playwright
C = json.load(open('charts.json'))
FONTS = open('../lab/fonts.css').read()
CSS = re.search(r'<style>\n\[\[FONTS\]\]\n(.*?)</style>', open('../proto/guide_template.html', encoding='utf-8').read(), re.S).group(1)
D = '../datapack/JioMausam_Germany_Data/csv/'
lk = pd.read_csv(D + 'links.csv'); net = pd.read_csv(D + 'network_average_hourly.csv'); te = net[net.period == 'test']
K = json.load(open('../datapack/pack_meta.json'))['K']
rad_tune, our_tune = lk.radar_mm_tuning.sum(), lk.ours_uncal_mm_tuning.sum()
r_net = np.corrcoef(te.ours_calibrated, te.radar)[0, 1]
rl = lk.r_unseen_days.dropna()
# 6-hour correlation example (values rounded to 3 decimals so a reader can redo it)
ex = net.iloc[85:91][['hour_utc', 'ours_calibrated', 'radar']].round(3)
x, y = ex.ours_calibrated.values, ex.radar.values; mx, my = x.mean(), y.mean()
dx, dy = x - mx, y - my; r6 = (dx * dy).sum() / np.sqrt((dx ** 2).sum() * (dy ** 2).sum())
L = json.load(open('/home/user/market-research-agent/reliance-tup-xii/prototype/india/india_layer.json'))
ST = json.load(open('/home/user/market-research-agent/reliance-tup-xii/prototype/india/stress_test.json'))
ind = pd.read_csv('../datapack/india_daily_imd.csv')
inr = lambda v: '₹' + format(int(round(v)), ',')
page_no = [0]
FOOT = 'JioMausam · How we got our numbers'

def page(body, cls=''):
    page_no[0] += 1
    return f'<section class="page {cls}">{body}<div class="foot"><span>{FOOT}</span><span>{page_no[0]}</span></div></section>'

P = []
# ---------------- 1 cover ----------------
P.append(page(f'''
<div class="ch">Reliance T.U.P XII · Team notes</div>
<h1>How we got<br>our <span>numbers</span></h1>
<p class="sub">Every figure in our pitch, traced from the raw public data, through each calculation, to the slide.</p>
<p>Our pitch rests on two claims. First, that mobile-tower links can measure rain well enough to pay people on. Second, that Kavach can be priced so it survives bad years. This document shows exactly how we tested both: which data, which steps, which formulas, and what the results do and don't prove.</p>
<p>You don't need to be technical. Each part starts with the idea in plain words, then goes one level deeper. Every number can be re-checked in the Excel workbook or the Test Lab.</p>
<div class="toc">
<span>The three chains <b>2</b></span><span>The German data <b>3</b></span>
<span>Physics in one page <b>4</b></span><span>The rain pipeline <b>5</b></span>
<span>One minute by hand <b>7</b></span><span>The fair test <b>8</b></span>
<span>What correlation means <b>9</b></span><span>Our four correlations <b>10</b></span>
<span>The street map <b>12</b></span><span>The payout test <b>13</b></span>
<span>The India data <b>14</b></span><span>Counting trigger days <b>15</b></span>
<span>The price formula <b>16</b></span><span>The stress test <b>17</b></span>
<span>The financial plan <b>18</b></span><span>Price strategy <b>19</b></span>
<span>What this does not prove <b>20</b></span><span>Check it yourself <b>21</b></span>
</div>''', 'cover'))

# ---------------- 2 big picture ----------------
P.append(page(f'''
<div class="ch">Start here</div><h2>Three chains of evidence</h2>
<p class="lede">Every number belongs to one of three chains. Each chain starts with public data and ends with a claim we make on stage.</p>
<div class="g3">
<div class="box"><h4>1 · Can towers see rain?</h4><p class="mu" style="font-size:9.4pt">500 real tower links in Germany → our software turns signal loss into rain → compared with radar → <b>correlation 0.95</b>.</p></div>
<div class="box"><h4>2 · Can we pay on it?</h4><p class="mu" style="font-size:9.4pt">Our rain map → a pay/no-pay decision per square per day → compared with radar's decision → <b>94.6% agree, 68% caught, 18% false</b>.</p></div>
<div class="box"><h4>3 · Can we price it?</h4><p class="mu" style="font-size:9.4pt">25 years of IMD records → how often each trigger fires → <b>price per month</b> → replay every year → <b>stress test</b> → business case.</p></div>
</div>
<h3>Where every number comes from</h3>
<table class="tight">
<tr><th>Number</th><th>What it means</th><th>Built from</th><th>Check it</th></tr>
<tr><td class="mono">0.95</td><td>Network-average rain, ours vs radar, hour by hour, on unseen days</td><td>500 links, 192 test hours</td><td>Workbook · Network hourly</td></tr>
<tr><td class="mono">0.88 · 91%</td><td>Typical single link; share of links above 0.7</td><td>490 links scored one by one</td><td>Workbook · Link scores</td></tr>
<tr><td class="mono">0.78</td><td>Our street map vs radar map, every square, every hour</td><td>1,782 squares × 192 hours</td><td>Test Lab · tab A</td></tr>
<tr><td class="mono">×1.17</td><td>The one scale factor, fitted on tuning days only</td><td>Totals on 10–12 May</td><td>Workbook · Calibration</td></tr>
<tr><td class="mono">94.6% · 68% · 18%</td><td>Decisions that agree · radar events caught · our triggers not confirmed</td><td>14,256 square-days</td><td>Workbook · Payout test</td></tr>
<tr><td class="mono">11.9 days</td><td>Heavy-rain days a year in Mumbai (64.5 mm+)</td><td>IMD Santacruz, 2000–2024</td><td>Workbook · Prices</td></tr>
<tr><td class="mono">₹208 · ₹125</td><td>Kavach Plus per rider per month (5-day cap · 3-day cap)</td><td>Days paid × ₹300 ÷ 0.6 ÷ 12</td><td>Workbook · Prices</td></tr>
<tr><td class="mono">₹45 · ₹52 · ₹27→₹29</td><td>Kavach Basic: Mumbai rain · Nagpur heat · Ahmedabad heat (cost, then floor)</td><td>Same formula, rarer triggers</td><td>Workbook · Prices</td></tr>
<tr><td class="mono">222% · 242% · 469%</td><td>Worst year's claims ÷ premiums for each Basic product</td><td>Every year replayed</td><td>Workbook · Stress test</td></tr>
<tr><td class="mono">₹12.5 Cr · ₹174 Cr</td><td>Premiums a year: 50,000 riders · 1% of Jio's users</td><td>Users × price × 12</td><td>Workbook · Business case</td></tr>
</table>
<div class="callout plain"><span class="tg">The honest framing</span><p>Chains 1 and 2 use German data because no Indian telecom publishes link signals. They prove the <b>method</b> works on a real network. Chain 3 uses Indian data and proves the <b>prices</b>. Phase 1 of our plan repeats chain 1 on Jio's own Mumbai links.</p></div>
'''))

# ---------------- 3 German data ----------------
s = lk[lk.link_id == 359].iloc[0]
P.append(page(f'''
<div class="ch">Part 1 · The data</div><h2>The German data: what is in the files</h2>
<p class="lede">A microwave link is a radio beam between two towers that carries phone and internet traffic. Every link logs how strong its signal is. When rain falls between the towers, the signal weakens. That log is our rain gauge.</p>
<h3>Where it comes from</h3>
<p>The <b>pycomlink example dataset</b>. pycomlink is the open-source Python toolbox for rain from microwave links, developed at Karlsruhe Institute of Technology (KIT) in Germany. Its code and data are public on GitHub (github.com/pycomlink/pycomlink, folder <span class="mono">pycomlink/io/example_data</span>) under a BSD licence. The three files we used are byte-for-byte identical to the copies there.</p>
<table class="tight">
<tr><th>File</th><th>What is inside</th><th>Size</th></tr>
<tr><td class="mono">example_cml_data.nc</td><td>500 links × 2 channels × 15,840 minutes (10–20 May 2018). For each minute: transmitted and received signal level in dBm. For each link: frequency, polarization, length, both tower positions.</td><td>5.5 MB</td></tr>
<tr><td class="mono">example_path_averaged_reference_data.nc</td><td>German Weather Service (DWD) radar rainfall averaged along each link's path, every 5 minutes. The answer key for each link.</td><td>2.4 MB</td></tr>
<tr><td class="mono">example_areal_reference_data.nc</td><td>The radar map itself (RADOLAN-YW), a 190 × 228 grid of about 1 km squares, every 5 minutes. The answer key for the street map.</td><td>10.2 MB</td></tr>
</table>
<h3>What one link looks like</h3>
<table class="tight">
<tr><th>Link 359</th><th>Value</th><th>Meaning</th></tr>
<tr><td>Length</td><td class="mono">{s.length_km:.2f} km</td><td>Distance between the two towers</td></tr>
<tr><td>Frequency</td><td class="mono">{s.freq_ch1_GHz:.1f} GHz</td><td>Higher frequencies are more sensitive to rain</td></tr>
<tr><td>Transmitted (dry minute)</td><td class="mono">19.0 dBm</td><td>Power sent</td></tr>
<tr><td>Received (dry minute)</td><td class="mono">about −40.6 dBm</td><td>Power arriving: the beam loses about 59.6 dB on a dry day</td></tr>
<tr><td>Received (22:45, 13 May)</td><td class="mono">−66.1 dBm</td><td>During heavy rain: about 25 dB weaker</td></tr>
</table>
<div class="g2">
<div class="callout analogy"><span class="tg">Why Germany</span><p>It is the only public dataset we could find with real telecom link signals and a radar answer key for the same minutes. Indian operators do not publish link data. That is exactly what Phase 1 asks Jio for.</p></div>
<div class="callout honest"><span class="tg">One quirk to know</span><p>The tower coordinates are shifted for privacy: the file places the network at 57–58°N, 1–3°E, which is in the North Sea. Distances and shapes are real; the location is not. Radar was shifted the same way, so comparisons still line up.</p></div>
</div>'''))

# ---------------- 4 physics ----------------
k10 = s.itu_a_ch1 * 10 ** s.itu_b_ch1
P.append(page(f'''
<div class="ch">Part 1 · The physics</div><h2>Why rain weakens the signal, in one page</h2>
<p class="lede">Raindrops absorb and scatter microwaves. The more rain between two towers, the more of the beam is lost. Engineers have measured this relationship for decades, so it has a standard formula.</p>
<h3>Decibels, briefly</h3>
<p>Signal strength is measured in <b>decibels (dB)</b>, a scale where every 10 dB means ten times less power. dBm is the same scale measured against one milliwatt. "Signal loss" here is simply <b>sent minus received</b>: 19.0 − (−40.6) = 59.6 dB on a dry minute for link 359.</p>
<h3>The standard formula (ITU-R P.838)</h3>
<div class="box" style="text-align:center;margin:2mm 0 3mm"><p class="mono" style="font-size:13pt;margin:1mm 0">k = a × R<sup>b</sup></p><p class="mu" style="margin:0">k = loss per kilometre (dB/km) · R = rain rate (mm per hour) · a, b = constants for the link's frequency and polarization</p></div>
<p>The International Telecommunication Union publishes <i>a</i> and <i>b</i> for every frequency. Turned around, the formula gives rain from loss: <b>R = (k ÷ a)<sup>1/b</sup></b>. For link 359 (23.1 GHz, vertical), a = {s.itu_a_ch1:.4f} and b = {s.itu_b_ch1:.4f}.</p>
<table class="tight">
<tr><th>Rain rate</th><th>Loss per km at 23.1 GHz</th><th>Loss over link 359's {s.length_km:.1f} km</th><th>What it feels like</th></tr>
<tr><td class="mono">1 mm/h</td><td class="mono">{s.itu_a_ch1*1**s.itu_b_ch1:.2f} dB/km</td><td class="mono">{s.itu_a_ch1*1**s.itu_b_ch1*s.length_km:.1f} dB</td><td>Light drizzle: barely visible in the signal</td></tr>
<tr><td class="mono">10 mm/h</td><td class="mono">{k10:.2f} dB/km</td><td class="mono">{k10*s.length_km:.1f} dB</td><td>Heavy shower: the signal drops ten-fold</td></tr>
<tr><td class="mono">25 mm/h</td><td class="mono">{s.itu_a_ch1*25**s.itu_b_ch1:.2f} dB/km</td><td class="mono">{s.itu_a_ch1*25**s.itu_b_ch1*s.length_km:.1f} dB</td><td>Downpour: what link 359 saw at 22:45 on 13 May</td></tr>
</table>
<div class="g2">
<div class="callout plain"><span class="tg">Why frequency matters</span><p>Raindrops are a few millimetres across. Waves of similar size (above about 10 GHz) interact with them strongly. The dataset's links run from 6.5 to 38.9 GHz; most sit between 15 and 40 GHz, the sweet spot for sensing rain.</p></div>
<div class="callout plain"><span class="tg">Why it measures a line</span><p>A link reports the total loss along its whole path. So it tells you the <b>average rain along a road</b>, not at one house. Many crossing links let you rebuild the pattern street by street.</p></div>
</div>
<div class="callout honest"><span class="tg">Two things that also weaken the signal</span><p><b>Water on the antenna</b> (a wet dish loses a little signal even after rain stops) and <b>everyday wobble</b> (temperature, humidity, equipment). The pipeline on the next pages removes both before turning loss into rain.</p></div>'''))

# ---------------- 5 pipeline 1-3 ----------------
P.append(page(f'''
<div class="ch">Part 2 · The rain pipeline</div><h2>Steps 1–3: from raw signal to "it is raining"</h2>
<p class="lede">Our program, <span class="mono">rain_pipeline.py</span>, runs the same seven steps on every link and channel. Here is link 359 on the stormy day of 13 May 2018.</p>
<figure>{C['sig']}<figcaption>Top: the signal loss every minute (black) and the dry baseline the code holds during rain (dashed). Bottom: the wobble, and the threshold above which a minute counts as wet. Blue bands are the minutes marked wet: 453 of 1,440 that day.</figcaption></figure>
<div class="steps">
<div class="step"><p><b>Read the signal.</b> Loss = transmitted − received, every minute. Missing readings are stored as 255 (sent) or −99.9 (received) and are treated as gaps.</p></div>
<div class="step"><p><b>Fill short gaps.</b> Gaps of up to 5 minutes are bridged with a straight line. Longer gaps stay empty.</p></div>
<div class="step"><p><b>Spot rain from the wobble.</b> For each minute, take the standard deviation of the signal over the surrounding 60 minutes. On dry days the signal barely moves; rain makes it jump. The threshold is set per channel: <b>1.12 × that channel's 80th-percentile wobble</b>. For link 359 that is 0.34 dB. At 22:45 the wobble was 5.9 dB, far above it.</p></div>
</div>
<div class="callout analogy"><span class="tg">In plain words</span><p>Every link learns what "normal jitter" looks like for itself. When the signal shakes much more than usual, it is raining on that link. The 80th percentile means the link is assumed dry most of the time, which is true almost everywhere.</p></div>'''))

# ---------------- 6 pipeline 4-7 ----------------
P.append(page(f'''
<div class="ch">Part 2 · The rain pipeline</div><h2>Steps 4–7: from "it is raining" to millimetres</h2>
<div class="steps" style="counter-reset:s 3">
<div class="step"><p><b>Hold a dry baseline.</b> Outside rain, the baseline follows the signal. When a wet spell starts, it freezes at the average of the last 5 dry minutes and stays there until the spell ends. Anything above it during rain is extra loss.</p></div>
<div class="step"><p><b>Remove the wet-antenna effect.</b> Water on the antennas causes extra loss that is not rain in the path. Following Schleiss et al. (2013), the code allows up to <b>1.5 dB</b> for it, building up over about 15 minutes of rain.</p></div>
<div class="step"><p><b>Turn loss into rain.</b> Rain loss = signal loss − baseline − wet-antenna allowance. Divide by length for dB/km, then apply R = (k ÷ a)<sup>1/b</sup>. Rates below 0.1 mm/h are set to zero. The two channels of each link are averaged, then averaged into hours.</p></div>
<div class="step"><p><b>Apply one scale factor.</b> Multiply every link by <b>K = {K:.3f}</b>, fitted on the tuning days only (page 8).</p></div>
</div>
<figure>{C['rain359']}<figcaption>Link 359's hourly rain on 13 May: our estimate (from the signal alone) against radar along the same path. Day total: ours 29.1 mm, radar 28.5 mm.</figcaption></figure>
<table class="tight">
<tr><th>Setting</th><th>Value</th><th>Why this value</th></tr>
<tr><td>Wobble window</td><td class="mono">60 minutes</td><td>Long enough to see a storm build, short enough to catch it starting</td></tr>
<tr><td>Wet threshold</td><td class="mono">1.12 × 80th percentile</td><td>Standard rolling-deviation method; 1.12 balances missed and false wet minutes</td></tr>
<tr><td>Baseline memory</td><td class="mono">last 5 dry minutes</td><td>Avoids freezing on a single noisy reading</td></tr>
<tr><td>Wet-antenna cap</td><td class="mono">1.5 dB</td><td>Typical value in the published research for links like these</td></tr>
</table>
<div class="callout plain"><span class="tg">What is ours and what is borrowed</span><p>Steps 4–6 use pycomlink's published functions, the peer-reviewed standard. The wet/dry rule, the calibration, the scoring, the street map and the payout test are our own code. In the Test Lab you can move the threshold and wet-antenna sliders and watch every result change.</p></div>'''))

# ---------------- 7 worked minute ----------------
kk = 24.0204 / s.length_km
P.append(page(f'''
<div class="ch">Part 2 · Worked example</div><h2>One minute, calculated by hand</h2>
<p class="lede">Link 359, channel 1, 13 May 2018 at 22:45 UTC: the heaviest minute of the storm on this link. Every number below comes from the data file and can be found in <span class="mono">three_links_minute_by_minute.csv</span>.</p>
<table>
<tr><th>Step</th><th>Calculation</th><th>Result</th></tr>
<tr><td>1 · Signal loss</td><td class="mono">19.0 − (−66.1)</td><td class="mono"><b>85.1 dB</b></td></tr>
<tr><td>3 · Is it raining?</td><td>Wobble over the surrounding hour 5.91 dB, threshold 0.34 dB</td><td><b>Yes, wet</b></td></tr>
<tr><td>4 · Dry baseline</td><td>Frozen when this spell began (average of the last 5 dry minutes)</td><td class="mono">59.58 dB</td></tr>
<tr><td>4 · Extra loss</td><td class="mono">85.10 − 59.58</td><td class="mono">25.52 dB</td></tr>
<tr><td>5 · Wet antenna</td><td>Built up to its cap during the storm</td><td class="mono">− 1.50 dB</td></tr>
<tr><td>6 · Rain loss</td><td class="mono">25.52 − 1.50</td><td class="mono"><b>24.02 dB</b></td></tr>
<tr><td>6 · Loss per km</td><td class="mono">24.02 ÷ {s.length_km:.3f} km</td><td class="mono">{kk:.3f} dB/km</td></tr>
<tr><td>6 · Rain rate</td><td class="mono">({kk:.3f} ÷ {s.itu_a_ch1:.4f})<sup>1 ÷ {s.itu_b_ch1:.4f}</sup> = {kk/s.itu_a_ch1:.2f}<sup>{1/s.itu_b_ch1:.4f}</sup></td><td class="mono"><b>{(kk/s.itu_a_ch1)**(1/s.itu_b_ch1):.1f} mm/h</b></td></tr>
<tr><td>6 · Both channels</td><td>Channel 2 gave a slightly lower rate; the link uses the average</td><td class="mono">24.1 mm/h</td></tr>
<tr><td>6 · The hour</td><td>Average of the 60 one-minute values (both channels), 22:00 to 22:59</td><td class="mono">7.31 mm/h</td></tr>
<tr><td>7 · Calibrated hour</td><td class="mono">7.31 × {K:.3f}</td><td class="mono"><b>8.57 mm/h</b></td></tr>
<tr><td>Answer key</td><td>Radar along the same path, same hour</td><td class="mono"><b>8.63 mm/h</b></td></tr>
</table>
<div class="g2">
<div class="callout good"><span class="tg">What this shows</span><p>A handful of subtractions and one standard formula turn a phone network's own log into rain within 1% of radar for this hour. No new hardware, no guesswork.</p></div>
<div class="callout honest"><span class="tg">Not every hour is this close</span><p>One hour earlier the same link read 3.0 mm/h against radar's 4.8. Single hours are noisy; that is why we judge on 192 unseen hours and 490 links, not on one good example.</p></div>
</div>
<div class="callout say"><span class="tg">Say it like this</span><p>"At 22:45 the signal on one link dropped 25 dB. Take off 1.5 for the wet antenna, apply the ITU formula for 23 GHz, and you get 25 mm an hour. Radar saw the same storm."</p></div>'''))

# ---------------- 8 calibration ----------------
P.append(page(f'''
<div class="ch">Part 3 · The fair test</div><h2>Tune on three days, test on eight</h2>
<p class="lede">A test is only honest if the answer key is hidden while you set things up. We split the 11 days in two and never let the scoring days influence the method.</p>
<table class="tight"><tr><th>Period</th><th>Days</th><th>Used for</th></tr>
<tr><td><b>Tuning</b></td><td>10–12 May 2018 (72 hours)</td><td>Fitting the one scale factor K. Nothing else.</td></tr>
<tr><td><b>Test</b></td><td>13–20 May 2018 (192 hours)</td><td>Every published score: 0.95, 0.88, 0.78, 94.6%, 68%, 18%</td></tr></table>
<h3>The scale factor K, step by step</h3>
<p>Our raw estimates read a little low (wet-antenna and baseline choices are conservative). K scales them so that, over the tuning days, our total rain equals radar's total.</p>
<table class="tight">
<tr><td>Radar: all links, all tuning hours, added up</td><td class="mono" style="text-align:right">{rad_tune:,.1f}</td></tr>
<tr><td>Ours, before scaling: same sum</td><td class="mono" style="text-align:right">{our_tune:,.1f}</td></tr>
<tr><td><b>K = radar ÷ ours</b></td><td class="mono" style="text-align:right"><b>{K:.3f}</b></td></tr></table>
<h3>Three things people get wrong about K</h3>
<div class="num"><div class="big">0.95</div><div><b>K cannot create the correlation.</b> Multiplying every value by the same number changes the size, not the up-and-down pattern. The network correlation is {r_net:.4f} with K and exactly the same without it. The pattern was in the raw signal.</div></div>
<div class="num"><div class="big">1</div><div><b>It is one number for the whole network,</b> not one per link or per day. With 500 links and 192 test hours, a single number cannot be tuned to fit the answers.</div></div>
<div class="num"><div class="big">0.82</div><div><b>It does not make totals perfect.</b> On the test days our rain still adds up to 82% of radar's (the "bias"). K fixes most of the gap; local calibration in the pilot fixes the rest.</div></div>
<div class="callout plain"><span class="tg">Where K does matter</span><p>In the payout test. A trigger is a fixed amount of rain (10 mm in 3 hours), so reading 18% low would mean missing payouts. That is why the pilot calibrates against Mumbai's own rain gauges continuously, not once.</p></div>'''))

# ---------------- 9 correlation explained ----------------
rows6 = ''.join(f'<tr><td class="mono">{h[11:16]}</td><td class="mono">{a:.3f}</td><td class="mono">{b:.3f}</td><td class="mono">{da:+.3f}</td><td class="mono">{db:+.3f}</td><td class="mono">{da*db:.4f}</td></tr>' for h, a, b, da, db in zip(ex.hour_utc, x, y, dx, dy))
P.append(page(f'''
<div class="ch">Part 4 · Correlation</div><h2>What a correlation of 0.95 actually means</h2>
<p class="lede">Correlation (written r) measures how closely two series rise and fall together. It runs from −1 to 1. At 1, every rise in one is matched by a rise in the other. At 0, there is no pattern at all.</p>
<figure>{C['illus']}<figcaption>Illustration with made-up points: what different correlations look like. Each dot pairs two measurements of the same moment.</figcaption></figure>
<h3>The formula, and a tiny example from our data</h3>
<p>r = Σ(dx × dy) ÷ √( Σdx² × Σdy² ), where dx and dy are each value's distance from its own average. Six real hours of network-average rain on 13 May:</p>
<table class="tight"><tr><th>Hour</th><th>Ours (mm/h)</th><th>Radar (mm/h)</th><th>dx</th><th>dy</th><th>dx × dy</th></tr>{rows6}
<tr><td colspan="3">Averages: ours {mx:.3f}, radar {my:.3f}</td><td class="mono">Σdx² {(dx**2).sum():.4f}</td><td class="mono">Σdy² {(dy**2).sum():.4f}</td><td class="mono">Σ {(dx*dy).sum():.4f}</td></tr></table>
<p>r = {(dx*dy).sum():.4f} ÷ √({(dx**2).sum():.4f} × {(dy**2).sum():.4f}) = <b>{r6:.2f}</b>. The same calculation over all 192 test hours gives <b>{r_net:.3f}</b>. In Excel it is one function: <span class="mono">=CORREL(ours, radar)</span>.</p>
<div class="g2">
<div class="callout plain"><span class="tg">What it does tell you</span><p>Whether our system sees rain arrive, build, peak and leave at the same times and places as radar. That is what a payout trigger needs.</p></div>
<div class="callout honest"><span class="tg">What it doesn't</span><p>Whether the amounts are right. A system reading exactly half of radar every hour would still score 1.0. That is why we also report the bias (0.82) and the payout test.</p></div>
</div>'''))

# ---------------- 10 four correlations ----------------
P.append(page(f'''
<div class="ch">Part 4 · Correlation</div><h2>Our four correlations, and why they differ</h2>
<figure>{C['net']}<figcaption>Average rain over all 500 links, every hour for 11 days. Shaded: tuning days. Both lines come from completely different instruments: tower signals and weather radar.</figcaption></figure>
<table>
<tr><th>Comparison</th><th>r</th><th>What is being compared</th><th>Why it is higher or lower</th></tr>
<tr><td><b>Network average</b></td><td class="mono"><b>{r_net:.3f}</b></td><td>The average over 500 links, each test hour (192 pairs)</td><td>Averaging cancels each link's random errors. Highest.</td></tr>
<tr><td><b>Single link (median)</b></td><td class="mono"><b>{rl.median():.3f}</b></td><td>Each link vs radar on its own path; the middle of 490 scores</td><td>One link's noise is not averaged away. {(rl>0.7).mean():.0%} of links still score above 0.7.</td></tr>
<tr><td><b>Every link-hour pooled</b></td><td class="mono"><b>0.801</b></td><td>All 96,000 link-hour pairs thrown together</td><td>Mixes good and weak links and every quiet hour.</td></tr>
<tr><td><b>Street map vs radar map</b></td><td class="mono"><b>0.779</b></td><td>Each 4 km square, each test hour</td><td>Adds map-making error: squares far from links must be filled in. Lowest.</td></tr>
</table>
<div class="callout analogy"><span class="tg">An analogy</span><p>Ask 500 people to guess the temperature. Each guess is a bit off, but the average is excellent. The network number (0.95) is the average; the single-link number (0.88) is a typical individual; the map (0.78) also asks people to guess for streets they cannot see.</p></div>
<div class="callout say"><span class="tg">Say it like this</span><p>"Averaged across the network we match radar at 0.95. A typical single link scores 0.88, and nine in ten links are above 0.7. The street map is 0.78 because it has to fill in gaps, and that is what fusion with radar and gauges improves."</p></div>'''))

# ---------------- 11 scatter + hist ----------------
P.append(page(f'''
<div class="ch">Part 4 · Correlation</div><h2>Looking closer: every hour and every link</h2>
<div class="g2"><figure>{C['scatter']}<figcaption>Each dot is one test hour. Dots on the dashed line would be perfect agreement. They cluster tightly along it, sitting a little below: the 18% under-reading.</figcaption></figure>
<figure>{C['hist']}<figcaption>Each link scored on its own. Most links sit between 0.8 and 0.95. A long tail of weaker links has no single cause.</figcaption></figure></div>
<h3>What separates strong links from weak ones</h3>
<table class="tight"><tr><th>Link</th><th>r</th><th>Frequency</th><th>Length</th><th>Why</th></tr>
{''.join(f"<tr><td>{n} · {int(i)}</td><td class='mono'>{lk.loc[i,'r_unseen_days']:.2f}</td><td class='mono'>{lk.loc[i,'freq_ch1_GHz']:.1f} GHz</td><td class='mono'>{lk.loc[i,'length_km']:.1f} km</td><td>{w}</td></tr>" for n,i,w in [('Best',118,'Short path at a high frequency (37 GHz) that reacts strongly to rain'),('Typical',359,'The example used throughout this document'),('Weak',33,'Low frequency (6.5 GHz) barely reacts to rain; over 28.6 km other losses get counted as rain. It read 165 mm against radar’s 78')])}
</table>
<p>Only {int(lk.r_unseen_days.isna().sum())} of 500 links were not scored: they saw too little rain on the test days (under 5 mm in total) or had too few valid hours for a fair score.</p>
<p>Across all links, length and frequency barely predict the score (correlation about 0.02 with each), and weak links are the same typical length (about 6 km) and frequency (about 25 GHz) as strong ones. They did see a little less rain on the test days (median 38 mm against 43 mm), so noise weighed more. Link 33 is the exception that shows a real rule: very low frequencies are poor rain sensors.</p>
<div class="callout plain"><span class="tg">Why this matters for India</span><p>Monsoon rain is heavier than a German May, so signal drops are bigger relative to noise. But link quality has to be measured, not assumed, which is why Phase 1 starts with a coverage audit of Jio's Mumbai links: frequency, length and density in every square, and each link's own score against gauges.</p></div>'''))

# ---------------- 12 street map ----------------
P.append(page(f'''
<div class="ch">Part 5 · The street map</div><h2>From 500 lines to a map of squares</h2>
<p class="lede">Payouts happen per area, so we need rain for every square of the city, not just along links.</p>
<figure>{C['maps']}<figcaption>The heaviest test hour (13 May, 21:00 UTC). Left: built only from the 500 links (thin lines). Right: radar. Squares are about 3 × 4 km (radar's 1 km grid, four by four).</figcaption></figure>
<h3>How each square gets its value</h3>
<div class="steps">
<div class="step"><p>Each link's hourly rain is placed at the <b>midpoint</b> of its path.</p></div>
<div class="step"><p>For every square, find the <b>8 nearest midpoints</b> within 20 km.</p></div>
<div class="step"><p>Average them, giving nearer links more say: weight = <b>1 ÷ distance²</b> (inverse distance weighting). A link 2 km away counts four times as much as one 4 km away.</p></div>
<div class="step"><p>Only squares with a link midpoint within 6 km are scored: <b>1,782 squares</b>. Elsewhere we say "not enough links" instead of guessing.</p></div>
</div>
<div class="callout honest"><span class="tg">The simplification</span><p>Putting a link's rain at its midpoint ignores that it measured a whole line. Production methods treat each reading as an average along the line and blend in radar and gauges. Our simple version still reaches 0.78 against radar, which is a floor to build on, not a ceiling.</p></div>'''))

# ---------------- 13 payout test ----------------
P.append(page(f'''
<div class="ch">Part 5 · The payout test</div><h2>Would we have paid the right squares?</h2>
<p class="lede">Correlation is about patterns. Insurance is about decisions. So we asked the question a customer would: on each day, in each square, would our system and radar both have said "pay"?</p>
<p><b>The rule:</b> a square pays on a day if any 3-hour window that day had at least <b>10 mm</b> of rain. We apply it twice, once to our map and once to radar's, for 1,782 squares × 8 test days = <b>14,256 decisions</b>.</p>
<div class="g2"><table class="tight">
<tr><th></th><th>Radar: pay</th><th>Radar: don't</th></tr>
<tr><td><b>Ours: pay</b></td><td class="mono" style="background:var(--greenS)"><b>1,120</b> both pay</td><td class="mono" style="background:var(--redS)"><b>244</b> false trigger</td></tr>
<tr><td><b>Ours: don't</b></td><td class="mono" style="background:var(--amberS)"><b>519</b> missed</td><td class="mono"><b>12,373</b> neither</td></tr></table>
<table class="tight">
<tr><td>Agreement</td><td class="mono">(1,120 + 12,373) ÷ 14,256</td><td class="mono"><b>94.6%</b></td></tr>
<tr><td>Events caught</td><td class="mono">1,120 ÷ (1,120 + 519)</td><td class="mono"><b>68.3%</b></td></tr>
<tr><td>False triggers</td><td class="mono">244 ÷ (1,120 + 244)</td><td class="mono"><b>17.9%</b></td></tr></table></div>
<figure>{C['trade']}<figcaption>Every trigger level from 3 to 20 mm, re-scored. Lower triggers catch more events but agreement falls; higher triggers cut events caught and raise false triggers. 10 mm sits near the best balance.</figcaption></figure>
<div class="g2">
<div class="callout honest"><span class="tg">Why 94.6% flatters us</span><p>Most square-days are dry, and "neither pays" counts as agreement. Always say 68% and 18% alongside it. They are the numbers an insurer cares about.</p></div>
<div class="callout plain"><span class="tg">How the pilot closes the gap</span><p>Blend links with IMD radar and gauges, calibrate locally, and set the target: 80%+ of events caught, under 15% false triggers, before money moves.</p></div>
</div>'''))

# ---------------- 14 India data ----------------
cnt = ind.groupby('city').size(); miss = ind.rain_mm.isna().groupby(ind.city).sum()
P.append(page(f'''
<div class="ch">Part 6 · The India data</div><h2>25 years of IMD records</h2>
<p class="lede">To price Kavach we need to know how often each trigger would have fired in each city. That needs long, daily, official records.</p>
<h3>Source</h3>
<p>IMD's synoptic station reports, as archived in NOAA's <b>Global Summary of the Day</b>, a public-domain collection of daily reports from weather stations worldwide (<span class="mono">noaa-gsod-pds.s3.amazonaws.com</span>). We used IMD's own website first, but it was not reachable from our environment; the NOAA archive carries the same station reports.</p>
<table class="tight"><tr><th>City</th><th>Station</th><th>Station ID</th><th>Days kept</th><th>Days without rain report</th></tr>
<tr><td>Mumbai</td><td>Santacruz airport</td><td class="mono">43003</td><td class="mono">{cnt['Mumbai']:,}</td><td class="mono">{int(miss['Mumbai'])}</td></tr>
<tr><td>Nagpur</td><td>Sonegaon airport</td><td class="mono">42867</td><td class="mono">{cnt['Nagpur']:,}</td><td class="mono">{int(miss['Nagpur'])}</td></tr>
<tr><td>Ahmedabad</td><td>Ahmedabad airport</td><td class="mono">42647</td><td class="mono">{cnt['Ahmedabad']:,}</td><td class="mono">{int(miss['Ahmedabad'])}</td></tr>
<tr><td>Mumbai (2nd)</td><td>Colaba</td><td class="mono">43057</td><td colspan="2">Used only to show how different two stations 20 km apart can be</td></tr></table>
<h3>Cleaning, step by step</h3>
<div class="steps">
<div class="step"><p><b>Convert units.</b> Rain comes in inches: × 25.4 gives mm (2.54 in = 64.5 mm). Temperature comes in °F: (°F − 32) × 5 ÷ 9 gives °C (116.6°F = 47.0°C).</p></div>
<div class="step"><p><b>Drop missing codes.</b> 99.99 means "no rain report" and 9999.9 means "no temperature". Those days count as no trigger, never as a trigger.</p></div>
<div class="step"><p><b>Keep only complete years.</b> A year counts only with at least 330 daily reports and at least 110 in June–September, so a gap in the monsoon can't make a year look dry. All 25 years (2000–2024) passed for all three cities.</p></div>
</div>
<div class="callout honest"><span class="tg">A known weakness of the archive</span><p>It can under-record single extreme days. For 26 July 2005, IMD's official Santacruz total is 944 mm; the archive shows 461 mm. Both are far above every trigger, so the day still counts. We use the archive to count how often thresholds are crossed, never for exact totals.</p></div>'''))

# ---------------- 15 trigger days ----------------
def row(city, kind, th):
    return next(r for r in L[city]['rows'] if r['kind'] == kind and r['th'] == th)
tr = ''.join(f"<tr><td>{c}</td><td>{lab}</td><td class='mono'>{row(c,k,t)['days']:.1f}</td><td class='mono'>{row(c,k,t)['days_capped']:.1f}</td><td class='mono'>{int(round(row(c,k,t)['years_any']*25))} of 25</td><td class='mono'>₹{row(c,k,t)['prem_month']}</td></tr>"
             for c, k, t, lab in [('Mumbai','rain',64.5,'Heavy rain, 64.5 mm+'),('Mumbai','rain',115.6,'Very heavy, 115.6 mm+'),('Mumbai','rain',204.5,'Extremely heavy, 204.5 mm+'),('Nagpur','heat',45,'45°C+'),('Nagpur','heat',47,'47°C+ (severe heatwave)'),('Ahmedabad','heat',45,'45°C+'),('Ahmedabad','heat',47,'47°C+ (severe heatwave)')])
P.append(page(f'''
<div class="ch">Part 6 · Counting trigger days</div><h2>How often would Kavach have paid?</h2>
<p class="lede">We use IMD's own definitions as triggers, so nobody can say we picked numbers to suit ourselves.</p>
<p><b>IMD's terms, for one day:</b> heavy rain 64.5–115.5 mm · very heavy 115.6–204.4 mm · extremely heavy 204.5 mm or more · heatwave at an actual 45°C or more, <b>severe heatwave</b> at 47°C or more.</p>
<figure>{C['mumbai']}<figcaption>Every year since 2000, Santacruz had at least 5 heavy-rain days (fewest: 5 in 2015; most: 19 in 2010). So a 5-day cap is reached every single year.</figcaption></figure>
<table class="tight"><tr><th>City</th><th>Trigger</th><th>Days a year (avg)</th><th>Paid, 5-day cap</th><th>Years with any</th><th>Cost price a month</th></tr>{tr}</table>
<div class="callout plain"><span class="tg">Why these triggers for these products</span><p><b>Kavach Plus (riders)</b> uses heavy rain, 64.5 mm: the level at which deliveries stop. It fires often, so it behaves like a predictable rain allowance. <b>Kavach Basic (everyone)</b> uses the rare extremes, 204.5 mm in Mumbai and 47°C in Nagpur and Ahmedabad: true disaster days, about one a year, which keeps it cheap. Mumbai's hottest day in these records was 42°C, far below the heat triggers, so heat cover starts in Nagpur and Ahmedabad.</p></div>'''))

# ---------------- 16 price formula ----------------
P.append(page(f'''
<div class="ch">Part 7 · The price formula</div><h2>From trigger days to a monthly price</h2>
<div class="box" style="text-align:center;margin:1mm 0 4mm"><p class="mono" style="font-size:12.5pt;margin:1mm 0">Price per month = average days paid a year × payout per day ÷ payout share ÷ 12</p></div>
<h3>Kavach Plus, worked through</h3>
<table class="tight">
<tr><td>Heavy-rain days a year in Mumbai (average of 25 years)</td><td class="mono" style="text-align:right">11.88</td></tr>
<tr><td>Capped at 5 paid days (every year reaches the cap)</td><td class="mono" style="text-align:right">5.00</td></tr>
<tr><td>Expected claims per rider a year: 5 × ₹300</td><td class="mono" style="text-align:right">₹1,500</td></tr>
<tr><td>Premium a year so claims are 60% of it: ₹1,500 ÷ 0.6</td><td class="mono" style="text-align:right">₹2,500</td></tr>
<tr><td><b>Per month: ₹2,500 ÷ 12</b></td><td class="mono" style="text-align:right"><b>₹208</b></td></tr></table>
<table><tr><th>Product</th><th>Trigger</th><th>Days paid a year</th><th>Cost price</th><th>Price charged</th></tr>
<tr><td>Kavach Plus · Mumbai riders</td><td>64.5 mm, cap 5</td><td class="mono">5.00</td><td class="mono">₹208</td><td class="mono"><b>₹208</b></td></tr>
<tr><td>Kavach Plus · 3-day cap</td><td>64.5 mm, cap 3</td><td class="mono">3.00</td><td class="mono">₹125</td><td class="mono"><b>₹125</b></td></tr>
<tr><td>Kavach Basic · Mumbai</td><td>204.5 mm</td><td class="mono">1.08</td><td class="mono">₹45</td><td class="mono"><b>₹45</b></td></tr>
<tr><td>Kavach Basic · Nagpur</td><td>47°C</td><td class="mono">1.24</td><td class="mono">₹52</td><td class="mono"><b>₹52</b></td></tr>
<tr><td>Kavach Basic · Ahmedabad</td><td>47°C</td><td class="mono">0.64</td><td class="mono">₹27</td><td class="mono"><b>₹29</b> (floor)</td></tr></table>
<h3>The three choices behind the formula</h3>
<div class="num"><div class="big">₹300</div><div><b>Payout per trigger day.</b> Roughly a day's lost earnings for a gig worker or vendor, large enough to matter, small enough to keep premiums low.</div></div>
<div class="num"><div class="big">60%</div><div><b>Payout share (loss ratio).</b> Of every ₹100 of premium, ₹60 goes back as claims. The other ₹40 pays the insurer's costs, reinsurance, Jio's distribution fee (15–25%) and margin. It is a design choice, and the actuaries confirm it before launch.</div></div>
<div class="num"><div class="big">5 days</div><div><b>Yearly cap.</b> Limits what one person can get in a year to ₹1,500, which makes the worst case known in advance. Fewer days (3) makes it cheaper; more days makes it richer but costlier.</div></div>
<div class="callout plain"><span class="tg">Where ₹29 comes from</span><p>Our original design rule: a typical location should trigger about 0.7 days a year, and 0.7 × ₹300 ÷ 0.6 ÷ 12 = ₹29. When real data showed Ahmedabad costs only ₹27, we kept ₹29 as the floor so no city is priced below a sustainable minimum.</p></div>'''))

# ---------------- 17 stress test ----------------
st = [('Plus · Mumbai · cap 5', 'Mumbai Plus cap5 (>=64.5mm)'), ('Plus · Mumbai · cap 3', 'Mumbai Plus cap3 (>=64.5mm)'), ('Basic · Mumbai rain', 'Mumbai Basic (>=204.5mm)'), ('Basic · Nagpur heat', 'Nagpur Basic (>=47C)'), ('Basic · Ahmedabad heat', 'Ahmedabad Basic (>=47C)')]
srows = ''.join(f"<tr><td>{n}</td><td class='mono'>₹{ST[k]['premium_month']}</td><td class='mono' style='white-space:nowrap'>{ST[k]['worst_year']}: {ST[k]['worst_days']} days, {ST[k]['worst_paid_days']} paid</td><td class='mono'><b>{ST[k]['worst_loss_ratio']:.0%}</b></td><td class='mono'>{ST[k]['years_over_100pct']} of 25</td></tr>" for n, k in st)
P.append(page(f'''
<div class="ch">Part 8 · The stress test</div><h2>Replaying every year since 2000</h2>
<p class="lede">An average price can hide disaster years. So we replayed every year from 2000 to 2024 as if we had sold each product that year at its cost price: claims = days paid × ₹300, premiums = price × 12. Above 100%, that year lost money.</p>
<figure>{C['stress']}<figcaption>Claims ÷ premiums, year by year, for the three Basic products. Red bars are loss years. Solid line: 100%, break-even. Dashed line: the 60% target. Kavach Plus is not shown: it is flat at 60% every year, because every year hits the cap.</figcaption></figure>
<table class="tight"><tr><th>Product</th><th>Cost price</th><th>Worst year</th><th>Claims ÷ premiums</th><th>Loss years</th></tr>{srows}</table>
<h3>What it tells us</h3>
<div class="g2">
<div class="callout good"><span class="tg">Kavach Plus never lost money</span><p>Mumbai always has at least 5 heavy-rain days, so the payout is the same ₹1,500 every year. For a delivery app it is a <b>predictable rain allowance</b> that lands on the right days for the right riders.</p></div>
<div class="callout honest"><span class="tg">Kavach Basic needs reinsurance</span><p>Rare-event cover has bad years: 2 to 5 times the premiums. That is normal insurance. A reinsurer covers those years, and pooling cities helps because Mumbai's rain and Nagpur's heat peak in different months.</p></div>
</div>
<div class="callout plain"><span class="tg">The worst single day</span><p>If a city-wide flood triggers every rider at once: 50,000 riders × ₹300 = <b>₹1.5 crore</b> in one day. The cap means it can happen at most 5 times a year per rider, so the yearly maximum is known: ₹7.5 crore for 50,000 riders.</p></div>'''))

# ---------------- 18 financial plan ----------------
def plus(riders): return riders * 2500 / 1e7
def basic(adopt, price=29): return 50e7 * adopt * price * 12 / 1e7
sens1 = ''.join(f"<tr><td class='mono'>{r:,}</td><td class='mono'>{plus(r):.1f}</td><td class='mono'>{plus(r)*.6:.1f}</td><td class='mono'>{plus(r)*.15:.1f}–{plus(r)*.25:.1f}</td></tr>" for r in [25000, 50000, 100000, 200000])
sens2 = ''.join(f"<tr><td class='mono'>{a:.1%}</td><td class='mono'>{50e7*a/1e5:,.0f}</td><td class='mono'>{basic(a):.0f}</td><td class='mono'>{basic(a)*.15:.0f}–{basic(a)*.25:.0f}</td></tr>" for a in [0.005, 0.01, 0.02, 0.05])
P.append(page(f'''
<div class="ch">Part 9 · The financial plan</div><h2>Premiums, payouts and what Jio earns</h2>
<p class="lede">The most important distinction: <b>premiums are not Jio's revenue.</b> A licensed insurer collects them and carries the risk. Jio earns a distribution fee (15–25% of premiums) and sells weather data.</p>
<div class="g2">
<div><h3 style="margin-top:0">Kavach Plus · one delivery app</h3><table class="tight">
<tr><td>Riders covered</td><td class="mono" style="text-align:right">50,000</td></tr>
<tr><td>Premiums: 50,000 × ₹208 × 12</td><td class="mono" style="text-align:right"><b>₹12.5 Cr</b></td></tr>
<tr><td>Back to riders (60%)</td><td class="mono" style="text-align:right">₹7.5 Cr</td></tr>
<tr><td>Jio's fees (15–25%)</td><td class="mono" style="text-align:right">₹1.9–3.1 Cr</td></tr></table></div>
<div><h3 style="margin-top:0">Kavach Basic · at recharge</h3><table class="tight">
<tr><td>Jio users × 1% who buy</td><td class="mono" style="text-align:right">50 crore × 1% = 50 lakh</td></tr>
<tr><td>Premiums: 50 lakh × ₹29 × 12</td><td class="mono" style="text-align:right"><b>₹174 Cr</b></td></tr>
<tr><td>Back to people (60%)</td><td class="mono" style="text-align:right">₹104 Cr</td></tr>
<tr><td>Jio's fees (15–25%)</td><td class="mono" style="text-align:right">₹26–44 Cr</td></tr></table></div></div>
<h3>What moves the numbers</h3>
<div class="g2"><table class="tight"><tr><th>Riders</th><th>Premiums ₹ Cr</th><th>Claims ₹ Cr</th><th>Jio's fees ₹ Cr</th></tr>{sens1}</table>
<table class="tight"><tr><th>Adoption</th><th>Policies (lakh)</th><th>Premiums ₹ Cr</th><th>Jio's fees ₹ Cr</th></tr>{sens2}</table></div>
<p class="mu" style="font-size:9.2pt">Basic uses the ₹29 floor price, the cautious case: city prices run up to ₹52. Adoption figures are illustrations of scale, not forecasts. 50 crore is an approximate count of Jio users.</p>
<h3>A small, concrete example: Ahmedabad</h3>
<table class="tight"><tr><td>1 lakh customers × ₹29 × 12</td><td class="mono" style="text-align:right">₹3.48 Cr premiums a year</td></tr>
<tr><td>Expected claims: 1 lakh × 0.64 days × ₹300</td><td class="mono" style="text-align:right">₹1.92 Cr</td></tr>
<tr><td>Left for insurer, reinsurance, Jio's fee and costs</td><td class="mono" style="text-align:right">₹1.56 Cr</td></tr></table>
<div class="callout say"><span class="tg">Say it like this</span><p>"₹174 crore is the premium pool, not our revenue. Jio's share is 15 to 25 percent, the insurer carries the risk, and the data business comes on top."</p></div>'''))

# ---------------- 19 price strategy ----------------
P.append(page(f'''
<div class="ch">Part 9 · Price strategy</div><h2>Why we price the way we do</h2>
<div class="num"><div class="big">B2B</div><div><b>Riders first, sold to the app.</b> A delivery app buys Kavach Plus for its riders. One contract covers tens of thousands of people, the app already knows where each rider works, and it has a clear reason to pay: storms cost it orders and riders. Individuals come later, at recharge.</div></div>
<div class="num"><div class="big">₹7</div><div><b>Small per rider.</b> ₹208 a month is about ₹7 a day, roughly 1% of a full-time rider's earnings. The 3-day version (₹125) gives the app a cheaper entry point.</div></div>
<div class="num"><div class="big">City</div><div><b>Priced city by city, from data.</b> A flat national price would overcharge low-risk cities and underprice high-risk ones. Each city's price comes from its own 25 years, with ₹29 as the floor.</div></div>
<div class="num"><div class="big">Cap</div><div><b>A cap that makes the worst case known.</b> At most 5 paid days a year: no one gets more than ₹1,500, and the insurer can reinsure a known maximum.</div></div>
<div class="num"><div class="big">3 h</div><div><b>Daily history now, 3-hour triggers later.</b> Indian records are daily, so prices come from daily data. The live product triggers on 3-hour rain. During the shadow pilot we record real 3-hour rain and the actuaries recalibrate the trigger to about 4–5 payout days a year before money moves.</div></div>
<h3>Questions a judge may ask</h3>
<table class="tight">
<tr><td><b>Why 60%?</b></td><td>It leaves room for the insurer, reinsurance and our fee. Mass micro-insurance often runs lean on costs because distribution is digital, so a higher payout share is possible later.</td></tr>
<tr><td><b>Plus always pays its cap. Is that insurance?</b></td><td>For the app it works as an automated rain allowance: the money lands on the right days for the right riders, with no claims. Basic is the true insurance product.</td></tr>
<tr><td><b>What if a year is far worse than the last 25?</b></td><td>The cap bounds each person's payout, reinsurance covers the pool, and prices are reviewed every year as new data arrives.</td></tr>
<tr><td><b>Who sets the final price?</b></td><td>A licensed insurer's actuaries, under IRDAI rules. Ours is the evidence-based starting point.</td></tr>
</table>'''))

# ---------------- 20 limits ----------------
P.append(page(f'''
<div class="ch">Know the limits</div><h2>What this does not prove, and what the pilot measures</h2>
<p class="lede">Saying what we have <i>not</i> shown is what makes the rest believable. Each limit has a matching measurement in Phase 1.</p>
<table>
<tr><th>Limit</th><th>Why it matters</th><th>What the pilot measures</th></tr>
<tr><td><b>German links, not Jio's</b></td><td>Different equipment, frequencies and climate</td><td>The same test on Jio's Mumbai links against gauges and IMD radar</td></tr>
<tr><td><b>11 days in May</b></td><td>Not a monsoon, not a full season</td><td>A full 90-day monsoon, every storm</td></tr>
<tr><td><b>Radar is not perfect truth</b></td><td>Radar has its own errors</td><td>Comparison with Mumbai's automatic rain gauges as well</td></tr>
<tr><td><b>18% under-reading</b></td><td>Fixed triggers need correct amounts</td><td>Totals within ±10% of gauges after local calibration</td></tr>
<tr><td><b>68% of events caught</b></td><td>Missed payouts hurt trust</td><td>80%+ caught with fusion, under 15% false triggers</td></tr>
<tr><td><b>Midpoint map</b></td><td>Ignores that a link measures a line</td><td>Path-aware mapping; error per square by link length</td></tr>
<tr><td><b>Fibre replaces microwave in cities</b></td><td>Fewer links where we need density</td><td>Coverage audit: usable links per 1 km square</td></tr>
<tr><td><b>Daily data for 3-hour triggers</b></td><td>Prices may shift when triggers change</td><td>3-hour trigger counts; recalibration before money moves</td></tr>
<tr><td><b>Archive under-records extremes</b></td><td>Totals on the worst days are too low</td><td>Prices use counts of days above a threshold, which are robust</td></tr>
<tr><td><b>Adoption and app ROI unknown</b></td><td>The ₹174 Cr is scale, not a forecast</td><td>Orders lost and rider churn in the partner app's own data</td></tr>
</table>
<h3>The go / no-go scorecard for real payouts</h3>
<div class="g3" style="grid-template-columns:repeat(4,1fr)">
<div class="box"><div class="big" style="color:var(--blue)">≥80%</div><p class="mu">heavy-rain events caught</p></div>
<div class="box"><div class="big" style="color:var(--blue)">&lt;15%</div><p class="mu">false triggers</p></div>
<div class="box"><div class="big" style="color:var(--blue)">±10%</div><p class="mu">rain totals vs gauges</p></div>
<div class="box"><div class="big" style="color:var(--blue)">&lt;6 h</div><p class="mu">from storm to payout</p></div></div>
<div class="callout say"><span class="tg">Say it like this</span><p>"We proved the method on real network data and priced the product on 25 years of IMD data. What we haven't proved is Jio's own coverage in Mumbai, and that is exactly what our 90-day shadow pilot measures, before any money moves."</p></div>'''))

# ---------------- 21 reproduce + glossary ----------------
P.append(page(f'''
<div class="ch">Check it yourself</div><h2>Three ways to re-check every number</h2>
<div class="g3">
<div class="box"><h4>The Test Lab</h4><p class="mu" style="font-size:9.2pt">Open <span class="mono">JioMausam_Test_Lab_standalone.html</span>. It re-runs all 500 links from the raw signal in a few seconds and shows "✓ Matches our Python run". Move the sliders to test assumptions live.</p></div>
<div class="box"><h4>The Excel workbook</h4><p class="mu" style="font-size:9.2pt"><span class="mono">JioMausam_Numbers_Workbook.xlsx</span>: live formulas for K, the 0.95, the 0.88, the payout test, prices, the stress test and the business case. Change a yellow cell and watch it update.</p></div>
<div class="box"><h4>The code</h4><p class="mu" style="font-size:9.2pt"><span class="mono">rain_pipeline.py</span>, <span class="mono">india_layer.py</span>, <span class="mono">stress_test.py</span> in the repository's <span class="mono">prototype/</span> folder, plus the data pack's CSV files of every stage.</p></div></div>
<h3>Glossary</h3>
<div class="dict">
<p><b>Attenuation.</b> Loss of signal strength, in dB. Rain attenuation is the part caused by rain in the path.</p>
<p><b>Baseline.</b> The signal loss a link would have if it were dry right now.</p>
<p><b>Bias.</b> Our total rain ÷ radar's total. 0.82 means we read 18% low.</p>
<p><b>Calibration (K).</b> One multiplier that matches our totals to radar's on the tuning days.</p>
<p><b>Cap.</b> The most days paid per person per year (5).</p>
<p><b>Correlation (r).</b> How closely two series rise and fall together, from −1 to 1.</p>
<p><b>dB, dBm.</b> Log scale for signal power; every 10 dB is ten times less. dBm is measured against 1 milliwatt.</p>
<p><b>Events caught.</b> Share of radar's payout events our system also triggered (68%).</p>
<p><b>False trigger.</b> We pay, radar would not have (18% of our triggers).</p>
<p><b>GSOD.</b> NOAA's Global Summary of the Day: archived daily weather-station reports, including IMD's.</p>
<p><b>IDW.</b> Inverse distance weighting: nearer links count more when filling a square.</p>
<p><b>ITU-R P.838.</b> The international standard linking rain rate to microwave loss.</p>
<p><b>Loss ratio (payout share).</b> Claims ÷ premiums. We price for 60%.</p>
<p><b>Microwave link (CML).</b> A radio beam between two towers carrying network traffic.</p>
<p><b>Parametric insurance.</b> Pays automatically when a measured value crosses a trigger; no claim forms.</p>
<p><b>pycomlink.</b> KIT's open-source toolbox for rain from microwave links; source of our German data.</p>
<p><b>RADOLAN.</b> The German Weather Service's radar rainfall product, our answer key.</p>
<p><b>Reinsurance.</b> Insurance for the insurer, covering years when claims beat premiums.</p>
<p><b>Shadow mode.</b> The system decides who it would pay, but no money moves.</p>
<p><b>Trigger.</b> The measured level that causes a payout (10 mm in 3 hours; 64.5 mm a day; 47°C).</p>
<p><b>Tuning / test days.</b> 10–12 May to fit K; 13–20 May, never seen in tuning, for every score.</p>
<p><b>Wet-antenna attenuation.</b> Extra loss from water on the dishes, removed before computing rain.</p>
</div>'''))

html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>How We Got Our Numbers</title><style>' + FONTS + CSS + '''
.page{display:block}
figure svg{max-height:92mm}
.page:nth-of-type(15) figure svg{max-height:52mm}
.page:nth-of-type(17) figure svg{max-height:58mm}
.g2 figure svg{max-height:80mm}
sup{font-size:70%}
.g2>*,.g3>*{min-width:0}
.box .mono{overflow-wrap:anywhere}
</style></head><body>''' + ''.join(P) + '</body></html>'
open('numbers.html', 'w', encoding='utf-8').write(html)
OUTPDF = '/home/user/market-research-agent/reliance-tup-xii/JioMausam_How_We_Got_Our_Numbers.pdf'
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    pg = b.new_page(); pg.goto('file://' + os.path.abspath('numbers.html')); pg.evaluate('document.fonts.ready.then(()=>1)'); pg.wait_for_timeout(800); pg.emulate_media(media='print')
    over = pg.evaluate('''[...document.querySelectorAll('.page')].map((p,i)=>{const f=p.querySelector('.foot'),ft=f.getBoundingClientRect().top;let m=0,w=0;p.querySelectorAll('*').forEach(c=>{if(!f.contains(c)&&!c.closest('svg')){const r=c.getBoundingClientRect();if(r.height>0){m=Math.max(m,r.bottom);w=Math.max(w,r.right-p.getBoundingClientRect().right)}}});return [i+1,Math.round(m-ft+12),Math.round(w)]}).filter(a=>a[1]>0||a[2]>0)''')
    print('overflow (page, px past footer gap, px past right margin):', over)
    pg.pdf(path=OUTPDF, format='A4', print_background=True, prefer_css_page_size=True)
    b.close()
print('pages', page_no[0], os.path.getsize(OUTPDF) // 1024, 'KB')
