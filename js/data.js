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
    description: { es: "App de la barra de menú que bloquea al momento el teclado, el ratón y el trackpad, incluidos los atajos y las teclas de función, para limpiar el Mac sin escribir nada ni abrir apps sin querer. Se activa con un clic y se desbloquea manteniendo la barra espaciadora 3 segundos. Nativa en Swift y sin dependencias.", en: "A menu bar app that instantly locks the keyboard, mouse and trackpad, shortcuts and function keys included, so you can clean your Mac without typing or opening apps by accident. Turn it on with one click; hold the space bar for 3 seconds to unlock. Native Swift, no dependencies." },
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
    description: { es: "App de la barra de menú que evita que el Mac entre en reposo o active el salvapantallas mientras trabajas, presentas o descargas archivos. Se enciende con un interruptor y tiene duraciones listas, de 15 minutos a 12 horas o sin límite. Hecha en Swift con SwiftUI, sin dependencias ni permisos especiales.", en: "A menu bar app that stops your Mac from sleeping or starting the screen saver while you work, present or download files. Flip a switch and pick a duration, from 15 minutes to 12 hours or unlimited. Built in Swift with SwiftUI, no dependencies and no special permissions." },
    tech: ["Swift", "SwiftUI", "macOS"],
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
    description: { es: "Mientras arrastras un archivo, mantienes Shift, Option o Control y aparece un anillo de opciones alrededor del cursor: lo sueltas sobre una y listo. Convierte audio, imagen, vídeo y PDF, lo comparte por AirDrop, comprime, normaliza y amplía imágenes ×4 con IA. Todo en local y sin tocar nunca el original.", en: "While you drag a file, hold Shift, Option or Control and a ring of options appears around the cursor: drop it on one and you're done. It converts audio, images, video and PDFs, shares via AirDrop, compresses, normalizes and upscales images ×4 with AI. All on-device, and the original is never touched." },
    tech: ["Swift", "SwiftUI", "AppKit", "FFmpeg"],
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
    description: { es: "Quita archivos de Finder › Recientes sin moverlos, renombrarlos ni tocar su contenido: el archivo sigue donde estaba y solo desaparece de la lista. Se usa desde la barra de menú, con la lista en tiempo real y un buscador, o con clic derecho en el Finder, también con varios archivos a la vez. Usa la misma consulta de Spotlight que el propio Finder.", en: "Removes files from Finder › Recents without moving, renaming or changing them: the file stays where it was and simply disappears from the list. Use it from the menu bar, with a live list and search, or with a right-click in Finder, even on several files at once. It uses the same Spotlight query as Finder itself." },
    tech: ["Swift", "Spotlight", "macOS"],
  },
  {
    id: "djokovox",
    name: "Djoko_vox",
    icon: "assets/apps/djokovox.png",
    status: "soon",
    tagline: { es: "Plugin de audio: channel strip para grabar voces.", en: "Audio plugin: a vocal recording channel strip." },
    description: { es: "Plugin multiefecto para grabar voces de música urbana con pocos controles y sonido «de disco» desde la primera toma. Encadena cinco módulos inspirados en equipos clásicos: previo con EQ, compresor óptico, EQ de aire con de-esser, saturación y reverb/delay. Tiene un modo Tracking con latencia cero para escucharte mientras grabas.", en: "A multi-effect plugin for recording urban-music vocals, with few controls and a record-ready sound from the first take. It chains five modules inspired by classic gear: preamp with EQ, optical compressor, air EQ with de-esser, saturation and reverb/delay. Its zero-latency Tracking mode lets you monitor while you record." },
    tech: ["C++20", "JUCE 8", "VST3 · AU"],
  },
  {
    id: "tienda",
    name: { es: "Tienda online", en: "Online store" },
    icon: "assets/apps/tienda.png",
    status: "private",
    featured: true, // sale en grande arriba de Proyectos
    tagline: { es: "Pagos con Stripe, archivos en R2 y descargas firmadas.", en: "Stripe payments, files on R2 and signed downloads." },
    description: { es: "La tienda de djokobeatz.com, hecha desde cero: carrito, pago con Stripe Checkout y entrega automática con enlaces de descarga firmados que caducan a los 10 minutos, servidos desde un bucket privado de Cloudflare R2. Precios, licencias y archivos se validan siempre en el servidor, y se compra sin crear cuenta.", en: "The djokobeatz.com store, built from scratch: cart, Stripe Checkout payments and automatic delivery through signed download links that expire after 10 minutes, served from a private Cloudflare R2 bucket. Prices, licences and files are always validated on the server, and you can buy without an account." },
    tech: ["Next.js", "TypeScript", "Stripe", "Cloudflare R2", "Vercel"],
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
