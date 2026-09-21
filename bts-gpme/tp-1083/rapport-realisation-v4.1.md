# Rapport de réalisation — BTS GPME v4.1

## Objet

Cette version met en œuvre l'architecture validée après les essais de la bibliothèque avec les élèves : **une seule application**, une navigation stable à gauche et un contenu pédagogique construit à droite.

## Architecture de l'accueil

La page d'accueil ne pré-affiche plus aucune réponse de recherche. Elle présente trois points d'entrée, dans l'ordre pédagogique retenu :

1. **Comprendre une notion** ;
2. **Savoir comment faire** ;
3. **M'entraîner**.

Le panneau de gauche est identique sur l'accueil et les pages internes. Il peut être replié en rail. Les pictogrammes ont des fonds colorés et conservent leur libellé lorsque le panneau est ouvert.

## Recherche

- aucun résultat avant saisie d'une requête ;
- un **Meilleur résultat** mis en avant ;
- les autres résultats restent sous **Autres pistes utiles** ;
- la recherche combine ressources, missions et notions.

## Notions

L'ancien index de 343 cartes n'est plus la destination normale d'un lien contextuel.

- **343 pages notion unitaires** ont été générées ;
- depuis une ressource, un clic sur une notion ouvre d'abord sa définition dans une fenêtre contextuelle sans quitter la ressource ;
- l'élève peut ensuite choisir **Ouvrir la notion** ;
- les notions connexes sont limitées et directement cliquables ;
- la page `connaissances/index.html` permet la recherche ou l'exploration A–Z ;
- sur ordinateur : survol = aperçu temporaire, clic = lettre conservée, × = état neutre ;
- aucune lettre sélectionnée n'entraîne l'affichage des 343 notions.

## Ressources et entraînement

Les 147 ressources utilisent la nouvelle navigation. Les liens vers les missions ont été exploités en sens inverse pour ajouter automatiquement un bloc **Je m'entraîne** aux ressources pour lesquelles une mission correspondante est connue.

**101 ressources** disposent ainsi d'au moins une situation d'entraînement reliée dans cette version.

La fiche `R-B1-025 — Rapprochement bancaire` a été reconstruite comme prototype éditorial complet :

1. Avant de commencer ;
2. Comprendre le principe ;
3. Comment faire ? ;
4. Point de vigilance ;
5. Notions utiles ;
6. Je m'entraîne.

La fiche `R-TR-015 — Chaîne de valeur de Porter` conserve le modèle visuel de référence en première étape et relie l'entraînement à M10.

## PGI

La navigation n'est plus intitulée « Odoo » mais **Situations avec PGI**. Les situations M01, M02, M03, M05, M06 et M07 sont présentées par besoin professionnel. Odoo est indiqué comme outil de mise en pratique dans cette bibliothèque.

## Référentiel

Le référentiel conserve son articulation spécifique : blocs, activités, tâches, compétences, critères et savoirs associés. Il reçoit la même navigation et la même charte générale. Les ancres officielles sont conservées afin qu'un lien depuis une ressource ou une notion conduise directement à l'objet visé.

## Retours élèves et Maintenance

Une boucle d'amélioration a été ajoutée avec PHP + SQLite :

- bouton **Suggérer une amélioration** ;
- catégories de retour + commentaire libre ;
- ressource et section associées automatiquement ;
- stockage dans SQLite ;
- badge `Maintenance n` = nombre de retours non traités ;
- espace Maintenance avec protection légère ;
- marquer traité / remettre à traiter ;
- suppression définitive ;
- export CSV ;
- diagnostic serveur fourni.

L'application pédagogique fonctionne en mode statique. La collecte partagée nécessite PHP avec `pdo_sqlite`.

## Contrôles

- **147/147 ressources** présentes ;
- **30/30 missions** présentes ;
- **343/343 notions unitaires** générées ;
- **26 lettres** dans l'explorateur A–Z ;
- aucun ancien lien `connaissances/index.html#k-...` dans les pages actives ;
- nouvelle interface sur **147/147 ressources** ;
- retour d'amélioration sur **147/147 ressources** ;
- **19 675 références locales** contrôlées : **0 lien cassé** ;
- syntaxe des scripts JavaScript v4.1 validée avec `node --check` ;
- syntaxe de tous les fichiers PHP validée avec `php -l` ;
- les ancres `a1-6` et `s1-6-1` du référentiel, utilisées comme tests de navigation précise, sont conservées.

### Limite du contrôle d'exécution

L'environnement de réalisation possède PHP mais pas l'extension `pdo_sqlite`. Le code PHP a donc été validé syntaxiquement, mais la création réelle de la base SQLite n'a pas pu être exécutée ici. Le package contient `maintenance/diagnostic.php` pour tester l'hébergement cible.

Le Chromium headless disponible dans l'environnement n'a pas terminé les captures de fichiers locaux ; le rendu visuel final n'est donc pas compté comme test automatisé réussi. Les contrôles de structure, liens, scripts et contenus ont en revanche été exécutés.

## Ancienne source enseignant

Les anciens outils exclusivement présents dans la distribution enseignant ont été regroupés sous `maintenance/archives-ancienne-source-enseignant/`. Ils ne constituent plus une interface distincte.
