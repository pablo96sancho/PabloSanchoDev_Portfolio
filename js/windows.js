/*
 * Gestor de ventanas: abrir, cerrar, minimizar al Dock, ampliar, arrastrar
 * y traer al frente. En móvil las ventanas van apiladas y casi todo esto se desactiva.
 */

const MOBILE = window.matchMedia("(max-width: 820px)");
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

// Espacio que ocupan la barra de menú y el Dock (igual que en css/base.css)
const MENUBAR_H = 32;
const DOCK_SPACE = 96;
const MARGIN = 12;

// Posición inicial de cada ventana: x e y son fracciones del escritorio libre
const LAYOUT = {
  finder:   { x: 0.05, y: 0.03, w: 760, h: 520 },
  contact:  { x: 0.6,  y: 0.56, w: 560, h: 300 },
  detail:   { x: 0.58, y: 0.12, w: 460, h: null }, // null: alto según el contenido
};

const EASE = "cubic-bezier(.2, .8, .2, 1)";

const Windows = {
  z: 10,
  beforeMax: {},

  get(id) {
    return document.querySelector(`[data-window="${id}"]`);
  },

  isVisible(win) {
    return win.classList.contains("is-open") && !win.classList.contains("is-minimized");
  },

  // Rectángulo del escritorio libre (sin barra de menú ni Dock)
  area() {
    return {
      left: MARGIN,
      top: MENUBAR_H + MARGIN,
      right: window.innerWidth - MARGIN,
      bottom: window.innerHeight - DOCK_SPACE,
    };
  },

  // Coloca cada ventana en su sitio inicial, ajustándola si la pantalla es pequeña
  layout() {
    const a = this.area();
    const areaW = a.right - a.left;
    const areaH = a.bottom - a.top;
    for (const [id, l] of Object.entries(LAYOUT)) {
      const win = this.get(id);
      const w = Math.min(l.w, areaW);
      const h = Math.min(l.h ?? 0, areaH);
      const left = Math.min(a.left + l.x * areaW, a.right - w);
      const top = Math.min(a.top + l.y * areaH, a.bottom - h);
      Object.assign(win.style, { left: `${left}px`, top: `${top}px`, width: `${w}px`, height: l.h ? `${h}px` : "" });
    }
  },

  // Si se hace pequeña la ventana del navegador, que ninguna ventana se quede fuera
  clampAll() {
    const a = this.area();
    document.querySelectorAll(".window").forEach((win) => {
      if (win.classList.contains("is-max")) return this.fillArea(win);
      const left = Math.max(a.left - win.offsetWidth + 120, Math.min(win.offsetLeft, a.right - 120));
      const top = Math.max(MENUBAR_H, Math.min(win.offsetTop, a.bottom - 40));
      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
    });
  },

  focus(win) {
    document.querySelectorAll(".window.is-focused").forEach((w) => w.classList.remove("is-focused"));
    win.classList.add("is-focused");
    win.style.zIndex = ++this.z;
  },

  // id puede ser una ventana o una sección del Finder (about, projects, stack)
  open(id) {
    if (SECTIONS.includes(id)) {
      Finder.show(id);
      id = "finder";
    }
    const win = this.get(id);
    if (!win) return;

    if (MOBILE.matches) {
      if (id === "detail") {
        win.classList.add("is-open");
        document.body.classList.add("sheet-open");
        win.querySelector(".detail__body").scrollTop = 0;
      } else {
        win.scrollIntoView({ behavior: REDUCED_MOTION.matches ? "auto" : "smooth", block: "start" });
      }
      return;
    }

    if (win.classList.contains("is-minimized")) {
      win.classList.remove("is-minimized");
      this.animate(win, this.dockTransform(win), "none", 380, [0, 1]).then((a) => a?.cancel());
    } else if (!win.classList.contains("is-open")) {
      win.classList.add("is-open");
      this.animate(win, "scale(.94) translateY(12px)", "none", 320, [0, 1]).then((a) => a?.cancel());
    }
    this.focus(win);
    this.syncDock();
  },

  close(win) {
    if (MOBILE.matches) {
      if (win.dataset.window === "detail") {
        win.classList.remove("is-open");
        document.body.classList.remove("sheet-open");
      }
      return;
    }
    this.animate(win, "none", "scale(.94)", 200, [1, 0]).then((anim) => {
      win.classList.remove("is-open", "is-focused");
      anim?.cancel();
      this.syncDock();
    });
  },

  minimize(win) {
    if (MOBILE.matches) return;
    this.animate(win, "none", this.dockTransform(win), 420, [1, 0]).then((anim) => {
      win.classList.add("is-minimized");
      win.classList.remove("is-focused");
      anim?.cancel();
      this.syncDock();
    });
  },

  toggleMaximize(win) {
    if (MOBILE.matches) return;
    const id = win.dataset.window;
    win.classList.add("is-resizing");
    if (win.classList.contains("is-max")) {
      win.classList.remove("is-max");
      Object.assign(win.style, this.beforeMax[id]);
    } else {
      this.beforeMax[id] = {
        left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height,
      };
      win.classList.add("is-max");
      this.fillArea(win);
    }
    setTimeout(() => win.classList.remove("is-resizing"), 320);
    this.focus(win);
  },

  fillArea(win) {
    const a = this.area();
    Object.assign(win.style, {
      left: `${a.left}px`, top: `${a.top}px`,
      width: `${a.right - a.left}px`, height: `${a.bottom - a.top}px`,
    });
  },

  // Transformación que lleva la ventana hasta su icono del Dock (efecto minimizar)
  dockTransform(win) {
    const id = win.dataset.window === "finder" ? Finder.current : win.dataset.window;
    const project = win.dataset.showing;
    const target =
      document.querySelector(`.dock [data-open="${id}"]`) ||
      document.querySelector(`.dock [data-project="${project}"]`) ||
      document.querySelector('.dock [data-open="projects"]');
    const from = win.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.width / from.width;
    return `translate(${dx}px, ${dy}px) scale(${scale})`;
  },

  // Anima transform y opacidad entre dos estados. La animación se queda en su
  // estado final hasta que quien la llama la cancela (así no parpadea al ocultar).
  animate(win, from, to, duration, opacity) {
    if (REDUCED_MOTION.matches) return Promise.resolve(null);
    const anim = win.animate(
      [{ transform: from, opacity: opacity[0] }, { transform: to, opacity: opacity[1] }],
      { duration, easing: EASE, fill: "forwards" }
    );
    return anim.finished.then(() => anim, () => null);
  },

  // Punto bajo el icono del Dock de las ventanas abiertas
  syncDock() {
    document.querySelectorAll(".dock [data-open]").forEach((btn) => {
      const id = btn.dataset.open;
      const isSection = SECTIONS.includes(id);
      const win = this.get(isSection ? "finder" : id);
      const running = win.classList.contains("is-open") && (!isSection || Finder.current === id);
      btn.classList.toggle("is-running", running);
    });
    const detail = this.get("detail");
    document.querySelectorAll(".dock [data-project]").forEach((btn) => {
      const running = detail.classList.contains("is-open") && detail.dataset.showing === btn.dataset.project;
      btn.classList.toggle("is-running", running);
    });
  },

  // Arrastrar ventanas por la barra de título o la barra lateral
  enableDragging() {
    let drag = null;

    document.addEventListener("pointerdown", (e) => {
      const handle = e.target.closest(".window__drag");
      if (!handle || MOBILE.matches || e.button !== 0) return;
      if (e.target.closest("button, a, input")) return;
      const win = handle.closest(".window");
      if (win.classList.contains("is-max")) return;
      drag = { win, dx: e.clientX - win.offsetLeft, dy: e.clientY - win.offsetTop };
      handle.setPointerCapture(e.pointerId);
      document.body.classList.add("is-dragging");
    });

    document.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const a = this.area();
      const w = drag.win.offsetWidth;
      const left = Math.max(a.left - w + 120, Math.min(e.clientX - drag.dx, a.right - 120));
      const top = Math.max(MENUBAR_H, Math.min(e.clientY - drag.dy, a.bottom - 40));
      drag.win.style.left = `${left}px`;
      drag.win.style.top = `${top}px`;
    });

    const stop = () => {
      drag = null;
      document.body.classList.remove("is-dragging");
    };
    document.addEventListener("pointerup", stop);
    document.addEventListener("pointercancel", stop);

    // Doble clic en la barra de título: ampliar, como en macOS
    document.addEventListener("dblclick", (e) => {
      const handle = e.target.closest(".window__drag");
      if (!handle || e.target.closest("button, a")) return;
      this.toggleMaximize(handle.closest(".window"));
    });
  },
};
