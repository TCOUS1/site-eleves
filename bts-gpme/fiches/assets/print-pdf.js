/* v3.3 — bouton d'impression / export PDF (héritage v3.2) */
(function(){
  'use strict';
  function labelMode(){
    var body=document.body;
    if(document.querySelector('article.resource')){
      return body.getAttribute('data-resource-view')==='full'?'Vue complète':'Vue essentielle';
    }
    var mode=body.getAttribute('data-guidance')||'guided';
    return mode==='autonomous'?'Mode autonome':(mode==='semi'?'Mode semi-guidé':'Mode guidé');
  }
  function initPrintPdf(){
    var mission=document.querySelector('main.mission-workspace');
    var resource=document.querySelector('article.resource');
    if(!mission && !resource) return;
    if(document.querySelector('.print-pdf-toolbar')) return;

    var bar=document.createElement('section');
    bar.className='print-pdf-toolbar';
    bar.setAttribute('aria-label','Impression et export PDF');
    var copy=document.createElement('div');
    copy.className='print-pdf-toolbar__copy';
    var title=document.createElement('p');
    title.className='print-pdf-toolbar__title';
    title.textContent=resource?'Imprimer cette ressource':'Imprimer ce TP';
    var help=document.createElement('p');
    help.className='print-pdf-toolbar__help';
    help.textContent=resource
      ? 'La sortie reprend la vue Essentiel ou Complet actuellement affichée.'
      : 'La sortie reprend le niveau Guidé, Semi-guidé ou Autonome actuellement affiché.';
    copy.appendChild(title);copy.appendChild(help);
    var btn=document.createElement('button');
    btn.type='button';btn.className='print-pdf-toolbar__button';
    btn.textContent='Imprimer / enregistrer en PDF';
    btn.addEventListener('click',function(){window.print();});
    bar.appendChild(copy);bar.appendChild(btn);

    var nav=document.querySelector('.demo-nav');
    if(nav && nav.parentNode){nav.insertAdjacentElement('afterend',bar);}else{
      var target=mission||resource;target.parentNode.insertBefore(bar,target);
    }

    var meta=document.createElement('div');
    meta.className='print-pdf-meta';
    meta.setAttribute('aria-hidden','true');
    var targetMain=mission||resource;
    targetMain.insertBefore(meta,targetMain.firstChild);
    function updateMeta(){
      var ref='';
      var refNode=document.querySelector('.mission-card__ref,.resource__ref,.resource__type');
      if(refNode) ref=refNode.textContent.trim();
      var date=new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date());
      meta.innerHTML='<strong>Support BTS GPME</strong> — '+labelMode()+(ref?' — '+ref:'')+' — impression du '+date+'.';
    }
    window.addEventListener('beforeprint',updateMeta);
    updateMeta();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPrintPdf);
  else initPrintPdf();
})();
