(()=>{
  const extra=[
    {kind:'tp',id:'TP-1083',title:'TP 1083 — Gestion des risques — Sécuriser la croissance d’une PME industrielle et omnicanale',url:'../tp-1083/index.html',queries:['1083','gestion des risques','SST','DUERP','cyber RGPD','risque client trésorerie','fournisseurs qualité','TP transversal'],meta:'TP / situation professionnelle'},
    {kind:'tp',id:'TP-PAPETERIE',title:'TP Papeterie Services — Prospection et loi de Pareto',url:'../tp-papeterie-services/index.html',queries:['papeterie services','prospection','loi de Pareto','GRCF activité 1.1','TP'],meta:'TP / situation professionnelle'},
    {kind:'tp',id:'TP-HEXA',title:'TP HEXA Le Matériel — Prospection',url:'../tp-hexa/index.html',queries:['HEXA','HEXA Le Matériel','prospection','GRCF activité 1.1','TP'],meta:'TP / situation professionnelle'},
    {kind:'tp',id:'TP-SIROT',title:'TP Pépinières SIROT — Administration des ventes',url:'../tp-pepinieres-sirot/index.html',queries:['Pépinières SIROT','administration des ventes','GRCF activité 1.2','TP'],meta:'TP / situation professionnelle'},
    {kind:'tp',id:'TP-BAINU',title:'TP Bainu Errandonea — Relation client',url:'../tp-bainu-errandonea/index.html',queries:['Bainu Errandonea','relation client','GRCF activité 1.3','TP'],meta:'TP / situation professionnelle'},
    {kind:'tp',id:'TP-TECHNORD',title:'TP Technord Services — Suivi et sécurisation d’un investissement',url:'../tp-technord-services/index.html',queries:['Technord Services','investissement','immobilisation corporelle','achats','GRCF activité 1.5','TP'],meta:'TP / situation professionnelle'}
  ];
  if(!Array.isArray(window.GPME_SEARCH_V42)) window.GPME_SEARCH_V42=[];
  const known=new Set(window.GPME_SEARCH_V42.map(x=>x.id));
  extra.forEach(x=>{if(!known.has(x.id))window.GPME_SEARCH_V42.push(x)});
})();
