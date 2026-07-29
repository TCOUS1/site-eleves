(() => {
  "use strict";

  const byId = id => document.getElementById(id);

  // ---------------------------------------------------------------
  // 1. Classement Internet / Web / autre service
  // ---------------------------------------------------------------
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-web-sort]");
    if (!button) return;

    const item = button.closest(".web-sort-item");
    const expected = item?.dataset.expected;
    const selected = button.dataset.webSort;
    const feedback = item?.querySelector(".web-feedback");
    const good = selected === expected;

    item.querySelectorAll("[data-web-sort]").forEach(candidate => {
      candidate.classList.remove("good", "bad");
    });

    button.classList.add(good ? "good" : "bad");

    if (feedback) {
      feedback.textContent = good
        ? "Classement correct."
        : `À revoir : la réponse attendue est « ${expected} ».`;
    }
  });

  // ---------------------------------------------------------------
  // 2. Décomposition d'URL
  // ---------------------------------------------------------------
  function analyzeUrl() {
    const input = byId("url-input");
    const feedback = byId("url-feedback");
    if (!input || !feedback) return;

    try {
      const url = new URL(input.value.trim());
      const values = {
        scheme: url.protocol.replace(":", ""),
        host: url.hostname,
        port: url.port || "(port par défaut)",
        path: url.pathname || "/",
        query: url.search || "(aucun paramètre)",
        fragment: url.hash || "(aucun fragment)",
      };

      Object.entries(values).forEach(([key, value]) => {
        const element = byId(`url-${key}`);
        if (element) element.textContent = value;
      });

      const secure = url.protocol === "https:";
      feedback.textContent = secure
        ? "La connexion demandée est chiffrée avec HTTPS. Cela ne prouve pas, à lui seul, que le site est honnête."
        : "Cette URL utilise HTTP : les échanges ne sont pas chiffrés par HTTPS.";
      feedback.className = `web-feedback ${secure ? "good" : "bad"}`;
    } catch (_) {
      feedback.textContent =
        "URL non reconnue. Vérifie notamment le protocole et le nom d’hôte.";
      feedback.className = "web-feedback bad";
    }
  }

  byId("url-analyze")?.addEventListener("click", analyzeUrl);
  analyzeUrl();

  // ---------------------------------------------------------------
  // 3. Éditeur HTML/CSS autonome
  // ---------------------------------------------------------------
  const defaultHtml = `<header>
  <h1>Mon premier site responsable</h1>
  <p>Une page créée en SNT.</p>
</header>

<main>
  <h2>Mon sujet</h2>
  <p>Je présente ici une information vérifiée.</p>
  <a href="https://example.org">Consulter ma source</a>
</main>`;

  const defaultCss = `body {
  max-width: 720px;
  margin: auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  background: #f4f7fb;
  color: #172033;
}

header {
  padding: 24px;
  border-radius: 18px;
  color: white;
  background: linear-gradient(135deg, #3157d5, #006b78);
}

a {
  color: #3157d5;
  font-weight: bold;
}

@media (max-width: 520px) {
  body {
    padding: 12px;
  }
}`;

  function updatePreview() {
    const htmlEditor = byId("html-editor");
    const cssEditor = byId("css-editor");
    const frame = byId("web-preview");
    if (!htmlEditor || !cssEditor || !frame) return;

    frame.srcdoc = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${cssEditor.value}</style>
</head>
<body>${htmlEditor.value}</body>
</html>`;
  }

  if (byId("html-editor") && byId("css-editor")) {
    if (!byId("html-editor").value.trim()) byId("html-editor").value = defaultHtml;
    if (!byId("css-editor").value.trim()) byId("css-editor").value = defaultCss;
    updatePreview();
  }

  byId("preview-update")?.addEventListener("click", updatePreview);

  byId("preview-reset")?.addEventListener("click", () => {
    byId("html-editor").value = defaultHtml;
    byId("css-editor").value = defaultCss;
    updatePreview();
  });

  // ---------------------------------------------------------------
  // 4. Simulateur HTTP
  // ---------------------------------------------------------------
  function simulateHttp() {
    const method = byId("http-method")?.value || "GET";
    const path = (byId("http-path")?.value || "/").trim();
    const paramName = (byId("http-param-name")?.value || "").trim();
    const paramValue = (byId("http-param-value")?.value || "").trim();
    const output = byId("http-output");
    if (!output) return;

    const query =
      paramName && paramValue
        ? `?${encodeURIComponent(paramName)}=${encodeURIComponent(paramValue)}`
        : "";

    let status = "200 OK";
    let body = `Ressource trouvée pour ${path || "/"}.`;

    if (path === "/introuvable") {
      status = "404 Not Found";
      body = "La ressource demandée n’existe pas.";
    } else if (path === "/prive") {
      status = "403 Forbidden";
      body = "Le serveur refuse l’accès à cette ressource.";
    } else if (path === "/erreur") {
      status = "500 Internal Server Error";
      body = "Le serveur a rencontré une erreur.";
    } else if (method === "POST") {
      status = "201 Created";
      body = "Le serveur a accepté les données et créé une ressource.";
    }

    output.textContent =
`${method} ${path || "/"}${query} HTTP/1.1
Host: cours.example.org
Accept: text/html
User-Agent: Navigateur-SNT

HTTP/1.1 ${status}
Content-Type: text/plain; charset=utf-8
Cache-Control: no-store

${body}`;
  }

  byId("http-send")?.addEventListener("click", simulateHttp);
  simulateHttp();

  // ---------------------------------------------------------------
  // 5. Mini moteur de recherche
  // ---------------------------------------------------------------
  const pages = [
    {
      title: "CERN — Naissance du Web",
      url: "home.cern",
      text: "web histoire tim berners lee cern invention partage scientifique",
      backlinks: 9,
      authority: 10,
      sponsored: false,
    },
    {
      title: "Blog personnel — Mon avis sur le Web",
      url: "blog.example",
      text: "web histoire avis classement navigateur",
      backlinks: 2,
      authority: 3,
      sponsored: false,
    },
    {
      title: "Cours SNT — HTML, CSS et hypertexte",
      url: "lycee.example",
      text: "web html css hypertexte url client serveur cours snt",
      backlinks: 5,
      authority: 7,
      sponsored: false,
    },
    {
      title: "Formation express HTML",
      url: "formation.example",
      text: "html css web apprendre formation",
      backlinks: 1,
      authority: 4,
      sponsored: true,
    },
  ];

  function searchPages() {
    const query = (byId("search-query")?.value || "")
      .toLowerCase()
      .trim();
    const popularityWeight = Number(
      byId("search-popularity")?.value || 1
    );
    const output = byId("search-results");
    if (!output) return;

    const words = query.split(/\s+/).filter(Boolean);

    const ranked = pages
      .map(page => {
        const relevance = words.reduce(
          (total, word) =>
            total + (page.text.includes(word) ? 4 : 0),
          0
        );
        const score =
          relevance +
          page.backlinks * popularityWeight +
          page.authority +
          (page.sponsored ? 1 : 0);
        return { ...page, relevance, score };
      })
      .sort((a, b) => b.score - a.score);

    output.innerHTML = "";

    ranked.forEach(page => {
      const item = document.createElement("li");
      item.className = `web-result${page.sponsored ? " sponsored" : ""}`;
      item.innerHTML = `
        <span class="web-score">score ${page.score}</span>
        <strong>${page.sponsored ? "Annonce — " : ""}${page.title}</strong>
        <div>${page.url}</div>
        <small>
          pertinence : ${page.relevance} · popularité : ${page.backlinks}
          · autorité simulée : ${page.authority}
        </small>`;
      output.appendChild(item);
    });
  }

  byId("search-run")?.addEventListener("click", searchPages);
  byId("search-popularity")?.addEventListener("input", searchPages);
  searchPages();

  // ---------------------------------------------------------------
  // 6. Simulateur de cookies et traces
  // ---------------------------------------------------------------
  function updateCookieTrace() {
    const output = byId("cookie-output");
    if (!output) return;

    const categories = [
      ["cookie-essential", "Nécessaire", "session, panier, authentification"],
      ["cookie-preference", "Préférences", "langue, thème, affichage"],
      ["cookie-analytics", "Mesure d’audience", "pages vues, durée, parcours"],
      ["cookie-ads", "Publicité", "profil, centres d’intérêt, reciblage"],
    ];

    const lines = [];
    let traces = 0;

    categories.forEach(([id, label, data]) => {
      const enabled = byId(id)?.checked;
      if (enabled) {
        traces += id === "cookie-essential" ? 1 : 3;
        lines.push(`✓ ${label} : ${data}`);
      } else {
        lines.push(`✗ ${label} : désactivé`);
      }
    });

    lines.push("");
    lines.push(`Indice pédagogique de traces : ${traces}/10`);
    lines.push(
      traces <= 3
        ? "Peu de catégories sont actives."
        : "Plusieurs catégories peuvent contribuer au suivi de la navigation."
    );

    output.textContent = lines.join("\n");
  }

  [
    "cookie-essential",
    "cookie-preference",
    "cookie-analytics",
    "cookie-ads",
  ].forEach(id => byId(id)?.addEventListener("change", updateCookieTrace));

  updateCookieTrace();

  // ---------------------------------------------------------------
  // 7. Diagnostic d'URL d'hameçonnage
  // ---------------------------------------------------------------
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-phishing-answer]");
    if (!button) return;

    const item = button.closest(".web-phishing-item");
    const expected = item?.dataset.expected;
    const selected = button.dataset.phishingAnswer;
    const feedback = item?.querySelector(".web-feedback");
    const good = selected === expected;

    item.querySelectorAll("[data-phishing-answer]").forEach(candidate => {
      candidate.classList.remove("good", "bad");
    });
    button.classList.add(good ? "good" : "bad");

    if (feedback) {
      feedback.textContent = good
        ? item.dataset.explanation
        : "À revoir : observe surtout le véritable nom de domaine.";
    }
  });

  // ---------------------------------------------------------------
  // 8. Texte à trous final
  // ---------------------------------------------------------------
  byId("fill-check")?.addEventListener("click", () => {
    const expected = {
      "fill-1": "html",
      "fill-2": "css",
      "fill-3": "http",
      "fill-4": "serveur",
      "fill-5": "cookie",
    };

    let correct = 0;
    Object.entries(expected).forEach(([id, answer]) => {
      const input = byId(id);
      if (!input) return;
      const good =
        input.value.trim().toLowerCase().replace(/[()]/g, "") === answer;
      input.style.outline = good
        ? "3px solid #16824a"
        : "3px solid #b9313b";
      if (good) correct += 1;
    });

    const feedback = byId("fill-feedback");
    if (feedback) {
      feedback.textContent = `${correct} réponse(s) correcte(s) sur 5.`;
    }
  });
})();
