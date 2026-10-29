/*
 * Pinta en el HTML el contenido que sale de data.js y i18n.js:
 * semáforos de las ventanas, barra lateral del Finder, proyectos, stack, papelera,
 * ficha de un proyecto y apps del Dock.
 */

// Crea un elemento: el("a", { href: "…", class: "x" }, "texto", otroElemento)
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "style") node.style.cssText = value;
    else node.setAttribute(key, value);
  }
  node.append(...children.filter((c) => c !== null && c !== undefined && c !== false));
  return node;
}

// Iconos pequeños de la barra lateral (mismo dibujo que en el Dock)
const SIDEBAR_ICONS = {
  about: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c.8-4.2 3.8-6.5 7.5-6.5s6.7 2.3 7.5 6.5"/>',
  projects: '<path d="M3 7.5a2 2 0 0 1 2-2h4.2l2 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  stack: '<path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z"/><path d="M3.5 12.2l8.5 4.5 8.5-4.5"/><path d="M3.5 16.2l8.5 4.5 8.5-4.5"/>',
  contact: '<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="M7 9.5l3 2.5-3 2.5"/><path d="M12.5 15h4.5"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
};

function svgIcon(paths) {
  const span = el("span", { class: "sidebar__glyph", "aria-hidden": "true" });
  span.innerHTML = `<svg viewBox="0 0 24 24">${paths}</svg>`;
  return span;
}

function trafficButtons() {
  return [
    el("button", { type: "button", class: "traffic__btn traffic__btn--close", "data-action": "close", "aria-label": I18N.t("window.close") }),
    el("button", { type: "button", class: "traffic__btn traffic__btn--min", "data-action": "minimize", "aria-label": I18N.t("window.minimize") }),
    el("button", { type: "button", class: "traffic__btn traffic__btn--max", "data-action": "maximize", "aria-label": I18N.t("window.maximize") }),
  ];
}

function renderTrafficLights() {
  document.querySelectorAll(".window__titlebar .traffic").forEach((box) => box.replaceChildren(...trafficButtons()));
}

// Barra lateral del Finder: marca la sección que se está viendo
function renderSidebar() {
  const sections = ["about", "projects", "stack", "contact"].map((id) =>
    el("li", {},
      el("button", { type: "button", class: "sidebar__item", "data-open": id, "aria-current": id === Finder.current ? "page" : null },
        svgIcon(SIDEBAR_ICONS[id]), I18N.t(`menu.${id}`)))
  );
  const links = [["GitHub", GITHUB], ["LinkedIn", LINKEDIN]].map(([name, url]) =>
    el("li", {},
      el("a", { class: "sidebar__item", href: url, target: "_blank", rel: "noopener" },
        svgIcon(SIDEBAR_ICONS.link), name))
  );
  document.getElementById("finder-sidebar").replaceChildren(
    el("div", { class: "traffic" }, ...trafficButtons()),
    el("p", { class: "sidebar__heading" }, I18N.t("sidebar.favorites")),
    el("ul", { class: "sidebar__list sidebar__list--sections" }, ...sections),
    el("p", { class: "sidebar__heading" }, I18N.t("sidebar.links")),
    el("ul", { class: "sidebar__list" }, ...links),
  );
}

function statusBadge(status) {
  return el("span", { class: `badge badge--${status}` }, I18N.t(`status.${status}`));
}

// Tarjeta grande del proyecto destacado (arriba de Proyectos)
function renderFeatured() {
  const p = PROJECTS.find((project) => project.featured);
  const box = document.getElementById("featured");
  if (!p) return box.replaceChildren();
  box.replaceChildren(
    el("article", { class: "featured" },
      el("img", { class: "featured__icon", src: p.icon, alt: "", width: 88, height: 88 }),
      el("div", { class: "featured__body" },
        el("p", { class: "featured__label" }, el("span", { class: "dot dot--green" }), I18N.t("projects.featured")),
        el("h3", { class: "featured__name" }, I18N.pick(p.name)),
        el("p", { class: "featured__tagline" }, I18N.pick(p.tagline)),
        el("ul", { class: "chips" }, ...p.tech.map((t) => el("li", { class: "chip" }, t))),
        el("div", { class: "featured__actions" },
          p.site ? el("a", { class: "button button--primary", href: p.site, target: "_blank", rel: "noopener" }, I18N.t("detail.site")) : null,
          el("button", { type: "button", class: "button", "data-project": p.id }, I18N.t("detail.more")))))
  );
}

function renderProjects() {
  renderFeatured();
  const grid = document.getElementById("projects-grid");
  grid.replaceChildren(...PROJECTS.filter((p) => !p.featured).map((p) =>
    el("li", {},
      el("button", { type: "button", class: "icon-grid__item", "data-project": p.id },
        el("img", { src: p.icon, alt: "", width: 72, height: 72, draggable: "false" }),
        el("span", { class: "icon-grid__name" }, I18N.pick(p.name)),
        statusBadge(p.status)))
  ));
}

