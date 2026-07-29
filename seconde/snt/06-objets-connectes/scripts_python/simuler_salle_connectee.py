from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Salle:
    temperature: float = 22.0
    luminosite: int = 250
    co2: int = 750
    presence: bool = True
    eclairage: bool = False
    ventilation: bool = False


def controler(salle: Salle) -> None:
    salle.eclairage = salle.presence and salle.luminosite < 300
    salle.ventilation = salle.co2 > 1200 or salle.temperature > 24.5


def afficher(salle: Salle) -> None:
    print("Température :", salle.temperature, "°C")
    print("Luminosité :", salle.luminosite, "lux")
    print("CO₂ :", salle.co2, "ppm")
    print("Présence :", salle.presence)
    print("Éclairage :", salle.eclairage)
    print("Ventilation :", salle.ventilation)


def main() -> None:
    salle = Salle()
    controler(salle)
    afficher(salle)

    print("\nAprès augmentation du CO₂ :")
    salle.co2 = 1450
    controler(salle)
    afficher(salle)


if __name__ == "__main__":
    main()
