(() => {
  "use strict";

  const byId = id => document.getElementById(id);
  const devices = [{"id_objet": "OC001", "nom": "Thermostat ÉcoSalle", "usage": "Régulation thermique", "capteurs": "température;présence", "actionneurs": "relais_chauffage;écran", "communications": "Wi-Fi", "traitement": "local+serveur", "donnees_personnelles": "présence;habitudes", "mise_a_jour": "automatique", "mot_de_passe_defaut": "non", "fin_support": "2030-12-31"}, {"id_objet": "OC002", "nom": "Bracelet Forme+", "usage": "Suivi d’activité", "capteurs": "accéléromètre;fréquence_cardiaque", "actionneurs": "vibreur;écran", "communications": "Bluetooth", "traitement": "smartphone+cloud", "donnees_personnelles": "santé;activité;sommeil", "mise_a_jour": "application", "mot_de_passe_defaut": "non", "fin_support": "2029-06-30"}, {"id_objet": "OC003", "nom": "Ampoule LumièreNet", "usage": "Éclairage", "capteurs": "aucun", "actionneurs": "LED", "communications": "Zigbee", "traitement": "passerelle", "donnees_personnelles": "horaires_utilisation", "mise_a_jour": "manuelle", "mot_de_passe_defaut": "non_applicable", "fin_support": "2028-03-31"}, {"id_objet": "OC004", "nom": "Caméra EntréeVision", "usage": "Surveillance", "capteurs": "caméra;microphone;mouvement", "actionneurs": "sirène;LED", "communications": "Wi-Fi", "traitement": "local+cloud", "donnees_personnelles": "image;voix;présence", "mise_a_jour": "irrégulière", "mot_de_passe_defaut": "oui", "fin_support": "2027-01-15"}, {"id_objet": "OC005", "nom": "Capteur Jardin", "usage": "Arrosage", "capteurs": "humidité_sol;température", "actionneurs": "électrovanne", "communications": "LoRaWAN", "traitement": "local+passerelle", "donnees_personnelles": "aucune_prévue", "mise_a_jour": "passerelle", "mot_de_passe_defaut": "non", "fin_support": "2031-09-30"}, {"id_objet": "OC006", "nom": "Badge AccèsCampus", "usage": "Contrôle d’accès", "capteurs": "lecteur_NFC", "actionneurs": "serrure;voyant;buzzer", "communications": "NFC;Ethernet", "traitement": "local+serveur", "donnees_personnelles": "identifiant;horodatage;accès", "mise_a_jour": "administrateur", "mot_de_passe_defaut": "non", "fin_support": "2032-12-31"}];
  const measurements = [{"horodatage": "2026-03-16T07:30", "temperature_c": 19.2, "luminosite_lux": 242, "co2_ppm": 430, "humidite_pct": 48.0, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T07:40", "temperature_c": 19.3, "luminosite_lux": 273, "co2_ppm": 442, "humidite_pct": 48.6, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T07:50", "temperature_c": 19.5, "luminosite_lux": 303, "co2_ppm": 454, "humidite_pct": 49.1, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T08:00", "temperature_c": 20.9, "luminosite_lux": 333, "co2_ppm": 1416, "humidite_pct": 49.6, "presence": "oui", "personnes_estimees": 25, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T08:10", "temperature_c": 20.9, "luminosite_lux": 362, "co2_ppm": 1352, "humidite_pct": 50.1, "presence": "oui", "personnes_estimees": 23, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T08:20", "temperature_c": 21.2, "luminosite_lux": 391, "co2_ppm": 1380, "humidite_pct": 50.6, "presence": "oui", "personnes_estimees": 25, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T08:30", "temperature_c": 21.4, "luminosite_lux": 420, "co2_ppm": 1468, "humidite_pct": 51.1, "presence": "oui", "personnes_estimees": 27, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T08:40", "temperature_c": 21.5, "luminosite_lux": 447, "co2_ppm": 1518, "humidite_pct": 51.5, "presence": "oui", "personnes_estimees": 28, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T08:50", "temperature_c": 21.5, "luminosite_lux": 475, "co2_ppm": 1416, "humidite_pct": 51.9, "presence": "oui", "personnes_estimees": 25, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T09:00", "temperature_c": 21.6, "luminosite_lux": 501, "co2_ppm": 1466, "humidite_pct": 52.2, "presence": "oui", "personnes_estimees": 26, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T09:10", "temperature_c": 21.7, "luminosite_lux": 527, "co2_ppm": 1456, "humidite_pct": 52.5, "presence": "oui", "personnes_estimees": 27, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T09:20", "temperature_c": 21.7, "luminosite_lux": 551, "co2_ppm": 1468, "humidite_pct": 52.7, "presence": "oui", "personnes_estimees": 27, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T09:30", "temperature_c": 21.5, "luminosite_lux": 575, "co2_ppm": 1328, "humidite_pct": 52.9, "presence": "oui", "personnes_estimees": 23, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T09:40", "temperature_c": 21.5, "luminosite_lux": 598, "co2_ppm": 1340, "humidite_pct": 53.0, "presence": "oui", "personnes_estimees": 23, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T09:50", "temperature_c": 21.5, "luminosite_lux": 620, "co2_ppm": 1314, "humidite_pct": 53.0, "presence": "oui", "personnes_estimees": 22, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T10:00", "temperature_c": 21.4, "luminosite_lux": 641, "co2_ppm": 1266, "humidite_pct": 53.0, "presence": "oui", "personnes_estimees": 22, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T10:10", "temperature_c": 21.2, "luminosite_lux": 660, "co2_ppm": 1126, "humidite_pct": 52.9, "presence": "oui", "personnes_estimees": 18, "fenetre": "ouverte", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T10:20", "temperature_c": 21.1, "luminosite_lux": 679, "co2_ppm": 1100, "humidite_pct": 52.7, "presence": "oui", "personnes_estimees": 17, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T10:30", "temperature_c": 21.0, "luminosite_lux": 696, "co2_ppm": 1112, "humidite_pct": 52.5, "presence": "oui", "personnes_estimees": 17, "fenetre": "ouverte", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T10:40", "temperature_c": 20.9, "luminosite_lux": 712, "co2_ppm": 1124, "humidite_pct": 52.3, "presence": "oui", "personnes_estimees": 17, "fenetre": "ouverte", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T10:50", "temperature_c": 20.5, "luminosite_lux": 727, "co2_ppm": 886, "humidite_pct": 52.0, "presence": "oui", "personnes_estimees": 12, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T11:00", "temperature_c": 20.4, "luminosite_lux": 741, "co2_ppm": 936, "humidite_pct": 51.6, "presence": "oui", "personnes_estimees": 13, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T11:10", "temperature_c": 20.3, "luminosite_lux": 753, "co2_ppm": 948, "humidite_pct": 51.2, "presence": "oui", "personnes_estimees": 13, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T11:20", "temperature_c": 20.2, "luminosite_lux": 764, "co2_ppm": 998, "humidite_pct": 50.8, "presence": "oui", "personnes_estimees": 14, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T11:30", "temperature_c": 19.9, "luminosite_lux": 773, "co2_ppm": 896, "humidite_pct": 50.3, "presence": "oui", "personnes_estimees": 11, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T11:40", "temperature_c": 19.8, "luminosite_lux": 781, "co2_ppm": 886, "humidite_pct": 49.8, "presence": "oui", "personnes_estimees": 12, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T11:50", "temperature_c": 19.7, "luminosite_lux": 788, "co2_ppm": 936, "humidite_pct": 49.3, "presence": "oui", "personnes_estimees": 13, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T12:00", "temperature_c": 19.7, "luminosite_lux": 793, "co2_ppm": 1024, "humidite_pct": 48.7, "presence": "oui", "personnes_estimees": 15, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T12:10", "temperature_c": 18.8, "luminosite_lux": 797, "co2_ppm": 466, "humidite_pct": 48.2, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T12:20", "temperature_c": 18.6, "luminosite_lux": 799, "co2_ppm": 478, "humidite_pct": 47.6, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T12:30", "temperature_c": 18.5, "luminosite_lux": 800, "co2_ppm": 430, "humidite_pct": 47.0, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T12:40", "temperature_c": 18.4, "luminosite_lux": 799, "co2_ppm": 442, "humidite_pct": 46.5, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T12:50", "temperature_c": 18.3, "luminosite_lux": 797, "co2_ppm": 454, "humidite_pct": 46.0, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T13:00", "temperature_c": 18.2, "luminosite_lux": 793, "co2_ppm": 466, "humidite_pct": 45.5, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T13:10", "temperature_c": 18.1, "luminosite_lux": 788, "co2_ppm": 478, "humidite_pct": 45.0, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T13:20", "temperature_c": 18.1, "luminosite_lux": 781, "co2_ppm": 430, "humidite_pct": 44.6, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T13:30", "temperature_c": 19.2, "luminosite_lux": 773, "co2_ppm": 1354, "humidite_pct": 44.2, "presence": "oui", "personnes_estimees": 24, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T13:40", "temperature_c": 19.3, "luminosite_lux": 764, "co2_ppm": 1442, "humidite_pct": 43.9, "presence": "oui", "personnes_estimees": 26, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T13:50", "temperature_c": 19.4, "luminosite_lux": 753, "co2_ppm": 1492, "humidite_pct": 43.6, "presence": "oui", "personnes_estimees": 27, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T14:00", "temperature_c": 19.4, "luminosite_lux": 741, "co2_ppm": 1542, "humidite_pct": 43.4, "presence": "oui", "personnes_estimees": 28, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T14:10", "temperature_c": 19.3, "luminosite_lux": 727, "co2_ppm": 1380, "humidite_pct": 43.2, "presence": "oui", "personnes_estimees": 25, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T14:20", "temperature_c": 19.4, "luminosite_lux": 712, "co2_ppm": 1430, "humidite_pct": 43.1, "presence": "oui", "personnes_estimees": 26, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T14:30", "temperature_c": 19.5, "luminosite_lux": 696, "co2_ppm": 1442, "humidite_pct": 43.0, "presence": "oui", "personnes_estimees": 26, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T14:40", "temperature_c": 19.6, "luminosite_lux": 679, "co2_ppm": 1454, "humidite_pct": 43.0, "presence": "oui", "personnes_estimees": 26, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T14:50", "temperature_c": 19.5, "luminosite_lux": 660, "co2_ppm": 1314, "humidite_pct": 43.1, "presence": "oui", "personnes_estimees": 22, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T15:00", "temperature_c": 19.6, "luminosite_lux": 641, "co2_ppm": 1266, "humidite_pct": 43.2, "presence": "oui", "personnes_estimees": 22, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T15:10", "temperature_c": 19.6, "luminosite_lux": 620, "co2_ppm": 1240, "humidite_pct": 43.4, "presence": "oui", "personnes_estimees": 21, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T15:20", "temperature_c": 19.8, "luminosite_lux": 598, "co2_ppm": 1252, "humidite_pct": 43.6, "presence": "oui", "personnes_estimees": 21, "fenetre": "ouverte", "ventilation": "active", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T15:30", "temperature_c": 19.7, "luminosite_lux": 575, "co2_ppm": 1112, "humidite_pct": 43.9, "presence": "oui", "personnes_estimees": 17, "fenetre": "ouverte", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T15:40", "temperature_c": 19.9, "luminosite_lux": 551, "co2_ppm": 1124, "humidite_pct": 44.3, "presence": "oui", "personnes_estimees": 17, "fenetre": "ouverte", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T15:50", "temperature_c": 20.0, "luminosite_lux": 527, "co2_ppm": 1038, "humidite_pct": 44.7, "presence": "oui", "personnes_estimees": 16, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T16:00", "temperature_c": 20.1, "luminosite_lux": 501, "co2_ppm": 1050, "humidite_pct": 45.1, "presence": "oui", "personnes_estimees": 16, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T16:10", "temperature_c": 20.1, "luminosite_lux": 474, "co2_ppm": 910, "humidite_pct": 45.6, "presence": "oui", "personnes_estimees": 12, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T16:20", "temperature_c": 20.2, "luminosite_lux": 447, "co2_ppm": 922, "humidite_pct": 46.1, "presence": "oui", "personnes_estimees": 12, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T16:30", "temperature_c": 20.4, "luminosite_lux": 420, "co2_ppm": 972, "humidite_pct": 46.6, "presence": "oui", "personnes_estimees": 13, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T16:40", "temperature_c": 20.6, "luminosite_lux": 391, "co2_ppm": 962, "humidite_pct": 47.1, "presence": "oui", "personnes_estimees": 14, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T16:50", "temperature_c": 20.5, "luminosite_lux": 362, "co2_ppm": 860, "humidite_pct": 47.7, "presence": "oui", "personnes_estimees": 11, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T17:00", "temperature_c": 20.7, "luminosite_lux": 333, "co2_ppm": 910, "humidite_pct": 48.3, "presence": "oui", "personnes_estimees": 12, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T17:10", "temperature_c": 20.2, "luminosite_lux": 303, "co2_ppm": 466, "humidite_pct": 48.8, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}, {"horodatage": "2026-03-16T17:20", "temperature_c": 20.3, "luminosite_lux": 273, "co2_ppm": 478, "humidite_pct": 49.3, "presence": "non", "personnes_estimees": 0, "fenetre": "fermée", "ventilation": "inactive", "eclairage": "éteinte"}];

  // ---------------------------------------------------------------
  // Classements
  // ---------------------------------------------------------------
  const componentCases = [
    ["Thermistance mesurant la température", "capteur"],
    ["Relais commandant un radiateur", "actionneur"],
    ["Bouton permettant de choisir le mode", "ihm"],
    ["Microcontrôleur exécutant les règles", "traitement"],
    ["Antenne Wi-Fi échangeant des messages", "communication"],
    ["Écran affichant une consigne et recevant un toucher", "ihm"],
  ];

  const componentList = byId("component-classifier");

  if (componentList) {
    componentCases.forEach(([label, expected]) => {
      const item = document.createElement("li");
      item.className = "iot-classifier-item";
      item.dataset.expected = expected;
      item.innerHTML = `
        <strong>${label}</strong>
        <div class="iot-actions">
          <button type="button" class="iot-choice"
                  data-iot-choice="capteur">Capteur</button>
          <button type="button" class="iot-choice"
                  data-iot-choice="traitement">Traitement</button>
          <button type="button" class="iot-choice"
                  data-iot-choice="actionneur">Actionneur</button>
          <button type="button" class="iot-choice"
                  data-iot-choice="ihm">IHM</button>
          <button type="button" class="iot-choice"
                  data-iot-choice="communication">Communication</button>
        </div>
        <p class="iot-feedback"></p>`;
      componentList.appendChild(item);
    });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-iot-choice]");
    if (!button) return;

    const item = button.closest("[data-expected]");
    if (!item) return;

    const good = button.dataset.iotChoice === item.dataset.expected;
    item.querySelectorAll("[data-iot-choice]").forEach(candidate => {
      candidate.classList.remove("good", "bad");
    });
    button.classList.add(good ? "good" : "bad");

    const feedback = item.querySelector(".iot-feedback");
    if (feedback) {
      feedback.textContent = good
        ? "Classement correct."
        : `À revoir : la fonction attendue est « ${item.dataset.expected} ».`;
    }
  });

  // ---------------------------------------------------------------
  // Salle connectée : acquisition, décision, action
  // ---------------------------------------------------------------
  const roomState = {
    temperature: 22,
    light: 220,
    co2: 850,
    presence: true,
    lightThreshold: 300,
    tempThreshold: 24.5,
    co2Threshold: 1200,
    automatic: true,
    lamp: false,
    fan: false,
    alarm: false,
  };

  const roomLog = [];

  function pushRoomLog(message) {
    roomLog.unshift({
      time: new Date().toLocaleTimeString("fr-FR"),
      message,
      temperature: roomState.temperature,
      light: roomState.light,
      co2: roomState.co2,
      lamp: roomState.lamp,
      fan: roomState.fan,
    });

    if (roomLog.length > 30) roomLog.length = 30;
  }

  function applyAutomaticRules() {
    if (!roomState.automatic) return;

    roomState.lamp =
      roomState.presence &&
      roomState.light < roomState.lightThreshold;

    roomState.fan =
      roomState.co2 > roomState.co2Threshold ||
      roomState.temperature > roomState.tempThreshold;

    roomState.alarm =
      roomState.temperature > 32 ||
      roomState.co2 > 2000;
  }

  function updateRoom() {
    roomState.temperature = Number(byId("sensor-temperature")?.value || 22);
    roomState.light = Number(byId("sensor-light")?.value || 220);
    roomState.co2 = Number(byId("sensor-co2")?.value || 850);
    roomState.presence = byId("sensor-presence")?.checked || false;

    roomState.lightThreshold =
      Number(byId("threshold-light")?.value || 300);
    roomState.tempThreshold =
      Number(byId("threshold-temperature")?.value || 24.5);
    roomState.co2Threshold =
      Number(byId("threshold-co2")?.value || 1200);

    roomState.automatic =
      (byId("room-mode")?.value || "auto") === "auto";

    applyAutomaticRules();

    byId("room-temperature").textContent =
      `${roomState.temperature.toFixed(1)} °C`;
    byId("room-light").textContent =
      `${roomState.light} lux`;
    byId("room-co2").textContent =
      `${roomState.co2} ppm`;
    byId("room-presence").textContent =
      roomState.presence ? "présence" : "vide";
    byId("room-lamp-state").textContent =
      roomState.lamp ? "allumé" : "éteint";
    byId("room-fan-state").textContent =
      roomState.fan ? "active" : "inactive";
    byId("room-alarm-state").textContent =
      roomState.alarm ? "alerte" : "normale";

    const lamp = byId("room-lamp-svg");
    lamp?.classList.toggle("iot-actuator-on", roomState.lamp);
    lamp?.classList.toggle("iot-actuator-off", !roomState.lamp);

    const fan = byId("room-fan-svg");
    fan?.classList.toggle("iot-fan-running", roomState.fan);

    const alarm = byId("room-alarm-svg");
    alarm?.classList.toggle("iot-actuator-on", roomState.alarm);
    alarm?.classList.toggle("iot-actuator-off", !roomState.alarm);

    const output = byId("room-output");
    if (output) {
      output.textContent =
`Acquisition
- température : ${roomState.temperature.toFixed(1)} °C
- luminosité : ${roomState.light} lux
- CO₂ : ${roomState.co2} ppm
- présence : ${roomState.presence ? "oui" : "non"}

Décision
- mode : ${roomState.automatic ? "automatique" : "manuel"}
- éclairage si présence ET lumière < ${roomState.lightThreshold} lux
- ventilation si CO₂ > ${roomState.co2Threshold} ppm
  OU température > ${roomState.tempThreshold.toFixed(1)} °C

Actions
- lampe : ${roomState.lamp ? "ON" : "OFF"}
- ventilation : ${roomState.fan ? "ON" : "OFF"}
- alarme : ${roomState.alarm ? "ON" : "OFF"}`;
    }

    syncDashboard();
  }

  [
    "sensor-temperature",
    "sensor-light",
    "sensor-co2",
    "sensor-presence",
    "threshold-light",
    "threshold-temperature",
    "threshold-co2",
    "room-mode",
  ].forEach(id => {
    byId(id)?.addEventListener("input", updateRoom);
    byId(id)?.addEventListener("change", updateRoom);
  });

  byId("manual-lamp")?.addEventListener("click", () => {
    if (roomState.automatic) return;
    roomState.lamp = !roomState.lamp;
    pushRoomLog(`Commande manuelle lampe : ${roomState.lamp}`);
    updateRoom();
  });

  byId("manual-fan")?.addEventListener("click", () => {
    if (roomState.automatic) return;
    roomState.fan = !roomState.fan;
    pushRoomLog(`Commande manuelle ventilation : ${roomState.fan}`);
    updateRoom();
  });

  updateRoom();

  // ---------------------------------------------------------------
  // Automate de porte
  // ---------------------------------------------------------------
  const transitions = {
    "FERMEE|presence_detectee": "OUVERTURE",
    "OUVERTURE|fin_ouverture": "OUVERTE",
    "OUVERTE|temporisation_terminee": "FERMETURE",
    "FERMETURE|fin_fermeture": "FERMEE",
    "FERMETURE|obstacle_detecte": "OUVERTURE",
    "OUVERTURE|obstacle_detecte": "BLOQUEE",
    "BLOQUEE|reinitialisation": "FERMEE",
  };

  let doorState = "FERMEE";
  const doorHistory = [];

  function renderDoorState(eventName = "initialisation") {
    document.querySelectorAll("[data-door-state]").forEach(element => {
      element.classList.toggle(
        "active",
        element.dataset.doorState === doorState
      );
    });

    byId("door-current").textContent = doorState;
    byId("door-event").textContent = eventName;
    byId("door-motor").textContent =
      doorState === "OUVERTURE"
        ? "sens ouverture"
        : doorState === "FERMETURE"
          ? "sens fermeture"
          : "arrêt";

    byId("door-safety").textContent =
      doorState === "BLOQUEE" ? "défaut" : "normale";

    byId("door-log").textContent = doorHistory
      .map(item => `${item.from} + ${item.event} → ${item.to}`)
      .join("\n");
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-door-event]");
    if (!button) return;

    const eventName = button.dataset.doorEvent;
    const from = doorState;
    const next = transitions[`${doorState}|${eventName}`] || doorState;

    doorState = next;
    doorHistory.unshift({from, event: eventName, to: next});
    doorHistory.splice(12);

    renderDoorState(eventName);
  });

  renderDoorState();

  // ---------------------------------------------------------------
  // Générateur de programme
  // ---------------------------------------------------------------
  function generateProgram() {
    const variable =
      byId("program-sensor")?.value || "temperature";
    const operator =
      byId("program-operator")?.value || ">";
    const threshold =
      Number(byId("program-threshold")?.value || 24);
    const actuator =
      byId("program-actuator")?.value || "ventilation";
    const interval =
      Number(byId("program-interval")?.value || 2000);

    const readLine = {
      temperature: "mesure = temperature()",
      luminosite: "mesure = display.read_light_level()",
      bouton: "mesure = button_a.is_pressed()",
    }[variable];

    const comparison =
      variable === "bouton"
        ? "if mesure:"
        : `if mesure ${operator} ${threshold}:`;

    const onMessage = actuator.toUpperCase() + ":ON";
    const offMessage = actuator.toUpperCase() + ":OFF";

    const code =
`from microbit import *
import radio

radio.config(group=23)
radio.on()

while True:
    ${readLine}

    ${comparison}
        radio.send("${onMessage}")
        display.show(Image.YES)
    else:
        radio.send("${offMessage}")
        display.show(Image.NO)

    radio.send("${variable.toUpperCase()}:" + str(mesure))
    sleep(${interval})`;

    byId("program-code").textContent = code;

    const simulatedValue =
      variable === "temperature"
        ? roomState.temperature
        : variable === "luminosite"
          ? roomState.light
          : roomState.presence;

    let condition;

    if (variable === "bouton") {
      condition = Boolean(simulatedValue);
    } else {
      condition = operator === ">"
        ? simulatedValue > threshold
        : simulatedValue < threshold;
    }

    byId("program-result").textContent =
`Entrée simulée : ${simulatedValue}
Condition : ${condition ? "vraie" : "fausse"}
Commande envoyée : ${actuator.toUpperCase()}:${condition ? "ON" : "OFF"}

Le programme est généré pour la micro:bit.
Le laboratoire n'exécute pas du code Python arbitraire.`;
  }

  [
    "program-sensor",
    "program-operator",
    "program-threshold",
    "program-actuator",
    "program-interval",
  ].forEach(id => {
    byId(id)?.addEventListener("input", generateProgram);
    byId(id)?.addEventListener("change", generateProgram);
  });

  byId("program-run")?.addEventListener("click", generateProgram);
  generateProgram();

  // ---------------------------------------------------------------
  // IHM
  // ---------------------------------------------------------------
  function syncDashboard() {
    if (!byId("dashboard-temperature")) return;

    byId("dashboard-temperature").textContent =
      `${roomState.temperature.toFixed(1)} °C`;
    byId("dashboard-light").textContent =
      `${roomState.light} lux`;
    byId("dashboard-co2").textContent =
      `${roomState.co2} ppm`;
    byId("dashboard-presence").textContent =
      roomState.presence ? "occupée" : "vide";
    byId("dashboard-lamp").textContent =
      roomState.lamp ? "ON" : "OFF";
    byId("dashboard-fan").textContent =
      roomState.fan ? "ON" : "OFF";

    const summary = [];

    if (roomState.co2 > roomState.co2Threshold) {
      summary.push("Aérer ou activer la ventilation.");
    }
    if (roomState.temperature > roomState.tempThreshold) {
      summary.push("Température supérieure à la consigne.");
    }
    if (!roomState.presence && roomState.lamp) {
      summary.push("Éclairage inutile dans une salle vide.");
    }
    if (!summary.length) {
      summary.push("Situation conforme aux règles définies.");
    }

    byId("dashboard-advice").textContent = summary.join(" ");
  }

  byId("dashboard-auto")?.addEventListener("change", event => {
    byId("room-mode").value = event.target.checked ? "auto" : "manual";
    updateRoom();
  });

  byId("dashboard-lamp-button")?.addEventListener("click", () => {
    byId("room-mode").value = "manual";
    if (byId("dashboard-auto")) byId("dashboard-auto").checked = false;
    roomState.automatic = false;
    roomState.lamp = !roomState.lamp;
    pushRoomLog(`IHM : lampe ${roomState.lamp ? "ON" : "OFF"}`);
    updateRoom();
  });

  byId("dashboard-fan-button")?.addEventListener("click", () => {
    byId("room-mode").value = "manual";
    if (byId("dashboard-auto")) byId("dashboard-auto").checked = false;
    roomState.automatic = false;
    roomState.fan = !roomState.fan;
    pushRoomLog(`IHM : ventilation ${roomState.fan ? "ON" : "OFF"}`);
    updateRoom();
  });

  syncDashboard();

  // ---------------------------------------------------------------
  // MQTT : publish / subscribe
  // ---------------------------------------------------------------
  const subscribers = [
    {name: "Tableau de bord", filter: "lycee/salle201/#"},
    {name: "Contrôleur", filter: "lycee/salle201/commande/+"},
    {name: "Journal énergie", filter: "lycee/+/etat/+"},
  ];

  const brokerMessages = [];

  function topicMatches(filter, topic) {
    const f = filter.split("/");
    const t = topic.split("/");

    for (let index = 0; index < f.length; index += 1) {
      if (f[index] === "#") return true;
      if (t[index] === undefined) return false;
      if (f[index] !== "+" && f[index] !== t[index]) return false;
    }

    return f.length === t.length;
  }

  function publishMessage() {
    const client =
      byId("mqtt-client")?.value.trim() || "objet-salle";
    const topic =
      byId("mqtt-topic")?.value.trim() ||
      "lycee/salle201/temperature";
    const payload =
      byId("mqtt-payload")?.value.trim() || "22.4";

    const delivered = subscribers
      .filter(subscriber => topicMatches(subscriber.filter, topic))
      .map(subscriber => subscriber.name);

    brokerMessages.unshift({
      time: new Date().toLocaleTimeString("fr-FR"),
      client,
      topic,
      payload,
      delivered,
    });

    brokerMessages.splice(20);
    renderBrokerMessages();
  }

  function renderBrokerMessages() {
    const list = byId("mqtt-message-list");
    if (!list) return;

    list.innerHTML = "";

    brokerMessages.forEach(message => {
      const item = document.createElement("li");
      item.className = "iot-message";
      item.innerHTML = `
        <strong>${message.topic}</strong>
        <span>${message.payload}</span>
        <small>
          ${message.time} · client ${message.client}<br>
          livré à : ${message.delivered.join(", ") || "aucun abonné"}
        </small>`;
      list.appendChild(item);
    });

    byId("mqtt-output").textContent =
`Abonnements actifs
${subscribers.map(item => `- ${item.name} : ${item.filter}`).join("\n")}

Rappels
- le producteur publie sur un sujet ;
- le courtier reçoit et distribue ;
- les abonnés reçoivent les sujets compatibles ;
- « + » remplace un niveau ;
- « # » remplace la fin du sujet.

Cette simulation n'établ établit aucune connexion réseau réelle.`
      .replace("n'établ établit", "n'établit");
  }

  byId("mqtt-publish")?.addEventListener("click", publishMessage);
  publishMessage();

  // ---------------------------------------------------------------
  // Audit de sécurité
  // ---------------------------------------------------------------
  function updateSecurityAudit() {
    const settings = {
      uniquePassword:
        byId("security-password")?.checked || false,
      updates:
        byId("security-updates")?.checked || false,
      localMode:
        byId("security-local")?.checked || false,
      encrypted:
        byId("security-encryption")?.checked || false,
      minimalData:
        byId("security-minimization")?.checked || false,
      networkIsolation:
        byId("security-network")?.checked || false,
      reset:
        byId("security-reset")?.checked || false,
      unsupported:
        byId("security-unsupported")?.checked || false,
    };

    let score = 0;
    if (settings.uniquePassword) score += 2;
    if (settings.updates) score += 2;
    if (settings.localMode) score += 1;
    if (settings.encrypted) score += 1;
    if (settings.minimalData) score += 1;
    if (settings.networkIsolation) score += 1;
    if (settings.reset) score += 1;
    if (!settings.unsupported) score += 1;

    const risks = [];
    if (!settings.uniquePassword) risks.push("identifiants faibles ou partagés");
    if (!settings.updates) risks.push("vulnérabilités non corrigées");
    if (!settings.encrypted) risks.push("messages potentiellement lisibles ou modifiables");
    if (!settings.minimalData) risks.push("collecte excessive");
    if (!settings.networkIsolation) risks.push("propagation vers d’autres appareils");
    if (!settings.reset) risks.push("données restantes lors d’une revente");
    if (settings.unsupported) risks.push("objet hors support");

    byId("security-score").textContent = `${score}/10`;
    byId("security-level").textContent =
      score >= 8 ? "robuste" : score >= 5 ? "à améliorer" : "fragile";

    byId("security-output").textContent =
`Diagnostic pédagogique

Score : ${score}/10
Risques principaux :
${risks.length ? risks.map(risk => `- ${risk}`).join("\n") : "- aucun risque majeur repéré dans cette grille"}

Plan prioritaire :
1. changer les identifiants par défaut ;
2. installer les mises à jour ;
3. limiter les données et les accès distants ;
4. séparer les équipements critiques ;
5. prévoir le mode local et la fin de support ;
6. effacer et réinitialiser avant changement d’utilisateur.

Un score ne remplace pas une analyse de risques complète.`;
  }

  [
    "security-password",
    "security-updates",
    "security-local",
    "security-encryption",
    "security-minimization",
    "security-network",
    "security-reset",
    "security-unsupported",
  ].forEach(id => {
    byId(id)?.addEventListener("change", updateSecurityAudit);
  });

  updateSecurityAudit();

  // ---------------------------------------------------------------
  // Données historiques et export
  // ---------------------------------------------------------------
  function renderMeasurementTable() {
    const body = byId("measurement-table-body");
    if (!body) return;

    measurements.slice(0, 12).forEach(row => {
      const tr = document.createElement("tr");
      [
        row.horodatage,
        row.temperature_c,
        row.luminosite_lux,
        row.co2_ppm,
        row.presence,
        row.ventilation,
        row.eclairage,
      ].forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function exportRoomLog() {
    const rows = [
      [
        "heure",
        "temperature_c",
        "luminosite_lux",
        "co2_ppm",
        "lampe",
        "ventilation",
        "message",
      ],
      ...roomLog.map(item => [
        item.time,
        item.temperature,
        item.light,
        item.co2,
        item.lamp,
        item.fan,
        item.message,
      ]),
    ];

    const text = rows
      .map(row =>
        row.map(value => {
          const string = String(value);
          return /[;"\n]/.test(string)
            ? `"${string.replace(/"/g, '""')}"`
            : string;
        }).join(";")
      )
      .join("\n");

    const blob = new Blob([text], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "journal_salle_connectee.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  byId("room-log-add")?.addEventListener("click", () => {
    pushRoomLog("Mesure enregistrée manuellement");
    byId("final-log").textContent = roomLog
      .map(item =>
        `${item.time} · T=${item.temperature} · CO₂=${item.co2} · ${item.message}`
      )
      .join("\n");
  });

  byId("room-log-export")?.addEventListener("click", exportRoomLog);
  renderMeasurementTable();

  // ---------------------------------------------------------------
  // Texte à compléter
  // ---------------------------------------------------------------
  byId("iot-fill-check")?.addEventListener("click", () => {
    const expected = {
      "iot-fill-1": "capteur",
      "iot-fill-2": "actionneur",
      "iot-fill-3": "microcontrôleur",
      "iot-fill-4": "ihm",
      "iot-fill-5": "événement",
    };

    let correct = 0;

    Object.entries(expected).forEach(([id, answer]) => {
      const input = byId(id);
      if (!input) return;

      const value = input.value
        .trim()
        .toLowerCase()
        .replace("microcontroleur", "microcontrôleur")
        .replace("evenement", "événement");

      const good = value === answer;
      input.style.outline = good
        ? "3px solid #16824a"
        : "3px solid #b9313b";

      if (good) correct += 1;
    });

    byId("iot-fill-feedback").textContent =
      `${correct} réponse(s) correcte(s) sur 5.`;
  });
})();
