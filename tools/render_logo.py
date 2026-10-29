"""
Renderiza el logo (agujero negro) como PNG con brillo real.

  python3 tools/render_logo.py            -> assets/logo-512.png y assets/logo-64.png

Necesita numpy y Pillow. Cómo está montado:
  - Disco de acreción: banda fina que cruza por delante del horizonte, con estrías
    y un lado más brillante que el otro (el que se acerca, efecto Doppler).
  - Lente gravitacional: la parte trasera del disco se ve como un arco por encima
    del agujero y otro más débil por debajo.
  - Anillo de fotones justo en el borde, horizonte negro y un "bloom" final.
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SS = 1024            # resolución de trabajo (luego se reduce)
TILT = np.radians(-10)
HOLE = 0.30          # radio del horizonte (la imagen va de -1 a 1)
rng = np.random.default_rng(7)


def gaussian_blur(img, sigma):
    """Desenfoque gaussiano con FFT, canal a canal."""
    n = img.shape[0]
    f = np.fft.fftfreq(n)
    kernel = np.exp(-2 * (np.pi * sigma) ** 2 * (f[:, None] ** 2 + f[None, :] ** 2))
    out = np.empty_like(img)
    for c in range(img.shape[2]):
        out[..., c] = np.real(np.fft.ifft2(np.fft.fft2(img[..., c]) * kernel))
    return out


def streaks(t, strength, octaves=6):
    """Ruido a lo largo de una coordenada: da las estrías del gas."""
    s = np.zeros_like(t)
    for i in range(octaves):
        freq = 6 * 2 ** i * rng.uniform(0.8, 1.2)
        s += np.sin(t * freq + rng.uniform(0, 2 * np.pi)) / (i + 1.5)
    return 1 + strength * s / 1.5


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def render():
    lin = np.linspace(-1, 1, SS)
    x, y = np.meshgrid(lin, lin)
    # Coordenadas giradas: u a lo largo del disco, v perpendicular (v < 0 = arriba)
    u = x * np.cos(TILT) + y * np.sin(TILT)
    v = -x * np.sin(TILT) + y * np.cos(TILT)
    r = np.hypot(u, v)
    angle = np.arctan2(v, u)

    blue = np.array([0.28, 0.56, 1.0])
    warm = np.array([1.0, 0.66, 0.5])

    # --- Disco por delante ---
    along = np.where(np.abs(u) < 0.38, 1.0, np.exp(-((np.abs(u) - 0.38) / 0.24) ** 2))
    thickness = 0.030 * (1 + 0.6 * np.abs(u))
    disk = np.exp(-((v - 0.012) / thickness) ** 2) * along * streaks(u * 3, 0.35)
    disk += 0.5 * np.exp(-((v - 0.034) / 0.010) ** 2) * along * streaks(u * 4, 0.6)
    doppler = 1.35 - 0.55 * np.clip(u + 0.2, 0, 1.2)          # izquierda más brillante
    disk *= doppler * 1.6
    warmth = np.clip(u, 0, 1)[..., None] * 0.7                 # derecha más cálida
    disk_rgb = disk[..., None] * (blue * (1 - warmth) + warm * warmth)

    # --- Lente: arco por encima y por debajo ---
    # Arco redondo alrededor del agujero. Solo cerca del disco (v ≈ 0) el radio crece
    # un poco, así el arco se abre hacia fuera y se funde con el disco sin esquina.
    near_disk = np.exp(-(v / 0.10) ** 2)
    top = np.clip(-v / np.maximum(r, 1e-6), 0, 1)
    radius = 0.40 + 0.08 * top + 0.13 * near_disk
    width = 0.022 + 0.05 * top ** 1.5
    fade = np.maximum(top, 0.3 * near_disk) ** 0.8              # no se apaga al llegar al disco
    arc = np.exp(-((r - radius) / width) ** 2) * fade * (v < 0.02) * streaks(angle * 2, 0.3, 4) * 1.25

    bottom = np.clip(v / np.maximum(r, 1e-6), 0, 1)
    near_disk = np.exp(-(v / 0.05) ** 2)
    radius = 0.37 + 0.05 * near_disk
    fade = np.maximum(bottom, 0.25 * near_disk) ** 1.6
    arc += 0.5 * np.exp(-((r - radius) / 0.014) ** 2) * fade * (v > 0) * streaks(angle * 2, 0.3, 4)

    # --- Anillo de fotones ---
    ring = 1.4 * np.exp(-((r - (HOLE + 0.012)) / 0.007) ** 2)

    behind = (arc + ring)[..., None] * blue
    outside = smoothstep(HOLE - 0.004, HOLE + 0.004, r)[..., None]
    light = behind * outside + disk_rgb

    # --- Bloom y ajuste de tono ---
    px = SS / 2
    bloom = gaussian_blur(light, 0.012 * px) * 0.7 + gaussian_blur(light, 0.05 * px) * 0.8
    halo = np.exp(-((r - 0.40) / 0.22) ** 2)[..., None] * np.array([0.02, 0.18, 0.6]) * 0.6
    color = 1 - np.exp(-(light + bloom + halo) * 1.7)
    # Dentro del horizonte solo se ve el disco que pasa por delante (y poco brillo)
    color_inside = 1 - np.exp(-(disk_rgb + bloom * 0.25) * 1.7)

    # Transparencia: el horizonte es opaco; fuera, según el brillo
    inside = 1 - outside[..., 0]
    alpha = np.clip(color.max(axis=2) * 1.25, 0, 1)
    rgb = np.clip(color / np.maximum(alpha[..., None], 1e-6), 0, 1)
    rgb = rgb * outside + color_inside * (1 - outside)
    alpha = np.maximum(alpha, inside)
    alpha *= 1 - smoothstep(0.82, 0.99, np.hypot(x, y))        # nada llega al borde

    rgba = np.dstack([rgb, alpha])
    return Image.fromarray((rgba * 255).round().astype(np.uint8))


if __name__ == "__main__":
    img = render()
    for size in (512, 64):
        out = ROOT / "assets" / f"logo-{size}.png"
        img.resize((size, size), Image.LANCZOS).save(out, optimize=True)
        print("->", out.relative_to(ROOT))
