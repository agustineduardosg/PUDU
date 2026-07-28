import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDirectory = path.join(root, "public", "marketing", "instagram");
const backgroundPath = path.join(
  outputDirectory,
  "background-message-to-crm.png",
);

const feedWidth = 1080;
const feedHeight = 1350;
const storyWidth = 1080;
const storyHeight = 1920;

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function wordmark(y = 88) {
  return `
    <text x="72" y="${y}" fill="#F8FAFC" font-family="Segoe UI, Arial" font-size="34" font-weight="900" letter-spacing="5">PUDU</text>
    <text x="207" y="${y}" fill="#10B981" font-family="Segoe UI, Arial" font-size="18" font-weight="800" letter-spacing="3">IT SOLUTIONS</text>
  `;
}

function multilineText(lines, { x, y, size, lineHeight, fill = "#F8FAFC" }) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${fill}" font-family="Segoe UI, Arial" font-size="${size}" font-weight="900" letter-spacing="-1">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

function feedOverlay({
  eyebrow,
  lines,
  accent = "#10B981",
  footer,
  demonstration = false,
}) {
  return Buffer.from(`
    <svg width="${feedWidth}" height="${feedHeight}" viewBox="0 0 ${feedWidth} ${feedHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#020617" stop-opacity="0.05"/>
          <stop offset="0.62" stop-color="#020617" stop-opacity="0.34"/>
          <stop offset="1" stop-color="#020617" stop-opacity="0.92"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1350" fill="url(#shade)"/>
      ${wordmark()}
      <rect x="72" y="178" width="${Math.max(280, eyebrow.length * 15)}" height="48" rx="24" fill="${accent}" fill-opacity="0.14" stroke="${accent}" stroke-opacity="0.42"/>
      <text x="96" y="210" fill="${accent}" font-family="Segoe UI, Arial" font-size="18" font-weight="900" letter-spacing="3">${escapeXml(eyebrow.toUpperCase())}</text>
      ${multilineText(lines, { x: 72, y: 330, size: 70, lineHeight: 82 })}
      <rect x="72" y="1010" width="936" height="2" fill="#FFFFFF" fill-opacity="0.12"/>
      ${
        demonstration
          ? `<rect x="72" y="1060" width="250" height="54" rx="27" fill="#F59E0B"/><text x="104" y="1095" fill="#020617" font-family="Segoe UI, Arial" font-size="20" font-weight="900" letter-spacing="2">DEMOSTRACIÓN</text>`
          : ""
      }
      <text x="72" y="1224" fill="#F8FAFC" fill-opacity="0.62" font-family="Segoe UI, Arial" font-size="23" font-weight="700">${escapeXml(footer)}</text>
      <circle cx="960" cy="1216" r="38" fill="${accent}"/>
      <path d="M946 1216h28M963 1202l14 14-14 14" stroke="#020617" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);
}

async function createFeedCover(fileName, options) {
  const base = await sharp(backgroundPath)
    .resize(feedWidth, feedHeight, { fit: "cover" })
    .png()
    .toBuffer();

  await sharp(base)
    .composite([{ input: feedOverlay(options) }])
    .png()
    .toFile(path.join(outputDirectory, fileName));
}

function carouselSvg({
  number,
  total = 7,
  eyebrow,
  titleLines,
  detailLines = [],
  accent = "#10B981",
  cta = false,
}) {
  const titleY = titleLines.length > 3 ? 330 : 390;
  const titleSize = titleLines.length > 3 ? 61 : 69;
  const titleLineHeight = titleLines.length > 3 ? 72 : 80;
  const detailStart = titleY + titleLines.length * titleLineHeight + 80;

  return Buffer.from(`
    <svg width="${feedWidth}" height="${feedHeight}" viewBox="0 0 ${feedWidth} ${feedHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="86%" cy="84%" r="70%">
          <stop offset="0" stop-color="${accent}" stop-opacity="0.22"/>
          <stop offset="1" stop-color="#020617" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="cta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#10B981"/>
          <stop offset="1" stop-color="#0EA5E9"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1350" fill="#020617"/>
      <rect width="1080" height="1350" fill="url(#glow)"/>
      <path d="M670 970 C800 780 960 850 1120 640" fill="none" stroke="${accent}" stroke-opacity="0.14" stroke-width="2"/>
      <path d="M610 1050 C790 870 920 1030 1120 810" fill="none" stroke="#0EA5E9" stroke-opacity="0.14" stroke-width="2"/>
      ${wordmark()}
      <text x="936" y="88" fill="#F8FAFC" fill-opacity="0.35" font-family="Segoe UI, Arial" font-size="22" font-weight="800">${number}/${total}</text>
      <rect x="72" y="182" width="${Math.max(250, eyebrow.length * 14)}" height="46" rx="23" fill="${accent}" fill-opacity="0.14"/>
      <text x="94" y="212" fill="${accent}" font-family="Segoe UI, Arial" font-size="17" font-weight="900" letter-spacing="3">${escapeXml(eyebrow.toUpperCase())}</text>
      ${multilineText(titleLines, { x: 72, y: titleY, size: titleSize, lineHeight: titleLineHeight })}
      ${multilineText(detailLines, { x: 76, y: detailStart, size: 30, lineHeight: 45, fill: "#94A3B8" })}
      ${
        cta
          ? `<rect x="72" y="980" width="650" height="104" rx="26" fill="url(#cta)"/><text x="112" y="1045" fill="#020617" font-family="Segoe UI, Arial" font-size="33" font-weight="900">ESCRIBE CRM POR DM</text>`
          : `<circle cx="82" cy="1190" r="10" fill="${accent}"/><text x="110" y="1198" fill="#F8FAFC" fill-opacity="0.52" font-family="Segoe UI, Arial" font-size="22" font-weight="700">Desliza para continuar</text>`
      }
    </svg>
  `);
}

async function createCarouselSlide(fileName, options) {
  await sharp(carouselSvg(options))
    .png()
    .toFile(path.join(outputDirectory, fileName));
}

function highlightSvg({ title, accent, symbol }) {
  const symbols = {
    start: `<path d="M450 950h180M540 860v180" stroke="${accent}" stroke-width="34" stroke-linecap="round"/>`,
    crm: `<rect x="430" y="850" width="220" height="190" rx="38" fill="none" stroke="${accent}" stroke-width="28"/><path d="M470 910h140M470 970h90" stroke="${accent}" stroke-width="24" stroke-linecap="round"/>`,
    automation: `<path d="M435 950c0-58 47-105 105-105s105 47 105 105-47 105-105 105-105-47-105-105Z" fill="none" stroke="${accent}" stroke-width="26"/><path d="M540 810v48M540 1042v48M400 950h48M632 950h48" stroke="${accent}" stroke-width="24" stroke-linecap="round"/>`,
    cases: `<path d="M430 1025l75-95 65 55 92-132" fill="none" stroke="${accent}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/><circle cx="662" cy="853" r="18" fill="${accent}"/>`,
    process: `<circle cx="445" cy="950" r="28" fill="${accent}"/><circle cx="540" cy="950" r="28" fill="${accent}"/><circle cx="635" cy="950" r="28" fill="${accent}"/><path d="M475 950h35M570 950h35" stroke="${accent}" stroke-width="18"/>`,
    questions: `<path d="M475 900c8-48 44-75 96-75 58 0 99 34 99 83 0 43-23 65-66 87-36 19-50 37-50 70" fill="none" stroke="${accent}" stroke-width="28" stroke-linecap="round"/><circle cx="554" cy="1120" r="18" fill="${accent}"/>`,
  };

  return Buffer.from(`
    <svg width="${storyWidth}" height="${storyHeight}" viewBox="0 0 ${storyWidth} ${storyHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="storyGlow" cx="50%" cy="48%" r="58%">
          <stop offset="0" stop-color="${accent}" stop-opacity="0.24"/>
          <stop offset="1" stop-color="#020617" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill="#020617"/>
      <rect width="1080" height="1920" fill="url(#storyGlow)"/>
      ${wordmark(120)}
      <circle cx="540" cy="950" r="210" fill="#FFFFFF" fill-opacity="0.035" stroke="${accent}" stroke-opacity="0.28" stroke-width="3"/>
      ${symbols[symbol]}
      <text x="540" y="1280" text-anchor="middle" fill="#F8FAFC" font-family="Segoe UI, Arial" font-size="64" font-weight="900" letter-spacing="-1">${escapeXml(title)}</text>
      <text x="540" y="1342" text-anchor="middle" fill="${accent}" font-family="Segoe UI, Arial" font-size="20" font-weight="900" letter-spacing="4">PUDU IT SOLUTIONS</text>
    </svg>
  `);
}

