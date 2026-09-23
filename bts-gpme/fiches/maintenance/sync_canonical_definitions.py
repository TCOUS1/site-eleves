from pathlib import Path
import re, html
ROOT=Path(__file__).resolve().parents[1]
NOTIONS=ROOT/'connaissances'/'notions'
def clean(x): return ' '.join(html.unescape(re.sub(r'<[^>]+>',' ',x)).split())
definitions={}; by_title={}
for p in NOTIONS.glob('*.html'):
    s=p.read_text(encoding='utf-8',errors='ignore')
    dm=re.search(r'<div class="v41-definition">(.*?)</div>',s,re.S)
    hm=re.search(r'<h1>(.*?)</h1>',s,re.S)
    if dm and hm:
        definitions[p.name]=dm.group(1)
        by_title[clean(hm.group(1))]=dm.group(1)
changed=0; replacements=0
# Resource concept lists: href determines the canonical object.
for p in ROOT.glob('ressources/**/*.html'):
    s=p.read_text(encoding='utf-8',errors='ignore'); original=s
    pat=re.compile(r'(<dt><a[^>]+href="(?:\.\./)*connaissances/notions/([^"]+)"[^>]*>.*?</a></dt><dd>)(.*?)(</dd>)',re.S)
    def repl(m):
        nonlocal_marker=None
        fn=m.group(2); d=definitions.get(fn)
        if d is None: return m.group(0)
        return m.group(1)+d+m.group(4)
    s=pat.sub(repl,s)
    if s!=original:
        replacements+=1; changed+=1; p.write_text(s,encoding='utf-8')
# Mission concept lists: title determines the canonical object.
for p in (ROOT/'missions').glob('M*.html'):
    s=p.read_text(encoding='utf-8',errors='ignore'); original=s
    def repl2(m):
        title=clean(m.group(1)); d=by_title.get(title)
        return f'<dt>{m.group(1)}</dt><dd>{d}</dd>' if d is not None else m.group(0)
    s=re.sub(r'<dt>(.*?)</dt><dd>(.*?)</dd>',repl2,s,flags=re.S)
    if s!=original:
        replacements+=1; changed+=1; p.write_text(s,encoding='utf-8')
print(f'canonical definitions synchronized: files={changed}')
