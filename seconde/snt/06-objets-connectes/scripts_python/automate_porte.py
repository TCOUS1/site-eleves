from __future__ import annotations

TRANSITIONS = {
    ("FERMEE", "presence_detectee"): "OUVERTURE",
    ("OUVERTURE", "fin_ouverture"): "OUVERTE",
    ("OUVERTE", "temporisation_terminee"): "FERMETURE",
    ("FERMETURE", "fin_fermeture"): "FERMEE",
    ("FERMETURE", "obstacle_detecte"): "OUVERTURE",
    ("OUVERTURE", "obstacle_detecte"): "BLOQUEE",
    ("BLOQUEE", "reinitialisation"): "FERMEE",
}


def transition(etat: str, evenement: str) -> str:
    return TRANSITIONS.get((etat, evenement), etat)


def main() -> None:
    etat = "FERMEE"
    scenario = [
        "presence_detectee",
        "fin_ouverture",
        "temporisation_terminee",
        "obstacle_detecte",
        "fin_ouverture",
        "temporisation_terminee",
        "fin_fermeture",
    ]

    print("État initial :", etat)

    for evenement in scenario:
        nouvel_etat = transition(etat, evenement)
        print(etat, "+", evenement, "→", nouvel_etat)
        etat = nouvel_etat


if __name__ == "__main__":
    main()
