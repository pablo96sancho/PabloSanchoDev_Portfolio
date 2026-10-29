/*
 * Contenido de Proyectos y Stack.
 * Para añadir un proyecto o una tecnología, basta con añadir un objeto a la lista.
 */

const GITHUB = "https://github.com/pablo96sancho";
const EMAIL = "pablo96sancho@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/pablo-sancho-alegre/";

// Enlace de descarga directa del instalador de una app
const dmg = (app) => `${GITHUB}/${app}/releases/latest/download/${app}-Installer.dmg`;

// status: "available" | "soon" | "private"
const PROJECTS = [
  {
    id: "cleanbruh",
    name: "CleanBRUH",
    icon: "assets/apps/cleanbruh.png",
    status: "available",
    tagline: { es: "Bloquea teclado, ratón y trackpad para limpiar el Mac.", en: "Locks keyboard, mouse and trackpad so you can clean your Mac." },
    description: { es: "[Provisional] Descripción larga de CleanBRUH.", en: "[Placeholder] Long description of CleanBRUH." },
    tech: ["Swift", "macOS"],
    repo: `${GITHUB}/CleanBRUH`,
    download: dmg("CleanBRUH"),
    release: { version: "v1.1", date: "2026-08-21" }, // respaldo si GitHub no responde
  },
  {
    id: "cafelero",
    name: "Cafelero",
    icon: "assets/apps/cafelero.png",
    status: "available",
    tagline: { es: "Mantiene la pantalla del Mac encendida.", en: "Keeps your Mac's screen awake." },
    description: { es: "[Provisional] Descripción larga de Cafelero.", en: "[Placeholder] Long description of Cafelero." },
    tech: ["Swift", "macOS"],
    repo: `${GITHUB}/Cafelero`,
    download: dmg("Cafelero"),
    release: { version: "v1.1.0", date: "2026-08-19" }, // respaldo si GitHub no responde
  },
  {
    id: "convertbruh",
    name: "ConvertBRUH",
    icon: "assets/apps/convertbruh.png",
    status: "available",
    tagline: { es: "Convierte archivos desde el Finder.", en: "Converts files right from Finder." },
    description: { es: "[Provisional] Descripción larga de ConvertBRUH.", en: "[Placeholder] Long description of ConvertBRUH." },
    tech: ["Swift", "FFmpeg", "macOS"],
    repo: `${GITHUB}/ConvertBRUH`,
    download: dmg("ConvertBRUH"),
    release: { version: "v1.6", date: "2026-10-27" }, // respaldo si GitHub no responde
  },
  {
    id: "unrecent",
    name: "UnRecent",
    icon: "assets/apps/unrecent.png",
    status: "soon",
    tagline: { es: "Quita archivos de Recientes sin borrarlos.", en: "Removes files from Recents without deleting them." },
    description: { es: "[Provisional] Descripción larga de UnRecent.", en: "[Placeholder] Long description of UnRecent." },
    tech: ["Swift", "macOS"],
  },
  {
    id: "djokovox",
    name: "Djoko_vox",
    icon: "assets/apps/djokovox.png",
    status: "soon",
    tagline: { es: "Plugin de audio: channel strip para grabar voces.", en: "Audio plugin: a vocal recording channel strip." },
    description: { es: "[Provisional] Descripción larga de Djoko_vox.", en: "[Placeholder] Long description of Djoko_vox." },
    tech: ["C++", "JUCE"],
  },
  {
    id: "tienda",
    name: { es: "Tienda online", en: "Online store" },
    icon: "assets/apps/tienda.png",
    status: "private",
    featured: true, // sale en grande arriba de Proyectos
    tagline: { es: "Pagos con Stripe, archivos en R2 y descargas firmadas.", en: "Stripe payments, files on R2 and signed downloads." },
    description: { es: "[Provisional] Descripción larga de la tienda.", en: "[Placeholder] Long description of the store." },
    tech: ["Next.js", "Stripe", "Cloudflare R2", "Vercel"],
    site: "https://djokobeatz.com",
  },
];

// Grupos de Stack. icon: nombre del SVG en assets/tech · color: tono del logo sobre fondo oscuro
// learning: true = lo estoy aprendiendo en DAM (sale marcado con un punto)
const STACK = [
  {
    group: "stack.mac",
    items: [
      { name: "Swift", icon: "swift", color: "#F05138" },
      { name: "Xcode", icon: "xcode", color: "#3C9BFF" },
    ],
  },
  {
    group: "stack.web",
    items: [
      { name: "HTML", icon: "html5", color: "#E96A3C" },
      { name: "CSS", icon: "css3", color: "#3D8BFF" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "TypeScript", icon: "typescript", color: "#4D8FDB" },
      { name: "Next.js", icon: "nextdotjs", color: "#FFFFFF" },
    ],
  },
  {
    group: "stack.backend",
    items: [
      { name: "Stripe", icon: "stripe", color: "#8A84FF" },
      { name: "Cloudflare R2", icon: "cloudflare", color: "#F38020" },
      { name: "Vercel", icon: "vercel", color: "#FFFFFF" },
      { name: "SQL · MySQL", icon: "mysql", color: "#6FA3CB", learning: true },
      { name: "PostgreSQL", icon: "postgresql", color: "#6E8FEA", learning: true },
      { name: "MongoDB", icon: "mongodb", color: "#47A248", learning: true },
      { name: "Hibernate", icon: "hibernate", color: "#BCAE79", learning: true },
      { name: "Odoo", icon: "odoo", color: "#B07FA8", learning: true },
    ],
  },
  {
    group: "stack.mobile",
    items: [
      { name: "Java", icon: "openjdk", color: "#F89820", learning: true },
      { name: "Kotlin", icon: "kotlin", color: "#A07CFF", learning: true },
      { name: "Android", icon: "android", color: "#3DDC84", learning: true },
      { name: "Python", icon: "python", color: "#FFD43B", learning: true },
      { name: "XML · JSON", icon: "json", color: "#FFFFFF", learning: true },
    ],
  },
  {
    group: "stack.audio",
    items: [
      { name: "C++ · JUCE", icon: "cplusplus", color: "#5A9BD5" },
    ],
  },
  {
    group: "stack.tools",
    items: [
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#FFFFFF" },
      { name: "VS Code", icon: "visualstudiocode", color: "#3BA3F5" },
      { name: "IntelliJ IDEA", icon: "intellijidea", color: "#FE5A84", learning: true },
      { name: "JUnit", icon: "junit5", color: "#25A162", learning: true },
      { name: "Docker", icon: "docker", color: "#2496ED", learning: true },
      { name: "Linux", icon: "linux", color: "#FCC624", learning: true },
    ],
  },
];
