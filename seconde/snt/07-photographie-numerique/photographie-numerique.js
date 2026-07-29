(() => {
  "use strict";

  const byId = id => document.getElementById(id);
  const pixelData = {"largeur": 16, "hauteur": 12, "mode": "RVB 8 bits par composante", "pixels": [[[235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244]], [[235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [255, 215, 70], [235, 240, 244], [235, 240, 244]], [[235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [174, 67, 61], [235, 240, 244], [235, 240, 244], [235, 240, 244], [255, 215, 70], [255, 215, 70], [255, 215, 70], [235, 240, 244]], [[235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [174, 67, 61], [174, 67, 61], [174, 67, 61], [235, 240, 244], [235, 240, 244], [235, 240, 244], [255, 215, 70], [235, 240, 244], [235, 240, 244]], [[235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244]], [[235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [174, 67, 61], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244]], [[235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [236, 190, 132], [236, 190, 132], [236, 190, 132], [236, 190, 132], [236, 190, 132], [236, 190, 132], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244], [235, 240, 244]], [[47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [236, 190, 132], [236, 190, 132], [84, 52, 35], [84, 52, 35], [236, 190, 132], [236, 190, 132], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72]], [[47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [236, 190, 132], [236, 190, 132], [84, 52, 35], [84, 52, 35], [236, 190, 132], [236, 190, 132], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72]], [[47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [236, 190, 132], [236, 190, 132], [84, 52, 35], [84, 52, 35], [236, 190, 132], [236, 190, 132], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72]], [[47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72]], [[47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72], [47, 137, 72]]]};
  const metadataDemo = {"fichier": "photo_exif_demo.jpg", "dimensions": [720, 480], "appareil": "Appareil pédagogique PX-2", "date_prise_de_vue": "2026-03-16T10:24:32+01:00", "temps_exposition": "1/125 s", "ouverture": "f/2,8", "sensibilite_iso": 200, "distance_focale": "35 mm", "auteur": "Classe fictive de seconde", "copyright": "Image originale pédagogique", "gps_fictif": {"latitude": 48.8566, "longitude": 2.3522, "avertissement": "Coordonnées fictives ajoutées dans ce fichier JSON pour l’activité."}};

  // ---------------------------------------------------------------
  // Utilitaires graphiques
  // ---------------------------------------------------------------
  function drawScene(ctx, width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * .55);
    sky.addColorStop(0, "rgb(48,126,205)");
    sky.addColorStop(1, "rgb(158,216,240)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height * .55);

    const ground = ctx.createLinearGradient(
      0,
      height * .55,
      0,
      height
    );
    ground.addColorStop(0, "rgb(82,154,82)");
    ground.addColorStop(1, "rgb(58,109,62)");
    ctx.fillStyle = ground;
    ctx.fillRect(0, height * .55, width, height * .45);

    ctx.fillStyle = "rgb(255,221,92)";
    ctx.beginPath();
    ctx.arc(width * .82, height * .17, width * .06, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgb(239,246,250)";
    [
      [width * .14, height * .17, width * .065],
      [width * .21, height * .15, width * .07],
      [width * .27, height * .18, width * .065],
    ].forEach(([x, y, radius]) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgb(94,107,135)";
    ctx.beginPath();
    ctx.moveTo(0, height * .57);
    ctx.lineTo(width * .21, height * .28);
    ctx.lineTo(width * .40, height * .57);
    ctx.fill();

    ctx.fillStyle = "rgb(78,92,125)";
    ctx.beginPath();
    ctx.moveTo(width * .25, height * .57);
    ctx.lineTo(width * .50, height * .25);
    ctx.lineTo(width * .74, height * .57);
    ctx.fill();

    ctx.fillStyle = "rgb(234,198,151)";
    ctx.fillRect(
      width * .42,
      height * .57,
      width * .28,
      height * .29
    );

    ctx.fillStyle = "rgb(158,63,58)";
    ctx.beginPath();
    ctx.moveTo(width * .38, height * .58);
    ctx.lineTo(width * .56, height * .40);
    ctx.lineTo(width * .74, height * .58);
    ctx.fill();

    ctx.fillStyle = "rgb(106,69,48)";
    ctx.fillRect(
      width * .53,
      height * .70,
      width * .07,
      height * .16
    );

    ctx.fillStyle = "rgb(119,196,231)";
    ctx.fillRect(
      width * .45,
      height * .65,
      width * .06,
      height * .09
    );
    ctx.fillRect(
      width * .63,
      height * .65,
      width * .055,
      height * .09
    );

    function tree(x, y, scale) {
      ctx.fillStyle = "rgb(98,65,42)";
      ctx.fillRect(x - 7 * scale, y, 14 * scale, 58 * scale);
      ctx.fillStyle = "rgb(42,121,60)";
      ctx.beginPath();
      ctx.arc(x, y - 35 * scale, 38 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgb(51,142,69)";
      ctx.beginPath();
      ctx.arc(
        x + 5 * scale,
        y - 70 * scale,
        28 * scale,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    tree(width * .12, height * .70, .85);
    tree(width * .85, height * .70, 1.0);

    ctx.fillStyle = "rgb(224,59,71)";
    ctx.beginPath();
    ctx.arc(width * .29, height * .82, width * .035, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgb(44,100,211)";
    ctx.fillRect(
      width * .77,
      height * .76,
      width * .075,
      height * .11
    );
  }

  function clamp(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
  }

  function luminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // ---------------------------------------------------------------
  // Module 1 : acquisition simulée
  // ---------------------------------------------------------------
  const acquisitionCanvas = byId("acquisition-canvas");
  const acquisitionCtx = acquisitionCanvas?.getContext("2d", {
    willReadFrequently: true,
  });

  function renderAcquisition() {
    if (!acquisitionCanvas || !acquisitionCtx) return;

    const exposure = Number(byId("acquisition-exposure")?.value || 0);
    const balance = Number(byId("acquisition-balance")?.value || 0);
    const noise = Number(byId("acquisition-noise")?.value || 0);
    const blur = Number(byId("acquisition-blur")?.value || 0);

    const buffer = document.createElement("canvas");
    buffer.width = acquisitionCanvas.width;
    buffer.height = acquisitionCanvas.height;
    const bctx = buffer.getContext("2d", {willReadFrequently: true});

    drawScene(bctx, buffer.width, buffer.height);

    const image = bctx.getImageData(0, 0, buffer.width, buffer.height);
    const factor = 2 ** exposure;
    const warm = balance / 100;

    for (let index = 0; index < image.data.length; index += 4) {
      const random = (Math.random() - .5) * noise;
      image.data[index] = clamp(
        image.data[index] * factor * (1 + Math.max(0, warm) * .35)
        + random
      );
      image.data[index + 1] = clamp(
        image.data[index + 1] * factor
        + random
      );
      image.data[index + 2] = clamp(
        image.data[index + 2] * factor * (1 + Math.max(0, -warm) * .35)
        + random
      );
    }

    bctx.putImageData(image, 0, 0);
    acquisitionCtx.clearRect(
      0,
      0,
      acquisitionCanvas.width,
      acquisitionCanvas.height
    );
    acquisitionCtx.filter = `blur(${blur}px)`;
    acquisitionCtx.drawImage(buffer, 0, 0);
    acquisitionCtx.filter = "none";

    byId("acquisition-output").textContent =
`Réglages simulés
- exposition : ${exposure > 0 ? "+" : ""}${exposure.toFixed(1)} IL
- balance : ${balance < 0 ? "froide" : balance > 0 ? "chaude" : "neutre"}
- bruit ajouté : ${noise}
- flou : ${blur} px

Construction simplifiée :
lumière → optique → photosites → conversion numérique
→ dématriçage → balance des blancs → réduction du bruit
→ netteté → compression et métadonnées.

Ces curseurs illustrent des effets ; ils ne reproduisent pas
fidèlement un appareil photographique particulier.`;
  }

  [
    "acquisition-exposure",
    "acquisition-balance",
    "acquisition-noise",
    "acquisition-blur",
  ].forEach(id => {
    byId(id)?.addEventListener("input", renderAcquisition);
  });
  renderAcquisition();

  // ---------------------------------------------------------------
  // Module 2 : pixels, définition et résolution
  // ---------------------------------------------------------------
  const pixelCanvas = byId("pixel-canvas");
  const pixelCtx = pixelCanvas?.getContext("2d");

  function renderPixelArt() {
    if (!pixelCanvas || !pixelCtx) return;

    const cellWidth = pixelCanvas.width / pixelData.largeur;
    const cellHeight = pixelCanvas.height / pixelData.hauteur;

    pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);

    pixelData.pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        pixelCtx.fillStyle =
          `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        pixelCtx.fillRect(
          x * cellWidth,
          y * cellHeight,
          cellWidth,
          cellHeight
        );

        pixelCtx.strokeStyle = "rgba(255,255,255,.5)";
        pixelCtx.strokeRect(
          x * cellWidth,
          y * cellHeight,
          cellWidth,
          cellHeight
        );
      });
    });
  }

  pixelCanvas?.addEventListener("pointermove", event => {
    const rect = pixelCanvas.getBoundingClientRect();
    const x = Math.floor(
      (event.clientX - rect.left) / rect.width * pixelData.largeur
    );
    const y = Math.floor(
      (event.clientY - rect.top) / rect.height * pixelData.hauteur
    );

    if (
      x < 0 || y < 0 ||
      x >= pixelData.largeur ||
      y >= pixelData.hauteur
    ) return;

    const [r, g, b] = pixelData.pixels[y][x];

    byId("pixel-position").textContent = `(${x}, ${y})`;
    byId("pixel-rgb").textContent = `R=${r} · V=${g} · B=${b}`;
    byId("pixel-hex").textContent =
      "#" + [r, g, b]
        .map(value => value.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    byId("pixel-swatch").style.background =
      `rgb(${r},${g},${b})`;
  });

  function updateResolutionCalculator() {
    const width = Math.max(
      1,
      Number(byId("resolution-width")?.value || 4000)
    );
    const height = Math.max(
      1,
      Number(byId("resolution-height")?.value || 3000)
    );
    const bits = Math.max(
      1,
      Number(byId("resolution-bits")?.value || 8)
    );
    const dpi = Math.max(
      1,
      Number(byId("resolution-dpi")?.value || 300)
    );

    const pixels = width * height;
    const megapixels = pixels / 1_000_000;
    const rawBytes = pixels * 3 * bits / 8;
    const printWidthCm = width / dpi * 2.54;
    const printHeightCm = height / dpi * 2.54;

    byId("resolution-megapixels").textContent =
      `${megapixels.toFixed(2)} Mpx`;
    byId("resolution-raw").textContent =
      `${(rawBytes / 1_048_576).toFixed(2)} Mio`;
    byId("resolution-print").textContent =
      `${printWidthCm.toFixed(1)} × ${printHeightCm.toFixed(1)} cm`;

    byId("resolution-output").textContent =
`Dimensions : ${width} × ${height} pixels
Définition : ${pixels.toLocaleString("fr-FR")} pixels
Profondeur : ${bits} bits par composante
Taille RVB brute théorique : ${(rawBytes / 1_048_576).toFixed(2)} Mio
Impression à ${dpi} pixels/pouce :
${printWidthCm.toFixed(1)} × ${printHeightCm.toFixed(1)} cm

La taille réelle du fichier dépend du format, de la compression,
des métadonnées et de la complexité de l'image.`;
  }

  [
    "resolution-width",
    "resolution-height",
    "resolution-bits",
    "resolution-dpi",
  ].forEach(id => {
    byId(id)?.addEventListener("input", updateResolutionCalculator);
  });

  renderPixelArt();
  updateResolutionCalculator();

  // ---------------------------------------------------------------
  // Module 3 : RVB, profondeur et Bayer
  // ---------------------------------------------------------------
  function quantize(value, bits) {
    const levels = 2 ** bits;
    const index = Math.round(value / 255 * (levels - 1));
    return Math.round(index / (levels - 1) * 255);
  }

  function updateColorMixer() {
    const sourceR = Number(byId("color-r")?.value || 128);
    const sourceG = Number(byId("color-g")?.value || 128);
    const sourceB = Number(byId("color-b")?.value || 128);
    const bits = Number(byId("color-depth")?.value || 8);

    const r = quantize(sourceR, bits);
    const g = quantize(sourceG, bits);
    const b = quantize(sourceB, bits);
    const levels = 2 ** bits;
    const colors = levels ** 3;

    const preview = byId("color-preview");
    preview.style.background = `rgb(${r},${g},${b})`;
    preview.style.color = luminance(r, g, b) > 145
      ? "#172033"
      : "#ffffff";
    preview.textContent = `RVB (${r}, ${g}, ${b})`;

    byId("color-r-value").textContent = r;
    byId("color-g-value").textContent = g;
    byId("color-b-value").textContent = b;
    byId("color-count").textContent =
      colors.toLocaleString("fr-FR");

    byId("color-output").textContent =
`Valeurs demandées : (${sourceR}, ${sourceG}, ${sourceB})
Valeurs quantifiées : (${r}, ${g}, ${b})
Profondeur : ${bits} bit(s) par composante
Niveaux par composante : ${levels}
Couleurs théoriques : ${colors.toLocaleString("fr-FR")}

À 8 bits par composante :
256 × 256 × 256 = 16 777 216 couleurs possibles.`;
  }

  function renderBayerGrid() {
    const root = byId("bayer-grid");
    if (!root) return;

    root.innerHTML = "";

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const cell = document.createElement("div");
        cell.className = "photo-bayer-cell";

        if (row % 2 === 0) {
          if (col % 2 === 0) {
            cell.textContent = "R";
            cell.style.background = "rgb(210,45,55)";
          } else {
            cell.textContent = "V";
            cell.style.background = "rgb(38,165,70)";
          }
        } else if (col % 2 === 0) {
          cell.textContent = "V";
          cell.style.background = "rgb(38,165,70)";
        } else {
          cell.textContent = "B";
          cell.style.background = "rgb(42,82,210)";
        }

        root.appendChild(cell);
      }
    }
  }

  [
    "color-r",
    "color-g",
    "color-b",
    "color-depth",
  ].forEach(id => {
    byId(id)?.addEventListener("input", updateColorMixer);
  });

  updateColorMixer();
  renderBayerGrid();

  // ---------------------------------------------------------------
  // Module 4 : métadonnées
  // ---------------------------------------------------------------
  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "—";
    if (bytes < 1024) return `${bytes} octets`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} Kio`;
    return `${(bytes / 1024 ** 2).toFixed(2)} Mio`;
  }

  function renderDemoMetadata() {
    byId("demo-meta-file").textContent = metadataDemo.fichier;
    byId("demo-meta-device").textContent = metadataDemo.appareil;
    byId("demo-meta-date").textContent = metadataDemo.date_prise_de_vue;
    byId("demo-meta-exposure").textContent =
      `${metadataDemo.temps_exposition} · ${metadataDemo.ouverture}`;
    byId("demo-meta-iso").textContent = metadataDemo.sensibilite_iso;
    byId("demo-meta-focal").textContent = metadataDemo.distance_focale;
    byId("demo-meta-author").textContent = metadataDemo.auteur;
    byId("demo-meta-gps").textContent =
      `${metadataDemo.gps_fictif.latitude}, ${metadataDemo.gps_fictif.longitude}`;

    byId("metadata-demo-output").textContent =
`Ces coordonnées sont fictives et stockées dans le fichier JSON
du cours. Elles illustrent le risque de publier une photographie
contenant un lieu précis.

Une métadonnée décrit le fichier ou la prise de vue ; elle n'est
pas un pixel visible de l'image.`;
  }

  function readAscii(view, offset, length) {
    let text = "";
    for (let index = 0; index < length; index += 1) {
      const value = view.getUint8(offset + index);
      if (value === 0) break;
      text += String.fromCharCode(value);
    }
    return text;
  }

  function parseJpegExif(buffer) {
    const view = new DataView(buffer);
    if (
      view.byteLength < 4 ||
      view.getUint16(0, false) !== 0xFFD8
    ) {
      return {};
    }

    let offset = 2;
    let tiffOffset = null;

    while (offset + 4 < view.byteLength) {
      if (view.getUint8(offset) !== 0xFF) break;
      const marker = view.getUint8(offset + 1);
      const length = view.getUint16(offset + 2, false);

      if (
        marker === 0xE1 &&
        readAscii(view, offset + 4, 6) === "Exif"
      ) {
        tiffOffset = offset + 10;
        break;
      }

      offset += 2 + length;
    }

    if (tiffOffset === null) return {};

    const little =
      view.getUint16(tiffOffset, false) === 0x4949;
    const get16 = position => view.getUint16(position, little);
    const get32 = position => view.getUint32(position, little);
    const typeSize = {
      1: 1,
      2: 1,
      3: 2,
      4: 4,
      5: 8,
      7: 1,
      9: 4,
      10: 8,
    };

    function readValue(entryOffset, type, count) {
      const bytes = (typeSize[type] || 1) * count;
      const valueOffset = bytes <= 4
        ? entryOffset + 8
        : tiffOffset + get32(entryOffset + 8);

      if (valueOffset < 0 || valueOffset + bytes > view.byteLength) {
        return null;
      }

      if (type === 2) {
        return readAscii(view, valueOffset, count);
      }

      if (type === 3) {
        return count === 1
          ? get16(valueOffset)
          : Array.from(
              {length: count},
              (_, index) => get16(valueOffset + index * 2)
            );
      }

      if (type === 4) {
        return count === 1
          ? get32(valueOffset)
          : Array.from(
              {length: count},
              (_, index) => get32(valueOffset + index * 4)
            );
      }

      if (type === 5) {
        const numerator = get32(valueOffset);
        const denominator = get32(valueOffset + 4);
        return denominator ? numerator / denominator : null;
      }

      return null;
    }

    const tags = {
      0x010F: "Fabricant",
      0x0110: "Modèle",
      0x0131: "Logiciel",
      0x0132: "DateModification",
      0x013B: "Artiste",
      0x8298: "Copyright",
      0x829A: "TempsExposition",
      0x829D: "Ouverture",
      0x8827: "ISO",
      0x9003: "DatePriseDeVue",
      0x920A: "Focale",
      0xA002: "LargeurExif",
      0xA003: "HauteurExif",
    };

    const result = {};

    function parseIfd(ifdRelativeOffset) {
      const ifdOffset = tiffOffset + ifdRelativeOffset;
      if (
        ifdOffset < 0 ||
        ifdOffset + 2 > view.byteLength
      ) return;

      const count = get16(ifdOffset);

      for (let index = 0; index < count; index += 1) {
        const entry = ifdOffset + 2 + index * 12;
        if (entry + 12 > view.byteLength) break;

        const tag = get16(entry);
        const type = get16(entry + 2);
        const number = get32(entry + 4);

        if (tag === 0x8769) {
          parseIfd(get32(entry + 8));
          continue;
        }

        if (tags[tag]) {
          result[tags[tag]] =
            readValue(entry, type, number);
        }
      }
    }

    const firstIfd = get32(tiffOffset + 4);
    parseIfd(firstIfd);

    return result;
  }

  byId("metadata-file")?.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const exif = parseJpegExif(arrayBuffer);
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    const dimensions = await new Promise(resolve => {
      image.onload = () => {
        resolve(`${image.naturalWidth} × ${image.naturalHeight} pixels`);
        URL.revokeObjectURL(objectUrl);
      };
      image.onerror = () => {
        resolve("dimensions non disponibles");
        URL.revokeObjectURL(objectUrl);
      };
      image.src = objectUrl;
    });

    byId("metadata-local-output").textContent =
`Fichier sélectionné localement
- nom : ${file.name}
- type MIME : ${file.type || "non indiqué"}
- taille : ${formatBytes(file.size)}
- dernière modification : ${new Date(file.lastModified).toLocaleString("fr-FR")}
- dimensions : ${dimensions}

EXIF détecté
${Object.keys(exif).length
  ? Object.entries(exif)
      .map(([key, value]) => `- ${key} : ${value}`)
      .join("\n")
  : "- aucune balise prise en charge n'a été trouvée"}

Le fichier reste sur cet appareil : le laboratoire n'effectue
aucun envoi réseau.`;
  });

  renderDemoMetadata();

  // ---------------------------------------------------------------
  // Module 5 : compression JPEG locale
  // ---------------------------------------------------------------
  const compressionCanvas = byId("compression-canvas");
  const compressionCtx = compressionCanvas?.getContext("2d");

  function renderCompression() {
    if (!compressionCanvas || !compressionCtx) return;

    const quality =
      Number(byId("compression-quality")?.value || 85) / 100;

    drawScene(
      compressionCtx,
      compressionCanvas.width,
      compressionCanvas.height
    );

    compressionCanvas.toBlob(blob => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const preview = byId("compression-preview");

      if (preview.dataset.objectUrl) {
        URL.revokeObjectURL(preview.dataset.objectUrl);
      }

      preview.src = url;
      preview.dataset.objectUrl = url;

      byId("compression-size").textContent =
        formatBytes(blob.size);
      byId("compression-quality-value").textContent =
        `${Math.round(quality * 100)} %`;

      byId("compression-output").textContent =
`Qualité demandée : ${Math.round(quality * 100)} %
Taille JPEG produite dans ce navigateur : ${formatBytes(blob.size)}
Dimensions : ${compressionCanvas.width} × ${compressionCanvas.height}

Une qualité plus faible réduit souvent la taille, mais peut
introduire des pertes de détails, des blocs et des franges.
Le résultat dépend du navigateur et du contenu de l'image.`;
    }, "image/jpeg", quality);
  }

  byId("compression-quality")?.addEventListener(
    "input",
    renderCompression
  );
  renderCompression();

  // ---------------------------------------------------------------
  // Module 6 : traitement par pixel et histogramme
  // ---------------------------------------------------------------
  const transformSource = document.createElement("canvas");
  transformSource.width = 480;
  transformSource.height = 320;
  const transformSourceCtx = transformSource.getContext(
    "2d",
    {willReadFrequently: true}
  );
  drawScene(transformSourceCtx, 480, 320);

  const transformCanvas = byId("transform-canvas");
  const transformCtx = transformCanvas?.getContext(
    "2d",
    {willReadFrequently: true}
  );
  const histogramCanvas = byId("histogram-canvas");
  const histogramCtx = histogramCanvas?.getContext("2d");

  function drawHistogram(imageData) {
    if (!histogramCtx || !histogramCanvas) return;

    const red = new Array(256).fill(0);
    const green = new Array(256).fill(0);
    const blue = new Array(256).fill(0);

    for (
      let index = 0;
      index < imageData.data.length;
      index += 4
    ) {
      red[imageData.data[index]] += 1;
      green[imageData.data[index + 1]] += 1;
      blue[imageData.data[index + 2]] += 1;
    }

    const max = Math.max(
      ...red,
      ...green,
      ...blue
    );

    histogramCtx.clearRect(
      0,
      0,
      histogramCanvas.width,
      histogramCanvas.height
    );
    histogramCtx.fillStyle = "#f4f6f8";
    histogramCtx.fillRect(
      0,
      0,
      histogramCanvas.width,
      histogramCanvas.height
    );

    function line(values, strokeStyle) {
      histogramCtx.strokeStyle = strokeStyle;
      histogramCtx.lineWidth = 1.5;
      histogramCtx.beginPath();

      values.forEach((value, index) => {
        const x =
          index / 255 * histogramCanvas.width;
        const y =
          histogramCanvas.height -
          value / max * (histogramCanvas.height - 8);

        if (index === 0) {
          histogramCtx.moveTo(x, y);
        } else {
          histogramCtx.lineTo(x, y);
        }
      });

      histogramCtx.stroke();
    }

    line(red, "rgba(210,45,55,.9)");
    line(green, "rgba(25,145,65,.9)");
    line(blue, "rgba(45,80,210,.9)");
  }

  function applyTransform() {
    if (!transformCtx || !transformCanvas) return;

    transformCtx.clearRect(
      0,
      0,
      transformCanvas.width,
      transformCanvas.height
    );
    transformCtx.drawImage(transformSource, 0, 0);

    const image = transformCtx.getImageData(
      0,
      0,
      transformCanvas.width,
      transformCanvas.height
    );
    const original = new Uint8ClampedArray(image.data);
    const operation =
      byId("transform-operation")?.value || "original";
    const threshold =
      Number(byId("transform-threshold")?.value || 128);
    const redFactor =
      Number(byId("transform-red")?.value || 100) / 100;
    const greenFactor =
      Number(byId("transform-green")?.value || 100) / 100;
    const blueFactor =
      Number(byId("transform-blue")?.value || 100) / 100;

    for (
      let index = 0;
      index < image.data.length;
      index += 4
    ) {
      let r = original[index];
      let g = original[index + 1];
      let b = original[index + 2];

      if (operation === "negative") {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      } else if (operation === "gray-average") {
        const gray = (r + g + b) / 3;
        r = g = b = gray;
      } else if (operation === "gray-luminance") {
        const gray = luminance(r, g, b);
        r = g = b = gray;
      } else if (operation === "threshold") {
        const value =
          luminance(r, g, b) >= threshold ? 255 : 0;
        r = g = b = value;
      } else if (operation === "rgb") {
        r *= redFactor;
        g *= greenFactor;
        b *= blueFactor;
      }

      image.data[index] = clamp(r);
      image.data[index + 1] = clamp(g);
      image.data[index + 2] = clamp(b);
    }

    if (operation === "edges") {
      const width = image.width;
      const height = image.height;
      const result = new Uint8ClampedArray(image.data.length);

      for (let y = 0; y < height - 1; y += 1) {
        for (let x = 0; x < width - 1; x += 1) {
          const index = (y * width + x) * 4;
          const right = index + 4;
          const below = index + width * 4;

          const centerL = luminance(
            original[index],
            original[index + 1],
            original[index + 2]
          );
          const rightL = luminance(
            original[right],
            original[right + 1],
            original[right + 2]
          );
          const belowL = luminance(
            original[below],
            original[below + 1],
            original[below + 2]
          );

          const variation =
            Math.abs(centerL - rightL) +
            Math.abs(centerL - belowL);
          const value = variation > threshold ? 0 : 255;

          result[index] = value;
          result[index + 1] = value;
          result[index + 2] = value;
          result[index + 3] = 255;
        }
      }

      image.data.set(result);
    }

    transformCtx.putImageData(image, 0, 0);
    drawHistogram(image);

    byId("transform-output").textContent =
`Opération : ${operation}
Seuil : ${threshold}
Multiplicateurs RVB :
- rouge × ${redFactor.toFixed(2)}
- vert × ${greenFactor.toFixed(2)}
- bleu × ${blueFactor.toFixed(2)}

Chaque transformation parcourt les pixels et modifie
leurs trois composantes. L'extraction de contours compare
la luminance de pixels voisins avec un seuil.`;
  }

  [
    "transform-operation",
    "transform-threshold",
    "transform-red",
    "transform-green",
    "transform-blue",
  ].forEach(id => {
    byId(id)?.addEventListener("input", applyTransform);
    byId(id)?.addEventListener("change", applyTransform);
  });
  applyTransform();

  // ---------------------------------------------------------------
  // Module 7 : pipeline algorithmique
  // ---------------------------------------------------------------
  function updatePipeline() {
    const steps = [
      ["pipeline-exposure", "Exposition", "estimer la quantité de lumière utile"],
      ["pipeline-focus", "Mise au point", "maximiser la netteté de la zone visée"],
      ["pipeline-demosaic", "Dématriçage", "calculer trois composantes par pixel"],
      ["pipeline-whitebalance", "Balance des blancs", "corriger une dominante colorée"],
      ["pipeline-denoise", "Réduction du bruit", "limiter les variations aléatoires"],
      ["pipeline-hdr", "Fusion / HDR", "combiner plusieurs expositions"],
      ["pipeline-lens", "Correction optique", "compenser certaines distorsions"],
      ["pipeline-sharpen", "Netteté", "renforcer les variations locales"],
      ["pipeline-compress", "Compression", "réduire le volume du fichier"],
    ];

    const active = [];

    steps.forEach(([id, name, description]) => {
      const enabled = byId(id)?.checked || false;
      const card = document.querySelector(
        `[data-pipeline-card="${id}"]`
      );
      card?.classList.toggle("active", enabled);

      if (enabled) {
        active.push(`${active.length + 1}. ${name} — ${description}`);
      }
    });

    byId("pipeline-output").textContent =
`Étapes activées
${active.length ? active.join("\n") : "Aucune étape sélectionnée."}

Une image finale n'est pas une copie directe des photosites :
elle résulte de mesures, d'interpolations, de corrections,
de décisions automatiques et parfois de la fusion de plusieurs
prises de vue. L'ordre précis dépend de l'appareil et du format.`;
  }

  document.querySelectorAll("[data-pipeline-control]")
    .forEach(input => {
      input.addEventListener("change", updatePipeline);
    });
  updatePipeline();

  // ---------------------------------------------------------------
  // Module 8 : rapport de projet
  // ---------------------------------------------------------------
  function buildProjectReport() {
    return {
      titre:
        byId("project-title")?.value.trim() ||
        "Projet photographique SNT",
      objectif:
        byId("project-objective")?.value.trim(),
      dimensions:
        byId("project-dimensions")?.value.trim(),
      format:
        byId("project-format")?.value,
      metadonnees:
        byId("project-metadata")?.value.trim(),
      transformation:
        byId("project-transform")?.value.trim(),
      algorithmes:
        byId("project-algorithms")?.value.trim(),
      publication:
        byId("project-publication")?.value.trim(),
      validation:
        byId("project-validation")?.value.trim(),
      date_export:
        new Date().toISOString(),
    };
  }

  byId("project-preview")?.addEventListener("click", () => {
    byId("project-output").textContent =
      JSON.stringify(buildProjectReport(), null, 2);
  });

  byId("project-export")?.addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify(buildProjectReport(), null, 2)],
      {type: "application/json;charset=utf-8"}
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projet_photographie_snt.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  // ---------------------------------------------------------------
  // Texte à compléter
  // ---------------------------------------------------------------
  byId("photo-fill-check")?.addEventListener("click", () => {
    const expected = {
      "photo-fill-1": "photosite",
      "photo-fill-2": "pixel",
      "photo-fill-3": "rvb",
      "photo-fill-4": "exif",
      "photo-fill-5": "compression",
    };

    let correct = 0;

    Object.entries(expected).forEach(([id, answer]) => {
      const input = byId(id);
      if (!input) return;

      const value = input.value
        .trim()
        .toLowerCase();

      const good = value === answer;
      input.style.outline = good
        ? "3px solid #16824a"
        : "3px solid #b9313b";

      if (good) correct += 1;
    });

    byId("photo-fill-feedback").textContent =
      `${correct} réponse(s) correcte(s) sur 5.`;
  });
})();
