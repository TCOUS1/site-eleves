# Référence de forme — matrice de cours et cours actuels

## Sources étudiées

- `MATRICE_OFFICIELLE_COURS_V1(1).zip` : matrice seule.
- `MATRICE_OFFICIELLE_COURS_V1(2).zip` : même matrice (22 fichiers communs strictement identiques) + le site de cours actuel.

La seconde archive contient des ensembles de cours en Seconde, Première STMG, Terminale STMG et BTS GPME. Le BTS comprend notamment les parcours/TP Odoo, Excel, ECOTERMIC, HEXA, Pépinières Sirot, Bainu-Errandonea, Technord Services, Papeterie Services, Passeport pro, ressources notionnelles et référentiel.

## Principes de la matrice à conserver lors de la future refonte visuelle

La charte pédagogique de la matrice organise le travail en cinq temps :

1. Observer et décrire.
2. Acquérir les notions.
3. Analyser de manière structurée.
4. Conceptualiser : diagnostiquer et proposer.
5. S’entraîner et vérifier.

Le modèle HTML prévoit en plus : finalité du parcours, accès rapide aux modules, pièges à éviter, contrôle rapide, flashcards, contenus enseignant et sources/licences.

Fonctions prévues par la matrice : accessibilité (clair/sombre, mode dys, taille), progression, sauvegarde locale des champs `data-save`, corrections escamotables, QCM, flashcards clavier/souris, mode enseignant et impression.

## Compatibilité avec le centre BTS GPME construit ici

La logique actuelle se mappe naturellement sur la matrice sans modifier le fond :

| Centre de ressources GPME | Matrice de cours |
|---|---|
| Explorer les pièces | Observer et décrire |
| Notions minimales | Acquérir les notions |
| Pièce → information → traitement | Analyser de manière structurée |
| Proposition / alerte / décision à valider | Conceptualiser |
| Outil de production + autocontrôle | S’entraîner et vérifier |

La future mise en forme devra donc **habiller la logique mission-first**, pas la remplacer par un cours linéaire.

## Ce que les cours actuels apportent comme référence

Une grande partie des cours BTS/STMG historiques est issue de sorties Scenari : leur contenu, leurs annexes, leurs séquences et leurs situations professionnelles sont précieux, mais leur structure technique générée (`lib-sc`, `lib-md`, `skin`, pages `co/`) n’a pas vocation à devenir la nouvelle structure commune.

Le site récent fournit déjà une identité transversale (`style.css`, cartes, bandeaux, menu d’accessibilité) tandis que `matrice-cours.css` fournit une couche spécifique de cours structurés. La refonte ultérieure devra réutiliser ces composants et éviter de dupliquer CSS/JS dans chaque fiche.

## Décision pour v1.7

Aucune refonte visuelle n’est appliquée maintenant. Ces fichiers deviennent la **référence officielle de forme** pour l’étape suivante, une fois les parcours et productions stabilisés.
