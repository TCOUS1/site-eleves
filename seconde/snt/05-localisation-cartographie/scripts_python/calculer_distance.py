from __future__ import annotations
import csv
from math import asin,cos,radians,sin,sqrt
from pathlib import Path
FICHIER=Path(__file__).resolve().parents[1]/"donnees"/"points_interet_demo.csv"
R=6371.0088
def haversine(lat1,lon1,lat2,lon2):
    p1,p2=radians(lat1),radians(lat2)
    dp=radians(lat2-lat1); dl=radians(lon2-lon1)
    a=sin(dp/2)**2+cos(p1)*cos(p2)*sin(dl/2)**2
    return 2*R*asin(sqrt(a))
with FICHIER.open(encoding="utf-8",newline="") as f:
    pts=list(csv.DictReader(f,delimiter=";"))
a,b=pts[0],pts[2]
d=haversine(float(a["latitude"]),float(a["longitude"]),float(b["latitude"]),float(b["longitude"]))
print("Départ :",a["nom"]); print("Arrivée :",b["nom"]); print("Distance :",round(d,3),"km")
