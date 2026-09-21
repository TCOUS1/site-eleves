(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const opener=$('[data-open-reading]');
const panel=$('#readingPanel');
const overlay=$('[data-overlay]');
const close=$('[data-close-reading]');

/* Navigation : un clic normal poursuit le parcours dans le même onglet.
   Ctrl/Cmd/Maj + clic et les téléchargements conservent le comportement du navigateur. */
document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  const link=e.target.closest('a[href]');
  if(!link||link.hasAttribute('download'))return;
  const href=link.getAttribute('href');
  if(!href||href.startsWith('#')||/^(mailto:|tel:|javascript:)/i.test(href))return;
  e.preventDefault();
  window.location.assign(link.href);
});

function openPanel(){panel.hidden=false;overlay.hidden=false;opener?.setAttribute('aria-expanded','true');}
function closePanel(){panel.hidden=true;overlay.hidden=true;opener?.setAttribute('aria-expanded','false');}
opener?.addEventListener('click',openPanel);close?.addEventListener('click',closePanel);overlay?.addEventListener('click',closePanel);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closePanel();});

const readingFonts=$$('[data-font]');
readingFonts.forEach(btn=>btn.addEventListener('click',()=>{
  const font=btn.dataset.font||'system';
  document.body.classList.toggle('font-verdana',font==='verdana');
  document.body.classList.toggle('font-dys',font==='dys');
  readingFonts.forEach(b=>b.classList.toggle('active',b===btn));
}));

$$('[data-alpha]').forEach(btn=>btn.addEventListener('click',()=>{
  $$('[data-alpha]').forEach(b=>b.classList.remove('is-current'));
  btn.classList.add('is-current');
}));

const lineBtn=$('[data-lines]');
const preview=$('[data-preview]');
lineBtn?.addEventListener('click',()=>{
  const on=lineBtn.getAttribute('aria-checked')!=='true';
  lineBtn.setAttribute('aria-checked',String(on));
  if(!preview)return;
  const words=preview.textContent.split(/(\s+)/);
  preview.textContent='';
  words.forEach(w=>{
    if(/^\s+$/.test(w)){preview.appendChild(document.createTextNode(w));return;}
    const s=document.createElement('span');s.textContent=w;preview.appendChild(s);
  });
  const spans=$$('span',preview);
  if(!on){spans.forEach(s=>{s.style.color='';s.style.fontWeight='';});return;}
  requestAnimationFrame(()=>{
    const colors=['#164f88','#a12f35','#2d6a4f'];const rows=[];
    spans.forEach(s=>{
      const top=s.getBoundingClientRect().top;
      let i=rows.findIndex(v=>Math.abs(v-top)<3);
      if(i<0){rows.push(top);i=rows.length-1;}
      s.style.color=colors[i%3];s.style.fontWeight='600';
    });
  });
});

/* Functional A-Z index: this page is now the complete notion index. */
const azList=$('[data-az-list]');
if(azList){
  const azSearch=$('#azSearch');
  const azStatus=$('[data-az-status]');
  const alphaButtons=$$('[data-alpha]');
  const notions=(window.GPME_SEARCH_V42||[])
    .filter(item=>item.kind==='notion' && item.title && item.url)
    .slice()
    .sort((a,b)=>a.title.localeCompare(b.title,'fr',{sensitivity:'base'}));
  let activeLetter='';

  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const esc=s=>String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const firstLetter=title=>norm(title).charAt(0).toUpperCase();

  function renderAz(){
    const query=norm(azSearch?.value).trim();
    const filtered=notions.filter(item=>{
      if(activeLetter && firstLetter(item.title)!==activeLetter)return false;
      if(!query)return true;
      const hay=norm([item.title,item.id,item.meta,...(item.queries||[])].filter(Boolean).join(' '));
      return query.split(/\s+/).filter(Boolean).every(term=>hay.includes(term));
    });
    azStatus.textContent=`${filtered.length} notion${filtered.length>1?'s':''}${activeLetter?' \u2014 lettre '+activeLetter:''}${query?' \u2014 recherche \u00ab '+azSearch.value.trim()+' \u00bb':''}`;
    azList.innerHTML=filtered.length ? filtered.map(item=>{
      const letter=firstLetter(item.title);
      const definition=(item.queries||[])[0]||'Notion du BTS GPME';
      return `<a class="az-row" href="${esc(item.url)}"><span class="az-letter">${esc(letter)}</span><span><strong>${esc(item.title)}</strong><small>${esc(definition)}</small></span><span class="arrow" aria-hidden="true">\u2192</span></a>`;
    }).join('') : '<p class="az-empty">Aucune notion ne correspond \u00e0 ce filtre.</p>';
  }

  alphaButtons.forEach(btn=>btn.addEventListener('click',()=>{
    activeLetter=(btn.dataset.alpha||'').toUpperCase();
    alphaButtons.forEach(b=>b.classList.toggle('is-current',b===btn));
    renderAz();
  }));
  azSearch?.addEventListener('input',renderAz);
  renderAz();
}

})();