# Fiche enseignant — La photographie numérique

## Positionnement

La séquence couvre les capacités du programme :

- distinguer photosites et pixels ;
- comparer les résolutions du capteur et de l’image ;
- retrouver les métadonnées EXIF ;
- transformer les trois composantes des pixels par programme ;
- expliciter les algorithmes de prise de vue ;
- identifier les étapes de construction de l’image finale.

Durée indicative : 10 h 55.

## Matériel

- navigateur récent ;
- Python 3 ;
- bibliothèque Pillow pour les scripts ;
- logiciel de retouche facultatif ;
- aucun appareil photo personnel n’est nécessaire.

## Déroulé conseillé

### Séance 1 — Acquisition

Partir de la chaîne scène → optique → capteur → données → algorithmes →
fichier. Les curseurs servent à formuler des hypothèses, pas à reproduire
un modèle physique complet.

### Séance 2 — Photosites et pixels

Utiliser l’image 16 × 12. Faire calculer la définition avant d’aborder les
mégapixels et l’impression. Insister sur les sens différents du terme
résolution.

### Séance 3 — Couleur

Manipuler RVB et la profondeur. Expliquer que le pixel final possède trois
composantes calculées alors que chaque photosite filtré ne mesure pas
directement les trois.

### Séance 4 — EXIF

Utiliser d’abord le fichier de démonstration. Une photographie personnelle
reste facultative. Ne pas projeter publiquement une localisation réelle.

### Séance 5 — Compression

Comparer la taille, les dimensions et les artefacts. Conserver l’original
et produire une copie de diffusion.

### Séance 6 — Programmation

Commencer par le négatif et les niveaux de gris. Poursuivre avec le seuillage
ou les contours. Faire verbaliser la formule appliquée à chaque pixel.

### Séance 7 — Algorithmes de l’appareil

Faire reconstruire l’ordre plausible des traitements. Comparer mode nuit,
HDR, panorama et portrait. Aborder l’authenticité par la provenance et le
contexte, sans promettre une détection parfaite à l’œil.

### Séance 8 — Projet

Le projet assemble une image autorisée, une analyse EXIF, une transformation
programmée, un export et une justification de publication.

## Difficultés fréquentes

- photosite et pixel confondus ;
- définition et résolution confondues ;
- croyance qu’un nombre de mégapixels résume la qualité ;
- synthèse additive confondue avec les pigments ;
- EXIF considérées comme immuables ;
- JPEG confondu avec une simple extension ;
- image finale prise pour une donnée brute ;
- transformation programmée sans conservation de l’original.

## Différenciation

Aide :
- utiliser le pixel-art 16 × 12 ;
- fournir la boucle de parcours des pixels ;
- limiter l’analyse EXIF à cinq champs ;
- utiliser une seule transformation.

Approfondissement :
- comparer plusieurs formules de luminance ;
- écrire un filtre sur une fenêtre de voisins ;
- mesurer l’erreur de compression ;
- comparer taille, bruit et netteté ;
- étudier une fusion HDR ou une réduction de bruit multi-images.

## Évaluation

L’évaluation finale porte sur la précision du vocabulaire, les calculs,
l’analyse des métadonnées, le programme, l’explication des algorithmes,
les droits et la reproductibilité.
