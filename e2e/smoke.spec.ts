import { expect, test, type Page } from "@playwright/test";
import { notFoundPath, plannedRoutes, routes, SITE_URL } from "./routes";

async function meta(page: Page, selector: string): Promise<string | null> {
  return page.locator(selector).first().getAttribute("content");
}

test.describe("smoke", () => {
  for (const route of routes) {
    test(`responde y tiene metadatos básicos: ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).trim()).not.toBe("");
      expect((await meta(page, 'meta[name="description"]'))?.trim()).toBeTruthy();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE_URL}${route}`,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
      await expect(page.locator("html")).toHaveAttribute("lang", "es-PE");
      await expect(page.locator("main#contenido")).toHaveCount(1);
    });
  }

  test("títulos y descripciones únicos entre rutas", async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const route of routes) {
      await page.goto(route);
      const title = await page.title();
      const description = (await meta(page, 'meta[name="description"]')) ?? "";
      // Longitudes de §7.1 y D21: título ≤ 60 y descripción ≤ 155 caracteres.
      expect(title.length, `título de ${route}`).toBeLessThanOrEqual(60);
      expect(description.length, `descripción de ${route}`).toBeLessThanOrEqual(155);
      titles.add(title);
      descriptions.add(description);
    }
    expect(titles.size).toBe(routes.length);
    expect(descriptions.size).toBe(routes.length);
  });

  test("sin enlaces internos rotos", async ({ page, request }) => {
    const hrefs = new Set<string>();
    for (const route of [...routes, notFoundPath]) {
      await page.goto(route);
      const found = await page
        .locator("a[href]")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
      found
        .filter((href) => href.startsWith("/") && !href.startsWith("//"))
        .forEach((href) => hrefs.add(href.split(/[?#]/)[0] ?? href));
    }
    const broken: string[] = [];
    for (const href of hrefs) {
      if (plannedRoutes.includes(href)) continue;
      const res = await request.get(href);
      if (res.status() !== 200) broken.push(`${href} → ${res.status()}`);
    }
    expect(broken).toEqual([]);
  });

  test("página 404 propia con noindex", async ({ page }) => {
    const response = await page.goto(notFoundPath);
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Página no encontrada");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("reflujo a 320 px sin desplazamiento horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    for (const route of [...routes, notFoundPath]) {
      await page.goto(route);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, route).toBeLessThanOrEqual(320);
    }
  });

  // Respaldos con métricas ajustadas mientras cargan las fuentes web (CLS, §11).
  test("pilas de fuentes con respaldo ajustado", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Mismo CSS en ambos proyectos");
    await page.goto("/");
    const families = await page.evaluate(() => ({
      body: getComputedStyle(document.body).fontFamily,
      h1: getComputedStyle(document.querySelector("h1")!).fontFamily,
    }));
    expect(families.body).toMatch(/^"Inter Variable", "Inter Fallback",/);
    expect(families.h1).toMatch(/^"Sora Variable", "Sora Fallback",/);
  });
});

// WCAG 1.4.12: con el espaciado de texto máximo que puede imponer el usuario no se pierde contenido
// (nada desborda la página ni queda recortado por un overflow-hidden). El estilo se inyecta con
// addStyleTag, que la CSP de producción bloquea: aquí se omite la CSP (la prueba es de diseño).
test.describe("espaciado de texto (1.4.12)", () => {
  test.use({ bypassCSP: true });

  test("sin desbordes ni recortes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Anchos fijos: una sola vez");
    const spacing =
      "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }";
    const cases: [number, string[]][] = [
      [320, [...routes, notFoundPath]],
      // Anchos donde el encabezado va justo (D13).
      ...[360, 400, 414, 1024].map((width): [number, string[]] => [width, ["/"]]),
    ];
    for (const [width, paths] of cases) {
      await page.setViewportSize({ width, height: 720 });
      for (const route of paths) {
        await page.goto(route);
        await page.addStyleTag({ content: spacing });
        const result = await page.evaluate(() => {
          const clipped: string[] = [];
          for (const el of document.querySelectorAll<HTMLElement>("body *")) {
            if (el.closest(".sr-only, [hidden], [aria-hidden='true'], svg")) continue;
            const cs = getComputedStyle(el);
            if (!/(hidden|clip)/.test(cs.overflowX) || cs.webkitLineClamp !== "none") continue;
            if ((el.textContent ?? "").trim() && el.scrollWidth > el.clientWidth + 2) {
              clipped.push(`${el.tagName} "${(el.textContent ?? "").trim().slice(0, 30)}"`);
            }
          }
          return { scrollWidth: document.documentElement.scrollWidth, clipped };
        });
        expect(result.scrollWidth, `${route} a ${width} px`).toBeLessThanOrEqual(width);
        expect(result.clipped, `${route} a ${width} px`).toEqual([]);
      }
    }
  });
});
