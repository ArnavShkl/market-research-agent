"""JioMausam final drill book: HTML -> PDF with Chromium (two passes so the contents page has real page numbers)."""
import re, sys, html
import pypdfium2 as pdfium
from playwright.sync_api import sync_playwright
sys.path.insert(0, '.')
from content_a import CHANGES, DRAFT_FIXES, KEPT, SLIDES
from content_c import TOP, SECTIONS
from content_d import BACKUP, KILL, LADDER, NUMBERS, NEVER, CHEAT
SP = '/tmp/claude-0/-home-user-market-research-agent/e8d4caac-b1a5-588e-8461-832ca62ca567/scratchpad/'
FONTS = open(SP + 'lab/fonts.css').read()
SCRIPT = [l.split('\t')[1] for l in open(SP + 'deck2/final_script_parts.txt', encoding='utf-8').read().splitlines()]
OUT = '/home/user/market-research-agent/reliance-tup-xii/JioMausam_Drill_Book_Final.pdf'

CSS = r"""
@page{size:A4;margin:14mm 15mm 16mm}
:root{--ink:#0E1424;--ink2:#2B3550;--mu:#5A6480;--line:#E3E1DB;--soft:#F6F4EF;--ac:#D9850F;--navy:#0B1530;
--blueS:#EAF2FC;--blueT:#1c5cab;--amberS:#FDF1DC;--amberT:#8a5200;--redS:#FBE9E7;--redT:#9d3128;--greenS:#E3F4EC;--greenT:#14704c;--greyS:#EEF0F4}
*{box-sizing:border-box}
html,body{margin:0;color:var(--ink);font:9.7pt/1.5 "DM Sans",system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,h4{font-family:Sora,"DM Sans",sans-serif;margin:0;letter-spacing:-.01em;color:var(--ink)}
h2{font-size:19pt;line-height:1.15;font-weight:800;margin:0 0 2.5mm;break-after:avoid}
h3{font-size:12.2pt;font-weight:700;margin:6mm 0 1.2mm;break-after:avoid}
p{margin:0 0 2.4mm}
.part{break-before:page}
.ch{font:700 7.8pt "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--ac);margin-bottom:1.6mm}
.lede{font-size:10.8pt;line-height:1.5;color:var(--ink2);margin-bottom:3.5mm}
.intro{color:var(--mu);font-size:9.3pt;margin:0 0 2.5mm}
.mu{color:var(--mu)}
ul{margin:0 0 2.4mm;padding-left:5mm} li{margin-bottom:.9mm}
table{width:100%;border-collapse:collapse;font-size:8.9pt;margin:1mm 0 3mm}
th{font:700 7.4pt "DM Sans",sans-serif;letter-spacing:.07em;text-transform:uppercase;color:var(--mu);text-align:left;border-bottom:1.2px solid var(--ink);padding:1.4mm 1.8mm}
td{border-bottom:1px solid var(--line);padding:1.6mm 1.8mm;vertical-align:top}
tr{break-inside:avoid}
.callout{border-radius:2.6mm;padding:3.2mm 4mm;margin:2.6mm 0;break-inside:avoid}
.callout p:last-child{margin-bottom:0}
.callout .tg{display:block;font:800 7.2pt "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:1mm}
.say{background:var(--navy);color:#EEF1F7}.say .tg{color:#F5A623}.say p{font-family:Sora,sans-serif;font-weight:600;font-size:10.2pt;line-height:1.45}
.honest{background:var(--redS)}.honest .tg{color:var(--redT)}
.plain{background:var(--blueS)}.plain .tg{color:var(--blueT)}
.good{background:var(--greenS)}.good .tg{color:var(--greenT)}
.chip{display:inline-block;font:700 7pt "DM Sans",sans-serif;letter-spacing:.05em;text-transform:uppercase;padding:.4mm 1.6mm;border-radius:1.2mm;white-space:nowrap}
.c-fact{background:var(--greenS);color:var(--greenT)}.c-calc{background:var(--blueS);color:var(--blueT)}
.c-target{background:var(--amberS);color:var(--amberT)}.c-assume{background:var(--redS);color:var(--redT)}.c-plan{background:var(--greyS);color:var(--ink2)}
.slide{border:1px solid var(--line);border-radius:3mm;padding:3.4mm 4.2mm;margin:0 0 4mm;break-inside:avoid}
.slide h4{font-size:11.4pt;margin-bottom:1.2mm}
.slide h4 span{color:var(--ac);font-family:"DM Sans";font-size:8pt;letter-spacing:.14em;text-transform:uppercase;margin-right:2mm}
.slide .lab{font:800 7pt "DM Sans";letter-spacing:.14em;text-transform:uppercase;color:var(--mu);margin:1.8mm 0 .6mm}
.slide ul{margin-bottom:1mm}
.slide .spk{background:var(--soft);border-left:2.4px solid var(--ac);padding:2mm 3mm;font-style:italic;color:var(--ink2);margin:1mm 0}
.slide .warn{color:var(--redT);font-size:9pt;margin-top:1.4mm}
.qa{margin:0 0 2.8mm;padding-bottom:2.4mm;border-bottom:1px solid var(--line);break-inside:avoid}
.qa .q{font-weight:700;font-size:9.9pt;margin-bottom:.6mm}
.qa .q::before{content:"Q";display:inline-block;width:4.6mm;height:4.6mm;border-radius:50%;background:var(--ink);color:#fff;font:800 7pt Sora;text-align:center;line-height:4.6mm;margin-right:1.8mm;vertical-align:1px}
.qa .a{color:var(--ink2);margin:0}
.qa .p{color:var(--mu);font-size:8.9pt;margin:.8mm 0 0}
.qa .p b{color:var(--ac)}
.top{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.top .qa{border:1px solid var(--line);border-radius:2.4mm;padding:2.6mm 3.2mm;margin:0}
.top .qa .a{font-size:9pt}
.small td{font-size:8.4pt}
.cheat{background:var(--navy);color:#EEF1F7;border-radius:3mm;padding:5mm 6mm;counter-reset:c}
.cheat div{display:grid;grid-template-columns:7mm 1fr;gap:2mm;padding:1.6mm 0;border-bottom:1px solid #26335a;font-family:Sora;font-weight:600;font-size:9.8pt;line-height:1.4}
.cheat div:last-child{border-bottom:0}
.cheat div::before{counter-increment:c;content:counter(c);color:#F5A623;font-weight:800}
.cover{height:266mm;background:var(--navy);color:#EEF1F7;border-radius:4mm;padding:20mm 16mm 14mm;position:relative;break-after:page}
.cover h1{color:#fff;font-size:38pt;line-height:1.02;font-weight:800;letter-spacing:-.02em}
.cover h1 span{color:#F5A623}
.cover .sub{font-family:Sora;font-size:13.5pt;line-height:1.35;color:#fff;margin:5mm 0 4mm;font-weight:600;max-width:150mm}
.cover p{color:#B9C2D8;font-size:10pt;max-width:155mm}
.cover .ch{color:#F5A623}
.toc{position:absolute;left:16mm;right:16mm;bottom:14mm;font-size:9.6pt;color:#D7DDEA;border-top:1px solid #26335a;padding-top:4mm}
.toc div{display:flex;justify-content:space-between;border-bottom:1px dotted #2d3a63;padding:1.1mm 0}
.toc div.sub2{padding-left:5mm;font-size:8.8pt;color:#B9C2D8}
.toc b{color:#F5A623;font-weight:600}
"""
CHIP = {'Fact': 'c-fact', 'Our calculation': 'c-calc', 'Our target': 'c-target', 'Our targets': 'c-target', 'Our assumption': 'c-assume', 'Plan': 'c-plan', 'Plan / targets': 'c-plan'}
chip = lambda t: f'<span class="chip {CHIP.get(t, "c-plan")}">{t}</span>'

