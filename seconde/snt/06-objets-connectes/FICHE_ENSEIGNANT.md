# Fiche enseignant — Informatique embarquée et objets connectés

## Positionnement

La séquence couvre les trois capacités officielles :

- identifier les algorithmes de contrôle reliant capteurs, IHM et actionneurs ;
- réaliser une IHM simple ;
- écrire un programme simple d’acquisition ou de commande.

Durée indicative : 11 h 10.

## Matériel

Le cours fonctionne avec un navigateur récent et Python 3.

Matériel facultatif :
- une carte micro:bit V2 ou une carte programmable équivalente ;
- câble USB et piles ;
- LED avec résistance, buzzer ou petit servomoteur ;
- capteur externe uniquement si le matériel est déjà disponible.

Aucun compte cloud ni achat n’est nécessaire.

## Déroulé conseillé

### Séance 1 — Architecture

Faire distinguer automatisé, embarqué et connecté. Construire la chaîne
d’information et d’action avant d’aborder le code.

### Séance 2 — Capteurs et actionneurs

Utiliser la salle simulée. Faire verbaliser :
grandeur, unité, fréquence, seuil, règle et action.

### Séance 3 — Événements et états

Manipuler la porte automatique. Exiger des scénarios de panne et une
priorité pour la sécurité.

### Séance 4 — Programmation

Utiliser d’abord `simuler_salle_connectee.py`, puis le générateur MicroPython.
Le fichier micro:bit est un prolongement facultatif.

### Séance 5 — IHM

Distinguer commande, accusé de réception et état réel. Tester au clavier,
sans dépendre uniquement de la couleur.

### Séance 6 — Communications

Faire publier des sujets MQTT fictifs. Relier débit, portée, énergie,
latence et fonctionnement local.

### Séance 7 — Sécurité

Partir d’un scénario et non d’une liste abstraite. Construire :
actif → menace → vulnérabilité → impact → mesure.

### Séance 8 — Projet

Le projet peut être virtuel ou matériel. Évaluer l’architecture, le
programme, l’IHM, la communication, la sécurité et les tests.

## Difficultés fréquentes

- capteur et actionneur inversés ;
- objet embarqué automatiquement qualifié de connecté ;
- règle de seuil sans hystérésis ;
- état confondu avec événement ;
- commande envoyée confondue avec état réel ;
- dépendance totale au cloud ;
- sécurité limitée au mot de passe ;
- collecte de présence trop détaillée.

## Différenciation

Aide :
- fournir la chaîne déjà partiellement remplie ;
- limiter l’automate à trois états ;
- modifier un script plutôt que l’écrire ;
- imposer une seule mesure et un seul actionneur.

Approfondissement :
- ajouter une hystérésis ;
- journaliser les mesures ;
- gérer une reconnexion ;
- comparer traitement local et distant ;
- utiliser deux micro:bits avec la radio ;
- ajouter une analyse de consommation.

## Cadre de sécurité matérielle

Ne jamais alimenter directement un moteur, une pompe ou un appareil secteur
depuis une broche. Utiliser un module de commande adapté et rester sur de
la très basse tension avec le matériel pédagogique.
