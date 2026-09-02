(()=>{
  const input=document.querySelector('#glossary-search'),reset=document.querySelector('#glossary-reset'),status=document.querySelector('#glossary-status'),empty=document.querySelector('#glossary-empty');
  const entries=[...document.querySelectorAll('.glossary-entry')],groups=[...document.querySelectorAll('.glossary-letter-group')],letterLinks=[...document.querySelectorAll('[data-letter-link]')];
  if(!input||!entries.length)return;
  const norm=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
  const apply=()=>{
    const q=norm(input.value),tokens=q.split(' ').filter(Boolean);let shown=0;
    entries.forEach(e=>{const hay=norm(e.textContent);const ok=!tokens.length||tokens.every(t=>hay.includes(t));e.hidden=!ok;if(ok)shown++;});
    groups.forEach(g=>{const visible=[...g.querySelectorAll('.glossary-entry')].some(e=>!e.hidden);g.hidden=!visible;});
    letterLinks.forEach(a=>{const g=document.querySelector(`#lettre-${a.dataset.letterLink.toLowerCase()}`);a.hidden=!!(q&&g&&g.hidden);});
    status.textContent=q?`${shown} notion${shown>1?'s':''} trouvée${shown>1?'s':''}.`:`${entries.length} notions disponibles.`;
    empty.hidden=shown!==0;
  };
  input.addEventListener('input',apply);reset.addEventListener('click',()=>{input.value='';apply();input.focus();});apply();
})();
