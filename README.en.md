<div align="center">

<img src="assets/logo-512.png" width="128" alt="Logo: a black hole" />

# Pablo Sancho · Portfolio

**My developer website, built as a macOS desktop.**

[![Visit the site](https://img.shields.io/badge/Visit_the_site-0071E3?style=for-the-badge&logo=safari&logoColor=white)](https://pablosanchodev.vercel.app)

![HTML](https://img.shields.io/badge/HTML-000000?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-000000?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=flat-square&logo=javascript&logoColor=white)
![No frameworks](https://img.shields.io/badge/no_frameworks-000000?style=flat-square)

[🇪🇸 Versión en español](./README.md)

</div>

<br />

<p align="center">
  <img src="docs/cover.jpg" width="820" alt="The site on desktop, with Finder, Terminal and the Dock, and on mobile with the windows stacked" />
</p>

Instead of a scrolling page, the site is a Mac desktop where every section is a window.
**About**, **Projects** and **Stack** live in a Finder window, and **Contact** is a Terminal
you can actually type into. It's built with plain HTML, CSS and JavaScript: no frameworks,
no libraries.

## Features

- 🪟 **macOS windows:** drag them, bring them to the front, double-click to zoom and minimize them into their Dock icon.
- 📁 **A real Finder:** the sidebar switches sections inside the same window, and ‹ › go back and forward.
- ⌨️ **Contact terminal:** understands `help`, `whoami`, `projects`, `email` (and copies it), `linkedin`, `open stack`, `lang es`… with history (↑ ↓) and Tab completion. Suggestions below for anyone who'd rather not type.
- 🧲 **Dock** with hover magnification and a bounce when a window opens.
- 📦 **"Latest releases" widget:** reads each app's latest release live from the GitHub API.
- 📱 **Mobile:** windows stack, the Dock becomes the navigation and each project's details slide up as a sheet.
- 🌍 **Spanish and English:** picked from the browser language, switchable from the menu bar.
- ♿ **Accessible:** keyboard-friendly, buttons are labelled for screen readers and it respects "Reduce motion".

## Projects on the site

| | Project | What it is |
|---|---|---|
| <img src="assets/apps/cleanbruh.png" width="32" /> | [CleanBRUH](https://github.com/pablo96sancho/CleanBRUH) | Locks keyboard, mouse and trackpad so you can clean your Mac |
| <img src="assets/apps/cafelero.png" width="32" /> | [Cafelero](https://github.com/pablo96sancho/Cafelero) | Keeps your Mac's screen awake |
| <img src="assets/apps/convertbruh.png" width="32" /> | [ConvertBRUH](https://github.com/pablo96sancho/ConvertBRUH) | Converts files right from Finder |
| <img src="assets/apps/unrecent.png" width="32" /> | UnRecent | Removes files from Recents without deleting them · *coming soon* |
| <img src="assets/apps/djokovox.png" width="32" /> | Djoko_vox | Vocal recording audio plugin (C++, JUCE) · *coming soon* |
| <img src="assets/apps/tienda.png" width="32" /> | Online store | Stripe payments, files on Cloudflare R2 and signed downloads |

## How it's built

```
index.html          menu bar, desktop with the windows, and Dock
css/                base · desktop · window · sections · terminal · mobile
js/
  i18n.js           every text in Spanish and English
  data.js           projects and stack (adding one = adding an object)
  render.js         renders the content from data.js
  windows.js        open, close, minimize, zoom and drag windows
  finder.js         Finder panes and ‹ › history
  dock.js           magnification and bounce
  terminal.js       the terminal and its commands
  widget.js         latest releases from the GitHub API
  main.js           startup
tools/
  render_logo.py    renders the black hole logo (numpy + Pillow)
```

Some of what it uses: `backdrop-filter` for the glass windows, the Web Animations API for
opening and minimizing, CSS masks to paint each logo in its brand colour, `Intl` for dates
and times in each language, and `IntersectionObserver` so the terminal starts when it's seen.

## Run it locally

```bash
git clone https://github.com/pablo96sancho/PabloSanchoDev_Portfolio.git
cd PabloSanchoDev_Portfolio
python3 -m http.server 8000
```

Then open <http://localhost:8000>. It needs a server: opening `index.html` directly makes the
browser block the logo masks.

## The logo

It's a Gargantua-style black hole (*Interstellar*): the disk crosses in front, and its far
side is bent above and below by gravity. It isn't hand-drawn; it's rendered with
[`tools/render_logo.py`](tools/render_logo.py):

```bash
pip3 install numpy pillow
python3 tools/render_logo.py
```

## Credits

- Technology logos: [Simple Icons](https://simpleicons.org) (CC0).

---

<div align="center">

Made by **Pablo Sancho** in Valencia ·
[LinkedIn](https://www.linkedin.com/in/pablo-sancho-alegre/) ·
[GitHub](https://github.com/pablo96sancho)

</div>
