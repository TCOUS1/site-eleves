#!/usr/bin/env python3
"""Validation structurelle portable de la version enseignant/source v2.10."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit, unquote
from collections import Counter
import json, subprocess, sys
try:
    import tinycss2
except Exception:
    tinycss2=None
ROOT=Path(__file__).resolve().parents[1]
errors=[]; warnings=[]
def err(x): errors.append(x)
def read(p): return p.read_text(encoding='utf-8',errors='replace')
htmls=sorted(ROOT.rglob('*.html')); soups={}; ids={}
for f in htmls:
    s=BeautifulSoup(read(f),'html.parser'); soups[f]=s
    vals=[n.get('id') for n in s.find_all(attrs={'id':True})]
    d=[k for k,v in Counter(vals).items() if v>1]
    if d: err(f"ID dupliqués {f.relative_to(ROOT)}: {d[:5]}")
    ids[f]=set(vals)
for f,s in soups.items():
    for tag,attr in [('a','href'),('link','href'),('script','src'),('img','src')]:
        for n in s.find_all(tag):
            v=(n.get(attr) or '').strip()
            if not v or v.startswith(('http://','https://','mailto:','tel:','javascript:','data:','//')): continue
            u=urlsplit(v); p=unquote(u.path); frag=unquote(u.fragment)
            target=f if not p else (f.parent/p).resolve()
            if not target.exists(): err(f"Lien cassé {f.relative_to(ROOT)} -> {v}"); continue
            if frag and target.suffix.lower()=='.html' and target in ids and frag not in ids[target]: err(f"Ancre cassée {f.relative_to(ROOT)} -> {v}")
idx=json.loads(read(ROOT/'resources-index.json'))
if len(idx)!=147: err(f"Ressources: {len(idx)} au lieu de 147")
missions=list((ROOT/'missions').glob('M[0-9][0-9].html'))
if len(missions)!=30: err(f"Missions: {len(missions)} au lieu de 30")
k=len(soups[ROOT/'connaissances/index.html'].select('article.knowledge-card'))
if k!=343: err(f"Connaissances: {k} au lieu de 343")
c=soups[ROOT/'referentiel/index.html'].select('details.ref-performance-v210')
if len(c)!=12: err(f"Activités avec critères: {len(c)} au lieu de 12")
if sum(len(x.select('li')) for x in c)!=165: err("Nombre d'items de critères différent de 165")
# Tableaux du parcours élève
for f,s in soups.items():
    rel=f.relative_to(ROOT)
    if rel.parts and rel.parts[0] in {'audit','maintenance','templates','enseignant'}: continue
    for tb in s.find_all('table'):
        if not tb.find('caption'): err(f"Tableau sans caption: {rel}")
        for th in tb.find_all('th'):
            if th.get('scope') not in {'col','row','colgroup','rowgroup'}: err(f"th sans scope: {rel}")
# Aucun fichier de police distribué
fonts=[p for p in ROOT.rglob('*') if p.is_file() and p.suffix.lower() in {'.ttf','.otf','.woff','.woff2'}]
if fonts: err("Fichiers de police présents dans l'archive")
# Syntaxe JS
for p in ROOT.rglob('*.js'):
    r=subprocess.run(['node','--check',str(p)],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    if r.returncode: err(f"Erreur JS: {p.relative_to(ROOT)}")
# CSS
if tinycss2:
    for p in ROOT.rglob('*.css'):
        if any(getattr(r,'type',None)=='error' for r in tinycss2.parse_stylesheet(read(p),skip_comments=True,skip_whitespace=True)): err(f"Erreur CSS: {p.relative_to(ROOT)}")
result={'status':'PASS' if not errors else 'FAIL','errors':errors,'warnings':warnings,'metrics':{'html':len(htmls),'resources':len(idx),'missions':len(missions),'knowledge':k,'criteria_activities':len(c)}}
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(1 if errors else 0)
