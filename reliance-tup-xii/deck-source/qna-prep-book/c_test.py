# Part 5: how we tested the links (HTML blocks; {fig:name} placeholders are replaced with charts)
TEST = r"""
<h3>5.1 The question we asked</h3>
<p>Can the signal between two phone towers tell us how much it is raining, and is it good enough to make a yes/no decision (“pay” or “alert”) for a neighbourhood? We did <b>not</b> use Jio data (it isn’t public). We used the standard public research dataset that has both real tower links and an answer key.</p>

<h3>5.2 The data: what, where from, how big</h3>
<table class="small"><tr><th style="width:26%">File</th><th>What is inside</th><th style="width:22%">Size</th></tr>
<tr><td><b>example_cml_data.nc</b></td><td>500 real microwave links from a German mobile network. Each link has 2 channels (one per direction). For every minute from 10 to 20 May 2018: <b>tsl</b> (power sent, dBm) and <b>rsl</b> (power received, dBm). Per link: frequency, polarization, length, tower coordinates.</td><td>500 links × 2 channels × 15,840 minutes</td></tr>
<tr><td><b>example_path_averaged_reference_data.nc</b></td><td>German Weather Service radar rain averaged along each link’s path, every 5 minutes. The answer key for each link.</td><td>500 links × 3,168 five-minute steps</td></tr>
<tr><td><b>example_areal_reference_data.nc</b></td><td>The radar rain map itself (product “RADOLAN YW”, Deutscher Wetterdienst), every 5 minutes. The answer key for the map and the decision test.</td><td>190 × 228 squares of ~1 km</td></tr></table>
<ul><li><b>Where from:</b> the example data shipped with <b>pycomlink</b>, the open-source toolbox from Karlsruhe Institute of Technology (KIT), Germany, BSD licence: <b>github.com/pycomlink/pycomlink</b>, folder <i>pycomlink/io/example_data</i> (also installs with <i>pip install pycomlink</i>). Our copies are byte-for-byte identical.</li>
<li><b>The links:</b> length 0.5–28.6 km (typical 5.8 km); frequency 6.5–38.9 GHz (typical 24.9 GHz); 450 vertical and 50 horizontal polarization.</li>
<li><b>Location:</b> real network, but coordinates were shifted for anonymity (they appear in the North Sea). The pattern is real; the place is not.</li></ul>

<h3>5.3 The tools</h3>
<p>No AI and no machine learning: physics formulas plus simple statistics, in Python (xarray, numpy, scipy). From <b>pycomlink 0.6.0</b> we used three standard functions: the dry baseline, the wet-antenna correction (Schleiss et al., 2013) and the rain formula (ITU-R P.838, 2005 coefficients). Our own code does everything else: cleaning, wet/dry detection, calibration, the map and the decision test. File: <i>prototype/pipeline/rain_pipeline.py</i>. The Test Lab (a web page) repeats every step in your browser, and the Excel workbook recomputes the key numbers with live formulas.</p>

<h3>5.4 The physics in one page</h3>
<ul><li><b>dB and dBm.</b> Radio power is measured on a log scale. dBm is power compared with one milliwatt. A difference of 3 dB means half the power; 10 dB means one-tenth.</li>
<li><b>Signal loss</b> = power sent − power received. On a dry day it is steady (for link 359 about 59 dB). Rain adds extra loss.</li>
<li><b>The formula</b> (ITU-R P.838): <span class="mono">k = a × R<sup>b</sup></span>. k = extra loss per kilometre (dB/km), R = rain rate (mm per hour), a and b = constants that depend on frequency and polarization. Turn it round: <span class="mono">R = (k ÷ a)<sup>1/b</sup></span>.</li>
<li><b>Frequency matters.</b> Higher frequencies react more to rain (a is bigger). Very low-frequency, very long links barely react, which is why they score worse.</li>
<li><b>Path-averaged.</b> The loss happens along the whole beam, so a link tells you the average rain along its path, not the rain at one point.</li></ul>

<h3>5.5 Step by step, with a real link</h3>
<p><b>Link 359</b>: 8.47 km long, 23.1 GHz, vertical polarization (a = 0.129, b = 0.962). We compare a dry minute with a storm minute on 13 May 2018, 22:45.</p>
<table class="small"><tr><th style="width:4%">#</th><th style="width:34%">Step</th><th style="width:20%">Dry minute</th><th style="width:20%">Storm minute</th><th>Notes</th></tr>
<tr><td>1</td><td><b>Clean.</b> Remove error codes (tsl 255, rsl −99.9); fill gaps of up to 5 minutes with a straight line</td><td></td><td></td><td>Gaps longer than 5 min stay empty</td></tr>
<tr><td>2</td><td><b>Signal loss</b> = sent − received</td><td>19.0 − (−40.4) = <b>59.4 dB</b></td><td>19.0 − (−66.1) = <b>85.1 dB</b></td><td></td></tr>
<tr><td>3</td><td><b>Wet or dry?</b> Standard deviation (“wobble”) of the loss over the surrounding 60 minutes. Wet if above 1.12 × that channel’s 80th-percentile wobble</td><td>0.11 dB → dry</td><td><b>5.91 dB → wet</b></td><td>Link 359’s threshold: 0.345 dB. 453 of 1,440 minutes that day were wet</td></tr>
<tr><td>4</td><td><b>Dry baseline.</b> While dry, baseline = the loss itself; when wet, frozen at the average of the last 5 dry minutes</td><td>59.4</td><td><b>59.58 dB</b></td><td>The “no-rain” level</td></tr>
<tr><td>5</td><td><b>Wet antenna.</b> Water on the antennas adds loss that isn’t rain in the path; allowed up to 1.5 dB, building up over ~15 minutes</td><td>0</td><td><b>1.50 dB</b></td><td>Schleiss et al. 2013</td></tr>
<tr><td>6</td><td><b>Rain loss</b> A = loss − baseline − wet antenna (negative → 0)</td><td>0</td><td>85.1 − 59.58 − 1.50 = <b>24.02 dB</b></td><td></td></tr>
<tr><td>7</td><td><b>Loss per km</b> k = A ÷ length</td><td>0</td><td>24.02 ÷ 8.47 = <b>2.84 dB/km</b></td><td></td></tr>
<tr><td>8</td><td><b>Rain rate</b> R = (k ÷ a)<sup>1/b</sup>; below 0.1 mm/h → 0</td><td>0</td><td>(2.84 ÷ 0.129)<sup>1/0.962</sup> = <b>24.7 mm/h</b></td><td>ITU-R P.838</td></tr>
<tr><td>9</td><td><b>Both channels</b> averaged</td><td>0</td><td><b>24.1 mm/h</b></td><td>One number per link per minute</td></tr>
<tr><td>10</td><td><b>Hourly</b>: average each hour’s 60 minutes (= mm fallen in that hour)</td><td></td><td></td><td>Radar: 5-min amounts × 12 → mm/h, then hourly</td></tr></table>
{fig:sig}
{fig:rain359}

<h3>5.6 Calibration: one number, fitted fairly</h3>
<p>Raw link estimates come out a bit low overall, so we fit <b>one scale factor K for the whole network</b>, using only the first three days (10–12 May, the “tuning days”): K = radar’s total ÷ our total = 2,758 mm ÷ 2,352 mm = <b>1.17</b>. Every estimate is multiplied by 1.17. The last eight days (13–20 May, 192 hours) were <b>never</b> used for tuning, so every score below is on unseen data. It is like studying from last year’s paper and then sitting a new exam.</p>

<h3>5.7 Scoring the rain amounts (unseen days only)</h3>
<p><b>Correlation (r)</b> measures whether two series rise and fall together: 1 = perfectly together, 0 = no relation. It does <b>not</b> check amounts, so we also report <b>bias</b> (our total ÷ radar’s total).</p>
{fig:illus}
<table class="small"><tr><th style="width:18%">Score</th><th>How it’s calculated</th><th style="width:34%">What it means</th></tr>
<tr><td><b>0.953</b> network</td><td>Average all links each hour; correlate with radar’s average over 192 hours</td><td>The network as a whole tracks rain. Most forgiving: local errors cancel</td></tr>
<tr><td><b>0.882</b> typical link</td><td>Each link vs radar along its own path; middle value of 490 links (those with ≥100 valid hours and ≥5 mm of radar rain)</td><td>91% of links score above 0.7. Range 0.16–0.99</td></tr>
<tr><td><b>0.801</b> pooled</td><td>All link-hours thrown together</td><td>Mixes good and weak links and quiet hours</td></tr>
<tr><td><b>0.779</b> map</td><td>Our map vs radar’s map, every square, every test hour</td><td>Adds map-making error; lowest</td></tr>
<tr><td><b>0.82</b> bias</td><td>Our total ÷ radar’s total on test days (17,438 ÷ 21,312 mm)</td><td>We read 18% low; likely because the tuning days had little rain</td></tr>
<tr><td><b>91% / 5%</b></td><td>Per link per day: rain or no rain (0.1 mm+)</td><td>Rain days spotted 91% of the time, 5% false calls</td></tr></table>
{fig:net}
<div class="g2">{fig:scatter}{fig:hist}</div>
<table class="small"><tr><th>Example link</th><th>Length</th><th>Frequency</th><th>r (unseen)</th><th>Why</th></tr>
<tr><td>Best · 118</td><td>2.6 km</td><td>37.4 GHz</td><td>0.99</td><td>Short path at a high frequency that reacts strongly to rain</td></tr>
<tr><td>Typical · 359</td><td>8.5 km</td><td>23.1 GHz</td><td>0.88</td><td>The example above</td></tr>
<tr><td>Weak · 33</td><td>28.6 km</td><td>6.5 GHz</td><td>0.70</td><td>Very long, low-frequency link; reacts weakly, so small errors grow (it read 165 mm vs radar’s 78)</td></tr></table>

<h3>5.8 Making a map</h3>
<ol><li>Radar’s ~1 km map is merged 4 × 4 into squares of about 3 × 4 km (“~4 km zones”).</li>
<li>Each link’s hourly rain is placed at the midpoint of its path.</li>
<li>Each square takes the <b>8 nearest midpoints within 20 km</b> and averages them, nearer links counting more: weight = 1 ÷ distance² (a link 2 km away counts four times as much as one 4 km away). This is inverse distance weighting (IDW).</li>
<li>Only squares with a link midpoint within 6 km are kept: <b>1,782 squares</b>.</li></ol>
{fig:maps}

<h3>5.9 The decision test: where 68% comes from</h3>
<p><b>Rule:</b> a square “triggers” on a day if any 3 consecutive hours that day add up to <b>10 mm or more</b>. We ask our map and radar’s map the same question for every square on every test day: 1,782 squares × 8 days = <b>14,256 yes/no decisions</b>.</p>
<table class="cm"><tr><th></th><th>Radar: yes</th><th>Radar: no</th><th>Total</th></tr>
<tr><th>Links: yes</th><td class="hit">1,120<br><span>both yes</span></td><td class="fa">244<br><span>only us (unconfirmed)</span></td><td>1,364</td></tr>
<tr><th>Links: no</th><td class="miss">519<br><span>we missed</span></td><td class="cn">12,373<br><span>both no</span></td><td>12,892</td></tr>
<tr><th>Total</th><td>1,639</td><td>12,617</td><td>14,256</td></tr></table>
<ul><li><b>Events caught</b> = 1,120 ÷ 1,639 = <b>68.3%</b> (the number on slide 3).</li>
<li><b>Our triggers not confirmed by radar</b> = 244 ÷ 1,364 = <b>17.9%</b>.</li>
<li><b>Decisions that agree</b> = (1,120 + 12,373) ÷ 14,256 = <b>94.6%</b>: looks great only because most square-days are dry; never headline it.</li></ul>
<table class="small"><tr><th>Trigger level</th><th>Radar events</th><th>Caught</th><th>Unconfirmed</th><th>Agree</th></tr>
<tr><td>5 mm in 3 h</td><td>4,400</td><td>63.6%</td><td>9.2%</td><td>86.8%</td></tr>
<tr><td><b>10 mm in 3 h (ours)</b></td><td>1,639</td><td><b>68.3%</b></td><td>17.9%</td><td>94.6%</td></tr>
<tr><td>15 mm in 3 h</td><td>696</td><td>53.9%</td><td>35.3%</td><td>96.3%</td></tr></table>
<p>No trigger level gets near 80%, so the conclusion doesn’t depend on the rule we picked.</p>
{fig:trade}

<h3>5.10 Why links alone miss events</h3>
<ul><li>They read 18% low overall, so events just over 10 mm fall just under.</li>
<li>A link averages rain over its path, which smooths out sharp, local peaks.</li>
<li>Squares between links are estimated from neighbours, not measured.</li>
<li>One scale factor for 500 different links; production systems calibrate each area.</li>
<li>A threshold test is harsh: 9 mm against an 11 mm event counts as a full miss.</li></ul>

<div class="callout say"><span class="tg">The 25-second answer</span><p>“We used a public research dataset from KIT in Germany: 500 real phone-network links, signal every minute for 11 days, with the German weather service’s radar as the answer key. Rain weakens the signal; a standard formula turns that loss into rain. For every ~4 km zone each test day we asked: 10 mm in 3 hours? Radar said yes 1,639 times; links also said yes on 1,120. That’s 68%, below our 80% bar, which is why we never use links alone.”</p></div>

<h3>5.11 What this test proves, and what it doesn’t</h3>
<div class="g2"><div class="callout good"><span class="tg">It shows</span><p>Real phone-network links carry a strong rain signal (0.95 network, 0.88 typical link), with an open, published method that we ran ourselves.</p></div>
<div class="callout honest"><span class="tg">It doesn’t show</span><p>Anything about Jio’s network, Indian monsoon rain, rain gauges as truth (radar was the reference), or business value. Eleven days in May in Germany is a check of the method, not a validation of the product.</p></div></div>

<h3>5.12 Check it yourself</h3>
<ul><li><b>Excel:</b> <i>data/JioMausam_Numbers_Workbook.xlsx</i> recomputes 1.17, 0.95, 0.88, 94.6% / 68% / 18% with live formulas from the CSVs.</li>
<li><b>CSV files</b> in <i>data/germany/csv/</i>: links.csv, three_links_minute_by_minute.csv (every step for links 118, 359, 33), hourly rain for all links, network_average_hourly.csv (CORREL of the test rows = 0.953), payout_decisions_test_days.csv (the 14,256 decisions).</li>
<li><b>Test Lab and code:</b> <i>prototype/JioMausam_Test_Lab_standalone.html</i> reruns everything offline in a browser; the Python is <i>prototype/pipeline/rain_pipeline.py</i>.</li></ul>

"""
CAPTIONS = {
 'sig': "Link 359 on 13 May 2018, minute by minute. Top: signal loss (black) and the dry baseline held during rain (dashed). Bottom: the wobble and the wet threshold (0.34 dB). Blue bands: minutes marked wet (453 of 1,440).",
 'rain359': "Link 359’s hourly rain on 13 May: our estimate from the signal alone vs radar along the same path. Day total: ours 29.1 mm, radar 28.5 mm.",
 'illus': "Made-up example dots showing what different correlations look like.",
 'net': "Average rain over all 500 links, every hour for 11 days. Shaded: tuning days. Two completely different instruments: tower signals and weather radar.",
 'scatter': "Each dot is one test hour. Dots on the dashed line would be perfect agreement; they sit tightly along it, a little below (the 18% under-reading).",
 'hist': "Each link scored on its own. Most sit between 0.8 and 0.95.",
 'maps': "The heaviest test hour (13 May, 21:00 UTC). Left: built only from the 500 links (thin lines). Right: radar. Squares are about 3 × 4 km.",
 'trade': "Every trigger level from 3 to 20 mm re-scored. Lower triggers catch more events but agreement falls; higher triggers catch fewer and raise unconfirmed triggers.",
 'mumbai': "Every year since 2000, Santacruz had at least 5 heavy-rain days (fewest 5 in 2015, most 19 in 2010), so a 5-day cap is reached every year.",
 'stress': "Claims ÷ premiums, year by year, for the three Basic products. Red bars are loss years; solid line 100%, dashed 60% target. Plus is flat at 60% every year.",
}
