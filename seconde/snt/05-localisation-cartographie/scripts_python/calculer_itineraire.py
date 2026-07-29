from __future__ import annotations
import heapq,json
from pathlib import Path
FICHIER=Path(__file__).resolve().parents[1]/"donnees"/"reseau_itineraires_demo.json"
data=json.loads(FICHIER.read_text(encoding="utf-8"))
graph={n:[] for n in data["nodes"]}
for e in data["edges"]:
    if not e["accessible"]: continue
    graph[e["a"]].append((e["b"],e["distance"]))
    graph[e["b"]].append((e["a"],e["distance"]))
q=[(0,"A",[])]; vus=set()
while q:
    cout,n,chemin=heapq.heappop(q)
    if n in vus: continue
    vus.add(n); chemin=chemin+[n]
    if n=="H":
        print("Chemin accessible :"," → ".join(chemin)); print("Distance :",cout,"m"); break
    for v,p in graph[n]:
        if v not in vus: heapq.heappush(q,(cout+p,v,chemin))
