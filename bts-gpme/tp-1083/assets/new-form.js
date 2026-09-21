(() => {
  const checks = [...document.querySelectorAll('[data-pilot-check]')];
  if (!checks.length) return;
  const key = 'bts-gpme-forme-v2:' + location.pathname;
  let state = {};
  try { state = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) {}
  checks.forEach((c, i) => { const id=c.dataset.pilotCheck || String(i); c.checked=Boolean(state[id]); });
  const fill=document.querySelector('.pilot-progress__fill');
  const label=document.querySelector('.pilot-progress__label');
  function render(){
    const done=checks.filter(c=>c.checked).length;
    const pct=Math.round((done/checks.length)*100);
    if(fill) fill.style.width=pct+'%';
    if(label) label.textContent=`Repérage personnel : ${done}/${checks.length} étapes marquées`;
  }
  checks.forEach((c,i)=>c.addEventListener('change',()=>{
    const id=c.dataset.pilotCheck || String(i); state[id]=c.checked;
    try { localStorage.setItem(key,JSON.stringify(state)); } catch(e) {}
    render();
  }));
  render();
})();
