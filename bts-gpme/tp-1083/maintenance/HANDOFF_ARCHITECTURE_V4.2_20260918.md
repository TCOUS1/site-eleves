# HANDOFF — Architecture pédagogique BTS GPME / v4.2

Date : 18 septembre 2026  
Branche Git : `refonte-intention-v4.2`  
Périmètre : `E:\COURS\github\site-eleves\bts-gpme\`  
Objet : transmettre au prochain fil non seulement l’état actuel, mais surtout **l’évolution des choix d’architecture, les problèmes auxquels ils répondaient et les raisons de les conserver ou de les faire évoluer**.

## 1. Principe directeur actuel

Le système n’est plus conçu comme une collection de fiches à consulter, mais comme un **environnement qui doit aider l’étudiant à reconnaître son besoin, trouver une ressource, construire une représentation juste de la situation puis agir sans que l’interface ou la fiche lui fournisse la réponse du cas**.

La règle transversale devenue centrale est :

> **Le contenu détermine la forme, pas l’inverse.**

Conséquence pédagogique : ne pas demander à l’étudiant de « remplir un modèle » avant d’avoir compris ce qu’il doit représenter. La progression recherchée est généralement :

`observer la réalité → comprendre ce qu’il faut montrer → organiser le raisonnement → choisir / mobiliser l’outil → produire → contrôler`

Cette règle est issue d’observations en classe et doit désormais servir de critère d’architecture, d’écriture et d’interface.

## 2. Point de départ — architecture orientée action professionnelle

La spécification maître a d’abord posé qu’une ressource correspond à une **unité d’action professionnelle autonome**, et non à une case du référentiel. Le référentiel reste la source normative du rattachement pédagogique, mais ne doit pas dicter artificiellement la forme visible des ressources.

Choix structurants initiaux :
- recherche en langage naturel avec vocabulaire élève ;
- ressource trouvable sans connaître son nom professionnel ;
- distinction entre ce que fournit la ressource (méthode, notion, outil) et ce que fournit le dossier (faits, pièces, valeurs) ;
- donnée manquante = information à traiter, jamais invitation à inventer ;
- traçabilité de la conclusion ;
- aide qui soutient le diagnostic sans le supprimer.
## 3. v3.5 — la couverture n’était plus le problème, l’accès l’était

Le retour d’usage a montré que disposer de 147 ressources ne suffisait pas. L’étudiant pouvait avoir la bonne ressource dans la bibliothèque et pourtant ne pas l’atteindre efficacement.

Décision v3.5 :
- faire apparaître **un meilleur résultat principal** immédiatement ;
- repousser les pistes connexes dans un bloc secondaire ;
- employer dans les titres et l’index les formulations réellement saisies par les étudiants ;
- enrichir une fiche existante plutôt que créer systématiquement une nouvelle fiche.

Pourquoi : réduire le coût de recherche et éviter que la richesse documentaire devienne elle-même un obstacle. La volumétrie n’a donc pas été augmentée pour répondre à un problème d’accès.

Conséquence durable : avant d’ajouter une nouvelle ressource, vérifier si le problème vient réellement d’un manque de contenu ou d’un défaut de recherche, de titre, de vocabulaire ou de guidage.

## 4. v3.6 — passer de « la ressource existe » à « l’élève peut se la représenter »

L’observation suivante a été décisive : **la présence d’une explication ne garantit ni sa compréhension ni son utilisation**. Certains concepts imposent à l’étudiant de reconstruire mentalement une structure avant même de pouvoir agir.

Décision v3.6 : pour chaque ressource, demander successivement :
1. quel est l’objectif d’action ;
2. quelle représentation mentale l’étudiant doit construire ;
3. si un visuel réduit réellement l’effort de compréhension ;
4. quel format sert le mieux cet objectif ;
5. ce que l’étudiant doit pouvoir faire immédiatement après.

Choix techniques associés :
- un visuel principal seulement lorsqu’il apporte un gain réel ;
- pas de décoration systématique ;
- HTML/CSS/SVG statique plutôt qu’une dépendance en ligne ;
- fonctionnement hors ligne et à l’impression conservé.

Pourquoi : ne pas confondre enrichissement visuel et amélioration pédagogique. Le visuel est un outil de représentation, pas un objectif graphique.
## 5. v4.0 — séparer navigation et lecture

Le prototype v4.0 a constaté que l’ancienne interface demandait à l’étudiant d’apprendre à piloter la fiche elle-même. Les étapes, cases, niveaux Essentiel/Complet et éléments de navigation prenaient trop de place dans la tâche cognitive.

Décision v4.0 :
- panneau de navigation/recherche séparé de la zone de lecture ;
- rail d’icônes lorsque le panneau est replié ;
- une zone principale consacrée au contenu ;
- abandon de l’interface Essentiel/Complet au profit d’un approfondissement ponctuel ;
- suppression des anciennes étapes visuelles lorsqu’elles ne servent pas le contenu.

Principe formulé : **l’élève choisit à gauche ; il consulte à droite. La structure guide la lecture sans lui demander d’apprendre à piloter la fiche.**

Pourquoi : réduire la charge d’interface et rendre l’outil immédiatement utilisable en situation professionnelle.

## 6. v4.2 — architecture centrée sur l’intention et non sur le gabarit

La réflexion v4.2 a prolongé ce mouvement : une page ne doit plus être définie d’abord par un gabarit uniforme mais par **l’intention cognitive ou professionnelle qu’elle sert**.

Typologie retenue :
- 📘 **Connaissance** — comprendre « qu’est-ce que c’est ? » ;
- 🛠 **Méthode / outil** — savoir « comment l’utiliser ? » ;
- 🔄 **Processus** — comprendre où se situe une action dans un ensemble ;
- 📋 **Procédure** — respecter une méthode prescrite, en rappelant que la procédure réelle de l’entreprise prévaut ;
- 🧪 **Entraînement** — pratiquer, sans polluer le parcours principal.

Une même notion ou un même outil peut donc avoir plusieurs usages et plusieurs pages d’intention différentes. Exemple : la chaîne de valeur peut servir à comprendre l’organisation, éclairer un choix stratégique ou repérer des zones de risque.

Raison : éviter qu’une seule fiche essaie de tout faire et éviter aussi l’effet inverse, où l’on duplique le contenu pour remplir des catégories. **Une page = une intention identifiable**, pas nécessairement « une action » au sens strict.
## 7. Mobile et activité — la recherche doit être le point d’entrée

Le mobile ne doit pas reproduire un site desktop miniaturisé. Le parcours cible est :

`terme recherché → objet trouvé → actions possibles`

Décisions v4.2 :
- recherche visible immédiatement en haut ;
- shell mobile visé : `[G] [🔎 Rechercher un terme…] [Aa] [☰]` ;
- pas de barre de navigation permanente en bas ;
- réglages de confort de lecture dans une feuille `Aa` ;
- en mode activité, masquer l’essentiel de la navigation non nécessaire ;
- conserver une sortie discrète vers le thème ou la recherche.

Formule de conception utile : **les liens décident quoi faire ; le contenu permet de le faire.**

Pourquoi : en activité, l’élève ne vient pas « visiter une bibliothèque » ; il cherche une aide ciblée pour poursuivre son travail.

## 8. Le TP 1083 a servi de test réel de l’architecture

Les dernières évolutions ne viennent pas d’un besoin théorique mais de difficultés observées pendant la passation du TP 1083.

### 8.1 Chaîne de valeur : le classement arrivait trop tôt

Difficulté constatée : les étudiants tentaient de faire correspondre l’entreprise aux cases de Porter avant d’avoir construit une représentation de ce que fait réellement l’entreprise.

Diagnostic : il manquait une étape cognitive intermédiaire. Le problème n’était pas seulement la définition de Porter mais l’absence de représentation concrète préalable.

Nouvelle progression :

`proposition de valeur → activités réelles → rôle des activités → classement Porter → mode de réalisation → cœur de métier / maîtrise stratégique`

Le principe à conserver est : **ne pas adapter artificiellement le fond à la forme ; adapter la représentation au fond et à l’objectif de l’analyse.**

### 8.2 Activités principales, soutien et cœur de métier

Deux distinctions sont désormais explicites :
- activité principale : participe généralement directement au parcours de l’offre vers le client ;
- activité de soutien : fournit aux autres activités ressources, compétences, technologies ou moyens de pilotage.

Mais « soutien » ne signifie jamais « secondaire ». Une fonction de soutien peut être stratégiquement déterminante selon l’entreprise. De même, **activité principale ≠ cœur de métier** : le cœur de métier dépend de la proposition de valeur, des savoir-faire et de la différenciation propres à l’organisation observée.
### 8.3 Exécution, externalisation et maîtrise

La formulation initiale « une activité principale peut être externalisée » a été jugée trop grossière car elle pouvait faire perdre la question stratégique essentielle : **qu’est-ce que l’entreprise doit continuer à maîtriser pour conserver sa proposition de valeur ?**

Formulation retenue :

> Une entreprise peut confier certaines opérations nécessaires à son offre à un partenaire, mais elle doit conserver la maîtrise des activités, compétences et savoir-faire qui fondent son cœur de métier et sa proposition de valeur. **Externaliser l’exécution ne signifie pas externaliser la maîtrise.**

Pourquoi : distinguer le fait de réaliser matériellement une opération du fait d’en maîtriser la conception, les critères, les compétences, le contrôle et la décision.

### 8.4 Attention aux exemples qui donnent la réponse du cas

Un exemple fictif de fabricant de jeans vendant dans ses propres magasins a été brièvement utilisé pour expliquer Porter. Il a été retiré car il était trop proche du cas 1083 et risquait de devenir un corrigé implicite.

L’exemple de la ressource `chaine-de-valeur.html` utilise désormais une entreprise différente (`BureauBois`).

Règle à conserver : **un exemple pédagogique doit rendre le raisonnement visible sans reproduire suffisamment le cas actif pour que l’étudiant puisse simplement transposer la réponse.**

## 9. Même logique appliquée à l’analyse des risques

L’architecture de la méthode risque a également été simplifiée à partir des difficultés d’usage. La séquence actuelle est :

`activité → acteurs → ce qu’ils font → moyens / dépendances → événement redouté → conséquences concrètes → G / P justifiées → mesures existantes attestées → priorisation / action → réévaluation`

Choix importants :
- probabilité ≠ fréquence ; la fréquence ou l’exposition peuvent seulement constituer des indices ;
- ne jamais inventer une mesure existante ; distinguer « attestée », « à vérifier », « aucune identifiée » ;
- une conséquence doit décrire ce qui se produit concrètement, sur quoi ou sur qui ;
- une cotation non justifiable reste en attente plutôt que d’être fabriquée ;
- dans l’outil pédagogique actuel, tout G=5 fait l’objet d’un examen spécifique même si G×P n’est pas maximal.

Pourquoi : obliger l’étudiant à partir du travail réel et des preuves avant de remplir une matrice. La matrice doit organiser une analyse déjà construite, pas produire artificiellement l’analyse.
## 10. Invariants à préserver

Le prochain fil ne doit pas repartir de zéro ni revenir à des architectures déjà écartées sans raison nouvelle.

À préserver :
- **fond avant forme** ;
- situation réelle avant modèle abstrait ;
- recherche avec les mots de l’étudiant ;
- une aide qui permet de poursuivre sans fournir le livrable du cas ;
- séparation entre méthode générique et données du dossier ;
- aucune invention d’une donnée absente ;
- contenu court quand le court suffit, approfondissement seulement quand il apporte quelque chose ;
- adaptation aux procédures/outils réels de l’entreprise en stage ;
- compatibilité smartphone, impression et fonctionnement sans dépendance externe inutile ;
- observation de classe comme source de révision prioritaire.

À éviter :
- créer une nouvelle fiche pour chaque difficulté ;
- ajouter du texte « au cas où » ;
- imposer le même gabarit à des objets cognitifs différents ;
- faire remplir un tableau ou une matrice avant compréhension du contenu ;
- multiplier les éléments de navigation permanents ;
- donner un exemple trop proche d’une situation évaluée ou en cours ;
- modifier une version en ligne au milieu d’une passation si cela peut créer une inégalité entre étudiants.

## 11. Boucle d’amélioration désormais privilégiée

La bibliothèque et les TP doivent évoluer par itérations courtes fondées sur l’usage réel :

`difficulté observée → diagnostic du blocage → identification de la couche concernée → correction minimale → contrôle de cohérence → nouvelle observation`

Couches possibles à distinguer avant de corriger :
- connaissance manquante ;
- représentation mentale insuffisante ;
- méthode ou étape intermédiaire absente ;
- consigne ambiguë ;
- ressource difficile à trouver ;
- interface qui surcharge ;
- outil/gabarit qui impose sa forme au raisonnement.

Cette distinction est importante : une difficulté d’élève ne doit pas conduire automatiquement à ajouter une explication. La correction doit viser **la cause du blocage**.
## 12. État local au moment du handoff

- Branche active : `refonte-intention-v4.2`.
- Le working tree contient un très grand nombre de modifications liées à la refonte v4.2 : ne pas faire de nettoyage global, reset ou remplacement massif sans examen.
- Actifs v4.2 présents localement : `assets/app-v42.css`, `assets/app-v42.js`, `assets/search-index-v42.js`.
- Ressources chaîne de valeur actuelles :
  - `connaissances/notions/chaine-de-valeur.html` ;
  - `ressources/transversal/R-TR-015-chaine-valeur-porter-risques.html` ;
  - `ressources/transversal/R-TR-017-chaine-valeur-strategie.html` ;
  - `ressources/transversal/R-TR-018-chaine-valeur-risques.html`.
- TP 1083 : version locale v1.3 prête ; classeur `S01_Matrice_analyse_risques_v1.3.xlsx` intégré ; HTML synchronisé.
- ZIP élève propre : `E:\COURS\github\TP_1083_HTML_v1.3_ELEVE.zip`.
- SHA-256 du ZIP au dernier contrôle : `aecaaea9e4fb820ea666c39adbcab8afdc5da8bb6990acfbb793d006d3f6dc25`.
- Le ZIP a été reconstruit avec chemins standards : 0 entrée `./...`, 0 séparateur `\` dans les noms internes.
- Aucun push de cette évolution ne doit être déclenché automatiquement. L’utilisateur a choisi d’attendre la fin de la remise du groupe actuel afin de ne pas modifier l’environnement pendant la passation. La version locale est néanmoins déjà prête dans le dépôt pour un futur commit/push via GitHub Desktop.

### Nettoyage technique encore visible

Le `git status` du 18/09/2026 montre encore deux fichiers temporaires non suivis à examiner avant un commit :
- `_tmp_S01_v13_correct.b64` ;
- `_tmp_searchfix_v42.py`.

Ne pas les inclure dans un commit sans vérifier leur utilité. Les fichiers OpenDyslexic sont également non suivis dans le dépôt ; ne jamais les redistribuer depuis le chat.

## 13. Fichiers historiques à lire si une décision doit être reconstituée

- `maintenance/specification-maitre.md` — principes fondateurs ;
- `maintenance/v3.5-tp1083-adaptation.md` — passage de la couverture documentaire à l’accès réel ;
- `maintenance/v3.6-evolution-visuelle.md` — représentations mentales et usage raisonné des visuels ;
- `maintenance/v4.0-prototype-architecture.md` — séparation navigation / lecture ;
- présent fichier — synthèse de continuité v4.2 et décisions issues des observations de classe.
## 14. Consigne de reprise pour le prochain fil

Commencer par ce handoff avant toute modification. Ne pas réouvrir tout l’historique sauf contradiction ou besoin précis.

Priorité de travail : **observer ce que les élèves n’arrivent pas à faire, identifier pourquoi, puis intervenir au niveau minimal utile**.

Lorsqu’une difficulté nouvelle est signalée :
1. reformuler ce que l’élève devait réussir ;
2. identifier le premier point de divergence entre ce qui était attendu et ce qu’il a réellement fait ;
3. déterminer s’il manque une connaissance, une représentation, une étape de raisonnement, une consigne, un accès ou un outil ;
4. challenger la correction envisagée avant d’ajouter du contenu ;
5. modifier seulement les ressources nécessaires ;
6. vérifier la cohérence avec l’architecture mobile, la recherche et les usages liés ;
7. conserver la difficulté comme observation de passation pour juger l’effet de la correction lors d’un usage ultérieur.

Le but n’est pas d’obtenir une bibliothèque théoriquement exhaustive. Le but est qu’un étudiant puisse **comprendre ce qu’il doit faire, trouver l’aide adaptée, construire son raisonnement et produire de façon professionnelle avec une autonomie croissante**.

## 15. Point de vigilance méthodologique

Le projet a déjà connu plusieurs enrichissements successifs. Ne pas confondre amélioration et accumulation. Avant toute nouvelle fonction, fiche, visuel ou couche d’interface, poser la question :

> **À quoi cela sert-il pour l’étudiant dans une situation professionnelle identifiable, et quelle difficulté observée cela résout-il ?**

Si la réponse n’est pas nette, ne pas ajouter l’élément à ce stade.
