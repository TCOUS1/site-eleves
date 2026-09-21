(() => {
  const body = document.body;
  const toolsToggle = document.querySelector('[data-tools-toggle]');
  const mobileToggle = document.querySelector('[data-mobile-tools-toggle]');

  toolsToggle?.addEventListener('click', () => {
    const collapsed = body.classList.toggle('tools-collapsed');
    toolsToggle.setAttribute('aria-expanded', String(!collapsed));
    toolsToggle.textContent = collapsed ? '›' : '‹';
    toolsToggle.title = collapsed ? 'Déployer les ressources' : 'Réduire les ressources';
  });

  mobileToggle?.addEventListener('click', () => {
    const open = body.classList.toggle('mobile-tools-open');
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.innerHTML = open ? '✕ Fermer les ressources' : '☰ Ressources de la mission';
  });



  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

  // Mémoriser localement les tâches cochées, sans aucune donnée nominative.
  document.querySelectorAll('.task-section input[type="checkbox"]').forEach((box) => {
    const section = box.closest('.task-section');
    if (!section?.id) return;
    const key = 'tp1083:'+location.pathname+':'+section.id;
    try { box.checked = localStorage.getItem(key) === '1'; } catch(e) {}
    box.addEventListener('change', () => { try { localStorage.setItem(key, box.checked ? '1' : '0'); } catch(e) {} });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      body.classList.remove('mobile-tools-open');
      mobileToggle?.setAttribute('aria-expanded','false');
      if (mobileToggle) mobileToggle.innerHTML = '☰ Ressources de la mission';
    }
  });
})();