async function createHighlight(fileName, options) {
  await sharp(highlightSvg(options))
    .png()
    .toFile(path.join(outputDirectory, fileName));
}

await fs.mkdir(outputDirectory, { recursive: true });

await Promise.all([
  createFeedCover("post-01-reel-que-resolvemos.png", {
    accent: "#10B981",
    eyebrow: "Ordena tus ventas",
    footer: "Escribe DIAGNÓSTICO y revisamos tu proceso",
    lines: [
      "¿TUS VENTAS",
      "VIVEN ENTRE",
      "MENSAJES Y",
      "PLANILLAS?",
    ],
  }),
  createFeedCover("post-02-carrusel-diagnostico.png", {
    accent: "#F59E0B",
    eyebrow: "Diagnóstico comercial",
    footer: "Cinco señales para reconocer el problema",
    lines: [
      "5 SEÑALES DE",
      "QUE NECESITAS",
      "ORDENAR TU",
      "PROCESO",
      "COMERCIAL",
    ],
  }),
  createFeedCover("post-03-reel-instagram-crm.png", {
    accent: "#F472B6",
    demonstration: true,
    eyebrow: "Instagram conectado",
    footer: "Escribe CRM y te mostramos cómo funciona",
    lines: [
      "ASÍ ENTRA",
      "UN LEAD DE",
      "INSTAGRAM",
      "AL CRM DE PUDU",
    ],
  }),
]);

