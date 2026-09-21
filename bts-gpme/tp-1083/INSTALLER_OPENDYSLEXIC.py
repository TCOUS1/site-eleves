#!/usr/bin/env python3
"""Extrait les fichiers OpenDyslexic déjà fournis dans MATRICE_OFFICIELLE_COURS_V1 vers assets/fonts."""
from pathlib import Path
import sys, zipfile, shutil

EXPECTED = [
    'OpenDyslexic-Regular.otf',
    'OpenDyslexic-Bold.otf',
    'OpenDyslexic-Italic.otf',
    'OpenDyslexic-BoldItalic.otf',
    'OpenDyslexicMono-Regular.otf',
]
root=Path(__file__).resolve().parent
out=root/'assets'/'fonts'
out.mkdir(parents=True,exist_ok=True)

def candidates():
    if len(sys.argv)>1:
        yield Path(sys.argv[1]).expanduser().resolve()
    for base in (root, root.parent, Path.cwd()):
        for p in base.glob('MATRICE_OFFICIELLE_COURS_V1*.zip'):
            yield p.resolve()

zip_path=next((p for p in candidates() if p.is_file()),None)
if not zip_path:
    raise SystemExit('Archive MATRICE_OFFICIELLE_COURS_V1 introuvable. Lancez : python INSTALLER_OPENDYSLEXIC.py chemin/vers/MATRICE_OFFICIELLE_COURS_V1.zip')

with zipfile.ZipFile(zip_path) as z:
    names=z.namelist()
    selected={}
    for filename in EXPECTED:
        matches=[n for n in names if n.endswith('/dys/fonts/'+filename)]
        if not matches:
            raise SystemExit(f'Police manquante dans la matrice : {filename}')
        selected[filename]=matches[0]
    for filename, member in selected.items():
        with z.open(member) as src, open(out/filename,'wb') as dst:
            shutil.copyfileobj(src,dst)
        print('Installé :',out/filename)
print('OpenDyslexic est prêt. Le bouton Dys utilise maintenant les fichiers fournis dans votre matrice.')
