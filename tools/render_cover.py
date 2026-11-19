"""Portada del README (docs/cover.jpg) y vista previa para compartir (docs/og.jpg).

Hacen falta dos capturas a 2x de la web en local, en español:
  - escritorio: 1440×900 con Sobre mí abierto  → 2880×1800
  - móvil:      390×844, arriba del todo         → 780×1688

Uso: python3 tools/render_cover.py <captura-escritorio.png> <captura-movil.png>
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
BG = (8, 11, 18)
COVER = (1600, 940)


def rounded(img, radius):
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, img.width - 1, img.height - 1), radius, fill=255)
    img.putalpha(m)
    return img


def drop_shadow(canvas, box, radius, blur=28, alpha=170, dy=18):
    sh = Image.new("L", canvas.size, 0)
    x0, y0, x1, y1 = box
    ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + dy, x1, y1 + dy), radius, fill=alpha)
    canvas.paste((0, 0, 0), (0, 0), sh.filter(ImageFilter.GaussianBlur(blur)))


def main(desk_path, phone_path):
    canvas = Image.new("RGB", COVER, BG)

    # Escritorio: 1440×900 reducido a 1360×850, en (60, 50)
    desk = Image.open(desk_path).convert("RGB").resize((1360, 850), Image.LANCZOS)
    drop_shadow(canvas, (60, 50, 1420, 900), 14)
    canvas.paste(rounded(desk.convert("RGBA"), 14), (60, 50), rounded(desk.convert("RGBA"), 14))

    # Móvil: marco gris de 2 px, bisel oscuro de 6 px y la pantalla (390×844 → 306×662)
    fx0, fy0, fx1, fy1 = 1239, 232, 1561, 910
    drop_shadow(canvas, (fx0, fy0, fx1, fy1), 52, blur=24, alpha=200)
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle((fx0, fy0, fx1, fy1), 52, fill=(88, 89, 93))
    d.rounded_rectangle((fx0 + 2, fy0 + 2, fx1 - 2, fy1 - 2), 50, fill=(20, 21, 26))
    phone = rounded(Image.open(phone_path).convert("RGBA").resize((306, 662), Image.LANCZOS), 42)
    canvas.paste(phone, (fx0 + 8, fy0 + 8), phone)

    canvas.save(ROOT / "docs/cover.jpg", quality=90, optimize=True)

    # Vista previa 1200×630: la portada a 630 px de alto, con margen del color del fondo
    og = Image.new("RGB", (1200, 630), BG)
    small = canvas.resize((round(COVER[0] * 630 / COVER[1]), 630), Image.LANCZOS)
    og.paste(small, ((1200 - small.width) // 2, 0))
    og.save(ROOT / "docs/og.jpg", quality=88, optimize=True)
    print(ROOT / "docs/cover.jpg", ROOT / "docs/og.jpg")


if __name__ == "__main__":
    main(*sys.argv[1:3])
