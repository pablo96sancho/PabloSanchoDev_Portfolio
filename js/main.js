/*
 * Arranque: idioma, contenido, ventanas iniciales, reloj, fondo y clics.
 */

const WALLPAPERS = ["assets/wallpapers/gargantua.jpg", "assets/wallpapers/singularity.jpg"];
const START_WINDOWS = ["finder", "contact"];

// ---------- Fondo de escritorio ----------
function setWallpaper(index, animate) {
  const box = document.getElementById("wallpaper");
  const layer = el("div", { class: "wallpaper__layer", style: `background-image: url("${WALLPAPERS[index]}")` });
  box.append(layer);
  if (animate && !REDUCED_MOTION.matches) {
    layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: "ease" })
      .finished.then(() => box.querySelectorAll(".wallpaper__layer:not(:last-child)").forEach((l) => l.remove()));
  } else {
    box.querySelectorAll(".wallpaper__layer:not(:last-child)").forEach((l) => l.remove());
  }
}

function initWallpaper() {
  let index = 0;
  try { index = Number(localStorage.getItem("wallpaper")) % WALLPAPERS.length || 0; } catch (e) { /* sin almacenamiento */ }
  setWallpaper(index, false);

  document.getElementById("wallpaper-btn").addEventListener("click", () => {
    index = (index + 1) % WALLPAPERS.length;
    try { localStorage.setItem("wallpaper", index); } catch (e) { /* sin almacenamiento */ }
    setWallpaper(index, true);
  });
}

// El fondo se mueve un poco con el ratón, como si hubiera profundidad
function initParallax() {
  const box = document.getElementById("wallpaper");
  let frame = null;
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || MOBILE.matches || REDUCED_MOTION.matches || frame) return;
    frame = requestAnimationFrame(() => {
      box.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
      box.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
      frame = null;
    });
  });
}

// ---------- Reloj de la barra de menú y del widget ----------
function updateClock() {
  const now = new Date();
  const locale = I18N.lang === "es" ? "es-ES" : "en-US";
  const day = now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const clock = document.getElementById("clock");
  clock.textContent = `${day}  ${time}`;
  clock.dateTime = now.toISOString();
  document.getElementById("widget-time").textContent = time;
}

// ---------- Clics (un solo listener para toda la página) ----------
function initEvents() {
  document.addEventListener("click", (e) => {
    // Móvil: tocar fuera de la ficha de proyecto la cierra
    if (document.body.classList.contains("sheet-open") && !e.target.closest("#win-detail")) {
      Windows.close(Windows.get("detail"));
      return;
    }

    const opener = e.target.closest("[data-open]");
    if (opener) {
      if (opener.closest(".dock")) Dock.bounce(opener);
      Windows.open(opener.dataset.open);
      return;
    }

    const project = e.target.closest("[data-project]");
    if (project) {
      if (project.closest(".dock")) Dock.bounce(project);
      renderDetail(project.dataset.project);
      Windows.open("detail");
      return;
    }

    const action = e.target.closest("[data-action]");
    if (action) {
      const win = action.closest(".window");
      if (action.dataset.action === "close") Windows.close(win);
      if (action.dataset.action === "minimize") Windows.minimize(win);
      if (action.dataset.action === "maximize") Windows.toggleMaximize(win);
      return;
    }

    const lang = e.target.closest("[data-lang]");
    if (lang) I18N.set(lang.dataset.lang);
  });

  // Clic dentro de una ventana: traerla al frente
  document.addEventListener("pointerdown", (e) => {
    const win = e.target.closest(".window");
    if (win && !MOBILE.matches) Windows.focus(win);
  });

  // Escape cierra la ficha de proyecto
  document.addEventListener("keydown", (e) => {
    const detail = Windows.get("detail");
    if (e.key === "Escape" && Windows.isVisible(detail)) Windows.close(detail);
  });

  document.addEventListener("langchange", () => {
    renderAll();
    updateClock();
    Windows.syncDock();
  });
}

// ---------- Arranque ----------
function init() {
  I18N.init();
  I18N.apply();
  renderAll();
  Finder.init();
  initWallpaper();
  initParallax();
  initEvents();
  Dock.init();
  Terminal.init();
  Windows.enableDragging();

  updateClock();
  setInterval(updateClock, 15000);

  // En ordenador las ventanas se colocan; en móvil van apiladas con CSS
  let laidOut = false;
  const setMode = () => {
    if (!MOBILE.matches && !laidOut) {
      Windows.layout();
      laidOut = true;
    }
    if (MOBILE.matches) document.body.classList.remove("sheet-open");
  };
  setMode();
  MOBILE.addEventListener("change", setMode);

  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (MOBILE.matches || resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      Windows.clampAll();
      resizeFrame = null;
    });
  });

  // Las ventanas iniciales aparecen una detrás de otra (en móvil, sin animar ni hacer scroll)
  if (MOBILE.matches) {
    START_WINDOWS.forEach((id) => Windows.get(id).classList.add("is-open"));
    Windows.syncDock();
  } else {
    START_WINDOWS.forEach((id, i) => setTimeout(() => Windows.open(id), 250 + i * 140));
  }

  // La terminal arranca la primera vez que se ve
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      Terminal.boot();
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById("win-contact"));
}

init();
