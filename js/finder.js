/*
 * Finder: una sola ventana con cuatro paneles (Sobre mí, Proyectos, Stack y Papelera).
 * La barra lateral cambia de panel y las flechas ‹ › van atrás y adelante.
 */

const SECTIONS = ["about", "projects", "stack", "trash"];

const Finder = {
  current: "about",
  history: ["about"],
  index: 0,

  init() {
    document.getElementById("finder-back").addEventListener("click", () => this.go(-1));
    document.getElementById("finder-forward").addEventListener("click", () => this.go(1));
    // "Vaciar" la Papelera nunca la vacía
    document.getElementById("trash-empty").addEventListener("click", () => {
      document.getElementById("trash-text").textContent = I18N.t("trash.refuse");
    });
    this.show("about", false);
  },

  // Cambia al panel id. record = false cuando venimos de las flechas.
  show(id, record = true) {
    if (record && id !== this.current) {
      this.history = this.history.slice(0, this.index + 1);
      this.history.push(id);
      this.index = this.history.length - 1;
    }
    const changed = id !== this.current;
    this.current = id;

    document.querySelectorAll("[data-pane]").forEach((pane) => {
      pane.hidden = pane.dataset.pane !== id;
    });
    const pane = document.querySelector(`[data-pane="${id}"]`);
    if (changed && !REDUCED_MOTION.matches) {
      pane.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: EASE });
    }
    document.getElementById("finder-content").scrollTop = 0;

    this.updateTexts();
    renderSidebar();
    document.getElementById("finder-back").disabled = this.index === 0;
    document.getElementById("finder-forward").disabled = this.index === this.history.length - 1;
    Windows.syncDock();
  },

  go(step) {
    const index = this.index + step;
    if (index < 0 || index >= this.history.length) return;
    this.index = index;
    this.show(this.history[index], false);
  },

  // Título de la ventana y texto de la barra de estado del panel actual
  updateTexts() {
    document.getElementById("finder-title").textContent = I18N.t(`menu.${this.current}`);
    const counts = {
      projects: PROJECTS.length,
      stack: STACK.reduce((total, group) => total + group.items.length, 0),
      trash: TRASH.length,
    };
    const n = counts[this.current];
    document.getElementById("finder-status").textContent = n ? I18N.t("projects.items", { n }) : "";
  },
};
