"""JioMausam complete Q&A prep book (based on the submitted short pitch video and the final presentation)."""
import re, sys, json
import pypdfium2 as pdfium
from playwright.sync_api import sync_playwright
SP = '/tmp/claude-0/-home-user-market-research-agent/e8d4caac-b1a5-588e-8461-832ca62ca567/scratchpad/'
sys.path[:0] = [SP + 'book', SP + 'drill2']
from c_kid_video import KID, KID_SUMMARY, VIDEO_SCENES, VIDEO_CHANGES, VIDEO_KEPT, VIDEO_NEW
from c_test import TEST, CAPTIONS
from c_india import INDIA
from c_gloss_q import GLOSSARY, VIDEO_Q, FIVE_W, EXTRA_TECH
from content_a import SLIDES
from content_c import TOP, SECTIONS
from content_d import BACKUP, KILL, LADDER, NUMBERS, NEVER, CHEAT
import build as DB   # reuse CSS, chip(), qa()

OUT = '/home/user/market-research-agent/reliance-tup-xii/JioMausam_Complete_QnA_Prep_Book.pdf'
FONTS = DB.FONTS
SCRIPT = DB.SCRIPT
CH = json.load(open(SP + 'numbers/charts.json'))
CH['trade'] = CH['trade'].replace('false triggers', 'unconfirmed triggers')
SECTIONS = [s for s in SECTIONS if s[0] != 'The video vs the deck']
SECTIONS = [(t, i, items + EXTRA_TECH if t == 'The technology' else items) for t, i, items in SECTIONS]
NEVER = NEVER + [("“Every phone is a thermometer.”", "“Heat comes from IMD stations and satellite.”"),
                 ("“The network measures temperature near you.”", "“Links sense rain only.”"),
                 ("“₹29 a month for everyone.”", "“Prices depend on the city; ₹29 is our minimum.”"),
                 ("“Zero new hardware.”", "“Mostly existing infrastructure; gauges only where links are thin.”"),
                 ("“Heat will cost India 34 million jobs.”", "“Working hours equal to about 34 million full-time jobs (ILO).”")]

