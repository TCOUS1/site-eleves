from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageStat

DOSSIER = Path(__file__).resolve().parents[1]
ORIGINAL = DOSSIER / "images" / "scene_demo_originale.png"
JPEG_95 = DOSSIER / "images" / "scene_demo_qualite_95.jpg"
JPEG_30 = DOSSIER / "images" / "scene_demo_qualite_30.jpg"


def erreur_quadratique(
    reference: Image.Image,
    candidate: Image.Image,
) -> float:
    difference = ImageChops.difference(
        reference.convert("RGB"),
        candidate.convert("RGB"),
    )
    statistiques = ImageStat.Stat(difference)
    sommes = statistiques.sum2
    pixels = reference.width * reference.height * 3
    return sum(sommes) / pixels


def main() -> None:
    with Image.open(ORIGINAL) as reference:
        for fichier in [JPEG_95, JPEG_30]:
            with Image.open(fichier) as candidate:
                print(fichier.name)
                print("  taille :", fichier.stat().st_size, "octets")
                print(
                    "  erreur quadratique moyenne :",
                    round(
                        erreur_quadratique(
                            reference,
                            candidate,
                        ),
                        2,
                    ),
                )


if __name__ == "__main__":
    main()
