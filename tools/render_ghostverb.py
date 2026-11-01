"""Icono de GhostVerb para el portfolio: el knob INTENSITY del plugin rodeado por la
onda del riser (barras rojas que crecen hasta arriba y la sílaba en blanco a la
derecha), con la silueta de Djoko_vox.

Uso: python3 tools/render_ghostverb.py  →  assets/apps/ghostverb.png (256 px)
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/apps/ghostverb.png"
S = 4  # se dibuja a 1024 px y se reduce
W = 256 * S

RED = (229, 46, 54)
WHITE = (240, 240, 242)


def vgradient(size, top, bottom):
    w, h = size
    g = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / (h - 1)
        g.putpixel((0, y), tuple(round(a + (b - a) * t) for a, b in zip(top, bottom)))
    return g.resize((w, h))


def circle_mask(c, cy, r, dy=0, fill=255):
    m = Image.new("L", (W, W), 0)
    ImageDraw.Draw(m).ellipse((c - r, cy - r + dy, c + r, cy + r + dy), fill=fill)
    return m


img = vgradient((W, W), (57, 59, 65), (28, 28, 32))
c, cy = W / 2, W / 2 + 10 * S

# Knob: sombra, aro y cara
R = 60 * S
img.paste((8, 8, 10), (0, 0), circle_mask(c, cy, R, 8 * S, 200).filter(ImageFilter.GaussianBlur(9 * S)))
img.paste(vgradient((W, W), (78, 79, 85), (22, 22, 25)), (0, 0), circle_mask(c, cy, R))
face = R - 4 * S
img.paste(vgradient((W, W), (46, 47, 52), (26, 26, 30)), (0, 0), circle_mask(c, cy, face))
d = ImageDraw.Draw(img)
d.rounded_rectangle((c - 4.5 * S, cy - face + 10 * S, c + 4.5 * S, cy - face + 42 * S), 4 * S, fill=WHITE)

# Anillo: de abajo a la izquierda (225°) a abajo a la derecha (-45°).
# Las rojas son la cola que sube (curva EXP) y las blancas, la sílaba.
r0, L_max = 73 * S, 37 * S
syllable = [0.55, 0.9, 0.45, 1.0, 0.7, 0.5, 0.8, 0.4, 0.6]
n_red = 22
n = n_red + len(syllable)
red = Image.new("L", (W, W), 0)
rd = ImageDraw.Draw(red)
for i in range(n):
    a = math.radians(225 - 270 * i / (n - 1))
    if i < n_red:
        t = (i + 1) / n_red
        length = max(3 * S, L_max * t ** 2.4 * (0.85 + 0.15 * math.sin(i * 2.1) ** 2))
        draw, fill = rd, 255
    else:
        length = L_max * syllable[i - n_red]
        draw, fill = d, WHITE
    p0 = (c + r0 * math.cos(a), cy - r0 * math.sin(a))
    p1 = (c + (r0 + length) * math.cos(a), cy - (r0 + length) * math.sin(a))
    draw.line([p0, p1], fill=fill, width=round(5.2 * S))
    for px, py in (p0, p1):
        r = 2.6 * S
        draw.ellipse((px - r, py - r, px + r, py + r), fill=fill)

img.paste(RED, (0, 0), red.filter(ImageFilter.GaussianBlur(6 * S)).point(lambda v: v * 0.6))
img.paste(RED, (0, 0), red)

# Misma silueta que el icono de Djoko_vox
out = img.resize((256, 256), Image.LANCZOS).convert("RGBA")
out.putalpha(Image.open(ROOT / "assets/apps/djokovox.png").convert("RGBA").split()[3])
out.save(OUT, optimize=True)
print(OUT)
