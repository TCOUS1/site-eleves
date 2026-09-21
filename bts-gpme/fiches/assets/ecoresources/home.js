(()=>{
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const panel=$('#readingPanel');
const overlay=$('[data-overlay]');
const opener=$('[data-open-reading]');
const closer=$('[data-close-reading]');
const preview=$('[data-preview]');
const linesBtn=$('[data-lines]');
const state={font:'system',size:1,line:1.6,lines:false};

function openPanel(){
  panel.hidden=false;overlay.hidden=false;opener.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';closer.focus();
}
function closePanel(){
  panel.hidden=true;overlay.hidden=true;opener.setAttribute('aria-expanded','false');
  document.body.style.overflow='';opener.focus();
}
opener.addEventListener('click',openPanel);
closer.addEventListener('click',closePanel);
overlay.addEventListener('click',closePanel);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closePanel();});

function wrapPreview(){
  if(preview.querySelector('span'))return;
  const text=preview.textContent;preview.textContent='';
  text.split(/(\s+)/).forEach(part=>{
    if(/^\s+$/.test(part)){preview.appendChild(document.createTextNode(part));return;}
    const s=document.createElement('span');s.textContent=part;preview.appendChild(s);
  });
}
function recolor(){
  wrapPreview();
  const spans=$$('span',preview);
  spans.forEach(s=>{s.style.color='';s.style.fontWeight='';});
  preview.parentElement.classList.toggle('preview-lines',state.lines);
  if(!state.lines)return;
  requestAnimationFrame(()=>{
    const palette=['#164f88','#a12f35','#2d6a4f'];
    const rows=[];
    spans.forEach(span=>{
      const top=span.getBoundingClientRect().top;
      let idx=rows.findIndex(v=>Math.abs(v-top)<3);
      if(idx===-1){rows.push(top);idx=rows.length-1;}
      span.style.color=palette[idx%palette.length];
      span.style.fontWeight='600';
    });
  });
}
function applyReading(){
  document.body.classList.toggle('font-verdana',state.font==='verdana');
  document.body.classList.toggle('font-dys',state.font==='dys');
  document.documentElement.style.setProperty('--text-scale',state.size);
  document.documentElement.style.setProperty('--line-height',state.line);
  $('[data-size-label]').textContent=Math.round(state.size*100)+' %';
  $('[data-line-label]').textContent=state.line.toFixed(2).replace('.',',');
  $$('[data-font]').forEach(b=>b.classList.toggle('active',b.dataset.font===state.font));
  linesBtn.setAttribute('aria-checked',String(state.lines));
  recolor();
}
$$('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{state.font=btn.dataset.font;applyReading();}));
$('[data-size="minus"]').addEventListener('click',()=>{state.size=Math.max(.9,Math.round((state.size-.1)*10)/10);applyReading();});
$('[data-size="plus"]').addEventListener('click',()=>{state.size=Math.min(1.4,Math.round((state.size+.1)*10)/10);applyReading();});
$('[data-line="minus"]').addEventListener('click',()=>{state.line=Math.max(1.35,Math.round((state.line-.05)*100)/100);applyReading();});
$('[data-line="plus"]').addEventListener('click',()=>{state.line=Math.min(2,Math.round((state.line+.05)*100)/100);applyReading();});
linesBtn.addEventListener('click',()=>{state.lines=!state.lines;applyReading();});
$('[data-reset]').addEventListener('click',()=>{state.font='system';state.size=1;state.line=1.6;state.lines=false;applyReading();});
window.addEventListener('resize',()=>state.lines&&recolor());

/* Recherche accueil : réutilise l’index canonique déjà présent dans le site. */
const searchForm=$('[data-search-form]');
const searchInput=$('#homeSearch');
const searchPopover=$('[data-search-popover]');
const searchIndex=(window.GPME_SEARCH_V42||[]).map(item=>({
  ...item,
  label:item.title||item.id||'Ressource',
  context:item.meta||item.kind||'Ressource',
  keys:[item.title,item.id,item.meta,...(item.queries||[])].filter(Boolean).join(' ')
}));

function norm(s){
  return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}
function score(item,query){
  const terms=norm(query).split(/\s+/).filter(Boolean);
  if(!terms.length)return -1;
  const hay=norm(item.keys);
  let total=0;
  for(const term of terms){
    if(!hay.includes(term))return -1;
    const label=norm(item.label);
    if(label===term)total+=12;
    else if(label.startsWith(term))total+=8;
    else if(label.includes(term))total+=6;
    else total+=2;
  }
  return total;
}
function getResults(query){
  return searchIndex.map(item=>({...item,_score:score(item,query)}))
    .filter(item=>item._score>=0)
    .sort((a,b)=>b._score-a._score || a.label.localeCompare(b.label,'fr'))
    .slice(0,6);
}
function showResults(query){
  const q=query.trim();
  if(!q){searchPopover.hidden=true;searchPopover.innerHTML='';return;}
  const found=getResults(q);
  searchPopover.innerHTML=found.length
    ? found.map((item,i)=>`<button class="search-result" type="button" data-search-result="${i}"><span><strong>${item.label}</strong><small>${item.context}</small></span><span aria-hidden="true">→</span></button>`).join('')
    : `<div class="search-no-result"><strong>Aucun résultat direct.</strong><br><a href="az.html">Explorer les notions de A à Z →</a></div>`;
  searchPopover.hidden=false;
  [...searchPopover.querySelectorAll('[data-search-result]')].forEach((btn,i)=>{
    btn.addEventListener('click',()=>{const item=found[i]; if(item?.url) window.location.href=item.url;});
  });
}
searchForm.addEventListener('submit',e=>{
  e.preventDefault();
  const q=searchInput.value.trim();
  if(!q){searchInput.focus();return;}
  const found=getResults(q);
  if(found[0]?.url){window.location.href=found[0].url;return;}
  showResults(q);
});
searchInput.addEventListener('input',()=>{if(searchInput.value.trim().length>=2)showResults(searchInput.value);else searchPopover.hidden=true;});
searchInput.addEventListener('keydown',e=>{if(e.key==='Escape'){searchInput.value='';searchPopover.hidden=true;}});
document.addEventListener('pointerdown',e=>{if(!searchForm.contains(e.target)&&!searchPopover.contains(e.target))searchPopover.hidden=true;});

applyReading();
})();