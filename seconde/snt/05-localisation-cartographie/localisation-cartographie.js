(() => {
"use strict";
const byId=id=>document.getElementById(id);
const pois=[{"id": "P01", "nom": "Lycée des Horizons", "categorie": "Éducation", "latitude": 45.7521, "longitude": 4.8422, "altitude_m": 192.0, "accessible_pmr": "oui", "description": "Point de départ du parcours."}, {"id": "P02", "nom": "Gare de Ville-Lumière", "categorie": "Transport", "latitude": 45.7564, "longitude": 4.8331, "altitude_m": 188.0, "accessible_pmr": "oui", "description": "Gare fictive et pôle d’échanges."}, {"id": "P03", "nom": "Parc des Sources", "categorie": "Loisir", "latitude": 45.7478, "longitude": 4.8517, "altitude_m": 201.0, "accessible_pmr": "partiel", "description": "Parc traversé par une voie verte."}, {"id": "P04", "nom": "Médiathèque Atlas", "categorie": "Culture", "latitude": 45.7592, "longitude": 4.8465, "altitude_m": 196.0, "accessible_pmr": "oui", "description": "Équipement culturel fictif."}, {"id": "P05", "nom": "Belvédère du Levant", "categorie": "Point de vue", "latitude": 45.7449, "longitude": 4.8614, "altitude_m": 248.0, "accessible_pmr": "non", "description": "Accès par un escalier et un sentier pentu."}, {"id": "P06", "nom": "Centre sportif Olympe", "categorie": "Sport", "latitude": 45.7635, "longitude": 4.8572, "altitude_m": 205.0, "accessible_pmr": "oui", "description": "Gymnase et terrains fictifs."}, {"id": "P07", "nom": "Hôpital Saint-Clair", "categorie": "Santé", "latitude": 45.7681, "longitude": 4.8395, "altitude_m": 199.0, "accessible_pmr": "oui", "description": "Établissement de santé fictif."}, {"id": "P08", "nom": "Maison des Associations", "categorie": "Service public", "latitude": 45.7504, "longitude": 4.8308, "altitude_m": 186.0, "accessible_pmr": "oui", "description": "Lieu de réunion fictif."}], routeNodes={"A": {"nom": "Lycée", "x": 70, "y": 180}, "B": {"nom": "Place", "x": 170, "y": 135}, "C": {"nom": "Gare", "x": 170, "y": 245}, "D": {"nom": "Pont", "x": 285, "y": 120}, "E": {"nom": "Parc", "x": 295, "y": 235}, "F": {"nom": "Médiathèque", "x": 415, "y": 100}, "G": {"nom": "Centre sportif", "x": 420, "y": 235}, "H": {"nom": "Hôpital", "x": 545, "y": 165}}, routeEdges=[{"a": "A", "b": "B", "distance": 900, "time": 11, "accessible": true, "type": "rue"}, {"a": "A", "b": "C", "distance": 760, "time": 10, "accessible": true, "type": "voie verte"}, {"a": "B", "b": "C", "distance": 520, "time": 7, "accessible": true, "type": "rue"}, {"a": "B", "b": "D", "distance": 880, "time": 11, "accessible": true, "type": "rue"}, {"a": "C", "b": "E", "distance": 940, "time": 12, "accessible": true, "type": "voie verte"}, {"a": "D", "b": "E", "distance": 470, "time": 8, "accessible": false, "type": "escaliers"}, {"a": "D", "b": "F", "distance": 910, "time": 12, "accessible": true, "type": "rue"}, {"a": "E", "b": "G", "distance": 810, "time": 10, "accessible": true, "type": "voie verte"}, {"a": "F", "b": "G", "distance": 690, "time": 9, "accessible": true, "type": "rue"}, {"a": "F", "b": "H", "distance": 970, "time": 12, "accessible": true, "type": "rue"}, {"a": "G", "b": "H", "distance": 880, "time": 11, "accessible": true, "type": "rue"}, {"a": "E", "b": "H", "distance": 1540, "time": 18, "accessible": true, "type": "avenue"}], trackPoints=[{"lat": 45.7521, "lon": 4.8422, "ele": 192.0, "time": "2026-07-29T08:15:00Z"}, {"lat": 45.75255, "lon": 4.8433, "ele": 193.0, "time": "2026-07-29T08:16:15Z"}, {"lat": 45.7531, "lon": 4.8447, "ele": 194.0, "time": "2026-07-29T08:17:30Z"}, {"lat": 45.75365, "lon": 4.8461, "ele": 196.0, "time": "2026-07-29T08:18:45Z"}, {"lat": 45.7532, "lon": 4.8478, "ele": 198.0, "time": "2026-07-29T08:20:00Z"}, {"lat": 45.75245, "lon": 4.8492, "ele": 199.0, "time": "2026-07-29T08:21:15Z"}, {"lat": 45.7514, "lon": 4.8503, "ele": 200.0, "time": "2026-07-29T08:22:30Z"}, {"lat": 45.7501, "lon": 4.8509, "ele": 201.0, "time": "2026-07-29T08:23:45Z"}, {"lat": 45.7489, "lon": 4.8513, "ele": 201.0, "time": "2026-07-29T08:25:00Z"}, {"lat": 45.7478, "lon": 4.8517, "ele": 201.0, "time": "2026-07-29T08:26:15Z"}];

document.querySelectorAll("[data-map-layer]").forEach(input=>{
  input.addEventListener("change",()=>{
    document.querySelector(`[data-layer="${input.dataset.mapLayer}"]`)
      ?.classList.toggle("hidden",!input.checked);
  });
});

function updateScale(){
  const value=byId("map-scale")?.value||"local";
  const messages={
    quartier:"Échelle du quartier : bâtiments, passages et noms locaux sont affichés.",
    local:"Échelle locale : rues principales, transports et équipements sont conservés.",
    regional:"Échelle régionale : les détails fins sont supprimés et les axes majeurs sont généralisés."
  };
  if(byId("scale-explanation")) byId("scale-explanation").textContent=messages[value];
  document.querySelectorAll("[data-min-scale]").forEach(el=>{
    const req=el.dataset.minScale;
    const visible=value==="quartier"||(value==="local"&&req!=="quartier")||(value==="regional"&&req==="regional");
    el.classList.toggle("hidden",!visible);
  });
}
byId("map-scale")?.addEventListener("change",updateScale); updateScale();

const rad=d=>d*Math.PI/180;
function haversine(a,b,c,d){
  const R=6371.0088,p1=rad(a),p2=rad(c),dp=rad(c-a),dl=rad(d-b);
  const x=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}
function dms(value,latitude){
  const abs=Math.abs(value),deg=Math.floor(abs),mf=(abs-deg)*60,min=Math.floor(mf),sec=(mf-min)*60;
  const hem=latitude?(value>=0?"N":"S"):(value>=0?"E":"O");
  return `${deg}° ${min}′ ${sec.toFixed(2)}″ ${hem}`;
}
function fillPoi(select){
  pois.forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=p.nom;select.appendChild(o)});
}
[byId("distance-start"),byId("distance-end")].forEach(s=>{if(s)fillPoi(s)});
if(byId("distance-end")) byId("distance-end").value="P03";
function updateDistance(){
  const a=pois.find(p=>p.id===byId("distance-start")?.value)||pois[0];
  const b=pois.find(p=>p.id===byId("distance-end")?.value)||pois[2];
  const dist=haversine(a.latitude,a.longitude,b.latitude,b.longitude);
  byId("coordinate-start").textContent=`${a.latitude.toFixed(5)}, ${a.longitude.toFixed(5)}`;
  byId("coordinate-end").textContent=`${b.latitude.toFixed(5)}, ${b.longitude.toFixed(5)}`;
  byId("coordinate-start-dms").textContent=`${dms(a.latitude,true)} · ${dms(a.longitude,false)}`;
  byId("coordinate-end-dms").textContent=`${dms(b.latitude,true)} · ${dms(b.longitude,false)}`;
  byId("distance-result").textContent=`${dist.toFixed(3)} km`;
  byId("distance-output").textContent=`Départ : ${a.nom}
Arrivée : ${b.nom}
Distance à vol d'oiseau : ${dist.toFixed(3)} km

Elle ne tient pas compte des rues, du relief, des interdictions ni du mode de transport.`;
}
["distance-start","distance-end"].forEach(id=>byId(id)?.addEventListener("change",updateDistance)); updateDistance();

