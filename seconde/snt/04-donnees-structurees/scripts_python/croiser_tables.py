from __future__ import annotations
import csv
from pathlib import Path
D=Path(__file__).resolve().parents[1]/"donnees"
def load(name):
    with (D/name).open(encoding="utf-8",newline="") as f:return list(csv.DictReader(f,delimiter=";"))
e=load("equipements_publics_demo.csv");c=load("communes_demo.csv")
pop={r["commune"]:int(r["population_2025"]) for r in c}
for r in e:
    ratio=int(r["visiteurs_2025"])/pop[r["commune"]]
    print(r["commune"],round(ratio,2))
