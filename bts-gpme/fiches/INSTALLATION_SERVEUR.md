# Installation serveur — retours élèves

La bibliothèque pédagogique fonctionne aussi en fichiers statiques. La fonction **Suggérer une amélioration** et le badge **Maintenance** nécessitent un serveur PHP.

## Prérequis

- PHP 8.1 ou supérieur ;
- extension `pdo_sqlite` ;
- droit d'écriture de PHP sur le dossier `data/`.

Le fichier `maintenance/diagnostic.php` permet de vérifier ces trois points après mise en ligne.

## Installation

1. Déposer le dossier complet sur le serveur web.
2. Ouvrir `maintenance/diagnostic.php` et vérifier les trois indicateurs.
3. Modifier le code de maintenance dans `maintenance/config.php` (le code initial est `gpme`).
4. Ouvrir `index.html`.

La base `data/feedback.sqlite` est créée automatiquement au premier commentaire.

## Fonctionnement des retours

- le badge `Maintenance n` = nombre exact de retours non traités ;
- **Marquer traité** retire un retour du compteur mais le conserve dans la base ;
- **Remettre à traiter** le réactive ;
- **Supprimer** l'efface définitivement ;
- **Exporter CSV** télécharge l'ensemble de la base des retours.

Les commentaires sont anonymes par défaut. Aucune donnée d'identité n'est demandée.