const beacons=[
 {name:"S1",x:90,y:85,color:"#3157d5"},
 {name:"S2",x:490,y:75,color:"#2e8a54"},
 {name:"S3",x:125,y:330,color:"#8d4db5"},
 {name:"S4",x:485,y:330,color:"#c46a2c"}
], target={x:300,y:210};
function solve(bs,ds){
  if(bs.length<3)return null;
  const r=bs[0],d0=ds[0],rows=[];
  for(let i=1;i<bs.length;i++){
    const b=bs[i],d=ds[i];
    rows.push({a:2*(b.x-r.x),b:2*(b.y-r.y),c:d0**2-d**2-r.x**2+b.x**2-r.y**2+b.y**2});
  }
  let aa=0,ab=0,bb=0,ac=0,bc=0;
  rows.forEach(q=>{aa+=q.a*q.a;ab+=q.a*q.b;bb+=q.b*q.b;ac+=q.a*q.c;bc+=q.b*q.c});
  const det=aa*bb-ab*ab;if(Math.abs(det)<1e-9)return null;
  return {x:(ac*bb-bc*ab)/det,y:(aa*bc-ab*ac)/det};
}
function updateTrilat(){
  const count=Number(byId("trilat-count")?.value||3),error=Number(byId("trilat-error")?.value||0);
  const svg=byId("trilat-svg"),out=byId("trilat-output");if(!svg||!out)return;
  svg.innerHTML='<rect width="600" height="410" rx="18" fill="#eef4ea"/>';
  const used=beacons.slice(0,count);
  const ds=used.map((b,i)=>Math.hypot(target.x-b.x,target.y-b.y)+error*Math.sin((i+1)*2.17));
  used.forEach((b,i)=>{
    const circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
    circle.setAttribute("cx",b.x);circle.setAttribute("cy",b.y);circle.setAttribute("r",ds[i]);
    circle.setAttribute("class","geo-trilat-circle");circle.setAttribute("stroke",b.color);svg.appendChild(circle);
    const g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("class","geo-beacon");
    g.innerHTML=`<circle cx="${b.x}" cy="${b.y}" r="22"/><text x="${b.x}" y="${b.y+1}">${b.name}</text>`;svg.appendChild(g);
  });
  svg.insertAdjacentHTML("beforeend",`<circle cx="${target.x}" cy="${target.y}" r="11" class="geo-target"/>`);
  const est=solve(used,ds);
  if(!est){
    out.textContent=`Balises utilisées : ${count}\nAvec deux distances dans le plan, plusieurs positions sont possibles.`;
    return;
  }
  svg.insertAdjacentHTML("beforeend",`<circle cx="${est.x}" cy="${est.y}" r="9" class="geo-estimate"/>`);
  const pe=Math.hypot(target.x-est.x,target.y-est.y);
  out.textContent=`Balises utilisées : ${count}
Erreur ajoutée : ${error} unité(s)
Position réelle : (${target.x.toFixed(1)}, ${target.y.toFixed(1)})
Position estimée : (${est.x.toFixed(1)}, ${est.y.toFixed(1)})
Erreur de position : ${pe.toFixed(2)} unité(s)

Rouge : position réelle. Jaune : estimation.
Le modèle 2D simplifie fortement un système GNSS réel.`;
}
["trilat-count","trilat-error"].forEach(id=>{byId(id)?.addEventListener("input",updateTrilat);byId(id)?.addEventListener("change",updateTrilat)});updateTrilat();

