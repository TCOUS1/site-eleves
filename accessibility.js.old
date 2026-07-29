let fontSize = 1.05;

/* =============================
   THÈME CLAIR / SOMBRE
============================= */
function toggleTheme() {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

/* =============================
   MODE DYS
============================= */
function toggleDys() {
  document.body.classList.toggle("dys");

  const dysButton = document.getElementById("btn-dys");

  if (document.body.classList.contains("dys")) {
    localStorage.setItem("dysMode", "on");
    if (dysButton) dysButton.classList.add("active");
  } else {
    localStorage.setItem("dysMode", "off");
    if (dysButton) dysButton.classList.remove("active");
  }
}

/* =============================
   TAILLE DE POLICE
============================= */
function fontPlus() {
  fontSize += 0.1;
  document.body.style.fontSize = fontSize + "em";
  localStorage.setItem("fontSize", fontSize);
}

function fontMinus() {
  fontSize -= 0.1;
  document.body.style.fontSize = fontSize + "em";
  localStorage.setItem("fontSize", fontSize);
}

/* =============================
   RESET
============================= */
function resetAccessibility() {
  document.body.classList.remove("light", "dys");
  document.body.style.fontSize = "";

  localStorage.removeItem("theme");
  localStorage.removeItem("dysMode");
  localStorage.removeItem("fontSize");

  fontSize = 1.05;
}

/* =============================
   RESTAURATION AU CHARGEMENT ✅
============================= */
window.addEventListener("DOMContentLoaded", () => {

  /* Thème */
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }

  /* Mode Dys */
  if (localStorage.getItem("dysMode") === "on") {
    document.body.classList.add("dys");
    const dysButton = document.getElementById("btn-dys");
    if (dysButton) dysButton.classList.add("active");
  }

  /* Taille police */
  if (localStorage.getItem("fontSize")) {
    fontSize = parseFloat(localStorage.getItem("fontSize"));
    document.body.style.fontSize = fontSize + "em";
  }

});

/* =============================
   FICHES DE RÉVISION STMG
   Le module ne s'active que sur les pages concernées.
============================= */
window.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".revision-page");
  if (!root) return;

  const cards = [...root.querySelectorAll(".revision-card")];
  const themeSections = [...root.querySelectorAll("[data-theme-section]")];
  const search = root.querySelector("#search");
  const filters = [...root.querySelectorAll(".filter")];
  const doneCount = root.querySelector("#done-count");
  const progressFill = root.querySelector("#progress-fill");
  const progressMessage = root.querySelector("#progress-message");
  const detailBlocks = [...root.querySelectorAll("details")];
  const storageKey = root.dataset.storageKey || "revision-fiches-v1";
  let activeFilter = "all";
  let completed = new Set();
  let detailPrintState = [];

  const normalize = value => value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    completed = new Set(Array.isArray(stored) ? stored : []);
  } catch (_) {
    completed = new Set();
  }

  function updateProgress() {
    cards.forEach(card => {
      const button = card.querySelector(".done-btn");
      const isDone = completed.has(card.dataset.id);
      button.setAttribute("aria-pressed", String(isDone));
      button.textContent = isDone ? "Révisée ✓" : "À réviser";
    });

    const count = completed.size;
    doneCount.textContent = count;
    progressFill.style.width = `${Math.round(count / cards.length * 100)}%`;
    progressMessage.textContent = count === cards.length
      ? "Bravo : parcours terminé !"
      : count === 0
        ? "Commence par le thème de ton choix."
        : `Encore ${cards.length - count} fiche${cards.length - count > 1 ? "s" : ""} à valider.`;
  }

  function applyFilters() {
    const query = normalize(search.value.trim());
    let visibleCount = 0;

    cards.forEach(card => {
      const themeMatch = activeFilter === "all" || card.dataset.theme === activeFilter;
      const textMatch = !query || normalize(card.textContent).includes(query);
      card.hidden = !(themeMatch && textMatch);
      if (!card.hidden) visibleCount += 1;
    });

    themeSections.forEach(section => {
      const hasVisibleCard = [...section.querySelectorAll(".revision-card")]
        .some(card => !card.hidden);
      section.hidden = !hasVisibleCard;
    });

    root.querySelector("#empty-state")
      .classList.toggle("visible", visibleCount === 0);
  }

  root.addEventListener("click", event => {
    const doneButton = event.target.closest(".done-btn");
    if (doneButton) {
      const id = doneButton.closest(".revision-card").dataset.id;
      completed.has(id) ? completed.delete(id) : completed.add(id);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...completed]));
      } catch (_) {}
      updateProgress();
    }

    const answerButton = event.target.closest(".answer-btn");
    if (answerButton) {
      const answer = answerButton.nextElementSibling;
      const open = answerButton.getAttribute("aria-expanded") === "true";
      answerButton.setAttribute("aria-expanded", String(!open));
      answerButton.textContent = open ? "Voir la correction" : "Masquer la correction";
      answer.hidden = open;
    }

    const filterButton = event.target.closest(".filter");
    if (filterButton) {
      activeFilter = filterButton.dataset.filter;
      filters.forEach(button => {
        button.setAttribute("aria-pressed", String(button === filterButton));
      });
      applyFilters();
    }
  });

  search.addEventListener("input", applyFilters);
  root.querySelector("#print-page").addEventListener("click", () => window.print());

  window.addEventListener("beforeprint", () => {
    detailPrintState = detailBlocks.map(details => details.open);
    detailBlocks.forEach(details => { details.open = true; });
  });

  window.addEventListener("afterprint", () => {
    detailBlocks.forEach((details, index) => {
      details.open = detailPrintState[index];
    });
  });

  updateProgress();
  applyFilters();
});
