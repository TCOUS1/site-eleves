from __future__ import annotations

from pathlib import Path

from PIL import Image

DOSSIER = Path(__file__).resolve().parents[1]
SOURCE = DOSSIER / "images" / "scene_demo_originale.png"
SORTIE = DOSSIER / "resultats_python" / "scene_contours.png"


def luminance(pixel: tuple[int, int, int]) -> float:
    rouge, vert, bleu = pixel
    return (
        0.2126 * rouge
        + 0.7152 * vert
        + 0.0722 * bleu
    )


def contours(
    image: Image.Image,
    seuil: float = 55,
) -> Image.Image:
    source = image.convert("RGB")
    resultat = Image.new("RGB", source.size, "white")

    for y in range(source.height - 1):
        for x in range(source.width - 1):
            centre = luminance(source.getpixel((x, y)))
            droite = luminance(source.getpixel((x + 1, y)))
            dessous = luminance(source.getpixel((x, y + 1)))

            variation = abs(centre - droite) + abs(
                centre - dessous
            )
            valeur = 0 if variation > seuil else 255
            resultat.putpixel(
                (x, y),
                (valeur, valeur, valeur),
            )

    return resultat


def main() -> None:
    SORTIE.parent.mkdir(exist_ok=True)

    with Image.open(SOURCE) as image:
        contours(image).save(SORTIE)

    print("Image créée :", SORTIE)


if __name__ == "__main__":
    main()
