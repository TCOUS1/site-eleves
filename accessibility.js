let fontSize = 1.05;

function toggleTheme() {
  document.body.classList.toggle("light");
}

function toggleDys() {
  document.body.classList.toggle("dys");
}

function fontPlus() {
  fontSize += 0.1;
  document.body.style.fontSize = fontSize + "em";
}

function fontMinus() {
  fontSize -= 0.1;
  document.body.style.fontSize = fontSize + "em";
}


function resetAccessibility() {
  document.body.classList.remove("light", "dys", "lines");
  document.body.style.fontSize = "";
  fontSize = 1.05; // valeur par défaut
}
