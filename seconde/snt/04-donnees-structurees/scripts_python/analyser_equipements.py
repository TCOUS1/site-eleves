from __future__ import annotations
import csv
from pathlib import Path
from statistics import mean
FICHIER=Path(__file__).resolve().parents[1]/"donnees"/"equipements_publics_demo.csv"
with FICHIER.open(encoding="utf-8",newline="") as f:
    rows=list(csv.DictReader(f,delimiter=";"))
for r in rows:
    r["places"]=int(r["places"]);r["visiteurs_2025"]=int(r["visiteurs_2025"])
print("Équipements avec Wi-Fi :",sum(r["wifi"]=="oui" for r in rows))
print("Nombre moyen de places :",round(mean(r["places"] for r in rows),1))
for r in sorted(rows,key=lambda x:x["visiteurs_2025"],reverse=True)[:3]:
    print(r["nom"],r["visiteurs_2025"])
