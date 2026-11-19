"""Iconos de BRUTO, DELIRIUM y Switchblade para el portfolio, sacados de sus
interfaces y con la silueta de Djoko_vox (igual que GhostVerb):

- BRUTO: el frontal del plugin (panel, tornillos y el knob DRIVE de engranaje).
- DELIRIUM: la pantalla estéreo del plugin, con un garabato rojo que insinúa una D.
- Switchblade: el ][ rojo del logo, con la onda de colores de los chops cortada.

Uso: python3 tools/render_plugins.py  →  assets/apps/{bruto,delirium,switchblade}.png (256 px)
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
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


def background():
    return vgradient((W, W), (57, 59, 65), (28, 28, 32))


def mask(draw_fn):
    m = Image.new("L", (W, W), 0)
    draw_fn(ImageDraw.Draw(m))
    return m


def circle(c, cy, r):
    return (c - r, cy - r, c + r, cy + r)


def shadow(img, m, dy, blur, alpha=200):
    sh = Image.new("L", (W, W), 0)
    sh.paste(m, (0, dy))
    img.paste((6, 6, 8), (0, 0), sh.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: v * alpha // 255))


def glow(img, m, color, blur, strength=0.7):
    img.paste(color, (0, 0), m.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * strength)))


def brushed(c, cy, r, light, dark):
    """Disco de metal cepillado: degradado y anillos finos concéntricos."""
    disc = vgradient((W, W), light, dark)
    rings = Image.new("L", (W, W), 128)
    d = ImageDraw.Draw(rings)
    rnd = random.Random(7)
    for rr in range(int(r), 0, -2):
        d.ellipse(circle(c, cy, rr), outline=128 + rnd.randint(-14, 14), width=2)
    # Las vetas aclaran u oscurecen un poco el degradado
    light_l = Image.new("RGB", (W, W), (255, 255, 255))
    dark_l = Image.new("RGB", (W, W), (0, 0, 0))
    disc.paste(light_l, (0, 0), rings.point(lambda v: max(0, v - 128) * 3))
    disc.paste(dark_l, (0, 0), rings.point(lambda v: max(0, 128 - v) * 3))
    return disc


def finish(img, name):
    out = img.resize((256, 256), Image.LANCZOS).convert("RGBA")
    out.putalpha(Image.open(ROOT / "assets/apps/djokovox.png").convert("RGBA").split()[3])
    path = ROOT / f"assets/apps/{name}.png"
    out.save(path, optimize=True)
    print(path)


# ---------------------------------------------------------------- BRUTO
# Variante "G": el frontal del plugin, con tornillos y el knob DRIVE en el centro
def panel_bg():
    """Panel de metal oscuro con textura fina, como el frontal del plugin."""
    img = vgradient((W, W), (44, 45, 50), (20, 20, 23))
    noise = Image.effect_noise((W, W), 18).filter(ImageFilter.GaussianBlur(0.6))
    img.paste((255, 255, 255), (0, 0), noise.point(lambda v: max(0, v - 118) // 3))
    return img


def screw(img, x, y, r=7 * S, angle=35):
    m = mask(lambda m: m.ellipse(circle(x, y, r), fill=255))
    shadow(img, m, 2 * S, 2 * S, 180)
    img.paste(vgradient((W, W), (190, 191, 196), (70, 71, 76)), (0, 0), m)
    a = math.radians(angle)
    dx, dy = r * 0.75 * math.cos(a), r * 0.75 * math.sin(a)
    ImageDraw.Draw(img).line([(x - dx, y - dy), (x + dx, y + dy)], fill=(40, 40, 44), width=round(1.8 * S))


def scale_dots(img, c, cy, r, n, lit, big, small):
    """Escala de puntos de 7 a 5 en punto; los primeros `lit`, encendidos en rojo."""
    reds, core = Image.new("L", (W, W), 0), Image.new("L", (W, W), 0)
    rd, cd, d = ImageDraw.Draw(reds), ImageDraw.Draw(core), ImageDraw.Draw(img)
    for i in range(n):
        a = math.radians(225 - 270 * i / (n - 1))
        p = (c + r * math.cos(a), cy - r * math.sin(a))
        if i < lit:
            rd.ellipse(circle(*p, big), fill=255)
            cd.ellipse(circle(*p, big * 0.6), fill=255)
        else:
            d.ellipse(circle(*p, small), fill=(12, 12, 14))
    glow(img, reds, RED, 6 * S, 0.8)
    img.paste((120, 22, 28), (0, 0), reds)
    img.paste((255, 74, 80), (0, 0), core)


def gear_knob(img, c, cy, R, face_r, angle, lobes=8):
    """Knob de engranaje con cara de metal cepillado y punto rojo indicador."""
    pts = []
    for k in range(720):
        t = 2 * math.pi * k / 720
        bump = (0.5 + 0.5 * math.cos(lobes * t)) ** 0.6
        r = R - 8 * S + 8 * S * bump
        pts.append((c + r * math.cos(t), cy + r * math.sin(t)))
    g = mask(lambda m: m.polygon(pts, fill=255))
    shadow(img, g, round(R * 0.13), round(R * 0.15))
    img.paste(vgradient((W, W), (110, 111, 117), (18, 18, 21)), (0, 0), g)
    k = (R - 3 * S) / R
    inner = [(c + (x - c) * k, cy + (y - cy) * k) for x, y in pts]
    img.paste(vgradient((W, W), (54, 55, 60), (22, 22, 25)), (0, 0), mask(lambda m: m.polygon(inner, fill=255)))
    img.paste(vgradient((W, W), (36, 36, 40), (128, 129, 134)), (0, 0),
              mask(lambda m: m.ellipse(circle(c, cy, face_r + 2.5 * S), fill=255)))
    img.paste(brushed(c, cy, face_r, (176, 177, 182), (96, 97, 102)), (0, 0),
              mask(lambda m: m.ellipse(circle(c, cy, face_r), fill=255)))
    a = math.radians(angle)
    rr = (R + face_r) / 2
    p = (c + rr * math.cos(a), cy - rr * math.sin(a))
    dot = mask(lambda m: m.ellipse(circle(*p, R * 0.085), fill=255))
    glow(img, dot, RED, 5 * S, 0.7)
    img.paste(RED, (0, 0), dot)


def bruto():
    img = panel_bg()
    for x, y in ((38, 38), (218, 38), (38, 218), (218, 218)):
        screw(img, x * S, y * S, angle=random.Random(x * y).randint(0, 180))
    c, cy = W / 2, W / 2
    scale_dots(img, c, cy, 86 * S, 15, 6, 5 * S, 2.8 * S)
    gear_knob(img, c, cy, 68 * S, 40 * S, 225 - 270 * 5 / 14)
    finish(img, "bruto")


# ---------------------------------------------------------------- DELIRIUM
# Variante "E2": la pantalla estéreo del plugin, con un garabato que insinúa una D
def radial(c, cy, r, inner, outer, power=1.0):
    """Degradado radial a base de círculos concéntricos."""
    im = Image.new("RGB", (W, W), outer)
    d = ImageDraw.Draw(im)
    for rr in range(int(r), 0, -2):
        t = (rr / r) ** power
        d.ellipse(circle(c, cy, rr), fill=tuple(round(a + (b - a) * t) for a, b in zip(inner, outer)))
    return im


def delirium(k=0.7, seed=9):
    """k de 0 a 1: cuánto se nota la D (0, garabato; 1, D clara)."""
    img = background()
    d = ImageDraw.Draw(img)
    # Marco y pantalla
    x0, y0, x1, y1 = 26 * S, 26 * S, 230 * S, 230 * S
    bez = mask(lambda m: m.rounded_rectangle((x0, y0, x1, y1), 30 * S, fill=255))
    shadow(img, bez, 8 * S, 10 * S)
    img.paste(vgradient((W, W), (90, 91, 97), (28, 28, 32)), (0, 0), bez)
    scr = (x0 + 9 * S, y0 + 9 * S, x1 - 9 * S, y1 - 9 * S)
    img.paste(radial(W / 2, W / 2, 130 * S, (30, 4, 6), (6, 2, 3), 1.2), (0, 0),
              mask(lambda m: m.rounded_rectangle(scr, 22 * S, fill=255)))
    # Rejilla circular
    c = W / 2
    grid = (90, 16, 20)
    for r in (40, 72):
        d.ellipse(circle(c, c, r * S), outline=grid, width=round(1.4 * S))
    for a in (45, 135):
        t = math.radians(a)
        d.line([(c - 84 * S * math.cos(t), c - 84 * S * math.sin(t)),
                (c + 84 * S * math.cos(t), c + 84 * S * math.sin(t))], fill=grid, width=round(1.4 * S))

    rnd = random.Random(seed)
    # Garabato tipo Lissajous, que hace de panza de la D (se abre hacia la derecha)
    loops = []
    for i in range(700):
        t = i / 699 * 2 * math.pi * 5
        r = 50 * S * (0.65 + 0.35 * math.sin(t * 0.37)) + rnd.uniform(-2, 2) * S
        x, y = r * 0.62 * math.sin(t * 1.02 + 0.4), r * math.cos(t * 1.51)
        x *= (1 - 0.75 * k) if x < 0 else (1 + 0.75 * k)
        loops.append((c + x, c + y))
    # Palo: un trazo tembloroso a la izquierda, de diagonal a casi vertical según k
    left = min(x for x, _ in loops)
    tilt = math.radians(28 - 22 * k)
    half = 52 * S
    stem = []
    for rep in range(2):
        for i in range(80):
            v = -1 + 2 * i / 79
            if rep:
                v = -v
            stem.append((left + 2 * S - math.sin(tilt) * half * v + rnd.uniform(-2, 2) * S + rep * 2 * S,
                         c + half * v + rnd.uniform(-2, 2) * S))
    pts = stem + loops
    xs = [x for x, _ in pts]
    shift = c - (min(xs) + max(xs)) / 2
    pts = [(x + shift, y) for x, y in pts]

    scrib = Image.new("L", (W, W), 0)
    ImageDraw.Draw(scrib).line(pts, fill=255, width=round(2.4 * S), joint="curve")
    glow(img, scrib, RED, 8 * S, 0.9)
    img.paste((255, 60, 66), (0, 0), scrib)
    finish(img, "delirium")


# ---------------------------------------------------------------- Switchblade
# Variante "H": el ][ rojo del logo, con la onda cortada y cada trozo del color de un chop
SB_RED = (225, 11, 31)
CHOPS = [(226, 62, 66), (240, 138, 50), (236, 200, 60), (76, 200, 84), (78, 214, 200), (70, 130, 240), (150, 100, 236)]


def wave_amps(n, seed):
    """Alturas de una onda de muestra, con varios golpes."""
    rnd = random.Random(seed)
    out = []
    for i in range(n):
        t = i / (n - 1)
        env = 0.3 + 0.7 * abs(math.sin(t * math.pi * 3.2 + 0.4)) ** 1.5
        out.append(env * (0.45 + 0.55 * rnd.random()))
    return out


def brackets(cx, cy, h, t, gap, arm):
    """Máscara del ][ del logo, centrado en (cx, cy)."""
    m = Image.new("L", (W, W), 0)
    d = ImageDraw.Draw(m)
    top, bot = cy - h / 2, cy + h / 2
    xr = cx - gap / 2  # ]
    d.rectangle((xr - t, top, xr, bot), fill=255)
    d.rectangle((xr - t - arm, top, xr, top + t), fill=255)
    d.rectangle((xr - t - arm, bot - t, xr, bot), fill=255)
    xl = cx + gap / 2  # [
    d.rectangle((xl, top, xl + t, bot), fill=255)
    d.rectangle((xl, top, xl + t + arm, top + t), fill=255)
    d.rectangle((xl, bot - t, xl + t + arm, bot), fill=255)
    return m


def switchblade():
    img = background()
    d = ImageDraw.Draw(img)
    cy = W / 2
    # Onda de colores, cortada donde va el ][
    n = 26
    amps = wave_amps(n, 4)
    for i, a in enumerate(amps):
        x = 16 * S + i * (224 * S) / (n - 1)
        if 96 * S < x < 160 * S:
            continue
        col = CHOPS[min(6, int(i / n * 7))]
        d.line([(x, cy - a * 46 * S), (x, cy + a * 46 * S)], fill=col, width=round(4.4 * S))
    # ][ rojo con brillo
    m = brackets(W / 2, cy, 150 * S, 20 * S, 26 * S, 26 * S)
    shadow(img, m, 6 * S, 7 * S, 220)
    glow(img, m, SB_RED, 14 * S, 0.6)
    img.paste(vgradient((W, W), (255, 70, 82), (176, 6, 22)), (0, 0), m)
    finish(img, "switchblade")


if __name__ == "__main__":
    bruto()
    delirium()
    switchblade()
