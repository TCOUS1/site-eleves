(() => {
  "use strict";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storagePrefix = "msdgn-v1:";

  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(storagePrefix + "settings") || "{}");
    } catch {
      return {};
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(storagePrefix + "settings", JSON.stringify(settings));
  }

  function applySettings() {
    const settings = loadSettings();
    document.body.classList.toggle("dark", settings.dark === true);
    document.body.classList.toggle("dys", settings.dys === true);
    document.documentElement.style.setProperty("--font-scale", settings.fontScale || 1);
    document.body.classList.toggle("teacher-mode", settings.teacher === true);
    qsa("[data-tool='dark']").forEach(button => button.setAttribute("aria-pressed", String(settings.dark === true)));
    qsa("[data-tool='dys']").forEach(button => button.setAttribute("aria-pressed", String(settings.dys === true)));
    qsa("[data-tool='teacher']").forEach(button => button.setAttribute("aria-pressed", String(settings.teacher === true)));
  }

  function updateSetting(key, value) {
    const settings = loadSettings();
    settings[key] = value;
    saveSettings(settings);
    applySettings();
  }

  function restoreSavedFields() {
    qsa("[data-save]").forEach(element => {
      const key = storagePrefix + element.dataset.save;
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        if (element.type === "checkbox") {
          element.checked = stored === "true";
        } else {
          element.value = stored;
        }
      }
      const eventName = element.type === "checkbox" ? "change" : "input";
      element.addEventListener(eventName, () => {
        localStorage.setItem(key, element.type === "checkbox" ? String(element.checked) : element.value);
        if (element.classList.contains("phase-check")) updateCourseProgress();
      });
    });
  }

  function updateCourseProgress() {
    const code = document.body.dataset.courseCode;
    if (!code) return;
    const checks = qsa(".phase-check");
    const done = checks.filter(item => item.checked).length;
    const total = checks.length;
    const percent = total ? Math.round(done / total * 100) : 0;
    const fill = qs("#course-progress-fill");
    const text = qs("#course-progress-text");
    if (fill) fill.style.width = percent + "%";
    if (text) text.textContent = `${done} / ${total} · ${percent} %`;
    localStorage.setItem(storagePrefix + `course:${code}:progress`, String(percent));
    localStorage.setItem(storagePrefix + `course:${code}:complete`, String(percent === 100));
  }

  function updatePortalProgress() {
    const cards = qsa("[data-course-card]");
    if (!cards.length) return;
    let total = 0;
    cards.forEach(card => {
      const code = card.dataset.courseCard;
      const value = Number(localStorage.getItem(storagePrefix + `course:${code}:progress`) || 0);
      total += value;
      const fill = qs(".course-progress-mini span", card);
      const label = qs("[data-card-progress]", card);
      if (fill) fill.style.width = value + "%";
      if (label) label.textContent = value + " %";
    });
    const global = cards.length ? Math.round(total / cards.length) : 0;
    const fill = qs("#global-progress-fill");
    const text = qs("#global-progress-text");
    if (fill) fill.style.width = global + "%";
    if (text) text.textContent = global + " %";
  }

  function formatEuro(value) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function initCalculators() {
    qsa("[data-calculator='va']").forEach(root => {
      const update = () => {
        const value = name => Number(qs(`[data-calc-input='${name}']`, root)?.value || 0);
        qs("[data-calc-output]", root).textContent = "Valeur ajoutée : " + formatEuro(value("ca") - value("achats") - value("services"));
      };
      qsa("input", root).forEach(input => input.addEventListener("input", update));
      update();
    });

    qsa("[data-calculator='finance']").forEach(root => {
      const update = () => {
        const value = name => Number(qs(`[data-calc-input='${name}']`, root)?.value || 0);
        const frng = value("rs") - value("es");
        const bfr = value("ace") - value("de");
        const tn = frng - bfr;
        qs("[data-calc-output='frng']", root).textContent = formatEuro(frng);
        qs("[data-calc-output='bfr']", root).textContent = formatEuro(bfr);
        qs("[data-calc-output='tn']", root).textContent = formatEuro(tn);
      };
      qsa("input", root).forEach(input => input.addEventListener("input", update));
      update();
    });

    qsa("[data-calculator='mcs'] .product-calc").forEach(root => {
      const update = () => {
        const value = name => Number(qs(`[data-calc-input='${name}']`, root)?.value || 0);
        qs("[data-calc-output]", root).textContent = formatEuro(value("ca") - value("cv") - value("cfs"));
      };
      qsa("input", root).forEach(input => input.addEventListener("input", update));
      update();
    });
  }

  function syncPrintResponses() {
    qsa("textarea[data-save]").forEach(textarea => {
      let print = textarea.nextElementSibling?.classList.contains("print-response")
        ? textarea.nextElementSibling
        : null;
      if (!print) {
        print = document.createElement("div");
        print.className = "print-response";
        textarea.insertAdjacentElement("afterend", print);
      }
      print.textContent = textarea.value || "Espace de réponse";
    });
  }

  document.addEventListener("click", event => {
    const tool = event.target.closest("[data-tool]");
    if (tool) {
      const settings = loadSettings();
      if (tool.dataset.tool === "dark") updateSetting("dark", !settings.dark);
      if (tool.dataset.tool === "dys") updateSetting("dys", !settings.dys);
      if (tool.dataset.tool === "teacher") updateSetting("teacher", !settings.teacher);
      if (tool.dataset.tool === "font-plus") updateSetting("fontScale", Math.min(1.3, (settings.fontScale || 1) + .05));
      if (tool.dataset.tool === "font-minus") updateSetting("fontScale", Math.max(.85, (settings.fontScale || 1) - .05));
      if (tool.dataset.tool === "print") {
        syncPrintResponses();
        window.print();
      }
    }

    const reveal = event.target.closest("[data-reveal]");
    if (reveal) {
      const target = document.getElementById(reveal.dataset.reveal);
      if (target) {
        const isHidden = target.hidden;
        target.hidden = !isHidden;
        reveal.setAttribute("aria-expanded", String(isHidden));
        reveal.textContent = isHidden ? "Masquer la synthèse de référence" : "Comparer avec une synthèse de référence";
      }
    }

    const clearButton = event.target.closest("[data-clear-target]");
    if (clearButton) {
      const target = document.getElementById(clearButton.dataset.clearTarget);
      if (target && confirm("Effacer cette réponse enregistrée localement ?")) {
        target.value = "";
        localStorage.removeItem(storagePrefix + target.dataset.save);
        target.focus();
      }
    }

    const reset = event.target.closest("[data-reset-course]");
    if (reset) {
      const code = document.body.dataset.courseCode;
      if (code && confirm("Effacer toutes les réponses et la progression de ce cours ?")) {
        qsa("[data-save]").forEach(element => {
          localStorage.removeItem(storagePrefix + element.dataset.save);
          if (element.type === "checkbox") element.checked = false;
          else element.value = "";
        });
        updateCourseProgress();
      }
    }
  });

  function initPortalFilters() {
    const search = qs("#course-search");
    const theme = qs("#theme-filter");
    if (!search || !theme) return;
    const apply = () => {
      const text = search.value.trim().toLowerCase();
      const selectedTheme = theme.value;
      qsa("[data-course-card]").forEach(card => {
        const matchesText = !text || card.textContent.toLowerCase().includes(text);
        const matchesTheme = !selectedTheme || card.dataset.theme === selectedTheme;
        card.hidden = !(matchesText && matchesTheme);
      });
    };
    search.addEventListener("input", apply);
    theme.addEventListener("change", apply);
  }

  const params = new URLSearchParams(location.search);
  if (params.get("teacher") === "1") {
    const settings = loadSettings();
    settings.teacher = true;
    saveSettings(settings);
  }

  applySettings();
  restoreSavedFields();
  updateCourseProgress();
  updatePortalProgress();
  initCalculators();
  initPortalFilters();
  window.addEventListener("beforeprint", syncPrintResponses);
})();
