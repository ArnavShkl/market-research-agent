import re, base64, json, urllib.request, os
T=open('template.html',encoding='utf-8').read()
eng=open('engine.js',encoding='utf-8').read(); ind=open('india.js',encoding='utf-8').read()
meta=open('testlab-meta.json').read(); india=open('india-data.json').read()
for x in (eng,ind,meta,india): assert '</script' not in x
html=T.replace('/*__ENGINE__*/',eng).replace('/*__INDIAJS__*/',ind).replace('/*__META__*/',meta).replace('/*__INDIA__*/',india)
open('JioMausam_Test_Lab.html','w',encoding='utf-8').write(html)
print('artifact page KB',len(html.encode())//1024)
# fonts inlined for the offline file (latin + latin-ext)
if not os.path.exists('fonts.css'):
    url=re.search(r'href="(https://fonts.googleapis.com/css2[^"]+)"',T).group(1).replace('&amp;','&')
    css=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'})).read().decode()
    blocks=re.findall(r'/\* ([a-z-]+) \*/\s*(@font-face\s*{[^}]*})',css); out=[]
    for sub,b in blocks:
        if sub not in ('latin','latin-ext'): continue
        u=re.search(r'url\((https://[^)]+)\)',b).group(1)
        data=base64.b64encode(urllib.request.urlopen(u).read()).decode()
        out.append(b.replace(u,'data:font/woff2;base64,'+data))
    open('fonts.css','w').write('\n'.join(out))
fonts=open('fonts.css').read()
b64=base64.b64encode(open('testlab-data.bin','rb').read()).decode()
open('testlab-data.txt','w').write(b64)
head_end=html.index('</style>')+len('</style>')
head=re.sub(r'<link[^>]+>\n?','',html[:head_end]).replace('<style>','<style>\n'+fonts+'\n',1)
body=html[head_end:]
i=body.index('<script id="engine-src">')
body=body[:i]+'<script type="application/octet-stream" id="bin64">'+b64+'</script>\n'+body[i:]
sa=('<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<style>[hidden]{display:none!important}img{max-width:100%}</style>\n'+head+'\n</head><body>\n'+body+'\n</body></html>\n')
open('JioMausam_Test_Lab_standalone.html','w',encoding='utf-8').write(sa)
print('standalone MB',round(len(sa.encode())/1e6,2),'fonts KB',len(fonts)//1024)
