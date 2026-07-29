from __future__ import annotations

from pathlib import Path

from PIL import ExifTags, Image

IMAGE = (
    Path(__file__).resolve().parents[1]
    / "images"
    / "photo_exif_demo.jpg"
)


def afficher_valeur(nom: str, valeur: object) -> None:
    if nom == "GPSInfo" and isinstance(valeur, dict):
        print("GPSInfo :")
        for cle, contenu in valeur.items():
            etiquette = ExifTags.GPSTAGS.get(cle, cle)
            print("  ", etiquette, ":", contenu)
    else:
        print(nom, ":", valeur)


def main() -> None:
    with Image.open(IMAGE) as image:
        exif = image.getexif()

        print("Fichier :", IMAGE.name)
        print("Dimensions :", image.size)
        print("Nombre de balises EXIF :", len(exif))

        for identifiant, valeur in sorted(exif.items()):
            nom = ExifTags.TAGS.get(
                identifiant,
                str(identifiant),
            )
            afficher_valeur(nom, valeur)


if __name__ == "__main__":
    main()
