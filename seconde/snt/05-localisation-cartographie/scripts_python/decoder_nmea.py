from __future__ import annotations
from pathlib import Path
FICHIER=Path(__file__).resolve().parents[1]/"donnees"/"trames_nmea_demo.txt"
def checksum_ok(trame):
    contenu,attendu=trame.strip()[1:].split("*",1); v=0
    for c in contenu: v ^= ord(c)
    return f"{v:02X}"==attendu.upper()
def coord(val,hem):
    n=float(val); deg=int(n//100); dec=deg+(n-deg*100)/60
    return -dec if hem in {"S","W"} else dec
for ligne in FICHIER.read_text(encoding="utf-8").splitlines():
    if ligne.startswith("$GPGGA"):
        c=ligne.split("*",1)[0].split(",")
        print({"checksum":checksum_ok(ligne),"latitude":coord(c[2],c[3]),
               "longitude":coord(c[4],c[5]),"satellites":int(c[7]),"altitude":float(c[9])})
