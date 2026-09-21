(()=>{
'use strict';

const KEY='bts-gpme-reading-v1-1';
const OLD_KEY='bts-gpme-reading-v1';
const DEFAULTS={font:'standard',size:1,line:1.66,contrast:false,spacing:'normal',lines:false,ruler:false};
const LINE_COLORS=['#1f4e79','#9b2c2c','#245c46'];
const TARGET_SELECTOR=[
  'main p','main li','main td','main th','main blockquote','main dd','main dt',
  'main figcaption','main summary','main .deliverable span','main .deadline-box',
  'footer p'
].join(',');
const EXCLUDE_SELECTOR=[
  'h1','h2','h3','h4','h5','h6','button','input','select','textarea','option',
  'script','style','code','pre','kbd','samp','svg','canvas','.reading-panel',
  '.demo-nav','[aria-hidden="true"]'
].join(',');

let state={...DEFAULTS};
let resizeObserver=null;
let resizeTimer=0;
let recolorFrame=0;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function save(){
  try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}
}

function load(){
  try{
    const current=JSON.parse(localStorage.getItem(KEY)||'null');
    if(current){
      state={...DEFAULTS,...current};
      return;
    }
    const old=JSON.parse(localStorage.getItem(OLD_KEY)||'null');
    if(old){
      state={
        ...DEFAULTS,
        font:old.font||DEFAULTS.font,
        size:Number(old.size)||DEFAULTS.size,
        line:Number(old.line)||DEFAULTS.line,
        contrast:old.color==='black',
        spacing:old.spacing||DEFAULTS.spacing,
        lines:!!old.words,
        ruler:!!old.ruler
      };
    }
  }catch(e){
    state={...DEFAULTS};
  }
}

function setVar(k,v){document.documentElement.style.setProperty(k,v)}

function sync(){
  document.body.classList.toggle('reading-font-verdana',state.font==='verdana');
  document.body.classList.toggle('reading-font-dys',state.font==='dys');
  document.body.classList.toggle('reading-contrast',!!state.contrast);
  document.body.classList.toggle('reading-spaced',state.spacing!=='normal');
  document.body.classList.toggle('reading-ruler-on',!!state.ruler);
  document.body.classList.toggle('reading-lines-on',!!state.lines);

  setVar('--reader-size',String(state.size));
  setVar('--reader-line',String(state.line));
  setVar('--reader-letter',state.spacing==='wide'?'.055em':state.spacing==='medium'?'.025em':'0em');
  setVar('--reader-word',state.spacing==='wide'?'.12em':state.spacing==='medium'?'.06em':'0em');

  const fontStack=state.font==='verdana'?'Verdana,Arial,sans-serif':state.font==='dys'?'OpenDyslexic,Verdana,Arial,sans-serif':'Montserrat,Inter,system-ui,-apple-system,Segoe UI,Arial,sans-serif';
  document.body.style.fontFamily=fontStack;
  document.body.style.fontSize=(16*state.size).toFixed(2)+'px';
  document.body.style.lineHeight=String(state.line);
  document.body.style.letterSpacing=state.spacing==='wide'?'.055em':state.spacing==='medium'?'.025em':'0em';
  document.body.style.wordSpacing=state.spacing==='wide'?'.12em':state.spacing==='medium'?'.06em':'0em';

  $$('[data-font]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.font===state.font)));
  $$('[data-spacing]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.spacing===state.spacing)));

  $('[data-size-output]')?.replaceChildren(document.createTextNode(Math.round(state.size*100)+' %'));
  $('[data-line-output]')?.replaceChildren(document.createTextNode(state.line.toFixed(2).replace(/0$/,'')));

  const lb=$('[data-lines-toggle]');
  if(lb)lb.setAttribute('aria-checked',String(!!state.lines));

  const rb=$('[data-ruler-toggle]');
  if(rb)rb.setAttribute('aria-checked',String(!!state.ruler));

  if(state.lines){
    prepareLineColors();
  }else{
    clearLineColors();
  }
  syncProfiles();
}

function syncProfiles(){
  $$('[data-profile]').forEach(b=>b.setAttribute('aria-pressed','false'));
  let p='';
  if(JSON.stringify(state)===JSON.stringify(DEFAULTS))p='standard';
  else if(state.font==='verdana'&&state.size===1.15&&state.line===1.85&&state.spacing==='medium'&&!state.lines&&!state.contrast)p='comfortable';
  else if(state.contrast&&state.size===1.08&&!state.lines)p='contrast';
  else if(state.lines)p='lines';
  if(p)$(`[data-profile="${p}"]`)?.setAttribute('aria-pressed','true');
}

function applyProfile(p){
  state={...DEFAULTS};
  if(p==='comfortable')Object.assign(state,{font:'verdana',size:1.15,line:1.85,spacing:'medium'});
  if(p==='contrast')Object.assign(state,{size:1.08,contrast:true});
  if(p==='lines')Object.assign(state,{size:1.06,line:1.78,lines:true});
  sync();
  save();
}

function lineTargets(){
  return $$(TARGET_SELECTOR).filter(root=>{
    if(root.closest('.reading-panel,.demo-nav'))return false;
    if(root.matches('h1,h2,h3,h4,h5,h6'))return false;
    if(root.closest('h1,h2,h3,h4,h5,h6'))return false;
    return true;
  });
}

function clearLineColors(){
  cancelAnimationFrame(recolorFrame);
  $$('.reading-line-token').forEach(span=>{
    span.replaceWith(document.createTextNode(span.textContent||''));
  });
  lineTargets().forEach(root=>root.normalize());
}

function wrapLineWords(){
  const roots=lineTargets();
  roots.forEach(root=>{
    if(root.querySelector('.reading-line-token'))return;

    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode(node){
        if(!node.nodeValue || !node.nodeValue.trim())return NodeFilter.FILTER_REJECT;
        const parent=node.parentElement;
        if(!parent)return NodeFilter.FILTER_REJECT;
        if(parent.closest(EXCLUDE_SELECTOR))return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);

    nodes.forEach(node=>{
      const parts=node.nodeValue.split(/(\s+)/);
      const frag=document.createDocumentFragment();

      parts.forEach(part=>{
        if(!part || /^\s+$/.test(part)){
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const span=document.createElement('span');
        span.className='reading-line-token';
        span.textContent=part;
        frag.appendChild(span);
      });
      node.replaceWith(frag);
    });
  });
}

function colorVisualLines(){
  if(!state.lines)return;

  lineTargets().forEach(root=>{
    const tokens=$$('.reading-line-token',root).filter(t=>{
      const r=t.getBoundingClientRect();
      return r.width>0 && r.height>0;
    });
    if(!tokens.length)return;

    const lines=[];
    tokens.forEach(token=>{
      const rect=token.getBoundingClientRect();
      const top=rect.top;
      let lineIndex=lines.findIndex(v=>Math.abs(v-top)<=3);
      if(lineIndex===-1){
        lines.push(top);
        lines.sort((a,b)=>a-b);
        lineIndex=lines.findIndex(v=>Math.abs(v-top)<=3);
      }
      token.dataset.lineColor=String(lineIndex%LINE_COLORS.length);
      token.style.setProperty('color',LINE_COLORS[lineIndex%LINE_COLORS.length],'important');
    });

    // Le tri peut déplacer les indices après ajout d'une nouvelle ligne : seconde passe déterministe.
    const sorted=[...lines].sort((a,b)=>a-b);
    tokens.forEach(token=>{
      const top=token.getBoundingClientRect().top;
      let idx=0;
      let best=Infinity;
      sorted.forEach((v,i)=>{
        const d=Math.abs(v-top);
        if(d<best){best=d;idx=i}
      });
      token.dataset.lineColor=String(idx%LINE_COLORS.length);
      token.style.setProperty('color',LINE_COLORS[idx%LINE_COLORS.length],'important');
    });
  });
}

function scheduleLineRecolor(){
  if(!state.lines)return;
  cancelAnimationFrame(recolorFrame);
  recolorFrame=requestAnimationFrame(()=>{
    recolorFrame=requestAnimationFrame(colorVisualLines);
  });
}

function prepareLineColors(){
  wrapLineWords();
  scheduleLineRecolor();
}

function observeLayout(){
  if('ResizeObserver' in window){
    resizeObserver=new ResizeObserver(()=>{
      if(!state.lines)return;
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(scheduleLineRecolor,70);
    });
    const main=$('main');
    if(main)resizeObserver.observe(main);
    resizeObserver.observe(document.documentElement);
  }else{
    window.addEventListener('resize',()=>{
      if(!state.lines)return;
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(scheduleLineRecolor,90);
    },{passive:true});
  }

  document.addEventListener('toggle',()=>{
    if(state.lines)setTimeout(scheduleLineRecolor,40);
  },true);

  if(document.fonts?.ready){
    document.fonts.ready.then(()=>state.lines&&scheduleLineRecolor());
  }
}

function openPanel(){
  const panel=$('#readingPanel'),overlay=$('#readingOverlay'),opener=$('[data-reading-open]');
  if(!panel||!overlay)return;
  panel.hidden=false;
  overlay.hidden=false;
  opener?.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
  setTimeout(()=>$('.reading-panel__close',panel)?.focus(),0);
}

function closePanel(){
  const panel=$('#readingPanel'),overlay=$('#readingOverlay');
  if(panel)panel.hidden=true;
  if(overlay)overlay.hidden=true;
  $('[data-reading-open]')?.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
  $('[data-reading-open]')?.focus();
}

function initRuler(){
  const r=$('#readingRuler');
  if(!r)return;
  document.addEventListener('pointermove',e=>{
    if(!state.ruler)return;
    r.style.top=Math.max(0,e.clientY-r.offsetHeight/2)+'px';
  });
}

function init(){
  load();
  sync();
  initRuler();
  observeLayout();

  $('[data-reading-open]')?.addEventListener('click',openPanel);
  $('.reading-panel__close')?.addEventListener('click',closePanel);
  $('#readingOverlay')?.addEventListener('click',closePanel);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!$('#readingPanel')?.hidden)closePanel();
  });

  $$('[data-profile]').forEach(b=>b.addEventListener('click',()=>applyProfile(b.dataset.profile)));
  $$('[data-font]').forEach(b=>b.addEventListener('click',()=>{
    state.font=b.dataset.font;
    sync();
    save();
  }));
  $$('[data-spacing]').forEach(b=>b.addEventListener('click',()=>{
    state.spacing=b.dataset.spacing;
    sync();
    save();
  }));

  $('[data-size-minus]')?.addEventListener('click',()=>{
    state.size=clamp(Math.round((state.size-.1)*100)/100,.8,1.6);
    sync();save();
  });
  $('[data-size-plus]')?.addEventListener('click',()=>{
    state.size=clamp(Math.round((state.size+.1)*100)/100,.8,1.6);
    sync();save();
  });
  $('[data-line-minus]')?.addEventListener('click',()=>{
    state.line=clamp(Math.round((state.line-.1)*100)/100,1.3,2.4);
    sync();save();
  });
  $('[data-line-plus]')?.addEventListener('click',()=>{
    state.line=clamp(Math.round((state.line+.1)*100)/100,1.3,2.4);
    sync();save();
  });

  $('[data-lines-toggle]')?.addEventListener('click',()=>{
    state.lines=!state.lines;
    sync();
    save();
  });

  $('[data-ruler-toggle]')?.addEventListener('click',()=>{
    state.ruler=!state.ruler;
    sync();
    save();
  });

  $('[data-reset-reading]')?.addEventListener('click',()=>{
    state={...DEFAULTS};
    sync();
    save();
  });
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded',init,{once:true})
  : init();
})();