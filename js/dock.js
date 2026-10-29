/*
 * Dock: los iconos crecen al acercar el ratón (como en macOS)
 * y rebotan al abrir una ventana que estaba cerrada.
 */

const Dock = {
  MAX_SCALE: 1.6,
  RANGE: 150, // px alrededor del ratón que notan el efecto

  init() {
    const dock = document.getElementById("dock");
    let centers = [];

    const items = () => [...dock.querySelectorAll(".dock__item")];

    // Guardamos los centros con el Dock en reposo para que el efecto no tiemble
    dock.addEventListener("pointerenter", () => {
      centers = items().map((item) => {
        const r = item.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    });

    dock.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || MOBILE.matches || REDUCED_MOTION.matches) return;
      items().forEach((item, i) => {
        const distance = Math.min(Math.abs(e.clientX - centers[i]) / this.RANGE, 1);
        const scale = 1 + (this.MAX_SCALE - 1) * Math.cos((distance * Math.PI) / 2);
        item.style.setProperty("--s", scale.toFixed(3));
      });
    });

    dock.addEventListener("pointerleave", () => {
      items().forEach((item) => item.style.removeProperty("--s"));
    });
  },

  bounce(button) {
    if (!button || REDUCED_MOTION.matches || button.classList.contains("is-running")) return;
    button.classList.remove("is-launching");
    void button.offsetWidth; // reinicia la animación CSS
    button.classList.add("is-launching");
    button.addEventListener("animationend", () => button.classList.remove("is-launching"), { once: true });
  },
};
