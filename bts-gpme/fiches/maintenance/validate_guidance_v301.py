#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
import re, sys, json
ROOT=Path(__file__).resolve().parents[1]
missions=sorted((ROOT/'missions').glob('M[0-9][0-9].html'))
css=(ROOT/'assets/guidance-v30.css').read_text(encoding='utf-8')
js=(ROOT/'assets/guidance-v30.js').read_text(encoding='utf-8')
issues=[]; rows=[]

if '#verifier' in re.sub(r'/\*.*?\*/','',css,flags=re.S).split('body[data-guidance="autonomous"]',1)[-1].split('\n',1)[0]:
    issues.append('CSS: #verifier appears in the first autonomous hide selector.')
if re.search(r'body\[data-guidance="autonomous"\][^{]*\.mission-workspace__production\s*\{\s*display\s*:\s*none',css):
    issues.append('CSS: production section is explicitly hidden in autonomous mode.')
for token in ['URLSearchParams','dataset.guidanceLocked','params.get(\'mode\')','params.get(\'lock\')']:
    if token not in js: issues.append(f'JS: missing locked evaluation support token {token}')

for p in missions:
    s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    situation=bool(s.select_one('.pilot-hero'))
    dossier=bool(s.select_one('a[href*="dossiers/"]'))
    verifier=s.select_one('#verifier')
    production=s.select_one('#verifier .mission-workspace__production')
    prod_link=bool(production and production.select_one('a[href*="outils-production/"]'))
    wrongly_guided=bool(production and ('guided-only' in production.get('class',[]) or 'semi-only' in production.get('class',[])))
    notions=bool(s.select_one('#notions'))
    analyse=bool(s.select_one('#analyser'))
    stuck=bool(s.select_one('.mission-workspace__stuck'))
    toolbar=bool(s.select_one('.guidance-toolbar [data-guidance-choice="autonomous"]'))
    ok=all([situation,dossier,verifier,production,prod_link,notions,analyse,stuck,toolbar]) and not wrongly_guided
    if not ok:
        issues.append(f'{p.name}: missing/unsafe mission structure for guidance modes')
    rows.append({'mission':p.stem,'situation':situation,'dossier':dossier,'livrable':bool(production),'outil_production':prod_link,'notions':notions,'parcours_analyse':analyse,'aide_blocage':stuck,'ok':ok})

result={'missions':len(missions),'issues':issues,'rows':rows,'expected':{
 'guided':{'situation':True,'dossier':True,'livrable':True,'outil_production':True,'notions':True,'parcours_analyse':True,'aide_blocage':True},
 'semi':{'situation':True,'dossier':True,'livrable':True,'outil_production':True,'notions':'partiel','parcours_analyse':'partiel','aide_blocage':True},
 'autonomous':{'situation':True,'dossier':True,'livrable':True,'outil_production':True,'notions':False,'parcours_analyse':False,'aide_blocage':False}}}
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(1 if issues or len(missions)!=30 else 0)
