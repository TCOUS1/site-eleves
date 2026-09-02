/* v3.3 — Mode d’emploi contextuel + impression ciblée (héritage v3.0.3) */
(function () {
  'use strict';

  var lastHelpTrigger = null;
  function normPath() { return (location.pathname || '').replace(/\\/g, '/').toLowerCase(); }
  function ends(s) { return normPath().endsWith(s.toLowerCase()); }
  function isMission() { return /\/missions\/m\d+\.html$/.test(normPath()); }
  function isMissionIndex() { return ends('/missions/index.html'); }
  function isKnowledge() { return ends('/connaissances/index.html'); }
  function isResource() { return /\/ressources\/(?:bc[1-4]|transversal)\/[^/]+\.html$/.test(normPath()); }
  function isStarter() { return /\/demarrer\/(methode-recherche|controler-raisonnement|situation-complexe)\.html$/.test(normPath()); }
  function isOdoo() { return ends('/entrainement/odoo.html'); }
  function isTrainingIndex() { return ends('/entrainement/index.html'); }
  function isReferential() { return ends('/referentiel/index.html') || ends('/referentiel/savoirs.html'); }
  function isHome() {
    var p = normPath();
    return p.endsWith('/index.html') && !isMissionIndex() && !isKnowledge() && !isTrainingIndex() && !isReferential();
  }
  function isPrintablePage() { return isStarter() || isOdoo(); }

  function makeButton(label, extraClass) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'page-action-button' + (extraClass ? ' ' + extraClass : '');
    b.textContent = label;
    return b;
  }

  function helpData() {
    if (isMission()) return {
      title: 'Mode d’emploi de la mission',
      html: '<ol><li><strong>Commencez par la situation et les pièces.</strong> Reformulez ce qui est demandé avant de chercher une méthode.</li><li><strong>Choisissez le niveau d’aide adapté.</strong> Guidé donne davantage de repères ; Semi-guidé en retire une partie ; Autonome conserve la situation, le dossier et la production attendue.</li><li><strong>Utilisez les ressources comme documentation.</strong> Elles ne remplacent pas votre analyse du dossier.</li><li><strong>Produisez à partir de preuves.</strong> Si un outil vierge ou Odoo est proposé, utilisez-le seulement dans le périmètre autorisé.</li><li><strong>Avant de remettre :</strong> contrôlez les données, les limites de votre conclusion et ce qui doit être validé par un responsable.</li></ol>'
    };
    if (isResource()) return {
      title: 'Mode d’emploi de la fiche ressource',
      html: '<ol><li><strong>Vérifiez que cette fiche répond bien à votre besoin.</strong> Un bon résultat de recherche reste une piste à confirmer.</li><li><strong>Commencez par la vue Essentiel.</strong> Passez à Complet si vous avez besoin d’exemples, de précisions ou d’aide supplémentaire.</li><li><strong>Appliquez la méthode à vos propres pièces.</strong> Ne recopiez pas une formulation sans la relier aux faits du dossier.</li><li><strong>Ouvrez les blocs à la demande.</strong> Ils restent fermés pour limiter la charge de lecture.</li><li><strong>Pour conserver la fiche :</strong> utilisez « Imprimer / enregistrer en PDF » ; la vue et les blocs actuellement ouverts déterminent ce que vous emportez.</li></ol>'
    };
    if (isKnowledge()) return {
      title: 'Mode d’emploi de Connaissances',
      html: '<ol><li><strong>Cherchez un terme ou parcourez l’alphabet.</strong></li><li><strong>Lisez d’abord la définition.</strong> Elle sert à comprendre ou réviser, pas à remplacer une méthode complète.</li><li><strong>Suivez les liens</strong> vers les ressources et missions pour voir comment la notion se mobilise dans une situation professionnelle.</li><li><strong>Pour garder une notion :</strong> cliquez sur « Imprimer / PDF » dans sa carte ; seule cette connaissance sera préparée pour l’impression.</li></ol><p><strong>Repère :</strong> cet espace est une médiation pédagogique. Les codes signalés renvoient au référentiel, mais la liste des cartes n’est pas une liste officielle autonome.</p>'
    };
    if (isOdoo()) return {
      title: 'Mode d’emploi du parcours Odoo',
      html: '<ol><li><strong>Partez du besoin professionnel</strong> avant de choisir l’application Odoo.</li><li><strong>Repérez le périmètre :</strong> base, application, vue, filtres, date et droits disponibles.</li><li><strong>Agissez seulement dans le cadre autorisé.</strong> Une commande, une facture, un paiement ou un réglage ne doit pas être validé sans consigne explicite.</li><li><strong>Conservez une preuve exploitable :</strong> référence Odoo, état du document, filtre, capture utile ou export daté selon la consigne.</li><li><strong>Les menus peuvent varier</strong> selon la version, les modules et les droits : cherchez la fonction métier plutôt qu’un emplacement appris par cœur.</li></ol>'
    };
    if (isStarter()) return {
      title: 'Mode d’emploi de la méthode transversale',
      html: '<ol><li>Utilisez cette méthode lorsque vous ne savez pas encore quelle ressource choisir, lorsque la situation combine plusieurs problèmes ou lorsque vous voulez contrôler votre raisonnement.</li><li>Appliquez-la à la situation réelle : pièces disponibles, faits, informations manquantes, traitement et preuve.</li><li>Revenez ensuite à la mission ou à la ressource métier pertinente.</li><li>Vous pouvez imprimer ou enregistrer cette méthode en PDF pour l’utiliser comme repère de travail.</li></ol>'
    };
    if (isMissionIndex()) return {
      title: 'Mode d’emploi des missions',
      html: '<ol><li>Choisissez une mission à partir du <strong>problème professionnel</strong>, pas d’un chapitre à réciter.</li><li>Ouvrez le dossier et identifiez le livrable attendu.</li><li>Le niveau Guidé / Semi-guidé / Autonome détermine la quantité d’aide, pas la difficulté du dossier ni la production attendue.</li><li>Les ressources sont une documentation à mobiliser lorsque vous en avez besoin.</li></ol>'
    };
    if (isReferential()) return {
      title: 'Mode d’emploi du référentiel intégré',
      html: '<ol><li>Utilisez cette vue pour <strong>situer</strong> une activité, une tâche, une compétence ou une connaissance.</li><li>Suivez les liens vers les ressources pour voir comment les éléments du référentiel sont travaillés.</li><li>La présence d’un lien indique une couverture pédagogique ; elle ne prouve pas à elle seule la maîtrise de la compétence.</li><li>Lorsque le texte complet officiel est nécessaire, utilisez le référentiel officiel indiqué par la bibliothèque.</li></ol>'
    };
    if (isTrainingIndex()) return {
      title: 'Mode d’emploi des entraînements',
      html: '<ol><li>Choisissez un entraînement pour travailler un geste ou un raisonnement précis.</li><li>Essayez d’abord sans chercher la réponse dans une fiche.</li><li>Utilisez ensuite les ressources pour contrôler ou compléter votre démarche.</li><li>Le parcours Odoo sert à transposer certains gestes dans le PGI utilisé en formation.</li></ol>'
    };
    return {
      title: 'Mode d’emploi du centre de ressources',
      html: '<ol><li><strong>Partez de votre besoin avec vos mots.</strong> Vous n’avez pas besoin de connaître le vocabulaire du référentiel.</li><li><strong>Recherche :</strong> décrivez ce que vous devez faire. Comparez les premières pistes au lieu de considérer le premier résultat comme automatiquement juste.</li><li><strong>Alphabet :</strong> utilisez-le lorsque vous reconnaissez un terme mais ne savez plus exactement ce qu’il signifie.</li><li><strong>Connaissances :</strong> utilisez-les pour comprendre ou réviser une notion.</li><li><strong>Missions :</strong> elles servent à mobiliser les ressources dans une situation professionnelle complète.</li></ol>'
    };
  }

  function ensureHelpDialog() {
    var existing = document.getElementById('usage-help-dialog');
    if (existing) return existing;
    var d = document.createElement('dialog');
    d.id = 'usage-help-dialog';
    d.className = 'usage-help-dialog';
    d.setAttribute('aria-labelledby', 'usage-help-title');
    d.innerHTML = '<div class="usage-help-dialog__header"><h2 id="usage-help-title">Mode d’emploi</h2><button type="button" class="usage-help-dialog__close-x" aria-label="Fermer le mode d’emploi">×</button></div><div class="usage-help-dialog__body"></div><div class="usage-help-dialog__footer"><button type="button" class="page-action-button usage-help-dialog__close">Fermer</button></div>';
    document.body.appendChild(d);
    function closeHelp() {
      if (typeof d.close === 'function' && d.open) d.close();
      else d.removeAttribute('open');
      if (lastHelpTrigger) setTimeout(function () { try { lastHelpTrigger.focus(); } catch (e) {} }, 0);
    }
    d.querySelector('.usage-help-dialog__close-x').addEventListener('click', closeHelp);
    d.querySelector('.usage-help-dialog__close').addEventListener('click', closeHelp);
    d.addEventListener('click', function (ev) { if (ev.target === d) closeHelp(); });
    d.addEventListener('cancel', function () { /* Échap : fermeture native. */ });
    return d;
  }

  function openHelp(trigger) {
    lastHelpTrigger = trigger;
    var data = helpData();
    var d = ensureHelpDialog();
    d.querySelector('#usage-help-title').textContent = data.title;
    d.querySelector('.usage-help-dialog__body').innerHTML = data.html;
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }

  function cleanupKnowledgePrint() {
    document.body.classList.remove('print-pdf-knowledge-active');
    document.querySelectorAll('.knowledge-card.print-pdf-target').forEach(function (card) {
      card.classList.remove('print-pdf-target');
      var state = card.__printPdfDetailsState;
      if (state) {
        card.querySelectorAll('details').forEach(function (el, i) { el.open = !!state[i]; });
        delete card.__printPdfDetailsState;
      }
    });
  }

  function printKnowledge(card) {
    cleanupKnowledgePrint();
    var details = Array.prototype.slice.call(card.querySelectorAll('details'));
    card.__printPdfDetailsState = details.map(function (el) { return el.open; });
    details.forEach(function (el) { el.open = true; });
    card.classList.add('print-pdf-target');
    document.body.classList.add('print-pdf-knowledge-active');
    setTimeout(function () { window.print(); }, 30);
  }

  function installKnowledgePrintButtons() {
    document.querySelectorAll('.knowledge-card').forEach(function (card) {
      if (card.querySelector('.knowledge-print-button')) return;
      var b = makeButton('Imprimer / PDF', 'knowledge-print-button');
      b.setAttribute('aria-label', 'Imprimer ou enregistrer en PDF cette connaissance');
      b.addEventListener('click', function () { printKnowledge(card); });
      card.appendChild(b);
    });
  }

  function findActionAnchor() {
    if (isMission()) return document.querySelector('.pilot-hero, main');
    if (isKnowledge()) return document.querySelector('.knowledge-hero, main');
    if (isMissionIndex()) return document.querySelector('.mission-index > header, .mission-index header, main');
    if (isReferential()) return document.querySelector('.ref-hero, main > header, main');
    return document.querySelector('.resource__header, .resource-center__header, main > header, main');
  }

  function installToolbar() {
    if (document.querySelector('.page-actions-toolbar')) return;
    var anchor = findActionAnchor();
    if (!anchor) return;
    var bar = document.createElement('div');
    bar.className = 'page-actions-toolbar';
    bar.setAttribute('aria-label', 'Actions disponibles sur cette page');

    var help = makeButton('Mode d’emploi');
    help.setAttribute('aria-haspopup', 'dialog');
    help.setAttribute('aria-controls', 'usage-help-dialog');
    help.addEventListener('click', function () { openHelp(help); });
    bar.appendChild(help);

    if (isPrintablePage()) {
      var print = makeButton('Imprimer / enregistrer en PDF');
      print.setAttribute('aria-label', 'Imprimer cette fiche ou l’enregistrer en PDF avec le navigateur');
      print.addEventListener('click', function () { window.print(); });
      bar.appendChild(print);
      var hint = document.createElement('p');
      hint.className = 'page-action-hint';
      hint.textContent = isResource() ? 'Le PDF respecte la vue Essentiel/Complet et les blocs ouverts.' : 'Le navigateur permet aussi d’enregistrer la fiche au format PDF.';
      bar.appendChild(hint);
    }

    anchor.insertAdjacentElement('afterend', bar);
  }

  document.addEventListener('DOMContentLoaded', function () {
    installToolbar();
    if (isKnowledge()) installKnowledgePrintButtons();
  });
  window.addEventListener('afterprint', cleanupKnowledgePrint);
})();
