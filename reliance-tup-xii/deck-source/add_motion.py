"""Add slide transitions (Morph, fade through black) and auto-playing entrance animations to the deck.

PowerPoint 2019/365 plays Morph; older versions and Google Slides fall back to a fade.
Each slide's elements build automatically after the transition, in the order listed below.
"""
import re, sys, zipfile, shutil, os

SRC, DST = sys.argv[1], sys.argv[2]

MORPH = ('<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
         '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">'
         '<p:transition spd="slow"><p159:morph option="byObject"/></p:transition></mc:Choice>'
         '<mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>')
FADE_BLACK = '<p:transition spd="slow"><p:fade thruBlk="1"/></p:transition>'

# (object name, effect, 'after' | 'with', delay ms, duration ms)
K = [('kicker', 'fade', 'after', 0, 500), ('title', 'float', 'with', 120, 800)]
SPEC = {
    1: (FADE_BLACK, [('!!tower', 'fade', 'after', 200, 1400), ('kicker', 'fade', 'with', 500, 700), ('!!brand', 'float', 'with', 700, 1000),
                     ('tagline', 'fade', 'after', 150, 1000), ('sub', 'fade', 'after', 100, 800)]),
    2: (MORPH, K + [('shot', 'zoom', 'after', 100, 900), ('st1', 'float', 'after', 150, 700), ('st2', 'float', 'after', 100, 700),
                    ('link', 'fade', 'after', 100, 500), ('source', 'fade', 'with', 0, 500)]),
    3: (MORPH, K + [('chart', 'wipeL', 'after', 100, 1800), ('st1', 'float', 'after', 0, 600), ('st2', 'float', 'after', 100, 600),
                    ('st3', 'float', 'after', 100, 600), ('source', 'fade', 'with', 0, 500)]),
    4: (MORPH, K + [('chart', 'wipeU', 'after', 100, 1300), ('insight', 'fade', 'after', 100, 700),
                    ('city0', 'float', 'after', 100, 600), ('cityT0', 'float', 'with', 0, 600), ('cityP0', 'float', 'with', 0, 600),
                    ('city1', 'float', 'after', 0, 600), ('cityT1', 'float', 'with', 0, 600), ('cityP1', 'float', 'with', 0, 600),
                    ('city2', 'float', 'after', 0, 600), ('cityT2', 'float', 'with', 0, 600), ('cityP2', 'float', 'with', 0, 600),
                    ('source', 'fade', 'with', 0, 500)]),
    5: (MORPH, K + [('phone0', 'float', 'after', 100, 900), ('cap0', 'fade', 'with', 400, 600),
                    ('phone1', 'float', 'after', 100, 900), ('cap1', 'fade', 'with', 400, 600),
                    ('phone2', 'float', 'after', 100, 900), ('cap2', 'fade', 'with', 400, 600)]),
    6: (MORPH, K + [('bignum', 'zoom', 'after', 100, 900), ('why', 'fade', 'after', 100, 600),
                    ('col0', 'float', 'after', 0, 600), ('colT0', 'float', 'with', 0, 600),
                    ('col1', 'float', 'after', 0, 600), ('colT1', 'float', 'with', 0, 600),
                    ('col2', 'float', 'after', 0, 600), ('colT2', 'float', 'with', 0, 600), ('source', 'fade', 'with', 0, 500)]),
    7: (MORPH, K + [(f'layer{i}', 'wipeL', 'after', 60, 450) for i in range(5)] +
                   [('askBox', 'zoom', 'after', 150, 700), ('askText', 'fade', 'with', 350, 700)]),
    8: (FADE_BLACK, [('line1', 'fade', 'after', 400, 1300), ('line2', 'fade', 'after', 500, 1300), ('!!brand', 'zoom', 'after', 400, 900),
                     ('tag', 'fade', 'with', 300, 800)]),
}

class Ids:
    def __init__(self): self.n = 2
    def __call__(self): self.n += 1; return self.n

def set_vis(nid, spid):
    return (f'<p:set><p:cBhvr><p:cTn id="{nid()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="visible"/></p:to></p:set>')

def anim(nid, spid, attr, frm, to, dur, frm_is_num=False):
    fv = f'<p:fltVal val="{frm}"/>' if frm_is_num else f'<p:strVal val="{frm}"/>'
    return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="{nid()}" dur="{dur}" fill="hold"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:tavLst><p:tav tm="0"><p:val>{fv}</p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="{to}"/></p:val></p:tav></p:tavLst></p:anim>')

def effect_filter(nid, spid, filt, dur):
    return (f'<p:animEffect transition="in" filter="{filt}"><p:cBhvr><p:cTn id="{nid()}" dur="{dur}"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>')

