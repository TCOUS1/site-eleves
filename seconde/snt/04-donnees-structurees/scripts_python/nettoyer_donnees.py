from __future__ import annotations
import csv
from pathlib import Path
F=Path(__file__).resolve().parents[1]/"donnees"/"donnees_a_nettoyer.csv"
def integer(v):
    v=v.strip().replace(" ","")
    if not v:return None
    if v=="douze":return 12
    return int(v)
with F.open(encoding="utf-8",newline="") as f:rows=list(csv.DictReader(f,delimiter=";"))
unique={}
for r in rows:
    r["wifi"]=r["wifi"].lower();r["places"]=integer(r["places"]);r["visiteurs_2025"]=integer(r["visiteurs_2025"]);unique[r["id_equipement"]]=r
print("Lignes initiales :",len(rows));print("Objets uniques :",len(unique))
for r in unique.values():print(r)
