"use strict";

/*
 * Ancien controle par mot de passe neutralise.
 * Un site statique public ne protege pas des contenus reserves.
 */

function verifier() {
  window.alert(
    "Les ressources reservees ont ete deplacees vers un service authentifie."
  );
}

function logout() {
  sessionStorage.removeItem("auth");
  window.location.href = "index.html";
}
