/*
 * Terminal de Contacto: entiende unos cuantos comandos (help para verlos)
 * y debajo tiene sugerencias para quien no quiera escribir.
 */

const Terminal = {
  history: [],
  historyIndex: 0,
  booted: false,
  typing: false,
  SUGGESTIONS: ["help", "whoami", "projects", "email", "linkedin"],

  init() {
    this.body = document.getElementById("terminal");
    this.out = document.getElementById("terminal-output");
    this.input = document.getElementById("terminal-input");

    document.getElementById("terminal-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const value = this.input.value;
      this.input.value = "";
      this.run(value);
    });

    this.input.addEventListener("keydown", (e) => this.onKey(e));

    // Clic en cualquier parte de la terminal: escribir (salvo si se selecciona texto)
    this.body.addEventListener("click", (e) => {
      if (e.target.closest("a") || String(window.getSelection())) return;
      this.input.focus({ preventScroll: true });
    });

    this.renderChips();
    document.addEventListener("langchange", () => this.renderChips());
  },

  // Mensaje de bienvenida: se escribe "whoami" solo
  boot() {
    if (this.booted) return;
    this.booted = true;
    const date = new Date().toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }).replace(/,/g, "");
    this.print(I18N.t("term.lastLogin", { date }));
    this.type("whoami").then(() => this.print(I18N.t("term.hint"), "muted"));
  },

  renderChips() {
    const box = document.getElementById("terminal-chips");
    box.replaceChildren(...this.SUGGESTIONS.map((cmd) =>
      el("button", { type: "button", class: "terminal__chip" }, cmd)
    ));
    box.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => this.type(btn.textContent));
    });
  },

  // Escribe un comando letra a letra en la línea y lo ejecuta
  async type(command) {
    if (this.typing) return;
    this.typing = true;
    if (!REDUCED_MOTION.matches) {
      this.input.value = "";
      for (const char of command) {
        this.input.value += char;
        await new Promise((r) => setTimeout(r, 45 + Math.random() * 40));
      }
      await new Promise((r) => setTimeout(r, 160));
    }
    this.input.value = "";
    this.run(command);
    this.typing = false;
  },

  onKey(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const step = e.key === "ArrowUp" ? -1 : 1;
      this.historyIndex = Math.max(0, Math.min(this.history.length, this.historyIndex + step));
      this.input.value = this.history[this.historyIndex] ?? "";
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const match = Object.keys(this.commands).find((c) => c.startsWith(this.input.value) && this.input.value);
      if (match) this.input.value = match;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      this.out.replaceChildren();
    }
  },

  // Añade una línea de salida. Las partes pueden ser texto o elementos (enlaces).
  print(content, variant) {
    const parts = Array.isArray(content) ? content : [content];
    this.out.append(el("div", { class: variant ? `terminal__row terminal__row--${variant}` : "terminal__row" }, ...parts));
    this.body.scrollTop = this.body.scrollHeight;
  },

  link(text, href) {
    const external = href.startsWith("http");
    return el("a", { href, target: external ? "_blank" : null, rel: external ? "noopener" : null }, text);
  },

  run(raw) {
    const line = raw.trim();
    this.print([el("span", { class: "terminal__prompt" }, "pablo@MacBookPro ~ %"), ` ${line}`]);
    if (!line) return;

    this.history.push(line);
    this.historyIndex = this.history.length;

    const [name, ...args] = line.split(/\s+/);
    const command = Object.hasOwn(this.commands, name.toLowerCase()) ? this.commands[name.toLowerCase()] : null;
    if (command) command.call(this, args);
    else this.print(I18N.t("term.notFound", { cmd: name }), "error");
  },

  commands: {
    help() {
      I18N.t("term.help").forEach((row) => this.print(row));
    },
    whoami() {
      this.print(I18N.t("term.whoami"));
    },
    ls() {
      this.print("about.txt   projects/   stack/   contact.sh", "accent");
    },
    projects() {
      PROJECTS.forEach((p) => {
        this.print([I18N.pick(p.name).padEnd(16), el("span", { class: `terminal__status--${p.status}` }, I18N.t(`status.${p.status}`))]);
      });
      this.print("→ open projects", "muted");
    },
    stack() {
      STACK.forEach((group) => {
        this.print([el("span", { class: "terminal__key" }, `${I18N.t(group.group)}: `), group.items.map((i) => i.name).join(", ")]);
      });
    },
    email() {
      this.print(this.link(EMAIL, `mailto:${EMAIL}`));
      navigator.clipboard?.writeText(EMAIL).then(
        () => this.print(I18N.t("term.copied"), "muted"),
        () => {}
      );
    },
    linkedin() {
      this.print(this.link("linkedin.com/in/pablo-sancho-alegre", LINKEDIN));
    },
    github() {
      this.print(this.link("github.com/pablo96sancho", GITHUB));
    },
    contact() {
      this.print(I18N.t("term.contactMe"));
      this.print(["  ✉  ", this.link(EMAIL, `mailto:${EMAIL}`)]);
      this.print(["  in ", this.link("linkedin.com/in/pablo-sancho-alegre", LINKEDIN)]);
    },
    open(args) {
      const aliases = { about: "about", "about.txt": "about", projects: "projects", "projects/": "projects", stack: "stack", "stack/": "stack" };
      const id = aliases[(args[0] || "").toLowerCase()];
      if (!id) return this.print(I18N.t("term.openUsage"), "muted");
      this.print(I18N.t("term.opening", { name: I18N.t(`menu.${id}`) }), "muted");
      Windows.open(id);
    },
    lang(args) {
      const lang = (args[0] || "").toLowerCase();
      if (lang !== "es" && lang !== "en") return this.print(I18N.t("term.langUsage"), "muted");
      I18N.set(lang);
    },
    date() {
      this.print(new Date().toLocaleString(I18N.lang === "es" ? "es-ES" : "en-US", { dateStyle: "full", timeStyle: "short" }));
    },
    echo(args) {
      this.print(args.join(" "));
    },
    sudo() {
      this.print(I18N.t("term.sudo"), "error");
    },
    clear() {
      this.out.replaceChildren();
    },
    exit() {
      Windows.close(Windows.get("contact"));
    },
  },
};
