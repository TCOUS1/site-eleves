(() => {
  "use strict";

  /*
   * Accessibilité générique.
   * Une page autonome peut fournir ses propres fonctions portant les mêmes noms.
   * Dans ce cas, ce fichier ne les remplace pas et ne restaure pas un second état.
   */
  const pageProvidesAccessibility = [
    "toggleTheme",
    "toggleDys",
    "fontPlus",
    "fontMinus",
    "resetAccessibility"
  ].some(name => typeof window[name] === "function");

  if (!pageProvidesAccessibility) {
    let fontSize = 1.05;

    window.toggleTheme = function toggleTheme() {
      document.body.classList.toggle("light");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("light") ? "light" : "dark"
      );
    };

    window.toggleDys = function toggleDys() {
      document.body.classList.toggle("dys");
      const dysButton = document.getElementById("btn-dys");
      const enabled = document.body.classList.contains("dys");

      localStorage.setItem("dysMode", enabled ? "on" : "off");
      if (dysButton) dysButton.classList.toggle("active", enabled);
    };

    window.fontPlus = function fontPlus() {
      fontSize = Math.min(1.8, fontSize + 0.1);
      document.body.style.fontSize = `${fontSize}em`;
      localStorage.setItem("fontSize", String(fontSize));
    };

    window.fontMinus = function fontMinus() {
      fontSize = Math.max(0.8, fontSize - 0.1);
      document.body.style.fontSize = `${fontSize}em`;
      localStorage.setItem("fontSize", String(fontSize));
    };

    window.resetAccessibility = function resetAccessibility() {
      document.body.classList.remove("light", "dys");
      document.body.style.fontSize = "";

      localStorage.removeItem("theme");
      localStorage.removeItem("dysMode");
      localStorage.removeItem("fontSize");

      fontSize = 1.05;
      const dysButton = document.getElementById("btn-dys");
      if (dysButton) dysButton.classList.remove("active");
    };

    window.addEventListener("DOMContentLoaded", () => {
      if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
      }

      if (localStorage.getItem("dysMode") === "on") {
        document.body.classList.add("dys");
        const dysButton = document.getElementById("btn-dys");
        if (dysButton) dysButton.classList.add("active");
      }

      const storedFontSize = Number.parseFloat(localStorage.getItem("fontSize"));
      if (Number.isFinite(storedFontSize)) {
        fontSize = storedFontSize;
        document.body.style.fontSize = `${fontSize}em`;
      }
    });
  }

  /*
   * Fiches de révision STMG.
   * Le module est volontairement limité au composant .mgmt-revision.
   * Une simple classe .revision-page sur le body ne suffit plus à l’activer.
   */
  window.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector(".mgmt-revision");
    if (!root) return;

    const cards = [...root.querySelectorAll(".revision-card")];
    const themeSections = [...root.querySelectorAll("[data-theme-section]")];
    const search = root.querySelector("#search");
    const filters = [...root.querySelectorAll(".filter")];
    const doneCount = root.querySelector("#done-count");
    const progressFill = root.querySelector("#progress-fill");
    const progressMessage = root.querySelector("#progress-message");
    const emptyState = root.querySelector("#empty-state");
    const printButton = root.querySelector("#print-page");
    const detailBlocks = [...root.querySelectorAll("details")];
    const storageKey = root.dataset.storageKey || "revision-fiches-v1";

    /*
     * Si la structure attendue n’est pas complète, on n’installe aucun
     * gestionnaire partiel : cela évite les conflits avec d’autres disciplines.
     */
    if (
      !search ||
      !doneCount ||
      !progressFill ||
      !progressMessage ||
      !emptyState ||
      !printButton
    ) {
      console.warn(
        "Module de révision non initialisé : structure .mgmt-revision incomplète."
      );
      return;
    }

    let activeFilter = "all";
    let completed = new Set();
    let detailPrintState = [];

    const normalize = value => String(value)
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
        if (!button || !card.dataset.id) return;

        const isDone = completed.has(card.dataset.id);
        button.setAttribute("aria-pressed", String(isDone));
        button.textContent = isDone ? "Révisée ✓" : "À réviser";
      });

      const count = [...completed].filter(id =>
        cards.some(card => card.dataset.id === id)
      ).length;

      doneCount.textContent = String(count);
      progressFill.style.width = cards.length
        ? `${Math.round(count / cards.length * 100)}%`
        : "0%";

      progressMessage.textContent = cards.length > 0 && count === cards.length
        ? "Bravo : parcours terminé !"
        : count === 0
          ? "Commence par le thème de ton choix."
          : `Encore ${cards.length - count} fiche${cards.length - count > 1 ? "s" : ""} à valider.`;
    }

    function applyFilters() {
      const query = normalize(search.value.trim());
      let visibleCount = 0;

      cards.forEach(card => {
        const themeMatch =
          activeFilter === "all" || card.dataset.theme === activeFilter;
        const textMatch =
          !query || normalize(card.textContent).includes(query);

        card.hidden = !(themeMatch && textMatch);
        if (!card.hidden) visibleCount += 1;
      });

      themeSections.forEach(section => {
        const hasVisibleCard = [...section.querySelectorAll(".revision-card")]
          .some(card => !card.hidden);
        section.hidden = !hasVisibleCard;
      });

      emptyState.classList.toggle("visible", visibleCount === 0);
    }

    root.addEventListener("click", event => {
      const doneButton = event.target.closest(".done-btn");
      if (doneButton && root.contains(doneButton)) {
        const card = doneButton.closest(".revision-card");
        const id = card?.dataset.id;

        if (id) {
          completed.has(id) ? completed.delete(id) : completed.add(id);
          try {
            localStorage.setItem(storageKey, JSON.stringify([...completed]));
          } catch (_) {}
          updateProgress();
        }
      }

      const answerButton = event.target.closest(".answer-btn");
      if (answerButton && root.contains(answerButton)) {
        const answer = answerButton.nextElementSibling;
        if (!answer || !answer.classList.contains("answer")) return;

        const open = answerButton.getAttribute("aria-expanded") === "true";
        answerButton.setAttribute("aria-expanded", String(!open));
        answerButton.textContent =
          open ? "Voir la correction" : "Masquer la correction";
        answer.hidden = open;
      }

      const filterButton = event.target.closest(".filter");
      if (filterButton && root.contains(filterButton)) {
        activeFilter = filterButton.dataset.filter || "all";
        filters.forEach(button => {
          button.setAttribute(
            "aria-pressed",
            String(button === filterButton)
          );
        });
        applyFilters();
      }
    });

    search.addEventListener("input", applyFilters);
    printButton.addEventListener("click", () => window.print());

    window.addEventListener("beforeprint", () => {
      detailPrintState = detailBlocks.map(details => details.open);
      detailBlocks.forEach(details => {
        details.open = true;
      });
    });

    window.addEventListener("afterprint", () => {
      detailBlocks.forEach((details, index) => {
        details.open = detailPrintState[index];
      });
    });

    updateProgress();
    applyFilters();
  });
})();
