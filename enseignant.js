function verifier(passwordCorrect, redirectPage) {
    const mdp = document.getElementById("mdp").value;

    if (mdp === passwordCorrect) {
        sessionStorage.setItem("auth", "ok");
        window.location.href = redirectPage;
    } else {
        alert("Mot de passe incorrect");
    }
}


function logout() {
    sessionStorage.removeItem("auth");
    window.location.href = "index.html";
}
