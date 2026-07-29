(() => {
  "use strict";

  const byId = id => document.getElementById(id);

  // ---------------------------------------------------------------
  // Classements génériques
  // ---------------------------------------------------------------
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-social-choice]");
    if (!button) return;

    const item = button.closest("[data-expected]");
    if (!item) return;

    const selected = button.dataset.socialChoice;
    const expected = item.dataset.expected;
    const good = selected === expected;
    const feedback = item.querySelector(".social-feedback");

    item.querySelectorAll("[data-social-choice]").forEach(candidate => {
      candidate.classList.remove("good", "bad");
    });
    button.classList.add(good ? "good" : "bad");

    if (feedback) {
      feedback.textContent = good
        ? "Réponse cohérente."
        : `À revoir : la catégorie attendue est « ${expected} ».`;
    }
  });

  // ---------------------------------------------------------------
  // Identité numérique : traces déclarées, comportementales, tierces
  // ---------------------------------------------------------------
  const footprintItems = [
    ["Photo de profil choisie par l’utilisateur", "déclarée"],
    ["Durée de visionnage d’une vidéo", "comportementale"],
    ["Photo publiée par un ami et identifiant la personne", "tierce"],
    ["Biographie renseignée dans le profil", "déclarée"],
    ["Historique des likes", "comportementale"],
    ["Commentaire écrit par un autre utilisateur à propos de la personne", "tierce"],
  ];

  const footprintList = byId("footprint-list");
  if (footprintList) {
    footprintItems.forEach(([label, expected], index) => {
      const item = document.createElement("li");
      item.className = "social-classifier-item";
      item.dataset.expected = expected;
      item.innerHTML = `
        <strong>${label}</strong>
        <div class="social-actions">
          <button type="button" class="social-choice"
                  data-social-choice="déclarée">Déclarée</button>
          <button type="button" class="social-choice"
                  data-social-choice="comportementale">Comportementale</button>
          <button type="button" class="social-choice"
                  data-social-choice="tierce">Produite par un tiers</button>
        </div>
        <p class="social-feedback"></p>`;
      footprintList.appendChild(item);
    });
  }

  // ---------------------------------------------------------------
  // Simulateur de confidentialité
  // ---------------------------------------------------------------
  function updatePrivacy() {
    const audience = byId("privacy-audience")?.value || "public";
    const location = byId("privacy-location")?.checked || false;
    const contact = byId("privacy-contact")?.checked || false;
    const thirdParty = byId("privacy-third-party")?.checked || false;
    const twoFactor = byId("privacy-2fa")?.checked || false;
    const output = byId("privacy-output");
    if (!output) return;

    let risk = 0;
    const lines = [];

    if (audience === "public") {
      risk += 4;
      lines.push("• Publications visibles par tous.");
    } else if (audience === "amis") {
      risk += 2;
      lines.push("• Publications limitées aux relations acceptées.");
    } else {
      risk += 1;
      lines.push("• Publications limitées à un groupe sélectionné.");
    }

    if (location) {
      risk += 2;
      lines.push("• Géolocalisation attachée aux publications.");
    } else {
      lines.push("• Géolocalisation désactivée.");
    }

    if (contact) {
      risk += 1;
      lines.push("• Recherche du compte par téléphone ou courriel autorisée.");
    } else {
      lines.push("• Recherche par coordonnées limitée.");
    }

    if (thirdParty) {
      risk += 2;
      lines.push("• Une application tierce peut accéder à certaines données.");
    } else {
      lines.push("• Aucun accès tiers simulé.");
    }

    if (twoFactor) {
      risk -= 1;
      lines.push("• Double authentification activée.");
    } else {
      lines.push("• Double authentification non activée.");
    }

    risk = Math.max(0, Math.min(10, risk));
    lines.push("");
    lines.push(`Indice pédagogique d’exposition : ${risk}/10`);
    lines.push(
      risk <= 3
        ? "Configuration plutôt protectrice, à adapter à l’objectif du compte."
        : risk <= 6
          ? "Plusieurs réglages méritent d’être vérifiés."
          : "Exposition élevée : limiter l’audience et les données partagées."
    );

    output.textContent = lines.join("\n");
  }

  [
    "privacy-audience",
    "privacy-location",
    "privacy-contact",
    "privacy-third-party",
    "privacy-2fa",
  ].forEach(id => {
    byId(id)?.addEventListener("change", updatePrivacy);
  });
  updatePrivacy();

  // ---------------------------------------------------------------
  // Graphe social
  // ---------------------------------------------------------------
  const graphNodes = {
    A: [75, 85],
    B: [185, 55],
    C: [185, 145],
    D: [305, 70],
    E: [305, 160],
    F: [420, 65],
    G: [420, 160],
    H: [535, 115],
  };

  const baseEdges = [
    ["A","B"], ["A","C"], ["B","C"], ["B","D"], ["C","E"],
    ["D","E"], ["D","F"], ["E","G"], ["F","G"], ["G","H"],
  ];

  let bridgeEnabled = false;
  let selectedNode = "E";

  function graphEdges() {
    return bridgeEnabled ? [...baseEdges, ["A","H"]] : [...baseEdges];
  }

  function adjacency() {
    const adj = {};
    Object.keys(graphNodes).forEach(node => { adj[node] = []; });
    graphEdges().forEach(([a,b]) => {
      adj[a].push(b);
      adj[b].push(a);
    });
    return adj;
  }

  function distancesFrom(start) {
    const adj = adjacency();
    const distances = { [start]: 0 };
    const queue = [start];

    while (queue.length) {
      const current = queue.shift();
      adj[current].forEach(next => {
        if (!(next in distances)) {
          distances[next] = distances[current] + 1;
          queue.push(next);
        }
      });
    }
    return distances;
  }

  function graphMetrics() {
    const nodes = Object.keys(graphNodes);
    const eccentricities = {};
    nodes.forEach(node => {
      eccentricities[node] = Math.max(
        ...Object.values(distancesFrom(node))
      );
    });

    const radius = Math.min(...Object.values(eccentricities));
    const diameter = Math.max(...Object.values(eccentricities));
    const centers = nodes.filter(node => eccentricities[node] === radius);

    return { eccentricities, radius, diameter, centers };
  }

  function renderGraph() {
    const svg = byId("social-graph");
    if (!svg) return;

    svg.innerHTML = "";

    graphEdges().forEach(([a,b]) => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", graphNodes[a][0]);
      line.setAttribute("y1", graphNodes[a][1]);
      line.setAttribute("x2", graphNodes[b][0]);
      line.setAttribute("y2", graphNodes[b][1]);
      line.setAttribute(
        "class",
        a === "A" && b === "H" ? "social-edge bridge" : "social-edge"
      );
      svg.appendChild(line);
    });

    Object.entries(graphNodes).forEach(([name,[x,y]]) => {
      const group = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      group.setAttribute(
        "class",
        `social-node${name === selectedNode ? " selected" : ""}`
      );
      group.setAttribute("data-node", name);
      group.setAttribute("tabindex", "0");
      group.setAttribute("role", "button");
      group.setAttribute("aria-label", `Sélectionner le sommet ${name}`);

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 24);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", x);
      text.setAttribute("y", y + 1);
      text.textContent = name;

      group.append(circle, text);
      svg.appendChild(group);
    });

    updateGraphInfo();
  }

  function updateGraphInfo() {
    const adj = adjacency();
    const metrics = graphMetrics();
    const distances = distancesFrom(selectedNode);

    const selected = byId("graph-selected");
    const degree = byId("graph-degree");
    const eccentricity = byId("graph-eccentricity");
    const radius = byId("graph-radius");
    const diameter = byId("graph-diameter");
    const center = byId("graph-center");
    const distancesOutput = byId("graph-distances");

    if (selected) selected.textContent = selectedNode;
    if (degree) degree.textContent = adj[selectedNode].length;
    if (eccentricity) {
      eccentricity.textContent = metrics.eccentricities[selectedNode];
    }
    if (radius) radius.textContent = metrics.radius;
    if (diameter) diameter.textContent = metrics.diameter;
    if (center) center.textContent = metrics.centers.join(", ");
    if (distancesOutput) {
      distancesOutput.textContent = Object.entries(distances)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([node,distance]) => `${selectedNode} → ${node} : ${distance}`)
        .join("\n");
    }
  }

  byId("social-graph")?.addEventListener("click", event => {
    const node = event.target.closest("[data-node]");
    if (!node) return;
    selectedNode = node.dataset.node;
    renderGraph();
  });

  byId("social-graph")?.addEventListener("keydown", event => {
    const node = event.target.closest("[data-node]");
    if (!node || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    selectedNode = node.dataset.node;
    renderGraph();
  });

  byId("graph-bridge")?.addEventListener("click", () => {
    bridgeEnabled = !bridgeEnabled;
    const button = byId("graph-bridge");
    if (button) {
      button.textContent = bridgeEnabled
        ? "Retirer le lien A–H"
        : "Ajouter un lien A–H";
    }
    renderGraph();
  });

  renderGraph();

  // ---------------------------------------------------------------
  // Fil de recommandation simplifié
  // ---------------------------------------------------------------
  const posts = [
    {
      title: "Vidéo de robotique",
      theme: "sciences",
      followed: 1,
      liked: 1,
      watch: 8,
      novelty: 3,
    },
    {
      title: "Défi sportif",
      theme: "sport",
      followed: 0,
      liked: 0,
      watch: 9,
      novelty: 5,
    },
    {
      title: "Actualité environnementale",
      theme: "actualité",
      followed: 1,
      liked: 0,
      watch: 5,
      novelty: 4,
    },
    {
      title: "Humour très similaire aux vidéos déjà vues",
      theme: "humour",
      followed: 0,
      liked: 1,
      watch: 10,
      novelty: 1,
    },
    {
      title: "Point de vue contradictoire",
      theme: "débat",
      followed: 0,
      liked: 0,
      watch: 3,
      novelty: 10,
    },
  ];

  function renderFeed() {
    const followWeight = Number(byId("feed-follow")?.value || 4);
    const likeWeight = Number(byId("feed-like")?.value || 5);
    const watchWeight = Number(byId("feed-watch")?.value || 1);
    const diversityWeight = Number(byId("feed-diversity")?.value || 0);
    const output = byId("feed-list");
    if (!output) return;

    const ranked = posts
      .map(post => ({
        ...post,
        score:
          post.followed * followWeight +
          post.liked * likeWeight +
          post.watch * watchWeight +
          post.novelty * diversityWeight,
      }))
      .sort((a,b) => b.score - a.score);

    output.innerHTML = "";
    ranked.forEach((post,index) => {
      const item = document.createElement("li");
      item.className = "social-post";
      item.innerHTML = `
        <span class="score">${post.score}</span>
        <strong>${index + 1}. ${post.title}</strong>
        <div>Thème : ${post.theme}</div>
        <small>
          suivi : ${post.followed} · like antérieur : ${post.liked}
          · visionnage : ${post.watch} · diversité : ${post.novelty}
        </small>`;
      output.appendChild(item);
    });
  }

  ["feed-follow","feed-like","feed-watch","feed-diversity"].forEach(id => {
    byId(id)?.addEventListener("input", renderFeed);
  });
  renderFeed();

  // ---------------------------------------------------------------
  // Modèle économique simplifié
  // ---------------------------------------------------------------
  function updateRevenue() {
    const users = Number(byId("revenue-users")?.value || 100000);
    const minutes = Number(byId("revenue-minutes")?.value || 25);
    const adRate = Number(byId("revenue-ad-rate")?.value || 0.004);
    const premiumRate = Number(byId("revenue-premium-rate")?.value || 2);
    const premiumPrice = Number(byId("revenue-premium-price")?.value || 6);
    const output = byId("revenue-output");
    if (!output) return;

    const adImpressions = users * Math.max(1, Math.round(minutes / 5));
    const adRevenue = adImpressions * adRate;
    const premiumUsers = users * premiumRate / 100;
    const subscriptionRevenue = premiumUsers * premiumPrice;
    const total = adRevenue + subscriptionRevenue;

    byId("kpi-impressions").textContent =
      Math.round(adImpressions).toLocaleString("fr-FR");
    byId("kpi-premium").textContent =
      Math.round(premiumUsers).toLocaleString("fr-FR");
    byId("kpi-total").textContent =
      `${Math.round(total).toLocaleString("fr-FR")} €`;

    output.textContent =
`Simulation pédagogique mensuelle

Utilisateurs : ${users.toLocaleString("fr-FR")}
Temps moyen : ${minutes} min/jour
Impressions publicitaires estimées : ${Math.round(adImpressions).toLocaleString("fr-FR")}
Recettes publicitaires simulées : ${Math.round(adRevenue).toLocaleString("fr-FR")} €
Abonnés premium simulés : ${Math.round(premiumUsers).toLocaleString("fr-FR")}
Recettes d’abonnement simulées : ${Math.round(subscriptionRevenue).toLocaleString("fr-FR")} €
Total simulé : ${Math.round(total).toLocaleString("fr-FR")} €

Attention : ce modèle est volontairement simplifié.
Les plateformes réelles combinent plusieurs marchés,
coûts, contrats et indicateurs.`;
  }

  [
    "revenue-users",
    "revenue-minutes",
    "revenue-ad-rate",
    "revenue-premium-rate",
    "revenue-premium-price",
  ].forEach(id => {
    byId(id)?.addEventListener("input", updateRevenue);
  });
  updateRevenue();

  // ---------------------------------------------------------------
  // Triage cyberviolence
  // ---------------------------------------------------------------
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-safety-choice]");
    if (!button) return;

    const item = button.closest("[data-expected-safety]");
    if (!item) return;

    const selected = button.dataset.safetyChoice;
    const expected = item.dataset.expectedSafety;
    const good = selected === expected;
    const feedback = item.querySelector(".social-feedback");

    item.querySelectorAll("[data-safety-choice]").forEach(candidate => {
      candidate.classList.remove("good", "bad");
    });
    button.classList.add(good ? "good" : "bad");

    if (feedback) {
      feedback.textContent = good
        ? item.dataset.explanation
        : "À revoir : distingue urgence, accompagnement scolaire, signalement de plateforme et contenu public illicite.";
    }
  });

  // ---------------------------------------------------------------
  // Vérification d'information avant partage
  // ---------------------------------------------------------------
  function updateShareDecision() {
    const author = byId("claim-author")?.checked || false;
    const date = byId("claim-date")?.checked || false;
    const evidence = byId("claim-evidence")?.checked || false;
    const corroboration = byId("claim-corroboration")?.checked || false;
    const emotional = byId("claim-emotional")?.checked || false;
    const output = byId("claim-output");
    if (!output) return;

    let score = [author,date,evidence,corroboration].filter(Boolean).length;
    if (emotional) score -= 1;

    const lines = [
      `Auteur identifiable : ${author ? "oui" : "non"}`,
      `Date et contexte : ${date ? "oui" : "non"}`,
      `Preuves accessibles : ${evidence ? "oui" : "non"}`,
      `Recoupement : ${corroboration ? "oui" : "non"}`,
      `Formulation émotionnelle pressante : ${emotional ? "oui" : "non"}`,
      "",
    ];

    if (score >= 3) {
      lines.push("Plusieurs critères sont satisfaits, mais le contenu doit encore être lu et contextualisé avant partage.");
    } else if (score >= 1) {
      lines.push("Vérification insuffisante : rechercher la source originale et recouper.");
    } else {
      lines.push("Ne pas partager en l’état.");
    }

    output.textContent = lines.join("\n");
  }

  [
    "claim-author","claim-date","claim-evidence",
    "claim-corroboration","claim-emotional"
  ].forEach(id => byId(id)?.addEventListener("change", updateShareDecision));
  updateShareDecision();

  // ---------------------------------------------------------------
  // Texte à compléter
  // ---------------------------------------------------------------
  byId("social-fill-check")?.addEventListener("click", () => {
    const expected = {
      "social-fill-1": "graphe",
      "social-fill-2": "sommet",
      "social-fill-3": "arête",
      "social-fill-4": "authentification",
      "social-fill-5": "recommandation",
    };

    let correct = 0;
    Object.entries(expected).forEach(([id,answer]) => {
      const input = byId(id);
      if (!input) return;
      const value = input.value.trim().toLowerCase();
      const good = value === answer;
      input.style.outline = good
        ? "3px solid #16824a"
        : "3px solid #b9313b";
      if (good) correct += 1;
    });

    const feedback = byId("social-fill-feedback");
    if (feedback) {
      feedback.textContent = `${correct} réponse(s) correcte(s) sur 5.`;
    }
  });
})();
