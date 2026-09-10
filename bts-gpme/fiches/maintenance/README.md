# Maintenance de la bibliothèque

## Principe
Les fichiers HTML de `ressources/` restent la source de vérité pédagogique. Les attributs `data-*` portent le rattachement technique au référentiel.

## Après modification ou ajout d’une fiche
1. Conserver un identifiant `data-resource-id` permanent.
2. Utiliser uniquement des codes officiels dans `data-activities`, `data-tasks` et `data-knowledge`.
3. Conserver `data-resource-type` parmi : `methode`, `outil`, `repere`, `regle`. Le libellé visible peut être plus précis.
4. Mettre à jour `data-verified` et `data-maintenance` si le contenu est évolutif.
5. Regénérer les index, relations et audits avec le script de reconstruction du projet.

## Règle de fiabilité
Une fiche marquée `evolutive` doit être vérifiée sur une source institutionnelle avant usage professionnel. Le référentiel 2018 reste la source normative du rattachement pédagogique ; les règles juridiques et téléprocédures doivent, elles, être actualisées.

## Particularité du référentiel
Le référentiel publié réutilise notamment le code `S.1.4.2` pour deux libellés. La bibliothèque conserve cette anomalie au lieu d’inventer un code qui ne serait pas officiel.

## v0.9 — règle d’autonomie
Chaque ressource contient un bloc repliable « Si une information manque, que faire ? ». Il impose de ne pas inventer une donnée ou une règle et de distinguer recherche d’information, hypothèse autorisée et validation managériale.

Les ressources renforcées peuvent contenir :
- `details.resource__tool` : outil reproductible ;
- `details.resource__transfer` : mini-mission de transfert.

La page `entrainement/index.html` est générée à partir des mini-missions présentes dans les fiches.


## v1.0 — vocabulaire de recherche élève
`student-search-vocabulary.json` est une couche UX, **pas une taxonomie référentielle**. Elle sert uniquement à traduire des formulations comme « le client ne paie pas » vers les termes professionnels indexés (« impayé », « relance », « règlement »). Les hashtags restent exclusivement issus du référentiel.

`student-search-tests.json` contient des requêtes de test et la position de la ressource attendue. Toute modification importante du moteur ou des titres doit être accompagnée d’une nouvelle exécution de ces tests.
