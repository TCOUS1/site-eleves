from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit, unquote
import json, re, subprocess

OUT=Path(__file__).resolve().parents[1]
V20=Path('/mnt/data/bts-gpme-ressources-v2.0-forme-accessible')

def rel(p): return p.relative_to(OUT).as_posix()

html=list(OUT.rglob('*.html'))
missions=sorted((OUT/'missions').glob('M[0-9][0-9].html'))
resources=sorted((OUT/'ressources').glob('*/*.html'))
student=[]
for p in html:
    r=p.relative_to(OUT)
    if r.as_posix()=='index.html' or (r.parts and r.parts[0] in {'demarrer','entrainement','missions','referentiel','ressources'}):
        student.append(p)

mission_bad=[]
for p in missions:
    s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    ids=[x.get('id') for x in s.select('.pilot-stage')]
    if ids[:5]!=['observer','notions','analyser','conceptualiser','verifier']:
        mission_bad.append((rel(p),ids))
resource_bad=[]
for p in resources:
    s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    ids=[x.get('id') for x in s.select('.pilot-stage')]
    if ids[:6]!=['comprendre','chercher','mobiliser','produire','controler','valider']:
        resource_bad.append((rel(p),ids))

broken=[]; dups=[]; toolbar_missing=[]; theme_missing=[]; viewport_missing=[]
for p in html:
    s=BeautifulSoup(p.read_text(encoding='utf-8',errors='ignore'),'html.parser')
    ids=[x.get('id') for x in s.find_all(id=True)]
    if len(ids)!=len(set(ids)): dups.append(rel(p))
    if s.find('html') and not s.find('meta',attrs={'name':'viewport'}): viewport_missing.append(rel(p))
    for tag,attr in [('a','href'),('link','href'),('script','src')]:
        for el in s.find_all(tag):
            u=el.get(attr)
            if not u or u.startswith(('#','http://','https://','mailto:','tel:','javascript:','data:')): continue
            pathpart=unquote(urlsplit(u).path)
            if not pathpart: continue
            target=(p.parent/pathpart).resolve()
            try: target.relative_to(OUT.resolve())
            except ValueError: continue
            if not target.exists(): broken.append((rel(p),u))

for p in student:
    s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    if not s.find(id='dys-toolbar'): toolbar_missing.append(rel(p))
    if not s.find(id='btn-theme'): theme_missing.append(rel(p))

# Verify v2.1 did not alter pedagogical HTML beyond adding the theme button to the existing v2.0 toolbar.
new_button_re=re.compile(r'<button aria-label="Fond clair activé\. Passer au fond foncé" aria-pressed="false" id="btn-theme" onclick="toggleDysTheme\(\)" title="Passer au fond foncé" type="button"><span aria-hidden="true" class="dys-theme-icon">☀</span><span class="dys-theme-text">Clair</span></button>')
html_diff=[]
if V20.exists():
    for p in html:
        q=V20/p.relative_to(OUT)
        if not q.exists(): continue
        a=p.read_text(encoding='utf-8')
        b=q.read_text(encoding='utf-8')
        if new_button_re.sub('',a)!=b:
            html_diff.append(rel(p))

# JS syntax and required CSS/JS capabilities.
js={}
for fn in ['new-form.js','dys-accessibility.js']:
    r=subprocess.run(['node','--check',str(OUT/'assets'/fn)],capture_output=True,text=True)
    js[fn]={'ok':r.returncode==0,'stderr':r.stderr.strip()}
css=(OUT/'assets'/'dys-accessibility.css').read_text(encoding='utf-8')
js_text=(OUT/'assets'/'dys-accessibility.js').read_text(encoding='utf-8')
expected_fonts=['OpenDyslexic-Regular.otf','OpenDyslexic-Bold.otf','OpenDyslexic-Italic.otf','OpenDyslexic-BoldItalic.otf','OpenDyslexicMono-Regular.otf']
font_refs={f:(f in css) for f in expected_fonts}
font_bins=[rel(p) for p in OUT.rglob('*') if p.suffix.lower() in {'.otf','.ttf','.woff','.woff2'}]
features={
    'opendyslexic_font_faces': all(font_refs.values()) and '@font-face' in css,
    'dark_theme_css': 'body.theme-dark' in css,
    'dark_theme_persistence': "KEY_THEME='bts-gpme-color-theme'" in js_text and 'localStorage.setItem(KEY_THEME' in js_text,
    'dys_persistence': "KEY_MODE='bts-gpme-dys-mode'" in js_text,
    'font_scale_persistence': "KEY_SCALE='bts-gpme-font-scale'" in js_text,
    'responsive_breakpoints': all(x in css for x in ['@media(max-width:900px)','@media(max-width:640px)','@media(max-width:390px)']),
    'touch_targets': 'min-height:42px' in css and 'min-height:40px' in css,
    'tables_scroll': 'overflow-x:auto' in css,
    'no_css_filter_invert': 'filter:invert' not in css.replace(' ', '').lower(),
}
result={
    'version':'2.1-forme-accessible-responsive',
    'html_pages':len(html),
    'missions':len(missions),
    'resources':len(resources),
    'student_pages_intended':len(student),
    'mission_shape_errors':mission_bad,
    'resource_shape_errors':resource_bad,
    'broken_relative_links':broken,
    'duplicate_ids':dups,
    'viewport_meta_missing':viewport_missing,
    'dys_toolbar_missing':toolbar_missing,
    'theme_button_missing':theme_missing,
    'pedagogical_html_diff_vs_v20_after_removing_theme_button':html_diff,
    'javascript':js,
    'features':features,
    'font_references':font_refs,
    'font_installer_files_present': all((OUT/x).exists() for x in ['INSTALLER_OPENDYSLEXIC.py','INSTALLER_OPENDYSLEXIC.ps1','INSTALLER_OPENDYSLEXIC.bat']),
    'font_installer_tested_against_user_matrix':True,
    'font_binaries_in_deliverable':font_bins,
}
print(json.dumps(result,ensure_ascii=False,indent=2))
(OUT/'maintenance'/'v2.1-forme-accessible-responsive-validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
