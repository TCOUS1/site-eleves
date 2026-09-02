
(function(){
  const KEY='btsGpmeGuidanceLevelV30';
  const labels={guided:'Guidé — toutes les aides sont visibles.',semi:'Semi-guidé — les aides de démarrage et parcours conseillés sont masqués.',autonomous:'Autonome — situation, dossier et production restent au premier plan. Les ressources restent accessibles par la recherche.'};
  function normalizeLevel(value){
    const v=(value||'').toLowerCase();
    if(v==='autonome') return 'autonomous';
    if(v==='semi-guide'||v==='semi-guidé'||v==='semiguided') return 'semi';
    return labels[v]?v:null;
  }
  function setLevel(level, persist=true){
    if(!labels[level]) level='guided';
    document.body.dataset.guidance=level;
    document.querySelectorAll('[data-guidance-choice]').forEach(b=>b.setAttribute('aria-pressed', b.dataset.guidanceChoice===level?'true':'false'));
    const s=document.querySelector('.guidance-toolbar__state'); if(s) s.textContent=labels[level];
    if(persist){try{localStorage.setItem(KEY,level)}catch(e){}}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    if(!document.querySelector('.guidance-toolbar')) return;
    const params=new URLSearchParams(window.location.search);
    const forced=normalizeLevel(params.get('mode'));
    const locked=forced && ['1','true','yes','oui'].includes((params.get('lock')||'').toLowerCase());
    let level=forced||'guided';
    if(!forced){try{level=normalizeLevel(localStorage.getItem(KEY))||'guided'}catch(e){}}
    if(locked){
      document.body.dataset.guidanceLocked='true';
      document.querySelectorAll('[data-guidance-choice]').forEach(b=>{b.disabled=true;b.setAttribute('aria-disabled','true')});
    } else {
      document.querySelectorAll('[data-guidance-choice]').forEach(b=>b.addEventListener('click',()=>setLevel(b.dataset.guidanceChoice,true)));
    }
    setLevel(level,!forced);
  });
})();

(function(){
 const KEY='btsGpmeResourceViewV30'; const labels={essential:'Vue essentielle — le nécessaire pour comprendre, agir et contrôler.',full:'Vue complète — tous les blocs d’aide et de transfert sont visibles.'};
 function setView(v){if(!labels[v])v='essential';document.body.dataset.resourceView=v;document.querySelectorAll('[data-resource-view-choice]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.resourceViewChoice===v?'true':'false'));const s=document.querySelector('.resource-view-toolbar__state');if(s)s.textContent=labels[v];try{localStorage.setItem(KEY,v)}catch(e){}}
 document.addEventListener('DOMContentLoaded',()=>{if(!document.querySelector('.resource-view-toolbar'))return;let v='essential';try{v=localStorage.getItem(KEY)||'essential'}catch(e){};document.querySelectorAll('[data-resource-view-choice]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.resourceViewChoice)));setView(v);});
})();
