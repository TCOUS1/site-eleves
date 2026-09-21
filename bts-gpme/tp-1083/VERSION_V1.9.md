# TP 1083 — version locale candidate 1.9 — 20/09/2026

Cette version poursuit la stabilisation pédagogique de la situation 3 sans refondre l’interface visuelle. La refonte graphique et l’unification avec les nouvelles fiches BTS restent volontairement séparées.

## Ajustements depuis 1.8

- Tâche 12 : la chronologie n’est plus préqualifiée dans R05 ; l’étudiant doit distinguer fait confirmé, indice/hypothèse, preuve et information manquante.
- R05 / `Applications` : retrait des colonnes de sauvegarde devenues redondantes avec l’onglet dédié ; ajout d’un rappel sur la différence entre criticité métier et niveau de risque cyber.
- R05 / `Traitements_donnees` : recentrage sur le périmètre de l’incident ; retrait des informations de conformité générale non mobilisées dans les tâches.
- Tâche 13 : analyse limitée aux traitements susceptibles d’être concernés ; interdiction explicite de transformer l’activité en audit RGPD général.
- Tâche 14 : remplacement de la notion ambiguë de « seuil » par le critère de décision ; qualification de la violation avant le raisonnement sur la notification ; distinction maintenue entre notification CNIL et information des personnes.
- Tâche 15 : sélection de six faiblesses significatives, justifiée par les faits et la criticité métier, plutôt qu’une simple liste minimale.
- Tâche 16 : définition explicite du repère 3-2-1, contrôle de l’isolement et des tests de restauration, puis priorisation selon la criticité métier.
- Tâche 17 : fiche réflexe organisée selon trois situations différentes : message suspect sans interaction ; clic/ouverture/saisie ; poste ou compte potentiellement compromis.
- FP-CYB-01 : ajout d’un bloc de qualification d’une violation de données, d’un repère 3-2-1 et de premiers réflexes conditionnels.
- R09 v1.7 : ajout du repère ANSSI sur les sauvegardes et reformulation des critères de décision RGPD.
- Tous les liens internes vers R09 pointent désormais vers la version 1.7 afin d’éviter les variantes concurrentes dans le parcours élève.

## Sources institutionnelles vérifiées

- CNIL — Violations de données personnelles : https://www.cnil.fr/fr/violations-de-donnees-personnelles-les-regles-suivre
- CNIL — Notifier une violation : https://www.cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles
- CNIL — Sécurité : gérer les incidents et les violations : https://www.cnil.fr/fr/securite-gerer-les-incidents-et-les-violations
- ANSSI / MesServicesCyber — guide TPE/PME et sauvegardes 3-2-1 : https://messervices.cyber.gouv.fr/documents-guides/20241212_np_anssi_guide_tpe-pme_v2.pdf
- Cybermalveillance.gouv.fr — fiches réflexes de réaction aux compromissions.
