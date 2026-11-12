import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

// Verificaciones estáticas sobre dist/ y el repositorio (§17.2). Se ejecutan una sola vez.
const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");
const THIS_FILE = fileURLToPath(import.meta.url);

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".astro",
  "test-results",
  "playwright-report",
  "blob-report",
]);
const TEXT_EXT =
  /\.(?:astro|ts|mts|cts|js|mjs|cjs|json|css|md|ya?ml|conf|html|xml|txt|svg|webmanifest)$/i;
const TEXT_NAMES = new Set([
  "Dockerfile",
  ".gitignore",
  ".dockerignore",
  ".nvmrc",
  ".editorconfig",
  ".prettierignore",
]);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...(await walk(full)));
    } else if (TEXT_EXT.test(entry.name) || TEXT_NAMES.has(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const rel = (file: string): string => relative(ROOT, file).split(sep).join("/");

/** Scripts en línea ejecutables: sin src y distintos de application/ld+json. */
function inlineScripts(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1] ?? "";
    if (/\bsrc\s*=/.test(attrs)) continue;
    if (/type\s*=\s*["']?application\/ld\+json/i.test(attrs)) continue;
    out.push(m[2] ?? "");
  }
  return out;
}

const sha256hex = (value: string): string => createHash("sha256").update(value).digest("hex");

/*
 * Datos vetados (§1.4): la IP del VPS, el dominio del correo personal y nombres de plataformas o
 * proveedores de terceros de proyectos de clientes. Se guardan SOLO como hashes SHA-256 para que el
 * propio repositorio no los contenga en claro.
 */
const FORBIDDEN_IP_HASHES = new Set([
  "c4d56066fa9152ab7f6d7e450003a5918de8a5adc703afab73d0cd8a02358e59",
]);
const FORBIDDEN_TERM_HASHES = new Map<number, Set<string>>([
  [4, new Set(["d2db13057ff473bd576c5d33ba06a98597388c6ce05c26dca3d0cdaffd90c83b"])],
  [
    6,
    new Set([
      "a57723ea2187016632c8ca63d3a8df2df0c7c46fbdc3d850560810625c9162f5",
      "89d01c9ba73cb5c4fbd849c699875ddbb1fd302cadaf1cee4552e92e73676835",
    ]),
  ],
  [7, new Set(["56584949957de203b0b6cb347b57e0553cb31115cc3049e9839b7fb944465a9b"])],
]);

/**
 * Busca términos vetados dentro de cada palabra alfanumérica (sin distinguir mayúsculas). Los términos
 * de 6+ caracteres se buscan como subcadena; los más cortos, solo al inicio de la palabra (evita falsos
 * positivos en hashes base64 de package-lock.json o de nombres de archivo).
 */
function findForbidden(text: string): string[] {
  const hits: string[] = [];
  for (const ip of text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? []) {
    if (FORBIDDEN_IP_HASHES.has(sha256hex(ip))) hits.push("IP del VPS");
  }
  for (const token of new Set(text.toLowerCase().match(/[a-z0-9]+/g) ?? [])) {
    for (const [length, hashes] of FORBIDDEN_TERM_HASHES) {
      const last = length >= 6 ? token.length - length : 0;
      for (let i = 0; i <= last && i + length <= token.length; i++) {
        if (hashes.has(sha256hex(token.slice(i, i + length)))) {
          hits.push(`término vetado (${length} caracteres)`);
        }
      }
    }
  }
  return hits;
}

/** Tecnologías que nunca se asocian a un proyecto concreto (§1.4, §7.3). Sensible a mayúsculas. */
const PROJECT_TECH_NAMES = [
  "Java",
  "Spring",
  "Quarkus",
  "Python",
  "FastAPI",
  "Node.js",
  "NestJS",
  "PHP",
  "Laravel",
  "Angular",
  "Vue",
  "React",
  "Astro",
  "Golang",
  ".NET",
  "Azure",
  "AWS",
  "Google Cloud",
  "GCP",
  "OpenAI",
  "ChatGPT",
  "GPT",
  "Anthropic",
  "Claude",
  "Gemini",
  "Mistral",
  "DeepSeek",
  "LangChain",
  "PostgreSQL",
  "MySQL",
  "MariaDB",
  "MongoDB",
  "Redis",
  "Oracle",
  "SQL Server",
  "Elasticsearch",
  "Docker",
  "Kubernetes",
  "Kafka",
  "RabbitMQ",
  "Nginx",
  "Traefik",
  "YOLO",
  "PyTorch",
  "TensorFlow",
];
const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TECH_RE = new RegExp(
  `(?<![\\w.])(?:${PROJECT_TECH_NAMES.map(escapeRe).join("|")})(?![\\w])`,
  "g",
);

test.describe("salida de build", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Verificación estática: una sola vez");
    test.skip(!existsSync(DIST), "No existe dist/ (ejecuta npm run build)");
  });

  test("sin atributos style= en dist", async () => {
    const files = (await walk(DIST)).filter((f) => /\.(?:html|svg)$/i.test(f));
    const offenders: string[] = [];
    for (const file of files) {
      if (/\sstyle\s*=/i.test(await readFile(file, "utf8"))) offenders.push(rel(file));
    }
    expect(offenders).toEqual([]);
  });

  test("el único script en línea es el del tema y su hash coincide con la CSP", async () => {
    const files = (await walk(DIST)).filter((f) => f.endsWith(".html"));
    expect(files.length).toBeGreaterThan(0);
    const scripts = new Set<string>();
    for (const file of files) {
      const found = inlineScripts(await readFile(file, "utf8"));
      expect(found.length, rel(file)).toBe(1);
      found.forEach((s) => scripts.add(s));
    }
    expect(scripts.size).toBe(1);
    const [script = ""] = [...scripts];
    expect(script).toContain('localStorage.getItem("csi-theme")');

    const hash = createHash("sha256").update(script, "utf8").digest("base64");
    const conf = await readFile(join(ROOT, "nginx", "security-headers.conf"), "utf8");
    const cspHashes = [...conf.matchAll(/'sha256-([^']+)'/g)].map((m) => m[1]);
    expect(cspHashes).toEqual([hash]);
  });

  test("sin tecnologías asociadas a proyectos en /proyectos/", async () => {
    const dir = join(DIST, "proyectos");
    test.skip(!existsSync(dir), "Aún no existe /proyectos/ (Tramo 3)");
    const offenders: string[] = [];
    for (const file of (await walk(dir)).filter((f) => f.endsWith(".html"))) {
      const html = await readFile(file, "utf8");
      const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
      const hits = new Set(text.match(TECH_RE) ?? []);
      if (hits.size) offenders.push(`${rel(file)}: ${[...hits].join(", ")}`);
    }
    expect(offenders).toEqual([]);
  });

  test("sin datos vetados en dist/ ni en el repositorio", async () => {
    const files = (await walk(ROOT)).filter((f) => f !== THIS_FILE);
    const offenders: string[] = [];
    for (const file of files) {
      const hits = findForbidden(await readFile(file, "utf8"));
      if (hits.length) offenders.push(`${rel(file)}: ${[...new Set(hits)].join(", ")}`);
    }
    expect(offenders).toEqual([]);
  });
});