const carouselSlides = [
  {
    accent: "#F59E0B",
    eyebrow: "Señal 1",
    titleLines: ["TUS CLIENTES", "LLEGAN POR", "VARIOS CANALES"],
    detailLines: ["Pero nadie tiene una vista", "completa de cada conversación."],
  },
  {
    accent: "#F472B6",
    eyebrow: "Señal 2",
    titleLines: ["RESPONDES RÁPIDO,", "PERO DESPUÉS", "NO HAY", "SEGUIMIENTO"],
    detailLines: ["Una respuesta sin próximo paso", "no construye una oportunidad."],
  },
  {
    accent: "#0EA5E9",
    eyebrow: "Señal 3",
    titleLines: ["COPIAS DATOS", "ENTRE MENSAJES,", "PLANILLAS", "Y CORREOS"],
    detailLines: ["Tu equipo repite trabajo", "y aumenta el margen de error."],
  },
  {
    accent: "#EF4444",
    eyebrow: "Señal 4",
    titleLines: ["NO SABES", "QUÉ LEAD", "REQUIERE", "ATENCIÓN HOY"],
    detailLines: ["Sin prioridad ni responsable,", "las oportunidades se enfrían."],
  },
  {
    accent: "#10B981",
    eyebrow: "Señal 5",
    titleLines: ["NO PUEDES", "ATRIBUIR", "REUNIONES", "O VENTAS"],
    detailLines: ["Los Me gusta no indican", "qué campaña produce negocio."],
  },
  {
    accent: "#10B981",
    eyebrow: "El enfoque PUDU",
    titleLines: ["PRIMERO", "ORDENAMOS", "EL PROCESO"],
    detailLines: ["Después elegimos el CRM,", "la automatización o el software."],
  },
  {
    accent: "#10B981",
    cta: true,
    eyebrow: "Diagnóstico sin costo",
    titleLines: ["¿RECONOCES", "DOS O MÁS", "SEÑALES?"],
    detailLines: ["Revisamos dónde se pierden", "tus oportunidades y qué priorizar."],
  },
];

for (const [index, slide] of carouselSlides.entries()) {
  await createCarouselSlide(
    `post-02-slide-${String(index + 1).padStart(2, "0")}.png`,
    {
      ...slide,
      number: index + 1,
      total: carouselSlides.length,
    },
  );
}

const highlights = [
  ["destacado-01-empieza.png", "Empieza", "#10B981", "start"],
  ["destacado-02-crm.png", "CRM", "#0EA5E9", "crm"],
  [
    "destacado-03-automatiza.png",
    "Automatiza",
    "#F59E0B",
    "automation",
  ],
  ["destacado-04-casos.png", "Casos", "#F472B6", "cases"],
  ["destacado-05-proceso.png", "Proceso", "#10B981", "process"],
  ["destacado-06-preguntas.png", "Preguntas", "#0EA5E9", "questions"],
];

for (const [fileName, title, accent, symbol] of highlights) {
  await createHighlight(fileName, { accent, symbol, title });
}

console.log(`Generated Instagram assets in ${outputDirectory}`);
