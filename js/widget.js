/*
 * Widget "Últimas versiones": la última release de cada app, leída en directo
 * de la API de GitHub. Si GitHub no responde, usa las versiones de data.js.
 */

const Releases = {
  items: [],

  init() {
    // Primero lo que sabemos (data.js) para que el widget nunca salga vacío
    this.items = PROJECTS.filter((p) => p.release).map((p) => ({
      project: p,
      version: p.release.version,
      date: new Date(p.release.date),
      url: `${p.repo}/releases/latest`,
    }));
    this.render();
    this.refresh();
    document.addEventListener("langchange", () => this.render());
  },

  async refresh() {
    let cached = null;
    try { cached = JSON.parse(sessionStorage.getItem("releases")); } catch (e) { /* sin almacenamiento */ }

    const updates = cached || await Promise.all(this.items.map(async (item) => {
      const repo = item.project.repo.replace("https://github.com/", "");
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
        if (!res.ok) return null;
        const data = await res.json();
        return { id: item.project.id, version: data.tag_name, date: data.published_at, url: data.html_url };
      } catch (e) {
        return null;
      }
    }));

    if (!cached) {
      try { sessionStorage.setItem("releases", JSON.stringify(updates)); } catch (e) { /* sin almacenamiento */ }
    }
    updates.filter(Boolean).forEach((u) => {
      const item = this.items.find((i) => i.project.id === u.id);
      if (item) Object.assign(item, { version: u.version, date: new Date(u.date), url: u.url });
    });
    this.render();
  },

  // "hace 2 días", "hace 3 semanas"…
  ago(date) {
    const rtf = new Intl.RelativeTimeFormat(I18N.lang, { numeric: "auto" });
    const days = Math.round((date - Date.now()) / 86400000);
    if (Math.abs(days) < 7) return rtf.format(days, "day");
    if (Math.abs(days) < 30) return rtf.format(Math.round(days / 7), "week");
    return rtf.format(Math.round(days / 30), "month");
  },

  render() {
    const sorted = [...this.items].sort((a, b) => b.date - a.date);
    document.getElementById("releases").replaceChildren(...sorted.map((item) =>
      el("li", {},
        el("a", { class: "release", href: item.url, target: "_blank", rel: "noopener" },
          el("img", { class: "release__icon", src: item.project.icon, alt: "", width: 34, height: 34 }),
          el("span", { class: "release__text" },
            el("span", { class: "release__name" }, I18N.pick(item.project.name)),
            el("span", { class: "release__date" }, this.ago(item.date))),
          el("span", { class: "release__version" }, item.version)))
    ));
  },
};
