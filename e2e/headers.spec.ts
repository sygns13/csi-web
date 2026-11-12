import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type APIResponse } from "@playwright/test";
import { notFoundPath, routes } from "./routes";

// Servidor de producción (§16.2): cabeceras de seguridad, caché, tipos MIME, redirecciones, 404 y
// CSP sin infracciones. Solo tiene sentido contra la imagen Docker (nginx), no contra `astro preview`.
const ROOT = fileURLToPath(new URL("../", import.meta.url));

test.beforeEach(({ baseURL }) => {
  test.skip(!baseURL?.includes(":8080"), "Solo contra la imagen Docker (npm run test:e2e:docker)");
});

/** CSP esperada: la de nginx/security-headers.conf (con el hash del script de tema). */
async function expectedCsp(): Promise<string> {
  const conf = await readFile(join(ROOT, "nginx", "security-headers.conf"), "utf8");
  const match = conf.match(/Content-Security-Policy "([^"]+)"/);
  expect(match, "CSP en security-headers.conf").toBeTruthy();
  return match?.[1] ?? "";
}

async function expectSecurityHeaders(res: APIResponse): Promise<void> {
  const h = res.headers();
  expect(h["content-security-policy"]).toBe(await expectedCsp());
  expect(h["content-security-policy"]).toMatch(/script-src 'self' 'sha256-[A-Za-z0-9+/]+=*'/);
  // HSTS sin includeSubDomains ni preload (§16.2): no afecta a los otros subdominios.
  expect(h["strict-transport-security"]).toBe("max-age=31536000");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["cross-origin-opener-policy"]).toBe("same-origin");
  expect(h["permissions-policy"]).toBe(
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  // server_tokens off: sin versión de nginx.
  expect(h["server"] ?? "").not.toMatch(/\d/);
}

test.describe("servidor (nginx)", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Peticiones HTTP: una sola vez");
  });

  test("HTML: cabeceras de seguridad, no-cache y gzip", async ({ request }) => {
    for (const path of ["/", "/servicios/", "/contacto/"]) {
      const res = await request.get(path, { headers: { "Accept-Encoding": "gzip" } });
      expect(res.status(), path).toBe(200);
      await expectSecurityHeaders(res);
      expect(res.headers()["cache-control"]).toBe("no-cache");
      expect(res.headers()["content-type"]).toBe("text/html; charset=utf-8");
      expect(res.headers()["content-encoding"]).toBe("gzip");
    }
  });

  test("recursos con hash de /_astro/: caché inmutable de un año", async ({ request, page }) => {
    await page.goto("/contacto/");
    const assets = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLLinkElement | HTMLScriptElement>(
          'link[href^="/_astro/"], script[src^="/_astro/"], img[src^="/_astro/"]',
        ),
      ].map((el) => el.getAttribute("href") ?? el.getAttribute("src") ?? ""),
    );
    // CSS, JS, fuente precargada (woff2) e isotipo (svg).
    for (const ext of [".css", ".js", ".woff2", ".svg"]) {
      expect(
        assets.some((a) => a.endsWith(ext)),
        ext,
      ).toBe(true);
    }
    for (const asset of assets) {
      const res = await request.get(asset);
      expect(res.status(), asset).toBe(200);
      expect(res.headers()["cache-control"], asset).toBe("public, max-age=31536000, immutable");
      await expectSecurityHeaders(res);
    }
  });

  test("imágenes, íconos y manifest: caché de una semana y tipo MIME", async ({ request }) => {
    const files: [string, string][] = [
      ["/favicon.svg", "image/svg+xml"],
      ["/favicon-32.png", "image/png"],
      ["/apple-touch-icon.png", "image/png"],
      ["/icon-192.png", "image/png"],
      ["/icon-512.png", "image/png"],
      ["/brand/csi-logo-512.png", "image/png"],
      ["/og/default.png", "image/png"],
      ["/site.webmanifest", "application/manifest+json"],
    ];
    for (const [path, type] of files) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect(res.headers()["content-type"], path).toBe(type);
      expect(res.headers()["cache-control"], path).toBe("public, max-age=604800");
      await expectSecurityHeaders(res);
    }
  });

  test("robots.txt y sitemap", async ({ request }) => {
    for (const [path, type] of [
      ["/robots.txt", /^text\/plain/],
      ["/sitemap-index.xml", /xml/],
      ["/sitemap-0.xml", /xml/],
    ] as const) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect(res.headers()["content-type"], path).toMatch(type);
    }
  });

  test("sin barra final: 301 relativo a la URL con barra", async ({ request }) => {
    for (const path of ["/servicios", "/proyectos/apubot-2-csj-ancash", "/contacto"]) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(301);
      expect(res.headers()["location"], path).toBe(`${path}/`);
    }
  });

  test("404 propia con cabeceras de seguridad", async ({ request }) => {
    for (const path of [notFoundPath, "/no-existe", "/_astro/no-existe.js", "/no-existe.png"]) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(404);
      await expectSecurityHeaders(res);
      if (!path.startsWith("/_astro/") && !path.endsWith(".png")) {
        expect(await res.text(), path).toContain("Página no encontrada");
      }
    }
  });
});

test.describe("CSP en el navegador", () => {
  for (const route of [...routes, notFoundPath]) {
    test(`sin infracciones de CSP: ${route}`, async ({ page }) => {
      const violations: string[] = [];
      page.on("console", (msg) => {
        if (/content security policy|csp/i.test(msg.text())) violations.push(msg.text());
      });
      await page.addInitScript(() => {
        document.addEventListener("securitypolicyviolation", (event) => {
          const list = ((window as unknown as { __csp?: string[] }).__csp ??= []);
          list.push(`${event.violatedDirective}: ${event.blockedURI}`);
        });
      });
      await page.goto(route);
      // El script de tema en línea se ejecutó (su hash está permitido por la CSP).
      await expect(page.locator("html")).toHaveAttribute("data-theme", /^(light|dark)$/);
      // Los scripts empaquetados se ejecutaron: el botón de tema responde.
      const toggle = page.locator("[data-theme-toggle]:visible").first();
      if (await toggle.count()) {
        const before = await page.locator("html").getAttribute("data-theme");
        await toggle.click();
        await expect(page.locator("html")).not.toHaveAttribute("data-theme", before ?? "");
      }
      const fromEvents = await page.evaluate(
        () => (window as unknown as { __csp?: string[] }).__csp ?? [],
      );
      expect([...violations, ...fromEvents]).toEqual([]);
    });
  }
});
