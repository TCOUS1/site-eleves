from __future__ import annotations

from pathlib import Path
from statistics import mean

from PIL import Image

IMAGE = (
    Path(__file__).resolve().parents[1]
    / "images"
    / "scene_demo_originale.png"
)


def main() -> None:
    with Image.open(IMAGE) as image:
        rgb = image.convert("RGB")
        pixels = list(rgb.getdata())

        rouge = mean(pixel[0] for pixel in pixels)
        vert = mean(pixel[1] for pixel in pixels)
        bleu = mean(pixel[2] for pixel in pixels)

        print("Fichier :", IMAGE.name)
        print("Format :", image.format)
        print("Dimensions :", image.width, "×", image.height)
        print("Définition :", image.width * image.height, "pixels")
        print("Mode :", image.mode)
        print(
            "RVB moyen :",
            round(rouge, 1),
            round(vert, 1),
            round(bleu, 1),
        )


if __name__ == "__main__":
    main()
