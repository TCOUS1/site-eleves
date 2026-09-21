(()=>{
  'use strict';
  const drawer=document.querySelector('[data-drawer]');
  const overlay=document.querySelector('[data-drawer-overlay]');
  const openBtn=document.querySelector('[data-drawer-open]');
  const closeBtn=document.querySelector('[data-drawer-close]');
  const open=()=>{drawer?.classList.add('is-open');overlay?.classList.add('is-open');openBtn?.setAttribute('aria-expanded','true');document.body.classList.add('drawer-open');closeBtn?.focus();};
  const close=()=>{drawer?.classList.remove('is-open');overlay?.classList.remove('is-open');openBtn?.setAttribute('aria-expanded','false');document.body.classList.remove('drawer-open');openBtn?.focus();};
  openBtn?.addEventListener('click',open);closeBtn?.addEventListener('click',close);overlay?.addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer?.classList.contains('is-open'))close();});

  const rail=document.querySelector('[data-risk-rail]');
  if(!rail)return;
  const slides=[...rail.querySelectorAll('.risk-card')];
  const prev=document.querySelector('[data-risk-prev]');
  const next=document.querySelector('[data-risk-next]');
  const pause=document.querySelector('[data-risk-pause]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i=0,timer=null,paused=reduce;
  function visibleCount(){return innerWidth<660?1:innerWidth<1080?2:3;}
  function render(){
    const count=visibleCount();
    const max=Math.max(0,slides.length-count);
    i=Math.min(i,max);
    const gap=parseFloat(getComputedStyle(rail).gap)||18;
    const w=slides[0]?.getBoundingClientRect().width||0;
    rail.style.transform=`translateX(${-i*(w+gap)}px)`;
  }
  function go(delta){const count=visibleCount(),max=Math.max(0,slides.length-count);i+=delta;if(i>max)i=0;if(i<0)i=max;render();restart();}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  function start(){stop();if(!paused&&!reduce)timer=setInterval(()=>go(1),4500);}
  function restart(){start();}
  prev?.addEventListener('click',()=>go(-1));next?.addEventListener('click',()=>go(1));
  pause?.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Relancer le défilement automatique':'Mettre en pause le défilement automatique');start();});
  document.querySelector('.risk-window')?.addEventListener('mouseenter',stop);
  document.querySelector('.risk-window')?.addEventListener('mouseleave',start);
  document.querySelector('.risk-window')?.addEventListener('focusin',stop);
  document.querySelector('.risk-window')?.addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))start();});
  addEventListener('resize',()=>{clearTimeout(window.__riskResize);window.__riskResize=setTimeout(render,100);});
  render();start();
})();