// Papelera: mismos iconos que Proyectos, pero apagados
function renderTrash() {
  document.getElementById("trash-grid").replaceChildren(...TRASH.map((p) =>
    el("li", {},
      el("button", { type: "button", class: "icon-grid__item", "data-project": p.id },
        el("img", { src: p.icon, alt: "", width: 72, height: 72, draggable: "false" }),
        el("span", { class: "icon-grid__name" }, I18N.pick(p.name)),
        el("span", { class: "icon-grid__tagline" }, I18N.pick(p.tagline))))
  ));
}

function renderStack() {
  const box = document.getElementById("stack-content");
  const legend = el("p", { class: "stack-legend" }, el("span", { class: "tech__learning" }), I18N.t("stack.legend"));
  box.replaceChildren(legend, ...STACK.map((group) =>
    el("section", { class: "stack-group" },
      el("h3", { class: "stack-group__title" }, I18N.t(group.group)),
      el("p", { class: "stack-group__sub" }, I18N.t(`${group.group}.sub`)),
      el("ul", { class: "stack-grid" }, ...group.items.map((item) =>
        el("li", { class: "tech" },
          item.learning ? el("span", { class: "tech__learning", title: I18N.t("stack.legend") }) : null,
          el("span", {
            class: "tech__logo",
            "aria-hidden": "true",
            style: `-webkit-mask-image: url("assets/tech/${item.icon}.svg"); mask-image: url("assets/tech/${item.icon}.svg"); --tint: ${item.color}`,
          }),
          el("span", { class: "tech__name" }, item.name))
      )))
  ));
}

// Rellena la ventana de detalle con el proyecto elegido
function renderDetail(id) {
  const p = [...PROJECTS, ...TRASH].find((project) => project.id === id);
  if (!p) return;
  document.getElementById("detail-title").textContent = I18N.pick(p.name);

  const actions = el("div", { class: "detail__actions" });
  if (p.download) {
    actions.append(el("a", { class: "button button--primary", href: p.download }, I18N.t("detail.download")));
  }
  if (p.repo) {
    actions.append(el("a", { class: "button", href: p.repo, target: "_blank", rel: "noopener" }, I18N.t("detail.code")));
  }
  if (p.site) {
    actions.append(el("a", { class: "button button--primary", href: p.site, target: "_blank", rel: "noopener" }, I18N.t("detail.site")));
  }

  let note = null;
  if (p.status === "available") note = `${I18N.t("detail.requirements")}. ${I18N.t("detail.unsigned")}`;
  if (p.status === "soon") note = I18N.t("detail.soon");
  if (p.status === "private") note = I18N.t("detail.private");
  if (p.status === "discarded") note = I18N.t("detail.discarded");

  const body = el("div", {},
    el("div", { class: "detail__head" },
      el("img", { class: "detail__icon", src: p.icon, alt: "", width: 96, height: 96 }),
      el("div", {},
        el("h3", { class: "detail__name" }, I18N.pick(p.name)),
        el("p", { class: "detail__tagline" }, I18N.pick(p.tagline)),
        statusBadge(p.status))),
    el("p", { class: "detail__text" }, I18N.pick(p.description)),
    el("p", { class: "detail__label" }, I18N.t("detail.tech")),
    el("ul", { class: "chips" }, ...p.tech.map((t) => el("li", { class: "chip" }, t))),
    actions.children.length ? actions : null,
    note ? el("p", { class: "detail__note" }, note) : null,
  );
  document.getElementById("detail-body").replaceChildren(...body.childNodes);
  // "showing" y no "project": data-project es lo que abre una ficha al hacer clic
  document.getElementById("win-detail").dataset.showing = id;
}

function renderDockApps() {
  const list = document.querySelector(".dock__list");
  const trash = document.getElementById("dock-trash-divider"); // las apps van antes de la Papelera
  list.querySelectorAll("[data-dock-app]").forEach((li) => li.remove());
  PROJECTS.filter((p) => p.icon.endsWith(".png")).forEach((p) => {
    trash.before(el("li", { "data-dock-app": "" },
      el("button", { type: "button", class: "dock__item", "data-project": p.id, "aria-label": I18N.pick(p.name) },
        el("img", { class: "dock__icon", src: p.icon, alt: "", draggable: "false" }))));
  });
  // Como en macOS: la Papelera sale llena si tiene algo dentro
  document.getElementById("dock-trash").src = TRASH.length ? "assets/trash-full.png" : "assets/trash.png";
}

function renderAll() {
  renderSidebar();
  renderTrafficLights();
  Finder.updateTexts();
  renderProjects();
  renderStack();
  renderTrash();
  renderDockApps();
  const detail = document.getElementById("win-detail").dataset.showing;
  if (detail) renderDetail(detail);
}
