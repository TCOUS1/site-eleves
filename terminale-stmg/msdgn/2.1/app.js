(()=>{
'use strict';
const root=document.documentElement;
const body=document.body;
const one=s=>document.querySelector(s);
const all=s=>[...document.querySelectorAll(s)];
let fs=parseFloat(getComputedStyle(root).getPropertyValue('--font-size'))||17;
const drawer=one('.tool-drawer');
const tools=one('[data-tools]');
if(tools&&drawer){tools.addEventListener('click',()=>{drawer.hidden=!drawer.hidden;tools.setAttribute('aria-expanded',String(!drawer.hidden));});}
function active(button,on){if(button){button.classList.toggle('is-active',on);button.setAttribute('aria-pressed',String(on));}}
const plus=one('[data-action="font-plus"]');
const minus=one('[data-action="font-minus"]');
const spacing=one('[data-action="spacing"]');
const dys=one('[data-action="dyslexic"]');
const colors=one('[data-action="color-lines"]');
const print=one('[data-action="print"]');

let rgbPrepared=false;
let rgbFrame=0;
let rgbTimer=0;
const rgbPalette=['#c40020','#0057c8','#087a2d'];

function shouldSkipText(node){
  const p=node.parentElement;
  return !p || p.closest('.toolbar,.toc,.block-label,.response-sheet,script,style,button,input,textarea,select,option') || !node.nodeValue.trim();
}

function prepareRgbTokens(){
  if(rgbPrepared)return;
  const course=one('.course'); if(!course)return;
  const walker=document.createTreeWalker(course,NodeFilter.SHOW_TEXT,{acceptNode:n=>shouldSkipText(n)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    const frag=document.createDocumentFragment();
    const parts=node.nodeValue.split(/(\s+)/);
    parts.forEach(part=>{
      if(!part)return;
      if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
      const span=document.createElement('span');
      span.className='rgb-token';
      span.textContent=part;
      frag.appendChild(span);
    });
    node.parentNode.replaceChild(frag,node);
  });
  rgbPrepared=true;
}

function rectForToken(span){
  const rects=span.getClientRects();
  if(!rects.length)return null;
  // A token normally occupies one visual line. Use the first rendered fragment.
  const r=rects[0];
  return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height,center:(r.top+r.bottom)/2};
}

function sameVisualLine(a,b){
  if(!a||!b)return false;
  // Font weight and OpenDyslexic can shift glyph boxes by a few pixels.
  // Compare vertical centres and actual overlap instead of exact top coordinates.
  const overlap=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
  const minH=Math.max(1,Math.min(a.height,b.height));
  const centreTolerance=Math.max(3.5,minH*0.34);
  return overlap>minH*0.45 || Math.abs(a.center-b.center)<=centreTolerance;
}

function colorVisualLines(){
  rgbFrame=0;
  if(!body.classList.contains('color-lines'))return;
  prepareRgbTokens();
  const tokens=all('.course .rgb-token').filter(s=>s.getClientRects().length&&s.offsetParent!==null);
  let lineIndex=-1;
  let lineRect=null;
  let previousRect=null;
  let previousToken=null;

  tokens.forEach(span=>{
    const r=rectForToken(span); if(!r)return;
    const same=sameVisualLine(lineRect,r);
    if(!same){
      lineIndex++;
      lineRect={...r};
    }else{
      // Grow the representative line box so mixed bold/normal text remains one line.
      lineRect.top=Math.min(lineRect.top,r.top);
      lineRect.bottom=Math.max(lineRect.bottom,r.bottom);
      lineRect.height=lineRect.bottom-lineRect.top;
      lineRect.center=(lineRect.top+lineRect.bottom)/2;
    }
    span.style.setProperty('--rgb-color',rgbPalette[lineIndex%rgbPalette.length]);
    previousRect=r; previousToken=span;
  });
}

function scheduleRgb(delay=55){
  if(!body.classList.contains('color-lines'))return;
  clearTimeout(rgbTimer);
  if(rgbFrame)cancelAnimationFrame(rgbFrame);
  rgbTimer=setTimeout(()=>{
    rgbFrame=requestAnimationFrame(()=>requestAnimationFrame(colorVisualLines));
  },delay);
}

function toggleRgb(){
  body.classList.toggle('color-lines');
  active(colors,body.classList.contains('color-lines'));
  if(body.classList.contains('color-lines')){
    prepareRgbTokens();
    scheduleRgb(0);
  }
}

plus?.addEventListener('click',()=>{fs=Math.min(fs+1,24);root.style.setProperty('--font-size',fs+'px');scheduleRgb();});
minus?.addEventListener('click',()=>{fs=Math.max(fs-1,14);root.style.setProperty('--font-size',fs+'px');scheduleRgb();});
spacing?.addEventListener('click',()=>{body.classList.toggle('reading-space');active(spacing,body.classList.contains('reading-space'));scheduleRgb();});
dys?.addEventListener('click',()=>{body.classList.toggle('opendyslexic');active(dys,body.classList.contains('opendyslexic'));document.fonts?.ready.then(scheduleRgb);});
colors?.addEventListener('click',toggleRgb);
all('details.correction').forEach(d=>{const s=d.querySelector('summary');if(!s)return;d.addEventListener('toggle',()=>{s.textContent=d.open?'Masquer la correction':'Afficher la correction';scheduleRgb();});});
window.addEventListener('resize',()=>scheduleRgb(90),{passive:true});
window.addEventListener('orientationchange',()=>scheduleRgb(140),{passive:true});
if('ResizeObserver' in window){
  const course=one('.course');
  if(course){
    const ro=new ResizeObserver(()=>scheduleRgb(70));
    ro.observe(course);
  }
}
document.fonts?.ready.then(()=>scheduleRgb(0));
print?.addEventListener('click',()=>window.print());
})();