def qa(q, a, p=None):
    return f'<div class="qa"><div class="q">{q}</div><p class="a">{a}</p>' + (f'<p class="p"><b>If pushed:</b> {p}</p>' if p else '') + '</div>'

def build(toc):
    T = lambda k: toc.get(k, '')
    H = [f'<style>{FONTS}{CSS}</style>']
    # ---------- cover ----------
    toc_rows = [('Part A · How the idea changed, and why', 'A', False), ('Part B · The final deck, slide by slide', 'B', False),
                ('Part C · Question bank', 'C', False), ('The 12 questions to know cold', 'C0', True)]
    toc_rows += [(t, f'S{i}', True) for i, (t, _, _) in enumerate(SECTIONS)]
    toc_rows += [('Part D · Backup plans: if an assumption fails', 'D', False), ('Part E · Number guide, never-say list, cheat sheet', 'E', False)]
    H.append('<section class="cover"><div class="ch">Reliance T.U.P XII · Elimination round · Team notes</div>'
             '<h1>JioMausam<br><span>Drill book</span></h1>'
             '<p class="sub">What we changed and why, the final deck slide by slide, every cross-question we can think of, and what we do if an assumption fails.</p>'
             '<p>How to use it: read Parts A and B once to know the story. Drill Part C out loud: say the answer, then stop. Know Part D well enough to answer “what if this fails?” for any slide. Keep Part E open the night before.</p>'
             '<div class="toc">' + ''.join(f'<div class="{"sub2" if s else ""}"><span>{t}</span><b>{T(k)}</b></div>' for t, k, s in toc_rows) + '</div></section>')
    # ---------- Part A ----------
    H.append('<section class="part"><div class="ch">Part A</div><h2 id="A">How the idea changed, and why</h2>'
             '<p class="lede">Our submitted video pitched an insurance-first idea: Jio’s towers measure rain, and Mausam Kavach pays riders automatically. Stress-testing broke three things: <b>accuracy</b> (links alone caught 68% of rain events), <b>who pays</b> (unproven), and <b>evidence</b> (several claims we could not back). The final deck keeps the core (Jio’s network signal and the Mumbai problem) but leads with weather intelligence and makes insurance optional.</p>'
             '<div class="callout say"><span class="tg">The line to own the change</span><p>“Our original idea was Kavach. After stress-testing the accuracy and who pays, we realised the stronger business is the weather intelligence underneath it. Kavach becomes one application of that intelligence.”</p></div>'
             '<h3>What the video said → what we say now → why</h3><table><tr><th style="width:31%">The video said</th><th style="width:30%">Now we say</th><th>Why we changed it</th></tr>'
             + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for a, b, c in CHANGES) + '</table>'
             '<h3>Fixes made while drafting the deck</h3><table class="small"><tr><th style="width:32%">Earlier draft</th><th style="width:34%">Final</th><th>Why</th></tr>'
             + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for a, b, c in DRAFT_FIXES) + '</table>'
             '<h3>What we kept from the video</h3><ul>' + ''.join(f'<li>{k}</li>' for k in KEPT) + '</ul>'
             '<div class="callout plain"><span class="tg">If they ask “why is the deck different from your video?”</span><p>“The video was our first version. Afterwards we stress-tested three things: accuracy, who pays, and evidence. Our own test showed links alone catch 68% of rain events, not enough to pay claims on, and we couldn’t prove who would pay for insurance. So we kept the core, Jio’s network signal and the Mumbai problem, and moved insurance from the anchor to an option. The video’s 95% was decision agreement including dry days; we now lead with the stricter 68%.”</p></div></section>')
    # ---------- Part B ----------
    B = ['<section class="part"><div class="ch">Part B</div><h2 id="B">The final deck, slide by slide</h2>'
         '<p class="lede">For each slide: why it exists, what is on screen, what you say, where every number comes from, and the trap to avoid. Labels: '
         + ' '.join(chip(x) for x in ['Fact', 'Our calculation', 'Our target', 'Our assumption', 'Plan']) + '.</p>']
    for s, spk in zip(SLIDES, SCRIPT):
        nums = ''.join(f'<tr><td style="width:34%">{a}</td><td style="width:22%">{chip(b)}</td><td>{c}</td></tr>' for a, b, c in s['nums'])
        B.append(f'<div class="slide"><h4><span>Slide {s["n"]}</span>{s["title"]}</h4><p class="mu" style="margin-bottom:1mm"><b>Why it’s there:</b> {s["purpose"]}</p>'
                 '<div class="lab">On screen</div><ul>' + ''.join(f'<li>{x}</li>' for x in s['screen']) + '</ul>'
                 f'<div class="lab">What you say</div><div class="spk">{spk}</div>'
                 + (f'<div class="lab">Numbers and where they come from</div><table class="small">{nums}</table>' if nums else '')
                 + f'<div class="warn"><b>Watch out:</b> {s["watch"]}</div></div>')
    H.append(''.join(B) + '</section>')
    # ---------- Part C ----------
    C = ['<section class="part"><div class="ch">Part C</div><h2 id="C">Question bank</h2>'
         '<p class="lede">Answer in two or three sentences, then stop. Every answer should end by pointing back to the strategy: combine sources, prove it inside Reliance, gates before scale.</p>'
         '<h3 id="C0">The 12 questions to know cold</h3><div class="top">' + ''.join(qa(q, a) for q, a in TOP) + '</div>']
    for i, (title, intro, items) in enumerate(SECTIONS):
        C.append(f'<h3 id="S{i}" style="margin-top:7mm">{title}</h3>' + (f'<p class="intro">{intro}</p>' if intro else '') + ''.join(qa(*it) for it in items))
    H.append(''.join(C) + '</section>')
    # ---------- Part D ----------
    H.append('<section class="part"><div class="ch">Part D</div><h2 id="D">Backup plans: if an assumption fails</h2>'
             '<p class="lede">Every main assumption has a test, a Plan B and a Plan C. The design principle: combining sources means JioMausam gets weaker gracefully instead of failing outright, and every gate is a cheap place to stop.</p>'
             '<table class="small"><tr><th style="width:21%">Assumption</th><th style="width:22%">How we find out</th><th style="width:29%">If it fails: Plan B</th><th>Plan C</th></tr>'
             + ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in BACKUP) + '</table>'
             '<h3>How the system degrades</h3><table class="small"><tr><th style="width:22%">Situation</th><th>What still runs</th></tr>'
             + ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td></tr>' for a, b in LADDER) + '</table>'
             '<h3>Stop criteria</h3><ul>' + ''.join(f'<li>{k}</li>' for k in KILL) + '</ul>'
             '<div class="callout say"><span class="tg">If they ask “what if your main assumption is wrong?”</span><p>“Then we find out in the first 30 days, cheaply. If Jio’s links are thin, the layer still runs on radar and gauges for Jio’s own operations. If accuracy falls short, we don’t scale and insurance never launches. Every gate is a place to stop with evidence.”</p></div></section>')
    # ---------- Part E ----------
    H.append('<section class="part"><div class="ch">Part E</div><h2 id="E">Number guide, never-say list, cheat sheet</h2>'
             '<h3 style="margin-top:2mm">Every number and where it comes from</h3><table class="small"><tr><th style="width:32%">Number</th><th style="width:17%">Label</th><th>Source</th></tr>'
             + ''.join(f'<tr><td><b>{a}</b></td><td>{chip(b)}</td><td>{c}</td></tr>' for a, b, c in NUMBERS) + '</table>'
             '<div class="callout plain"><span class="tg">Data links</span><p>Rain-sensing test: github.com/pycomlink/pycomlink (folder pycomlink/io/example_data; also <i>pip install pycomlink</i>). Radar reference inside it: German Weather Service RADOLAN YW (opendata.dwd.de). India: noaa-gsod-pds.s3.amazonaws.com/{year}/{station}.csv, stations 43003099999 Santacruz, 43057099999 Colaba, 42867099999 Nagpur, 42647099999 Ahmedabad. Rechecks: the Numbers Workbook and the Test Lab in our repository.</p></div>'
             '<h3>Never say → say instead</h3><table class="small"><tr><th style="width:44%">Never say</th><th>Say instead</th></tr>'
             + ''.join(f'<tr><td style="color:var(--redT)">{a}</td><td>{b}</td></tr>' for a, b in NEVER) + '</table>'
             '<div style="break-inside:avoid"><h3>The night-before cheat sheet</h3><div class="cheat">' + ''.join(f'<div>{c}</div>' for c in CHEAT) + '</div></div></section>')
    return '<!doctype html><html><head><meta charset="utf-8"><title>JioMausam drill book</title></head><body>' + ''.join(H) + '</body></html>'