function checksum(payload){let v=0;for(const c of payload)v^=c.charCodeAt(0);return v.toString(16).toUpperCase().padStart(2,"0")}
function ncoord(value,hem){const n=Number(value),deg=Math.floor(n/100);let dec=deg+(n-deg*100)/60;return /[SW]/.test(hem)?-dec:dec}
function decode(line){
  const t=line.trim();if(!t.startsWith("$")||!t.includes("*"))return {error:"Structure invalide"};
  const [payload,cs]=t.slice(1).split("*"),f=payload.split(","),type=f[0],valid=checksum(payload)===cs.toUpperCase();
  if(type.endsWith("GGA"))return {type,valid,time:f[1],latitude:ncoord(f[2],f[3]),longitude:ncoord(f[4],f[5]),quality:Number(f[6]),satellites:Number(f[7]),hdop:Number(f[8]),altitude:Number(f[9])};
  if(type.endsWith("RMC"))return {type,valid,time:f[1],status:f[2],latitude:ncoord(f[3],f[4]),longitude:ncoord(f[5],f[6]),speedKnots:Number(f[7]),course:Number(f[8]),date:f[9]};
  return {type,valid,note:"Type non décodé"};
}
function runNmea(){
  const lines=byId("nmea-input").value.split(/\r?\n/).filter(x=>x.trim()),results=lines.map(decode),body=byId("nmea-table-body");
  body.innerHTML="";
  results.forEach(r=>{
    const tr=document.createElement("tr");
    [r.type||"—",r.valid===undefined?"—":(r.valid?"valide":"invalide"),
     Number.isFinite(r.latitude)?r.latitude.toFixed(6):"—",
     Number.isFinite(r.longitude)?r.longitude.toFixed(6):"—",
     r.satellites??"—",r.altitude??"—"].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td)});
    body.appendChild(tr);
  });
  byId("nmea-output").textContent=results.map((r,i)=>`Trame ${i+1}\n${JSON.stringify(r,null,2)}`).join("\n\n");
}
if(byId("nmea-input"))byId("nmea-input").value="$GPGGA,081500.00,4545.1260,N,00450.5320,E,1,08,0.9,192.0,M,46.0,M,,*69\n$GPRMC,081500.00,A,4545.1260,N,00450.5320,E,0.8,72.0,290726,,,A*67\n$GPGGA,081530.00,4545.1740,N,00450.6100,E,1,09,0.8,194.0,M,46.0,M,,*68\n$GPRMC,081530.00,A,4545.1740,N,00450.6100,E,3.4,58.0,290726,,,A*67\n$GPGGA,081600.00,4545.2240,N,00450.7060,E,1,10,0.7,196.0,M,46.0,M,,*6D\n$GPRMC,081600.00,A,4545.2240,N,00450.7060,E,4.1,61.0,290726,,,A*6F";
byId("nmea-decode")?.addEventListener("click",runNmea);runNmea();

