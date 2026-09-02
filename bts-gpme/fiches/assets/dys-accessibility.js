(() => {
  "use strict";
  const KEY_MODE='bts-gpme-dys-mode';
  const KEY_SCALE='bts-gpme-font-scale';
  const KEY_THEME='bts-gpme-color-theme';
  let scale=1;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function els(){return {dys:document.getElementById('btn-dys'),theme:document.getElementById('btn-theme'),state:document.getElementById('dys-toolbar-state')}}
  function announce(message){const s=els().state;if(s)s.textContent=message}
  function applyScale(){document.documentElement.style.fontSize=Math.round(scale*100)+'%';}
  function applyMode(on){
    document.body.classList.toggle('dys-mode',on);
    const b=els().dys;if(b)b.setAttribute('aria-pressed',on?'true':'false');
  }
  function applyTheme(theme){
    const dark=theme==='dark';
    document.body.classList.toggle('theme-dark',dark);
    document.documentElement.dataset.colorTheme=dark?'dark':'light';
    const b=els().theme;
    if(b){
      b.setAttribute('aria-pressed',dark?'true':'false');
      b.setAttribute('aria-label',dark?'Fond foncé activé. Passer au fond clair':'Fond clair activé. Passer au fond foncé');
      b.setAttribute('title',dark?'Passer au fond clair':'Passer au fond foncé');
      b.innerHTML=dark?'<span class="dys-theme-icon" aria-hidden="true">☾</span><span class="dys-theme-text">Foncé</span>':'<span class="dys-theme-icon" aria-hidden="true">☀</span><span class="dys-theme-text">Clair</span>';
    }
  }
  async function checkDysFont(){
    const b=els().dys;if(!b||!document.fonts)return true;
    try{const faces=await document.fonts.load('16px "OpenDyslexic"');const ok=faces&&faces.length>0;b.classList.toggle('dys-font-missing',!ok);b.title=ok?'Activer ou désactiver le mode DYS':'OpenDyslexic indisponible : lancez INSTALLER_OPENDYSLEXIC.bat puis rechargez la page';return ok}catch(e){b.classList.add('dys-font-missing');return false}
  }
  window.toggleDysComfort=function(){
    const on=!document.body.classList.contains('dys-mode');applyMode(on);
    try{localStorage.setItem(KEY_MODE,on?'on':'off')}catch(e){}
    if(on){checkDysFont().then(ok=>announce(ok?'OpenDyslexic et espacement renforcé activés':'Mode DYS activé avec police de secours : OpenDyslexic doit être préparée'));}else announce('Mode DYS désactivé');
  };
  window.toggleDysTheme=function(){
    const theme=document.body.classList.contains('theme-dark')?'light':'dark';applyTheme(theme);
    try{localStorage.setItem(KEY_THEME,theme)}catch(e){}
    announce(theme==='dark'?'Fond foncé activé':'Fond clair activé');
  };
  window.dysFontPlus=function(){
    scale=clamp(Math.round((scale+.1)*10)/10,.8,1.6);applyScale();
    try{localStorage.setItem(KEY_SCALE,String(scale))}catch(e){}
    announce('Taille du texte '+Math.round(scale*100)+' %');
  };
  window.dysFontMinus=function(){
    scale=clamp(Math.round((scale-.1)*10)/10,.8,1.6);applyScale();
    try{localStorage.setItem(KEY_SCALE,String(scale))}catch(e){}
    announce('Taille du texte '+Math.round(scale*100)+' %');
  };
  window.resetDysComfort=function(){
    scale=1;applyScale();applyMode(false);applyTheme('light');
    try{localStorage.removeItem(KEY_MODE);localStorage.removeItem(KEY_SCALE);localStorage.removeItem(KEY_THEME)}catch(e){}
    announce('Réglages de lecture réinitialisés');
  };
  function restore(){
    let stored=null;try{stored=Number.parseFloat(localStorage.getItem(KEY_SCALE));}catch(e){}
    if(Number.isFinite(stored))scale=clamp(stored,.8,1.6);applyScale();
    let on=false;try{on=localStorage.getItem(KEY_MODE)==='on'}catch(e){}applyMode(on);
    let theme='light';try{theme=localStorage.getItem(KEY_THEME)==='dark'?'dark':'light'}catch(e){}applyTheme(theme);
    checkDysFont();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();
})();
