from __future__ import annotations
from datetime import datetime
from math import asin,cos,radians,sin,sqrt
from pathlib import Path
from xml.etree import ElementTree
FICHIER=Path(__file__).resolve().parents[1]/"donnees"/"trace_randonnee_demo.gpx"
NS={"g":"http://www.topografix.com/GPX/1/1"}; R=6371008.8
def dist(a,b):
    p1,p2=radians(a[0]),radians(b[0]); dp=radians(b[0]-a[0]); dl=radians(b[1]-a[1])
    x=sin(dp/2)**2+cos(p1)*cos(p2)*sin(dl/2)**2
    return 2*R*asin(sqrt(x))
root=ElementTree.parse(FICHIER).getroot(); pts=[]
for e in root.findall(".//g:trkpt",NS):
    pts.append((float(e.attrib["lat"]),float(e.attrib["lon"]),float(e.findtext("g:ele",namespaces=NS)),
                datetime.fromisoformat(e.findtext("g:time",namespaces=NS).replace("Z","+00:00"))))
total=sum(dist(a,b) for a,b in zip(pts,pts[1:])); duree=(pts[-1][3]-pts[0][3]).total_seconds()
print("Points :",len(pts)); print("Distance :",round(total),"m"); print("Durée :",round(duree/60,1),"min")
print("Vitesse moyenne :",round(total/duree*3.6,2),"km/h")