function renderTrack(){
  const svg=byId("track-svg");if(!svg||!trackPoints.length)return;
  const minLat=Math.min(...trackPoints.map(p=>p.lat)),maxLat=Math.max(...trackPoints.map(p=>p.lat));
  const minLon=Math.min(...trackPoints.map(p=>p.lon)),maxLon=Math.max(...trackPoints.map(p=>p.lon));
  const pr=p=>({x:50+(p.lon-minLon)/(maxLon-minLon)*500,y:310-(p.lat-minLat)/(maxLat-minLat)*250});
  const q=trackPoints.map(pr),d=q.map((p,i)=>`${i?"L":"M"} ${p.x} ${p.y}`).join(" ");
  svg.innerHTML=`<rect width="600" height="360" rx="18" fill="#eaf2e6"/><path d="M20 270 C150 215 240 250 345 150 S500 95 580 70" fill="none" stroke="#9bc3d1" stroke-width="24" opacity=".8"/><path d="${d}" class="geo-trace-line"/>`;
  q.forEach((p,i)=>svg.insertAdjacentHTML("beforeend",`<circle cx="${p.x}" cy="${p.y}" r="${i===0||i===q.length-1?7:4}" class="geo-track-point"/>`));
  let distance=0;for(let i=1;i<trackPoints.length;i++)distance+=haversine(trackPoints[i-1].lat,trackPoints[i-1].lon,trackPoints[i].lat,trackPoints[i].lon)*1000;
  const start=new Date(trackPoints[0].time),end=new Date(trackPoints.at(-1).time),duration=(end-start)/1000;
  const gain=trackPoints.slice(1).reduce((s,p,i)=>s+Math.max(0,p.ele-trackPoints[i].ele),0);
  byId("track-points").textContent=trackPoints.length;byId("track-distance").textContent=`${Math.round(distance)} m`;
  byId("track-duration").textContent=`${(duration/60).toFixed(1)} min`;byId("track-speed").textContent=`${(distance/duration*3.6).toFixed(2)} km/h`;byId("track-elevation").textContent=`${Math.round(gain)} m`;
}
renderTrack();

