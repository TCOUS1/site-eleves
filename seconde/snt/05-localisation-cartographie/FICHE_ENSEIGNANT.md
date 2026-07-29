# Fiche enseignant — Localisation, cartographie et mobilité

## Positionnement

La séquence couvre les capacités du programme : géolocalisation, couches
cartographiques, contribution collaborative, NMEA et calcul d’itinéraire.
Durée indicative : 10 h 50.

## Matériel

- navigateur récent ;
- Python 3 facultatif mais conseillé ;
- éditeur de texte ou tableur ;
- accès ponctuel à un portail IGN ou à OpenStreetMap ;
- aucun téléphone personnel n’est nécessaire.

## Déroulé conseillé

### Séance 1 — Cartes et couches
Faire produire trois cartes pour trois destinataires. L’objectif central est de
comprendre la sélection de l’information et la généralisation.

### Séance 2 — Coordonnées
Travailler l’équateur, Greenwich, les signes et la conversion décimal / DMS.
Insister sur l’ordre longitude-latitude de GeoJSON.

### Séance 3 — GPS et Galileo
Utiliser la trilatération 2D comme analogie, puis expliciter ses limites :
satellites mobiles, pseudodistances et erreur d’horloge.

### Séance 4 — NMEA et GPX
Lire une trame caractère par caractère avant le décodeur. Le checksum contrôle
le message, pas la précision de la mesure.

### Séance 5 — Sources et OpenStreetMap
Une contribution réelle reste facultative. Elle exige un compte, une source
autorisée et une observation vérifiable. La préparation fictive suffit pour
évaluer les compétences.

### Séance 6 — Itinéraires
Commencer par le graphe papier. Faire varier distance, temps et accessibilité.
Toujours demander : « optimal selon quel critère ? »

### Séance 7 — Vie privée
Ne pas demander l’historique réel des élèves. Utiliser les cas fictifs et les
réglages de démonstration.

### Séance 8 — Projet
Niveau guidé avec le réseau fourni ou niveau autonome avec une zone réelle,
sans publier de trace personnelle.

## Difficultés fréquentes

- latitude et longitude inversées ;
- format NMEA ddmm.mmmm mal converti ;
- confusion triangulation / trilatération ;
- idée que le téléphone envoie sa position aux satellites ;
- checksum confondu avec précision ;
- itinéraire optimal sans critère ;
- oubli des droits, de la date et des incertitudes.

## Différenciation

Aide : limiter à GGA, fournir les coordonnées converties, utiliser un graphe de
cinq sommets.

Approfondissement : coder Haversine, ajouter le dénivelé, décoder RMC, détecter
un point aberrant, importer un GeoJSON.

## Évaluation

Évaluer la lecture de carte, le vocabulaire, les coordonnées, la compréhension
GNSS, le décodage NMEA, le graphe, la protection des données et la validation.
