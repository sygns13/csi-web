import { expect, test } from "@playwright/test";
import { routes } from "./routes";

test.describe("navegación", () => {
  test("saltar al contenido principal", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Saltar al contenido principal" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#contenido")).toBeFocused();
  });

  test("aria-current en la página actual", async ({ page }) => {
    for (const route of routes) {
      await page.goto(route);
      const current = page.locator('header a[aria-current="page"]');
      const hrefs = await current.evaluateAll((els) => els.map((a) => a.getAttribute("href")));
      hrefs.forEach((href) => expect(href).toBe(route));
      // Ningún enlace a otra página se marca como actual.
      const wrong = page.locator(`header a[aria-current="page"]:not([href="${route}"])`);
      await expect(wrong).toHaveCount(0);
    }
  });

  test.describe("escritorio", () => {
    test.beforeEach(({}, testInfo) => {
      test.skip(testInfo.project.name !== "desktop", "Solo en escritorio");
    });

    test("desplegable de Servicios con teclado", async ({ page }) => {
      await page.goto("/");
      const button = page.locator('[aria-controls="nav-servicios"]');
      const panel = page.locator("#nav-servicios");
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();

      // No se abre con hover (WCAG 1.4.13).
      await button.hover();
      await expect(panel).toBeHidden();

      await button.focus();
      await page.keyboard.press("Enter");
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toBeVisible();
      await expect(panel.getByRole("link")).toHaveCount(8);

      // El foco entra al panel con Tab y Escape lo devuelve al botón.
      await page.keyboard.press("Tab");
      await expect(panel.getByRole("link").first()).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();
      await expect(button).toBeFocused();

      // Espacio también abre.
      await page.keyboard.press("Space");
      await expect(panel).toBeVisible();

      // Clic fuera cierra.
      await page.locator("main").click({ position: { x: 5, y: 5 } });
      await expect(panel).toBeHidden();
    });

    test("el desplegable se cierra al sacar el foco del bloque", async ({ page }) => {
      await page.goto("/");
      const button = page.locator('[aria-controls="nav-servicios"]');
      const panel = page.locator("#nav-servicios");
      await button.click();
      await expect(panel).toBeVisible();
      const links = panel.getByRole("link");
      await links.last().focus();
      await page.keyboard.press("Tab");
      await expect(panel).toBeHidden();
      await expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("móvil", () => {
    test.beforeEach(({}, testInfo) => {
      test.skip(testInfo.project.name !== "mobile", "Solo en móvil");
    });

    test("menú móvil: apertura, foco circular, Escape y foco devuelto", async ({ page }) => {
      await page.goto("/");
      const toggle = page.locator("[data-menu-toggle]");
      const menu = page.locator("#menu-movil");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(menu).toBeHidden();

      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(menu).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("data-menu-open", "");
      // El fondo queda inerte mientras el menú está abierto.
      expect(await page.locator("main").evaluate((el) => (el as HTMLElement).inert)).toBe(true);

      // El foco circula entre el botón y el panel.
      await toggle.focus();
      const count = await menu
        .locator("a[href], button")
        .evaluateAll((els) => els.filter((el) => el.getClientRects().length > 0).length);
      for (let i = 0; i < count + 2; i++) {
        await page.keyboard.press("Tab");
        const inside = await page.evaluate(() => {
          const active = document.activeElement;
          return (
            !!active && (active.matches("[data-menu-toggle]") || !!active.closest("#menu-movil"))
          );
        });
        expect(inside).toBe(true);
      }

      // Shift+Tab desde el botón va al último elemento del panel.
      await toggle.focus();
      await page.keyboard.press("Shift+Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("#menu-movil"))).toBe(
        true,
      );

      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(menu).toBeHidden();
      await expect(toggle).toBeFocused();
      await expect(page.locator("html")).not.toHaveAttribute("data-menu-open", "");
      expect(await page.locator("main").evaluate((el) => (el as HTMLElement).inert)).toBe(false);
    });

    test("servicios en desplegable dentro del menú móvil", async ({ page }) => {
      await page.goto("/");
      await page.locator("[data-menu-toggle]").click();
      const button = page.locator('#menu-movil [aria-controls="menu-movil-servicios"]');
      const list = page.locator("#menu-movil-servicios");
      await expect(list).toBeHidden();
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(list).toBeVisible();
      await expect(list.getByRole("link")).toHaveCount(8);
    });
  });
});
