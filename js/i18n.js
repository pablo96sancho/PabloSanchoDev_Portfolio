/*
 * Textos de la web en español e inglés.
 * En el HTML, un elemento con data-i18n="clave" recibe el texto de esa clave,
 * y uno con data-i18n-aria="clave" lo recibe en su aria-label.
 * Todo lo marcado como provisional se irá rellenando.
 */

const TEXTS = {
  es: {
    "menu.about": "Sobre mí",
    "menu.projects": "Proyectos",
    "menu.stack": "Stack",
    "menu.contact": "Contacto",
    "menu.wallpaper": "Cambiar fondo de escritorio",
    "menu.language": "Idioma",

    "window.close": "Cerrar",
    "window.minimize": "Minimizar",
    "window.maximize": "Ampliar",

    "sidebar.favorites": "Favoritos",
    "sidebar.links": "Enlaces",
    "finder.back": "Atrás",
    "finder.forward": "Adelante",

    "widget.title": "Ahora mismo",
    "widget.study": "Estudiando DAM",
    "widget.build": "Construyendo UnRecent",
    "widget.place": "Valencia, España",

    "about.role": "Desarrollador de apps · Estudiante de DAM",
    "about.lead": "Hago apps para macOS que resuelven cosas pequeñas del día a día, y webs que funcionan de verdad: con pagos, descargas y usuarios reales.",
    "about.ctaProjects": "Ver proyectos",
    "about.ctaContact": "Contactar",
    "about.email": "Correo",
    "about.p1": "[Provisional] Estudio Desarrollo de Aplicaciones Multiplataforma y publico mis apps de Mac en GitHub, con instalador incluido.",
    "about.p2": "[Provisional] Me gusta construir herramientas pequeñas que resuelven algo concreto: limpiar el teclado sin que se pulse nada, que la pantalla no se apague, convertir archivos sin abrir otra app.",
    "about.p3": "[Provisional] También he montado mi propia tienda online con pagos y descargas, y vengo del bootcamp de ciberseguridad de The Bridge.",
    "about.k.studies": "Estudios",
    "about.v.studies": "DAM · Desarrollo de Aplicaciones Multiplataforma",
    "about.k.training": "Formación",
    "about.v.training": "Bootcamp de Ciberseguridad · The Bridge",
    "about.k.now": "Ahora",
    "about.v.now": "Construyendo UnRecent",
    "about.k.place": "Ubicación",
    "about.v.place": "Valencia, España",
    "about.k.languages": "Idiomas",
    "about.v.languages": "Español · Inglés",

    "projects.items": "{n} elementos",
    "projects.featured": "Proyecto destacado · En producción",
    "status.available": "Disponible",
    "status.soon": "Próximamente",
    "status.private": "Código privado",

    "detail.download": "Descargar .dmg",
    "detail.code": "Ver código",
    "detail.site": "Visitar web",
    "detail.requirements": "Apple Silicon · macOS 13 o posterior",
    "detail.unsigned": "La app no está firmada: la primera vez, clic derecho → Abrir.",
    "detail.soon": "Todavía no está disponible.",
    "detail.private": "El código es privado, pero la web está en marcha.",
    "detail.tech": "Tecnologías",
    "detail.more": "Más información",

    "stack.legend": "Aprendiendo en DAM",
    "stack.mac": "macOS",
    "stack.mac.sub": "Apps nativas para Mac",
    "stack.web": "Web",
    "stack.web.sub": "Webs y tiendas online",
    "stack.backend": "Backend y datos",
    "stack.backend.sub": "Pagos, archivos, servidores y bases de datos",
    "stack.mobile": "Móvil y multiplataforma",
    "stack.mobile.sub": "Apps para Android y lenguajes de clase",
    "stack.audio": "Audio",
    "stack.audio.sub": "Plugins de audio",
    "stack.tools": "Herramientas",
    "stack.tools.sub": "Con lo que trabajo cada día",

    "term.lastLogin": "Last login: {date} on ttys001",
    "term.hint": "Escribe help para ver los comandos, o toca una sugerencia de abajo.",
    "term.help": [
      "Comandos disponibles:",
      "  whoami      quién soy",
      "  ls          lo que hay en este escritorio",
      "  projects    mis proyectos",
      "  stack       tecnologías que uso",
      "  email       mi correo (y lo copia)",
      "  linkedin    mi perfil de LinkedIn",
      "  github      mi perfil de GitHub",
      "  open <x>    abre una ventana (about, projects, stack)",
      "  lang <es|en> cambia el idioma",
      "  clear       limpia la terminal",
    ],
    "term.whoami": "Pablo Sancho — desarrollador de apps para macOS y estudiante de DAM. Valencia.",
    "term.copied": "(copiado al portapapeles)",
    "term.notFound": "zsh: command not found: {cmd}",
    "term.openUsage": "uso: open <about|projects|stack>",
    "term.opening": "Abriendo {name}…",
    "term.langUsage": "uso: lang <es|en>",
    "term.sudo": "pablo no está en el archivo sudoers. Este incidente será reportado.",
    "term.contactMe": "Escríbeme:",
  },

  en: {
    "menu.about": "About",
    "menu.projects": "Projects",
    "menu.stack": "Stack",
    "menu.contact": "Contact",
    "menu.wallpaper": "Change wallpaper",
    "menu.language": "Language",

    "window.close": "Close",
    "window.minimize": "Minimize",
    "window.maximize": "Zoom",

    "sidebar.favorites": "Favorites",
    "sidebar.links": "Links",
    "finder.back": "Back",
    "finder.forward": "Forward",

    "widget.title": "Right now",
    "widget.study": "Studying app development",
    "widget.build": "Building UnRecent",
    "widget.place": "Valencia, Spain",

    "about.role": "App developer · Multiplatform App Development student",
    "about.lead": "I build macOS apps that fix small everyday annoyances, and websites that work for real: payments, downloads and real users.",
    "about.ctaProjects": "See projects",
    "about.ctaContact": "Get in touch",
    "about.email": "Email",
    "about.p1": "[Placeholder] I'm studying Multiplatform Application Development and I publish my Mac apps on GitHub, installer included.",
    "about.p2": "[Placeholder] I like building small tools that solve one specific thing: cleaning the keyboard without pressing anything, keeping the screen awake, converting files without opening another app.",
    "about.p3": "[Placeholder] I've also built my own online store with payments and downloads, and I did The Bridge's cybersecurity bootcamp.",
    "about.k.studies": "Studies",
    "about.v.studies": "DAM · Multiplatform Application Development",
    "about.k.training": "Training",
    "about.v.training": "Cybersecurity Bootcamp · The Bridge",
    "about.k.now": "Now",
    "about.v.now": "Building UnRecent",
    "about.k.place": "Location",
    "about.v.place": "Valencia, Spain",
    "about.k.languages": "Languages",
    "about.v.languages": "Spanish · English",

    "projects.items": "{n} items",
    "projects.featured": "Featured project · Live",
    "status.available": "Available",
    "status.soon": "Coming soon",
    "status.private": "Private code",

    "detail.download": "Download .dmg",
    "detail.code": "View code",
    "detail.site": "Visit site",
    "detail.requirements": "Apple Silicon · macOS 13 or later",
    "detail.unsigned": "The app isn't signed: the first time, right-click → Open.",
    "detail.soon": "Not available yet.",
    "detail.private": "The code is private, but the site is live.",
    "detail.tech": "Technologies",
    "detail.more": "More info",

    "stack.legend": "Learning in class",
    "stack.mac": "macOS",
    "stack.mac.sub": "Native Mac apps",
    "stack.web": "Web",
    "stack.web.sub": "Websites and online stores",
    "stack.backend": "Backend & data",
    "stack.backend.sub": "Payments, files, servers and databases",
    "stack.mobile": "Mobile & multiplatform",
    "stack.mobile.sub": "Android apps and the languages I study",
    "stack.audio": "Audio",
    "stack.audio.sub": "Audio plugins",
    "stack.tools": "Tools",
    "stack.tools.sub": "What I work with every day",

    "term.lastLogin": "Last login: {date} on ttys001",
    "term.hint": "Type help to see the commands, or tap a suggestion below.",
    "term.help": [
      "Available commands:",
      "  whoami      who I am",
      "  ls          what's on this desktop",
      "  projects    my projects",
      "  stack       technologies I use",
      "  email       my email (and copy it)",
      "  linkedin    my LinkedIn profile",
      "  github      my GitHub profile",
      "  open <x>    open a window (about, projects, stack)",
      "  lang <es|en> change the language",
      "  clear       clear the terminal",
    ],
    "term.whoami": "Pablo Sancho — macOS app developer and Multiplatform App Development student. Valencia, Spain.",
    "term.copied": "(copied to clipboard)",
    "term.notFound": "zsh: command not found: {cmd}",
    "term.openUsage": "usage: open <about|projects|stack>",
    "term.opening": "Opening {name}…",
    "term.langUsage": "usage: lang <es|en>",
    "term.sudo": "pablo is not in the sudoers file. This incident will be reported.",
    "term.contactMe": "Get in touch:",
  },
};

const I18N = {
  lang: "es",

  // Elige el idioma inicial: el guardado, o si no, el del navegador
  init() {
    let saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) { /* sin almacenamiento */ }
    const browser = (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";
    this.lang = saved === "es" || saved === "en" ? saved : browser;
  },

  // Devuelve el texto de una clave, sustituyendo {variables}
  t(key, vars = {}) {
    const value = TEXTS[this.lang][key] ?? TEXTS.es[key] ?? key;
    if (typeof value !== "string") return value;
    return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  },

  // Coge el texto en el idioma actual de un campo bilingüe { es, en }
  pick(field) {
    return typeof field === "string" ? field : field[this.lang] ?? field.es;
  },

  set(lang) {
    this.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) { /* sin almacenamiento */ }
    this.apply();
    document.dispatchEvent(new CustomEvent("langchange"));
  },

  // Rellena todos los textos marcados en el HTML
  apply() {
    document.documentElement.lang = this.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", this.t(el.dataset.i18nAria));
    });
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.lang === this.lang);
    });
  },
};
