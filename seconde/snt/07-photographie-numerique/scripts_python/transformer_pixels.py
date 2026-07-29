from __future__ import annotations

from pathlib import Path

from PIL import Image

DOSSIER = Path(__file__).resolve().parents[1]
SOURCE = DOSSIER / "images" / "scene_demo_originale.png"
SORTIE = DOSSIER / "resultats_python"


def negatif(image: Image.Image) -> Image.Image:
    source = image.convert("RGB")
    resultat = Image.new("RGB", source.size)

    for y in range(source.height):
        for x in range(source.width):
            rouge, vert, bleu = source.getpixel((x, y))
            resultat.putpixel(
                (x, y),
                (255 - rouge, 255 - vert, 255 - bleu),
            )

    return resultat


def niveaux_de_gris(image: Image.Image) -> Image.Image:
    source = image.convert("RGB")
    resultat = Image.new("RGB", source.size)

    for y in range(source.height):
        for x in range(source.width):
            rouge, vert, bleu = source.getpixel((x, y))
            gris = round(
                0.2126 * rouge
                + 0.7152 * vert
                + 0.0722 * bleu
            )
            resultat.putpixel((x, y), (gris, gris, gris))

    return resultat


def seuil(image: Image.Image, limite: int = 128) -> Image.Image:
    source = niveaux_de_gris(image)
    resultat = Image.new("RGB", source.size)

    for y in range(source.height):
        for x in range(source.width):
            gris = source.getpixel((x, y))[0]
            valeur = 255 if gris >= limite else 0
            resultat.putpixel((x, y), (valeur, valeur, valeur))

    return resultat


def main() -> None:
    SORTIE.mkdir(exist_ok=True)

    with Image.open(SOURCE) as image:
        negatif(image).save(SORTIE / "scene_negative.png")
        niveaux_de_gris(image).save(
            SORTIE / "scene_niveaux_de_gris.png"
        )
        seuil(image, 140).save(
            SORTIE / "scene_seuil_140.png"
        )

    print("Images créées dans :", SORTIE)


if __name__ == "__main__":
    main()
