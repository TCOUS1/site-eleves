(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const opener=$('[data-eco-open-reading]');
const closer=$('[data-eco-close-reading]');
const panel=$('#ecoReadingPanel');
const overlay=$('[data-eco-overlay]');
if(!opener||!closer||!panel||!overlay)return;
const state={font:'system'};
function openPanel(){panel.hidden=false;overlay.hidden=false;opener.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';closer.focus();}
function closePanel(){panel.hidden=true;overlay.hidden=true;opener.setAttribute('aria-expanded','false');document.body.style.overflow='';opener.focus();}
opener.addEventListener('click',openPanel);closer.addEventListener('click',closePanel);overlay.addEventListener('click',closePanel);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closePanel();});
function applyFont(){document.body.classList.toggle('font-verdana',state.font==='verdana');document.body.classList.toggle('font-dys',state.font==='dys');$$('[data-eco-font]').forEach(b=>b.classList.toggle('active',b.dataset.ecoFont===state.font));}
$$('[data-eco-font]').forEach(btn=>btn.addEventListener('click',()=>{state.font=btn.dataset.ecoFont;applyFont();}));
applyFont();
})();