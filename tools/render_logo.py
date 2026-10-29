"""
Renderiza el logo (agujero negro tipo Gargantua) en los azules de la web.

  python3 tools/render_logo.py   -> assets/logo-512.png y assets/logo-64.png

Necesita numpy y Pillow. Hay dos versiones con la misma forma:
  - Realista (logo-512: avatar, apple-touch-icon y README): brillo y vetas de gas.
  - Plana (logo-64: favicon y barra de menú): bandas de color sólido, se lee mejor en pequeño.

Cómo está montado:
  - Disco de acreción: anillos elípticos muy achatados. La mitad de delante cruza
    por encima del horizonte y es algo más gruesa.
  - Lente gravitacional: la parte de atrás del disco se ve como una campana por
    encima del agujero y otra más fina por debajo. Cada campana es una familia de
    curvas  |y| = a·exp(-(x/b)²)  y t (0 dentro, 1 fuera) dice en cuál cae cada píxel.
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SS = 1024            # resolución de trabajo (luego se reduce)
R = 0.27             # radio del horizonte (la imagen va de -1 a 1)
E = 0.11             # achatamiento de los anillos del disco
TILT = 10            # grados; el disco baja hacia la izquierda

lin = np.linspace(-1, 1, SS)
x, y = np.meshgrid(lin, lin)
y = y + 0.02         # el centro, un pelín más arriba
r = np.hypot(x, y)

# Colores: los de la web (acento #0A84FF)
NAVY = (0.02, 0.09, 0.28)
BLUE = (0.04, 0.52, 1.0)
SKY = (0.39, 0.82, 1.0)
WHITE = (0.93, 0.97, 1.0)


def smoothstep(a, b, v):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def blur(img, sigma):
    """Desenfoque gaussiano con FFT (imagen en gris o con canales)."""
    f = np.fft.fftfreq(img.shape[0])
    k = np.exp(-2 * (np.pi * sigma) ** 2 * (f[:, None] ** 2 + f[None, :] ** 2))
    if img.ndim == 2:
        return np.real(np.fft.ifft2(np.fft.fft2(img) * k))
    return np.dstack([np.real(np.fft.ifft2(np.fft.fft2(img[..., c]) * k)) for c in range(img.shape[2])])


def bell(a0, a1, b0, b1):
    """t de cada píxel en una familia de campanas |y| = a_t·exp(-(x/b_t)²), por bisección."""
    h = np.abs(y)
    lo = np.full(x.shape, -0.6)
    hi = np.full(x.shape, 1.6)
    for _ in range(30):
        mid = (lo + hi) / 2
        val = (a0 + (a1 - a0) * mid) * np.exp(-(x / (b0 + (b1 - b0) * mid)) ** 2)
        lo = np.where(val < h, mid, lo)
        hi = np.where(val < h, hi, mid)
    return (lo + hi) / 2


# --- Geometría común ---
front = y >= 0
A = np.hypot(x, y / np.where(front, E * 1.5, E))        # radio del anillo del disco


def disk_param(outer):
    """t del disco: 0 en el borde interior, 1 en el exterior (outer = radio exterior)."""
    return (A - 0.36) / (outer - 0.36)


disk_t = disk_param(0.93)
in_disk = (disk_t >= 0) & (disk_t <= 1)
top_t = bell(R * 1.1, R * 1.85, R * 1.0, R * 1.55)      # campana de arriba
in_top = ~front & (top_t >= 0) & (top_t <= 1)
bot_t = bell(R * 1.05, R * 1.38, R * 0.95, R * 1.2)     # campana de abajo, más fina
in_bot = front & (bot_t >= 0) & (bot_t <= 1)
hole = smoothstep(R + 0.004, R - 0.004, r)              # 1 dentro del horizonte
outside = 1 - hole


def streaks(t, strength, octaves, rng):
    """Ruido a lo largo de t: las vetas del gas."""
    s = np.zeros_like(t)
    for i in range(octaves):
        s += np.sin(t * (14 * 1.7 ** i) * rng.uniform(.85, 1.15) + rng.uniform(0, 6.3)) / (i + 1.4)
    return 1 + strength * s / 1.6


def ramp(v):
    """Intensidad 0..1 -> azul oscuro, acento, celeste y blanco."""
    stops = np.array([0, .35, .65, .85, 1])
    cols = np.array([[0.02, 0.10, 0.35], BLUE, [0.25, 0.70, 1.0], [0.70, 0.90, 1.0], [1, 1, 1]])
    v = np.clip(v, 0, 1)
    return np.dstack([np.interp(v, stops, cols[:, c]) for c in range(3)])


def to_image(rgb, alpha):
    rgba = np.dstack([np.clip(rgb, 0, 1), np.clip(alpha, 0, 1)])
    img = Image.fromarray((rgba * 255).round().astype(np.uint8))
    return img.rotate(TILT, resample=Image.BICUBIC)


def fill_square(img, margin=0.04):
    """Recorta lo transparente y centra el dibujo en un cuadrado con poco margen."""
    box = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    img = img.crop(box)
    side = round(max(img.size) * (1 + 2 * margin))
    square = Image.new("RGBA", (side, side))
    square.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    return square


def render_realistic():
    rng = np.random.default_rng(3)                      # mismas vetas en cada render
    doppler = 1.25 - 0.35 * np.clip((x + 1) / 2, 0, 1)  # izquierda más brillante
    disk = np.where(in_disk, np.exp(-disk_t * 2.6) * streaks(disk_t, 0.45, 7, rng), 0) * doppler
    disk *= smoothstep(1, 0.85, disk_t)
    top = np.where(in_top, np.exp(-np.maximum(top_t - 0.08, 0) * 3) * smoothstep(0, 0.06, top_t)
                   * streaks(top_t, 0.4, 6, rng), 0) * doppler
    bot = np.where(in_bot, 0.55 * np.exp(-bot_t * 3) * smoothstep(0, 0.08, bot_t)
                   * streaks(bot_t, 0.3, 5, rng), 0)
    ring = 1.1 * np.exp(-((r - R - 0.008) / 0.006) ** 2)  # anillo de fotones

    light = np.where(front, disk, disk * outside) + (top + bot + ring) * outside
    glow = blur(light, 0.006 * SS) * 0.6 + blur(light, 0.03 * SS) * 0.5
    tone = 1 - np.exp(-(light * 1.15 + glow) * 1.6)
    rgb = ramp(tone)
    alpha = np.clip(tone * 1.4, 0, 1)

    # Dentro del horizonte todo es negro salvo el disco que pasa por delante
    fd = 1 - np.exp(-blur(np.where(front, disk, 0), 1.5) * 6)
    rgb = rgb * outside[..., None] + ramp(fd) * fd[..., None] * hole[..., None]
    alpha = np.maximum(alpha, hole)
    alpha *= smoothstep(1.0, 0.9, np.hypot(x, y - 0.02))  # nada llega al borde
    return to_image(rgb, alpha)


def render_flat():
    disk_t = disk_param(0.78)                           # disco más corto: en pequeño cabe más grande

    def paint(t, mask, levels, rgb, alpha):
        for lo, hi, color in levels:
            m = mask & (t >= lo) & (t < hi)
            rgb[m] = color
            alpha[m] = 1

    # Cada banda: (desde, hasta, color). Los extremos navy hacen de contorno.
    levels = [(-0.12, 0, NAVY), (0, 0.18, WHITE), (0.18, 0.45, SKY), (0.45, 0.85, BLUE), (0.85, 1.12, NAVY)]
    rgb = np.zeros(x.shape + (3,))
    alpha = np.zeros(x.shape)
    # De atrás hacia delante: campanas, agujero con su contorno y disco
    paint(top_t, ~front, levels, rgb, alpha)
    paint(bot_t, front, [(-0.15, 0, NAVY), (0, 0.55, SKY), (0.55, 1.15, NAVY)], rgb, alpha)
    edge = r < R + 0.032
    rgb[edge] = NAVY
    alpha[edge] = 1
    rgb[r < R] = 0
    disk_rgb = np.zeros_like(rgb)
    disk_alpha = np.zeros_like(alpha)
    paint(disk_t, np.ones(x.shape, bool), levels, disk_rgb, disk_alpha)
    visible = (disk_alpha > 0) & (front | ~edge)
    rgb[visible] = disk_rgb[visible]
    alpha[visible] = 1
    return to_image(rgb, alpha)


if __name__ == "__main__":
    for img, size in ((render_realistic(), 512), (fill_square(render_flat()), 64)):
        out = ROOT / "assets" / f"logo-{size}.png"
        img.resize((size, size), Image.LANCZOS).save(out, optimize=True)
        print("->", out.relative_to(ROOT))
