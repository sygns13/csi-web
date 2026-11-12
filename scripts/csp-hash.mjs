// Calcula el sha256 (base64) del único script en línea permitido (tema, §4.8) a partir de dist/.
// Uso: npm run build && node scripts/csp-hash.mjs [--write]
//   --write  actualiza el hash en nginx/security-headers.conf.
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const confPath = path.join(root, "nginx", "security-headers.conf");

async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return htmlFiles(full);
      return Promise.resolve(e.name.endsWith(".html") ? [full] : []);
    }),
  );
  return nested.flat();
}

/** Scripts en línea ejecutables: sin src y distintos de application/ld+json. */
export function inlineScripts(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1] ?? "";
    if (/\bsrc\s*=/.test(attrs)) continue;
    if (/type\s*=\s*["']?application\/ld\+json/i.test(attrs)) continue;
    out.push(m[2] ?? "");
  }
  return out;
}

const files = await htmlFiles(dist).catch(() => {
  throw new Error("No existe dist/. Ejecuta primero `npm run build`.");
});
const contents = new Set();
for (const file of files) {
  for (const script of inlineScripts(await fs.readFile(file, "utf8"))) contents.add(script);
}
if (contents.size !== 1) {
  throw new Error(`Se esperaba exactamente un script en línea distinto; hay ${contents.size}.`);
}
const [script] = [...contents];
const hash = `sha256-${crypto.createHash("sha256").update(script, "utf8").digest("base64")}`;
console.log(hash);

if (process.argv.includes("--write")) {
  const conf = await fs.readFile(confPath, "utf8");
  const next = conf.replace(/'sha256-[^']*'/, `'${hash}'`);
  if (next === conf) {
    console.log("nginx/security-headers.conf ya estaba al día.");
  } else {
    await fs.writeFile(confPath, next);
    console.log("nginx/security-headers.conf actualizado.");
  }
}
