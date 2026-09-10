# BTS GPME — Ressources professionnelles v4.1

Application unique pour l’apprentissage et la maintenance.

## Utilisation pédagogique
- `index.html` : accueil.
- Recherche dans le panneau gauche.
- `connaissances/` : notions par recherche ou alphabet.
- `ressources/` : méthodes et outils.
- `missions/` : entraînements.
- `entrainement/pgi.html` : situations nécessitant un PGI (mise en pratique Odoo).
- `referentiel/` : référentiel BTS GPME.

## Retours élèves / Maintenance
La collecte des suggestions nécessite un hébergement PHP avec l’extension `pdo_sqlite`.

1. Déposer le dossier sur un serveur PHP.
2. Vérifier que `data/` est accessible en écriture par PHP.
3. Modifier le code dans `maintenance/config.php` (valeur livrée : `gpme`).
4. La base `data/feedback.sqlite` est créée automatiquement au premier retour.

Le badge `Maintenance n` correspond au nombre de retours non traités. L’espace Maintenance permet de les marquer traités, les remettre à traiter, les supprimer définitivement ou les exporter en CSV.

En ouverture directe (`file://`), le contenu pédagogique reste utilisable ; seule la collecte partagée des retours est indisponible.

## Ancienne source enseignant

Les anciens outils exclusivement présents dans la distribution enseignant ont été regroupés sous `maintenance/archives-ancienne-source-enseignant/`. Ils ne constituent plus une interface distincte.
