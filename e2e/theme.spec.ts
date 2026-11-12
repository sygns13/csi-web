import { expect, test } from "@playwright/test";

test.describe("tema", () => {
  test.describe("sigue al sistema (oscuro)", () => {
    test.use({ colorScheme: "dark" });

    test("sin preferencia guardada usa el tema del sistema", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.locator("[data-theme-toggle]:visible")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
  });

  test.describe("sigue al sistema (claro)", () => {
    test.use({ colorScheme: "light" });

    test("sin preferencia guardada usa el tema del sistema", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(page.locator("[data-theme-toggle]:visible")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    test("en pantallas estrechas el botón está en el menú móvil", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 720 });
      await page.goto("/");
      await expect(page.locator("[data-theme-toggle]:visible")).toHaveCount(0);
      await page.locator("[data-menu-toggle]").click();
      const toggle = page.locator("#menu-movil [data-theme-toggle]");
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAccessibleName("Modo oscuro");
      await toggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
    });

    test("escucha los cambios del sistema mientras no haya preferencia", async ({ page }) => {
      await page.goto("/");
      await page.emulateMedia({ colorScheme: "dark" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.locator("[data-theme-toggle]:visible")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    test("el botón alterna, guarda y persiste tras recargar", async ({ page }) => {
      await page.goto("/");
      const toggle = page.locator("[data-theme-toggle]:visible");
      await expect(toggle).toHaveAccessibleName("Modo oscuro");

      await toggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      expect(await page.evaluate(() => localStorage.getItem("csi-theme"))).toBe("dark");

      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");

      // Con preferencia guardada, ya no sigue al sistema.
      await page.emulateMedia({ colorScheme: "light" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

      await toggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      expect(await page.evaluate(() => localStorage.getItem("csi-theme"))).toBe("light");
    });
  });
});
