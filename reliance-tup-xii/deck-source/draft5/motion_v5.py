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
def grp(names, kind='float', first='after', d0=0, dur=500):
    return [(n, kind, first if k==0 else 'with', d0 if k==0 else 0, dur) for k,n in enumerate(names)]
def seq(rows, kind='float', gap=50, dur=450):
    out=[]
    for r in rows: out += grp(r, kind, 'after', gap, dur)
    return out
K = [('kicker', 'fade', 'after', 0, 400), ('title', 'float', 'with', 100, 650)]
TK = [('takeaway','fade','after',120,500)]
SPEC = {
    1: (FADE_BLACK, K + grp(['hlCard','hlHead'],'fade','after',50,450) + [('hlChart','wipeU','after',0,800)]
        + grp(['knowCard','knowT'],'float','after',50,450) + [('knowA','fade','after',0,250)] + grp(['needCard','needT'],'float','after',0,450)
        + seq([[f'imp{i}', f'impI{i}', f'impT{i}'] for i in range(2)], 'float', 30, 400) + TK + [('source','fade','with',0,400)]),
    2: (MORPH, K + grp(['towerA','towerB'],'fade','after',50,450) + [('beam','wipeL','after',0,600), ('beamLab','fade','with',150,450)]
        + grp([f'drop{i}' for i in range(8)]+['how'],'fade','after',0,450) + grp(['defCard','defT','defT2'],'zoom','after',80,550)
        + seq([['isCard','isT'],['isntCard','isntT']], 'float', 40, 400) + TK),
    3: (MORPH, K + seq([[f'pf{i}', f'pfI{i}', f'pfK{i}', f'pfT{i}'] for i in range(3)], 'float', 40, 420) + grp(['banner','bannerT'],'fade','after',80,400)
        + seq([['tile0','tileT0'],['tile1','tileT1']], 'float', 30, 400) + grp(['tile2','tileT2'],'zoom','after',120,550)
        + [('chart','wipeL','after',50,1100)] + TK + [('source','fade','with',0,400)]),
    4: (MORPH, K + grp(['srcCard','srcK'],'fade','after',50,400) + seq([[f'srcI{i}', f'srcT{i}', f'srcP{i}', f'srcP{i}T'] for i in range(6)], 'float', 20, 300)
        + grp(['mixCard','mixK'],'fade','after',80,450) + grp(['mixL0','mixB0'],'fade','after',0,300) + [('mixF0','wipeL','after',0,600), ('mixV0','fade','with',300,300)]
        + seq([[f'mixL{i}', f'mixB{i}', f'mixV{i}'] for i in range(1,5)], 'fade', 20, 300) + grp(['tgtLine','tgtLab'],'fade','after',80,450)
        + [('rule','fade','after',60,400)] + TK),
    5: (MORPH, K + grp(['hero','heroI','heroH'],'zoom','after',60,550) + [('heroT','fade','after',0,500), ('heroQ','fade','after',60,500)] + grp(['heroP','heroPT'],'fade','after',0,400)
        + seq([[f'use{i}', f'useI{i}', f'useH{i}', f'useT{i}'] for i in range(2)], 'float', 40, 420) + TK),
    6: (MORPH, K + seq([[f'mk{i}', f'mkO{i}', f'mkN{i}', f'mkT{i}', f'mkP{i}', f'mkP{i}T'] for i in range(3)], 'float', 40, 400)
        + grp(['dcCard','dcK'],'fade','after',60,400) + seq([[f'dcB{i}', f'dcT{i}'] + ([f'dcA{i}'] if i<3 else []) for i in range(4)], 'wipeL', 20, 350)
        + grp(['whyCard','whyT'],'fade','after',80,500) + TK),
    7: (MORPH, K + seq([[f'moat{i}', f'moatK{i}', f'moatKT{i}', f'moatT{i}'] + ([f'moatA{i}'] if i<3 else []) for i in range(4)], 'wipeL', 30, 400)
        + [('moatLine','fade','after',80,500), ('revK','fade','after',60,350)] + seq([[f'rev{i}', f'revN{i}', f'revT{i}'] for i in range(3)], 'float', 30, 400) + TK),
    8: (MORPH, K + seq([[f'fl{i}', f'flI{i}', f'flT{i}'] + ([f'flA{i}'] if i<3 else []) for i in range(4)], 'float', 40, 400)
        + [('flNote','fade','after',0,400)] + grp(['gateCard','gateT'],'zoom','after',100,550) + TK),
    9: (MORPH, K + [('table','fade','after',50,700), ('formula','fade','after',50,400), ('plusNote','fade','with',100,400)]
        + seq([[f'city{i}', f'cityI{i}', f'cityT{i}', f'cityP{i}'] for i in range(3)], 'float', 30, 400) + [('heatNote','fade','after',0,400)] + TK + [('source','fade','with',0,400)]),
    10: (MORPH, K + seq([[f'pr{i}', f'prH{i}', f'prT{i}', f'prG{i}', f'prGT{i}'] for i in range(3)], 'float', 40, 420)
        + grp(['rmK','rmTable'],'fade','after',80,600) + [('gatesLine','fade','after',60,450), ('close','fade','after',200,900), ('source','fade','with',0,400)]),
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
