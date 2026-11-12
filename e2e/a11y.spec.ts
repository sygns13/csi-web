import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { notFoundPath, routes } from "./routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const THEMES = ["light", "dark"] as const;

async function forceTheme(page: Page, theme: (typeof THEMES)[number]): Promise<void> {
  await page.addInitScript((value) => {
    try {
      localStorage.setItem("csi-theme", value);
    } catch {
      // sin almacenamiento
    }
  }, theme);
}

async function expectNoViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
  );
  expect(summary).toEqual([]);
}

test.describe("accesibilidad (axe)", () => {
  for (const theme of THEMES) {
    for (const route of [...routes, notFoundPath]) {
      test(`${route} — tema ${theme}`, async ({ page }) => {
        await forceTheme(page, theme);
        await page.goto(route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expectNoViolations(page);
      });
    }

    // El encabezado es translúcido: su texto debe cumplir el contraste con cualquier contenido
    // debajo, incluido el pie (el fondo más oscuro del tema claro).
    test(`encabezado sobre contenido desplazado — tema ${theme}`, async ({ page }) => {
      await forceTheme(page, theme);
      await page.goto("/contacto/");
      for (const target of ["[data-form-fields] button[type=submit]", "footer"]) {
        await page
          .locator(target)
          .first()
          .evaluate((el) => {
            const header = document.querySelector("[data-site-header]")?.getBoundingClientRect();
            window.scrollTo(
              0,
              el.getBoundingClientRect().top + window.scrollY - (header?.top ?? 0) - 20,
            );
          });
        const results = await new AxeBuilder({ page })
          .include("[data-site-header]")
          .withRules(["color-contrast"])
          .analyze();
        expect(
          results.violations.map((v) => v.id),
          target,
        ).toEqual([]);
      }
    });

    test(`navegación abierta — tema ${theme}`, async ({ page }, testInfo) => {
      await forceTheme(page, theme);
      await page.goto("/");
      if (testInfo.project.name === "mobile") {
        await page.locator("[data-menu-toggle]").click();
        await page.locator("#menu-movil [data-disclosure-button]").click();
        await expect(page.locator("#menu-movil-servicios")).toBeVisible();
      } else {
        await page.locator('[aria-controls="nav-servicios"]').click();
        await expect(page.locator("#nav-servicios")).toBeVisible();
      }
      await expectNoViolations(page);
    });
  }
});