CSS = DB.CSS + r"""
figure{margin:2mm 0 3.4mm;break-inside:avoid}
figure svg{width:100%;max-width:140mm;max-height:84mm;height:auto;display:block;margin:0 auto}
.g2 figure svg{max-width:100%}
.cover .toc{position:absolute;left:16mm;right:16mm;bottom:12mm;display:grid;grid-template-columns:1fr 1fr;column-gap:8mm;grid-auto-flow:column;grid-template-rows:repeat(15,auto)}
.cover .toc div{font-size:8.6pt;padding:.9mm 0}
.cover .toc div.sub2{font-size:8pt}
figcaption{font-size:8.3pt;color:var(--mu);margin-top:1mm;line-height:1.4}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.kid{display:grid;grid-template-columns:1fr 1fr;gap:3.2mm}
.kid .box{border:1px solid var(--line);border-radius:2.6mm;padding:3mm 3.6mm;break-inside:avoid}
.kid h4{font-size:10.4pt;margin-bottom:1mm;color:var(--ac)}
.kid p{margin:0;font-size:9.4pt}
.vc{border:1px solid var(--line);border-radius:2.6mm;padding:3mm 3.6mm;margin:0 0 3mm;break-inside:avoid}
.vc .row{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-bottom:1.6mm}
.vc .lab{font:800 6.8pt "DM Sans";letter-spacing:.14em;text-transform:uppercase;margin-bottom:.4mm}
.vc .old .lab{color:var(--redT)} .vc .new .lab{color:var(--greenT)}
.vc .old{background:var(--redS);border-radius:1.8mm;padding:2mm 2.6mm;font-size:9pt}
.vc .new{background:var(--greenS);border-radius:1.8mm;padding:2mm 2.6mm;font-size:9pt}
.vc .why{font-size:9pt;color:var(--ink2);margin:0 0 .8mm}
.vc .ask{font-size:9pt;font-style:italic;color:var(--blueT);margin:0}
.formula{font-family:Sora;font-weight:700;font-size:12pt;background:var(--amberS);color:var(--amberT);border-radius:2.4mm;padding:3mm 4mm;margin:2mm 0 3mm;text-align:center}
table.cm{width:auto;margin:2mm 0 3mm;font-size:9.4pt}
table.cm th{text-transform:none;letter-spacing:0;font-size:8.6pt;color:var(--ink);border:1px solid var(--line);text-align:center;padding:2mm 3mm}
table.cm td{border:1px solid var(--line);text-align:center;padding:2.4mm 5mm;font-family:Sora;font-weight:700;font-size:11pt}
table.cm td span{font-family:"DM Sans";font-weight:500;font-size:7.6pt;color:var(--mu)}
table.cm td.hit{background:var(--greenS)} table.cm td.cn{background:var(--soft)} table.cm td.miss{background:var(--redS)} table.cm td.fa{background:var(--amberS)}
.gl{columns:2;column-gap:7mm}
.gl h4{font-size:9.4pt;color:var(--ac);letter-spacing:.1em;text-transform:uppercase;font-family:"DM Sans";margin:3mm 0 1.4mm;break-after:avoid}
.gl p{margin:0 0 1.8mm;font-size:8.9pt;break-inside:avoid;line-height:1.42}
.five{display:grid;grid-template-columns:1fr 1fr;gap:2mm 4mm}
.five div{border-bottom:1px solid var(--line);padding:1.4mm 0;break-inside:avoid;font-size:9pt}
.five b{display:block;font-size:9.4pt}
.script p{margin:0 0 1.6mm;font-size:9.2pt}
.script b{color:var(--ac)}
"""
fig = lambda k: f'<figure>{CH[k]}<figcaption>{CAPTIONS[k]}</figcaption></figure>'
def figs(html): return re.sub(r'\{fig:(\w+)\}', lambda m: fig(m.group(1)), html)
chip, qa = DB.chip, DB.qa

PARTS = [('P1', 'JioMausam explained like you’re 10'), ('P2', 'Our two deliverables: the video and the presentation'),
         ('P3', 'What we removed from the video, and what we refined'), ('P4', 'The presentation, slide by slide'),
         ('P5', 'How we tested the microwave links: every detail'), ('P6', 'The India data and pricing: every detail'),
         ('P7', 'Glossary: every term explained'), ('P8', 'Question bank'), ('P9', 'Backup plans: if an assumption fails'),
         ('P10', 'Number guide, never-say list, cheat sheet')]
QSUB = [('Q0', 'The 12 questions to know cold'), ('Q1', 'Quick-fire: what, who, why, how, when, where'), ('Q2', 'Questions about our video')] + \
       [(f'S{i}', t) for i, (t, _, _) in enumerate(SECTIONS)]

def head(key, n, title):
    return f'<section class="part"><div class="ch">Part {n}</div><h2 id="{key}">{title}</h2>'

