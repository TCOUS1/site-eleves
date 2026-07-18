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

  localStorage.clear();

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