function graph(criterion,accessibleOnly){
  const g={};Object.keys(routeNodes).forEach(n=>g[n]=[]);
  routeEdges.forEach((e,i)=>{if(accessibleOnly&&!e.accessible)return;g[e.a].push({node:e.b,weight:e[criterion],edge:i});g[e.b].push({node:e.a,weight:e[criterion],edge:i})});
  return g;
}
function shortest(start,end,criterion,accessibleOnly){
  const g=graph(criterion,accessibleOnly),dist={},prev={},prevEdge={},un=new Set(Object.keys(g));
  Object.keys(g).forEach(n=>dist[n]=Infinity);dist[start]=0;
  while(un.size){
    let cur=null,best=Infinity;un.forEach(n=>{if(dist[n]<best){best=dist[n];cur=n}});
    if(cur===null||cur===end)break;un.delete(cur);
    g[cur].forEach(v=>{if(!un.has(v.node))return;const alt=dist[cur]+v.weight;if(alt<dist[v.node]){dist[v.node]=alt;prev[v.node]=cur;prevEdge[v.node]=v.edge}});
  }
  if(!Number.isFinite(dist[end]))return null;
  const path=[],edges=[];let cur=end;
  while(cur!==undefined){path.unshift(cur);if(cur===start)break;edges.unshift(prevEdge[cur]);cur=prev[cur]}
  return {path,edges,cost:dist[end]};
}
function renderRoute(selected=[]){
  const svg=byId("route-svg");svg.innerHTML='<rect width="620" height="330" rx="18" fill="#eef4ea"/>';
  routeEdges.forEach((e,i)=>{
    const a=routeNodes[e.a],b=routeNodes[e.b],cls=`geo-route-edge${e.accessible?"":" inaccessible"}${selected.includes(i)?" selected":""}`;
    svg.insertAdjacentHTML("beforeend",`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${cls}"/><text x="${(a.x+b.x)/2}" y="${(a.y+b.y)/2-7}" class="geo-route-label" text-anchor="middle">${e.distance} m / ${e.time} min</text>`);
  });
  Object.entries(routeNodes).forEach(([n,p])=>svg.insertAdjacentHTML("beforeend",`<g class="geo-route-node"><circle cx="${p.x}" cy="${p.y}" r="24"/><text x="${p.x}" y="${p.y+1}">${n}</text><text x="${p.x}" y="${p.y+40}" class="geo-route-label" text-anchor="middle">${p.nom}</text></g>`));
}
function updateRoute(){
  const start=byId("route-start").value,end=byId("route-end").value,criterion=byId("route-criterion").value,accessible=byId("route-accessible").checked;
  const r=shortest(start,end,criterion,accessible);if(!r){renderRoute([]);byId("route-output").textContent="Aucun itinéraire.";return}
  renderRoute(r.edges);const d=r.edges.reduce((s,i)=>s+routeEdges[i].distance,0),t=r.edges.reduce((s,i)=>s+routeEdges[i].time,0);
  byId("route-output").textContent=`Itinéraire : ${r.path.join(" → ")}
Critère : ${criterion}
Accessible uniquement : ${accessible?"oui":"non"}
Distance : ${d} m
Temps : ${t} min

Le meilleur itinéraire dépend du critère et des contraintes.`;
}
["route-start","route-end","route-criterion","route-accessible"].forEach(id=>byId(id)?.addEventListener("change",updateRoute));updateRoute();