def effect(nid, kind, spid, node, delay, dur):
    ctn = nid()
    if kind == 'fade':
        pid, sub, body = 10, 0, set_vis(nid, spid) + effect_filter(nid, spid, 'fade', dur)
    elif kind == 'float':
        pid, sub, body = 42, 0, (set_vis(nid, spid) + effect_filter(nid, spid, 'fade', dur) +
                                 anim(nid, spid, 'ppt_x', '#ppt_x', '#ppt_x', dur) + anim(nid, spid, 'ppt_y', '#ppt_y+.06', '#ppt_y', dur))
    elif kind == 'zoom':
        pid, sub, body = 53, 16, (set_vis(nid, spid) + anim(nid, spid, 'ppt_w', '#ppt_w*.82', '#ppt_w', dur) +
                                  anim(nid, spid, 'ppt_h', '#ppt_h*.82', '#ppt_h', dur) + effect_filter(nid, spid, 'fade', dur))
    elif kind == 'wipeL':
        pid, sub, body = 22, 8, set_vis(nid, spid) + effect_filter(nid, spid, 'wipe(left)', dur)
    elif kind == 'wipeU':
        pid, sub, body = 22, 4, set_vis(nid, spid) + effect_filter(nid, spid, 'wipe(down)', dur)
    else:
        raise ValueError(kind)
    return (f'<p:par><p:cTn id="{ctn}" presetID="{pid}" presetClass="entr" presetSubtype="{sub}" fill="hold" grpId="0" nodeType="{node}">'
            f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>{body}</p:childTnLst></p:cTn></p:par>')

def build_timing(effects, shapes):
    nid = Ids()
    groups, cur = [], None
    for name, kind, trig, delay, dur in effects:
        if name not in shapes:
            raise KeyError(f'no shape named {name!r}; have {sorted(shapes)}')
        if trig == 'after' or cur is None:
            cur = []; groups.append(cur)
        cur.append((name, kind, 'afterEffect' if not cur else 'withEffect', delay, dur))
    out, t0 = [], 0
    for g in groups:
        pid = nid()
        inner = ''.join(effect(nid, kind, shapes[name][0], node, delay, dur) for name, kind, node, delay, dur in g)
        out.append(f'<p:par><p:cTn id="{pid}" fill="hold"><p:stCondLst><p:cond delay="{t0}"/></p:stCondLst><p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>')
        t0 += max(d + du for _, _, _, d, du in g)
    root = (f'<p:par><p:cTn id="{nid()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst>'
            f'<p:childTnLst>{"".join(out)}</p:childTnLst></p:cTn></p:par>')
    seen, bld = set(), []
    for name, *_ in effects:
        spid, tag, has_text = shapes[name]
        if spid in seen: continue
        seen.add(spid)
        if tag == 'sp': bld.append(f'<p:bldP spid="{spid}" grpId="0"' + ('' if has_text else ' animBg="1"') + '/>')
        elif tag == 'graphicFrame': bld.append(f'<p:bldGraphic spid="{spid}" grpId="0"><p:bldAsOne/></p:bldGraphic>')
    return ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>' + root +
            '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
            '</p:childTnLst></p:cTn></p:par></p:tnLst>' + (f'<p:bldLst>{"".join(bld)}</p:bldLst>' if bld else '') + '</p:timing>')

def shapes_by_name(xml):
    found = {}
    for m in re.finditer(r'<p:(sp|pic|graphicFrame|cxnSp)>(.*?)</p:\1>', xml, re.S):
        tag, body = m.group(1), m.group(2)
        c = re.search(r'<p:cNvPr id="(\d+)" name="([^"]*)"', body)
        if c:
            has_text = bool(re.search(r'<a:t>[^<]*\S[^<]*</a:t>', body))
            found[c.group(2)] = (c.group(1), tag, has_text)
    return found

tmp = DST + '.dir'
shutil.rmtree(tmp, ignore_errors=True)
with zipfile.ZipFile(SRC) as z: z.extractall(tmp)
for n, (trans, effects) in SPEC.items():
    p = f'{tmp}/ppt/slides/slide{n}.xml'
    x = open(p, encoding='utf-8').read()
    x = re.sub(r'<p:transition.*?</p:transition>|<p:timing>.*?</p:timing>', '', x, flags=re.S)
    xml = trans + build_timing(effects, shapes_by_name(x))
    if '</p:clrMapOvr>' in x: x = x.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + xml, 1)
    else: x = x.replace('</p:cSld>', '</p:cSld>' + xml, 1)
    open(p, 'w', encoding='utf-8').write(x)
if os.path.exists(DST): os.remove(DST)
with zipfile.ZipFile(DST, 'w', zipfile.ZIP_DEFLATED) as z:
    # [Content_Types].xml first, as Office expects
    z.write(f'{tmp}/[Content_Types].xml', '[Content_Types].xml')
    for root, _, files in os.walk(tmp):
        for f in files:
            full = os.path.join(root, f); arc = os.path.relpath(full, tmp)
            if arc != '[Content_Types].xml': z.write(full, arc)
shutil.rmtree(tmp)
print('motion added ->', DST)
