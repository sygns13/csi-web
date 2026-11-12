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
});