FOOT = ('<div style="font-family:Helvetica,Arial,sans-serif;font-size:7pt;color:#5A6480;width:100%;padding:0 15mm;display:flex;justify-content:space-between">'
        '<span>JioMausam · Drill book (final)</span><span class="pageNumber"></span></div>')

def render(doc, path):
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
        pg = b.new_page(); pg.set_content(doc, wait_until='load'); pg.wait_for_timeout(400)
        pg.pdf(path=path, format='A4', print_background=True, prefer_css_page_size=True, display_header_footer=True,
               header_template='<span></span>', footer_template=FOOT)
        b.close()

def find_pages(path):
    keys = {'C': 'Question bank', 'A': 'How the idea changed, and why', 'B': 'The final deck, slide by slide', 'C': 'Question bank', 'C0': 'The 12 questions to know cold',
            'D': 'Backup plans: if an assumption fails', 'E': 'Number guide, never-say list, cheat sheet'}
    keys.update({f'S{i}': t for i, (t, _, _) in enumerate(SECTIONS)})
    d = pdfium.PdfDocument(path); texts = [re.sub(r'\s+', ' ', d[i].get_textpage().get_text_range()) for i in range(len(d))]
    out = {}
    for k, t in keys.items():
        start = int(out.get('C', 2)) if k.startswith('S') else 2
        for i in range(start, len(texts) + 1):
            if t in texts[i - 1]: out[k] = str(i); break
    return out, len(texts)

tmp = SP + 'drill2/pass1.pdf'
render(build({}), tmp)
toc, n1 = find_pages(tmp)
render(build(toc), OUT)
toc2, n2 = find_pages(OUT)
print('pages', n2, 'toc', toc2, 'stable', toc == toc2)
