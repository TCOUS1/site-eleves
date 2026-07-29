from __future__ import annotations

import csv
from pathlib import Path
from statistics import mean

FICHIER = (
    Path(__file__).resolve().parents[1]
    / "donnees"
    / "mesures_salle_connectee_demo.csv"
)


def charger() -> list[dict[str, str]]:
    with FICHIER.open(encoding="utf-8", newline="") as fichier:
        return list(csv.DictReader(fichier, delimiter=";"))


def main() -> None:
    mesures = charger()

    temperatures = [float(ligne["temperature_c"]) for ligne in mesures]
    co2 = [int(ligne["co2_ppm"]) for ligne in mesures]
    alertes = [
        ligne for ligne in mesures
        if int(ligne["co2_ppm"]) > 1200
    ]

    print("Nombre de mesures :", len(mesures))
    print("Température moyenne :", round(mean(temperatures), 1), "°C")
    print("CO₂ maximal :", max(co2), "ppm")
    print("Mesures avec alerte CO₂ :", len(alertes))

    for ligne in alertes[:5]:
        print("-", ligne["horodatage"], ligne["co2_ppm"], "ppm")


if __name__ == "__main__":
    main()
