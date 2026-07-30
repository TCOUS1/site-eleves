(() => {
  "use strict";

  const STORAGE = {
    theme: "theme",
    dys: "dysMode",
    font: "fontSize"
  };

  let fontSize = 1.05;

  function getButton(id) {
    return document.getElementById(id);
  }

  function announce(message) {
    const status = document.getElementById("accessibility-status");
    if (status) status.textContent = message;
  }

  function updateButtons() {
    const themeButton = getButton("btn-theme");
    const dysButton = getButton("btn-dys");
    const lightEnabled = document.body.classList.contains("light");
    const dysEnabled = document.body.classList.contains("dys");

    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(lightEnabled));
      themeButton.classList.toggle("active", lightEnabled);
      themeButton.title = lightEnabled
        ? "Activer le mode sombre"
        : "Activer le mode clair";
    }

    if (dysButton) {
      dysButton.setAttribute("aria-pressed", String(dysEnabled));
      dysButton.classList.toggle("active", dysEnabled);
    }
  }

  window.toggleTheme = function toggleTheme() {
    document.body.classList.toggle("light");
    const lightEnabled = document.body.classList.contains("light");
    localStorage.setItem(STORAGE.theme, lightEnabled ? "light" : "dark");
    updateButtons();
    announce(lightEnabled ? "Mode clair activé" : "Mode sombre activé");
  };

  window.toggleDys = function toggleDys() {
    document.body.classList.toggle("dys");
    const enabled = document.body.classList.contains("dys");
    localStorage.setItem(STORAGE.dys, enabled ? "on" : "off");
    updateButtons();
    announce(enabled ? "Mode dyslexie activé" : "Mode dyslexie désactivé");
  };

  window.fontPlus = function fontPlus() {
    fontSize = Math.min(1.8, Number((fontSize + 0.1).toFixed(2)));
    document.body.style.fontSize = `${fontSize}em`;
    localStorage.setItem(STORAGE.font, String(fontSize));
    announce(`Taille du texte augmentée à ${Math.round(fontSize * 100)} %`);
  };

  window.fontMinus = function fontMinus() {
    fontSize = Math.max(0.8, Number((fontSize - 0.1).toFixed(2)));
    document.body.style.fontSize = `${fontSize}em`;
    localStorage.setItem(STORAGE.font, String(fontSize));
    announce(`Taille du texte réduite à ${Math.round(fontSize * 100)} %`);
  };

  window.resetAccessibility = function resetAccessibility() {
    document.body.classList.remove("light", "dys");
    document.body.style.fontSize = "";
    localStorage.removeItem(STORAGE.theme);
    localStorage.removeItem(STORAGE.dys);
    localStorage.removeItem(STORAGE.font);
    fontSize = 1.05;
    updateButtons();
    announce("Réglages d’accessibilité réinitialisés");
  };

  window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem(STORAGE.theme) === "light") {
      document.body.classList.add("light");
    }

    if (localStorage.getItem(STORAGE.dys) === "on") {
      document.body.classList.add("dys");
    }

    const storedFont = Number.parseFloat(localStorage.getItem(STORAGE.font));
    if (Number.isFinite(storedFont)) {
      fontSize = Math.min(1.8, Math.max(0.8, storedFont));
      document.body.style.fontSize = `${fontSize}em`;
    }

    updateButtons();
  });
})();