def build(toc):
    T = lambda k: toc.get(k, '')
    H = [f'<style>{FONTS}{CSS}</style>']
    rows = []
    for k, t in PARTS:
        rows.append(f'<div><span>{t}</span><b>{T(k)}</b></div>')
        if k == 'P8': rows += [f'<div class="sub2"><span>{t2}</span><b>{T(k2)}</b></div>' for k2, t2 in QSUB]
    H.append('<section class="cover"><div class="ch">Reliance T.U.P XII · Elimination round · Team prep book</div>'
             '<h1>JioMausam<br><span>Complete Q&amp;A prep</span></h1>'
             '<p class="sub">Everything behind our video and our presentation, explained simply: every term, every number, how we tested the links, what changed and why, every cross-question we can think of, and the backup plan for each assumption.</p>'
             '<p>Read Parts 1–4 for the story, Parts 5–6 for the evidence, Part 7 whenever a word is unclear. Drill Part 8 out loud: answer, then stop. Know Part 9 for any “what if it fails?”. Keep Part 10 open the night before.</p>'
             '<div class="toc">' + ''.join(rows) + '</div></section>')
    # Part 1
    H.append(head('P1', 1, PARTS[0][1]) + '<p class="lede">No jargon. If you can explain this page to a 10-year-old, you can explain it to a judge.</p><div class="kid">'
             + ''.join(f'<div class="box"><h4>{t}</h4><p>{p}</p></div>' for t, p in KID) + '</div>'
             f'<div class="callout say"><span class="tg">The whole thing in one breath</span><p>{KID_SUMMARY}</p></div></section>')
    # Part 2
    vs = ''.join(f'<tr><td style="width:13%"><b>{a}</b></td><td>{b}</td><td style="width:30%"><i>{c}</i></td></tr>' for a, b, c in VIDEO_SCENES)
    sl = ''.join(f'<tr><td style="width:6%"><b>{s["n"]}</b></td><td style="width:38%">{s["title"]}</td><td>{s["purpose"]}</td></tr>' for s in SLIDES)
    sc = ''.join(f'<p><b>Slide {i}.</b> {t}</p>' for i, t in enumerate(SCRIPT, 1))
    H.append(head('P2', 2, PARTS[1][1]) +
             '<p class="lede">Judges have seen our <b>video</b> (submitted earlier, 1 minute 45 seconds, it cannot be changed). In the round we give the <b>presentation</b> (10 slides, 3 minutes) and then answer questions for 4 minutes. The video was our first version; the presentation is the stress-tested version. Expect questions about the gap between them (Part 3).</p>'
             '<h3>The video, scene by scene</h3><table class="small"><tr><th>Scene</th><th>On screen</th><th>Said aloud</th></tr>' + vs + '</table>'
             '<h3>The presentation, at a glance</h3><table class="small"><tr><th>#</th><th>Slide title</th><th>Why it is there</th></tr>' + sl + '</table>'
             '<h3>What we say in the presentation (about 3 minutes)</h3><div class="script">' + sc + '</div></section>')
    # Part 3
    vc = ''.join(f'<div class="vc"><div class="row"><div class="old"><div class="lab">The video said</div>{a}</div><div class="new"><div class="lab">The presentation says</div>{b}</div></div>'
                 f'<p class="why"><b>Why:</b> {c}</p><p class="ask">If asked: {d}</p></div>' for a, b, c, d in VIDEO_CHANGES)
    H.append(head('P3', 3, PARTS[2][1]) +
             '<p class="lede">After the video we stress-tested three things: <b>accuracy</b> (our own check: links alone caught 68% of rain events), <b>who pays</b> (unproven) and <b>evidence</b> (several claims we couldn’t back). We kept the core idea and changed what didn’t survive.</p>'
             '<div class="callout say"><span class="tg">The line to own the change</span><p>“Our original idea was Kavach. After stress-testing the accuracy and who pays, we realised the stronger business is the weather intelligence underneath it. Kavach becomes one application of that intelligence.”</p></div>'
             + vc + '<div class="g2"><div class="callout good"><span class="tg">Kept from the video</span><ul>' + ''.join(f'<li>{k}</li>' for k in VIDEO_KEPT) + '</ul></div>'
             '<div class="callout plain"><span class="tg">New in the presentation</span><ul>' + ''.join(f'<li>{k}</li>' for k in VIDEO_NEW) + '</ul></div></div>'
             '<div class="callout plain"><span class="tg">If they ask “why is your presentation so different from your video?”</span><p>“The video was our first version. Afterwards we stress-tested accuracy, who pays and evidence. Our own test showed links alone catch 68% of rain events, not enough to pay claims on, and we couldn’t prove who would pay for insurance. So we kept the core, Jio’s network as a weather signal, and moved insurance from the anchor to an option. We’d rather show you what survived testing than defend what didn’t.”</p></div></section>')
    # Part 4
    B = [head('P4', 4, PARTS[3][1]) + '<p class="lede">For each slide: why it exists, what is on screen, what you say, where every number comes from, and the trap to avoid. Labels: '
         + ' '.join(chip(x) for x in ['Fact', 'Our calculation', 'Our target', 'Our assumption', 'Plan']) + '.</p>']
    for s, spk in zip(SLIDES, SCRIPT):
        nums = ''.join(f'<tr><td style="width:34%">{a}</td><td style="width:22%">{chip(b)}</td><td>{c}</td></tr>' for a, b, c in s['nums'])
        B.append(f'<div class="slide"><h4><span>Slide {s["n"]}</span>{s["title"]}</h4><p class="mu" style="margin-bottom:1mm"><b>Why it’s there:</b> {s["purpose"]}</p>'
                 '<div class="lab">On screen</div><ul>' + ''.join(f'<li>{x}</li>' for x in s['screen']) + '</ul>'
                 f'<div class="lab">What you say</div><div class="spk">{spk}</div>'
                 + (f'<div class="lab">Numbers and where they come from</div><table class="small">{nums}</table>' if nums else '')
                 + f'<div class="warn"><b>Watch out:</b> {s["watch"]}</div></div>')
    H.append(''.join(B) + '</section>')
    # Parts 5, 6
    H.append(head('P5', 5, PARTS[4][1]) + '<p class="lede">The full chain behind “links alone caught 68%”: the data, the tools, every step with a real link, the scores, the map and the decision test. Every number here can be rechecked from public data.</p>' + figs(TEST) + '</section>')
    H.append(head('P6', 6, PARTS[5][1]) + '<p class="lede">Where the prices on slide 9 come from: real IMD records, simple counting, one formula, and a stress test of every year since 2000.</p>' + figs(INDIA) + '</section>')
    # Part 7
    g = ''.join(f'<h4>{sec}</h4>' + ''.join(f'<p><b>{t}.</b> {d}</p>' for t, d in items) for sec, items in GLOSSARY)
    H.append(head('P7', 7, PARTS[6][1]) + '<p class="lede">Every word you might hear or need, in one line each.</p><div class="gl">' + g + '</div></section>')
    # Part 8
    C = [head('P8', 8, PARTS[7][1]) + '<p class="lede">Answer in two or three sentences, then stop. End by pointing back to the strategy: combine sources, prove it inside Reliance, gates before scale.</p>'
         '<h3 id="Q0">The 12 questions to know cold</h3><div class="top">' + ''.join(qa(q, a) for q, a in TOP) + '</div>'
         '<h3 id="Q1" style="margin-top:7mm">Quick-fire: what, who, why, how, when, where</h3><div class="five">' + ''.join(f'<div><b>{q}</b>{a}</div>' for q, a in FIVE_W) + '</div>'
         '<h3 id="Q2" style="margin-top:7mm">Questions about our video</h3><p class="intro">Judges saw the video. Own every change; never pretend it didn’t say something.</p>' + ''.join(qa(*x) for x in VIDEO_Q)]
    for i, (title, intro, items) in enumerate(SECTIONS):
        C.append(f'<h3 id="S{i}" style="margin-top:7mm">{title}</h3>' + (f'<p class="intro">{intro}</p>' if intro else '') + ''.join(qa(*it) for it in items))
    H.append(''.join(C) + '</section>')
    # Part 9
    H.append(head('P9', 9, PARTS[8][1]) +
             '<p class="lede">Every main assumption has a test, a Plan B and a Plan C. Because we combine sources, JioMausam gets weaker gracefully instead of failing outright, and every gate is a cheap place to stop.</p>'
             '<table class="small"><tr><th style="width:21%">Assumption</th><th style="width:22%">How we find out</th><th style="width:29%">If it fails: Plan B</th><th>Plan C</th></tr>'
             + ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in BACKUP) + '</table>'
             '<h3>How the system degrades</h3><table class="small"><tr><th style="width:22%">Situation</th><th>What still runs</th></tr>'
             + ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td></tr>' for a, b in LADDER) + '</table>'
             '<h3>Stop criteria</h3><ul>' + ''.join(f'<li>{k}</li>' for k in KILL) + '</ul>'
             '<div class="callout say"><span class="tg">If they ask “what if your main assumption is wrong?”</span><p>“Then we find out in the first 30 days, cheaply. If Jio’s links are thin, the layer still runs on radar and gauges for Jio’s own operations. If accuracy falls short, we don’t scale and insurance never launches. Every gate is a place to stop with evidence.”</p></div></section>')
    # Part 10
    H.append(head('P10', 10, PARTS[9][1]) +
             '<h3 style="margin-top:2mm">Every number and where it comes from</h3><table class="small"><tr><th style="width:32%">Number</th><th style="width:17%">Label</th><th>Source</th></tr>'
             + ''.join(f'<tr><td><b>{a}</b></td><td>{chip(b)}</td><td>{c}</td></tr>' for a, b, c in NUMBERS) + '</table>'
             '<div class="callout plain"><span class="tg">Data links</span><p>Rain-sensing test: github.com/pycomlink/pycomlink (folder pycomlink/io/example_data; also <i>pip install pycomlink</i>). Radar reference inside it: German Weather Service RADOLAN YW (opendata.dwd.de). India: noaa-gsod-pds.s3.amazonaws.com/{year}/{station}.csv, stations 43003099999 Santacruz, 43057099999 Colaba, 42867099999 Nagpur, 42647099999 Ahmedabad. Papers: Messer et al., Science 2006 (doi:10.1126/science.1120034); Overeem et al., PNAS 2013 (doi:10.1073/pnas.1217961110).</p></div>'
             '<h3>Never say → say instead</h3><table class="small"><tr><th style="width:44%">Never say</th><th>Say instead</th></tr>'
             + ''.join(f'<tr><td style="color:var(--redT)">{a}</td><td>{b}</td></tr>' for a, b in NEVER) + '</table>'
             '<div style="break-inside:avoid"><h3>The night-before cheat sheet</h3><div class="cheat">' + ''.join(f'<div>{c}</div>' for c in CHEAT) + '</div></div></section>')
    return '<!doctype html><html><head><meta charset="utf-8"><title>JioMausam complete Q&amp;A prep</title></head><body>' + ''.join(H) + '</body></html>'

FOOT = DB.FOOT.replace('Drill book (final)', 'Complete Q&amp;A prep')

def find_pages(path):
    d = pdfium.PdfDocument(path); texts = [re.sub(r'\s+', ' ', d[i].get_textpage().get_text_range()) for i in range(len(d))]
    out = {}
    for k, t in PARTS:
        for i in range(2, len(texts) + 1):
            if t in texts[i - 1]: out[k] = i; break
    for k, t in QSUB:
        for i in range(out.get('P8', 2), len(texts) + 1):
            if t in texts[i - 1]: out[k] = i; break
    return {k: str(v) for k, v in out.items()}, len(texts)

def render(doc, path):
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
        pg = b.new_page(); pg.set_content(doc, wait_until='load'); pg.wait_for_timeout(500)
        pg.pdf(path=path, format='A4', print_background=True, prefer_css_page_size=True, display_header_footer=True,
               header_template='<span></span>', footer_template=FOOT)
        b.close()

tmp = SP + 'book/pass1.pdf'
render(build({}), tmp); toc, _ = find_pages(tmp)
render(build(toc), OUT); toc2, n = find_pages(OUT)
print('pages', n, 'stable', toc == toc2, toc2)
