// Genera favicons, íconos del manifest, el logo PNG para JSON-LD y la imagen Open Graph (§15).
// Uso: npm run brand:assets  (manual; los resultados se versionan en git, no forma parte del build).
//
// El texto de la imagen OG se convierte a trazos con fontkit, porque el FreeType de sharp no lee
// woff2 (las fuentes de Fontsource). Así se usan Sora e Inter reales sin depender de fuentes del sistema.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { openSync } from "fontkit";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const r = (...p) => path.join(root, ...p);

const COLORS = {
  bg: "#F6F9FC",
  text: "#0E1E33",
  muted: "#475A6E",
  brand: "#2274B9",
  cyan: "#1DB3E8",
  white: "#FFFFFF",
};
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const markSvg = await fs.readFile(r("src/assets/brand/csi-mark.svg"), "utf8");
const viewBox = markSvg.match(/viewBox="([^"]+)"/)?.[1];
if (!viewBox) throw new Error("csi-mark.svg no tiene viewBox");
const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number);

/** SVG del isotipo con tamaño explícito en píxeles (alto dado). */
function sizedMark(height) {
  const width = Math.round((height * vbW) / vbH);
  return {
    svg: markSvg.replace("<svg ", `<svg width="${width}" height="${height}" `),
    width,
    height,
  };
}

async function markPng(height) {
  const { svg } = sizedMark(height);
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** Ícono cuadrado: isotipo centrado con margen proporcional y fondo opcional. */
async function squareIcon(size, padding, background) {
  const inner = Math.round(size * (1 - 2 * padding));
  const mark = await markPng(inner);
  const { width = inner, height = inner } = await sharp(mark).metadata();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([
      { input: mark, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ---------- Texto a trazos (fontkit) ----------
function loadFont(file, wght) {
  const font = openSync(r("node_modules/@fontsource-variable", file));
  return font.getVariation({ wght });
}

/** Devuelve { d, width } con el texto convertido a un path SVG (línea base en y). */
function textPath(font, text, fontSize, x, y) {
  const scale = fontSize / font.unitsPerEm;
  const run = font.layout(text);
  let pen = 0;
  const parts = [];
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const d = glyph.path
      .scale(scale, -scale)
      .translate(x + (pen + pos.xOffset) * scale, y - pos.yOffset * scale)
      .toSVG();
    if (d) parts.push(d);
    pen += pos.xAdvance;
  });
  return { d: parts.join(""), width: pen * scale };
}

async function ogImage() {
  const W = 1200;
  const H = 630;
  const sora = loadFont("sora/files/sora-latin-wght-normal.woff2", 700);
  const inter = loadFont("inter/files/inter-latin-wght-normal.woff2", 500);

  const markH = 264;
  const mark = sizedMark(markH);
  const markX = 88;
  const markY = Math.round((H - markH) / 2) - 6;
  const textX = markX + mark.width + 56;
  const maxTextW = W - textX - 72;

  // Tamaño del título ajustado al ancho disponible (máx. 60 px).
  const title1 = "Construyendo Soluciones";
  const title2 = "Informáticas";
  const subtitle = "Software · Inteligencia artificial · Tecnología";
  const nominal = textPath(sora, title1, 60, 0, 0).width;
  const titleSize = Math.min(60, Math.floor((60 * maxTextW) / nominal));
  const subNominal = textPath(inter, subtitle, 28, 0, 0).width;
  const subSize = Math.min(28, Math.floor((28 * maxTextW) / subNominal));

  const line1 = textPath(sora, title1, titleSize, textX, 266);
  const line2 = textPath(sora, title2, titleSize, textX, 266 + Math.round(titleSize * 1.18));
  const sub = textPath(inter, subtitle, subSize, textX, 404);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="og-dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${COLORS.brand}" fill-opacity="0.25"/>
    </pattern>
    <linearGradient id="og-bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${COLORS.brand}"/>
      <stop offset="1" stop-color="${COLORS.cyan}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${COLORS.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#og-dots)"/>
  <path d="${line1.d}" fill="${COLORS.text}"/>
  <path d="${line2.d}" fill="${COLORS.text}"/>
  <path d="${sub.d}" fill="${COLORS.muted}"/>
  <rect x="${textX}" y="436" width="120" height="6" rx="3" fill="url(#og-bar)"/>
  <rect x="0" y="${H - 12}" width="${W}" height="12" fill="url(#og-bar)"/>
</svg>`;

  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const markBuf = await sharp(Buffer.from(mark.svg)).png().toBuffer();
  return sharp(base)
    .composite([{ input: markBuf, left: markX, top: markY }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** favicon.svg: copia del isotipo sin saltos de línea innecesarios. */
function faviconSvg() {
  return `${markSvg.replace(/>\s+</g, "><").trim()}\n`;
}

async function write(rel, data) {
  const file = r(rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
  const { size } = await fs.stat(file);
  console.log(`  ${rel} (${(size / 1024).toFixed(1)} KB)`);
}

console.log("Generando recursos de marca…");
await write("public/favicon.svg", faviconSvg());
await write("public/favicon-32.png", await squareIcon(32, 0.03, TRANSPARENT));
await write("public/apple-touch-icon.png", await squareIcon(180, 0.12, WHITE));
await write("public/icon-192.png", await squareIcon(192, 0.08, TRANSPARENT));
await write("public/icon-512.png", await squareIcon(512, 0.08, TRANSPARENT));
await write("public/brand/csi-logo-512.png", await squareIcon(512, 0.04, TRANSPARENT));
await write("public/og/default.png", await ogImage());
console.log("Listo.");