const locationCases=[
 ["Application de navigation utilisée pendant le trajet","pendant"],
 ["Jeu demandant la position en permanence","jamais"],
 ["Application météo réglée sur une ville choisie manuellement","jamais"],
 ["Application de secours déclenchée par l’utilisateur","pendant"],
 ["Réseau social ajoutant automatiquement le lieu précis à chaque photo","jamais"]
];
const classifier=byId("location-classifier");
if(classifier)locationCases.forEach(([label,expected])=>{
  const li=document.createElement("li");li.className="geo-classifier-item";li.dataset.expected=expected;
  li.innerHTML=`<strong>${label}</strong><div class="geo-actions"><button type="button" class="geo-choice" data-location-choice="jamais">Jamais</button><button type="button" class="geo-choice" data-location-choice="pendant">Pendant l’utilisation</button><button type="button" class="geo-choice" data-location-choice="toujours">Toujours</button></div><p class="geo-feedback"></p>`;classifier.appendChild(li);
});
document.addEventListener("click",event=>{
  const b=event.target.closest("[data-location-choice]");if(!b)return;const item=b.closest("[data-expected]"),good=b.dataset.locationChoice===item.dataset.expected;
  item.querySelectorAll("[data-location-choice]").forEach(x=>x.classList.remove("good","bad"));b.classList.add(good?"good":"bad");
  item.querySelector(".geo-feedback").textContent=good?"Réglage cohérent.":`À revoir : ici, le réglage conseillé est « ${item.dataset.expected} ».`;
});
function updatePrivacy(){
  const precision=Number(byId("privacy-precision").value),history=Number(byId("privacy-history").value),background=byId("privacy-background").checked,sharing=byId("privacy-sharing").value;
  let risk=precision+history+(background?2:0)+(sharing==="proches"?1:sharing==="public"?3:0);risk=Math.min(10,risk);
  byId("privacy-output").textContent=`Précision : ${precision}/3
Durée d'historique : ${history}/3
Arrière-plan : ${background?"oui":"non"}
Partage : ${sharing}
Indice pédagogique d'exposition : ${risk}/10

Un historique précis peut permettre d'inférer domicile, travail, habitudes et relations.`;
}
["privacy-precision","privacy-history","privacy-background","privacy-sharing"].forEach(id=>{byId(id)?.addEventListener("input",updatePrivacy);byId(id)?.addEventListener("change",updatePrivacy)});updatePrivacy();

byId("geo-fill-check")?.addEventListener("click",()=>{
 const expected={"geo-fill-1":"latitude","geo-fill-2":"longitude","geo-fill-3":"nmea","geo-fill-4":"graphe","geo-fill-5":"couche"};let ok=0;
 Object.entries(expected).forEach(([id,a])=>{const input=byId(id),good=input.value.trim().toLowerCase()===a;input.style.outline=good?"3px solid #16824a":"3px solid #b9313b";if(good)ok++});
 byId("geo-fill-feedback").textContent=`${ok} réponse(s) correcte(s) sur 5.`;
});
})();
