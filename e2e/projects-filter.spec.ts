import { expect, test, type Page } from "@playwright/test";
import { projectSlugs, sectorSlugs } from "./routes";

// Filtro por sector de /proyectos/ (§6.5, §17.2) y navegación del detalle (§6.6).

/** Proyectos por sector según §7.3. */
const EXPECTED: Record<string, number> = {
  justicia: 4,
  "investigacion-y-ambiente": 3,
  "educacion-superior": 4,
  "empresa-privada": 3,
};

const cards = (page: Page) => page.locator("[data-project-list] > li");
const group = (page: Page) => page.getByRole("group", { name: "Filtrar por sector" });
const status = (page: Page) => page.locator("[data-project-filter] [role=status]");

test.describe("filtro de proyectos", () => {
  test("muestra todos los proyectos y el filtro con «Todos» activo", async ({ page }) => {
    await page.goto("/proyectos/");
    await expect(cards(page)).toHaveCount(projectSlugs.length);
    await expect(group(page)).toBeVisible();
    const buttons = group(page).getByRole("button");
    await expect(buttons).toHaveText([
      "Todos",
      "Justicia",
      "Investigación y ambiente",
      "Educación superior",
      "Empresa privada",
    ]);
    await expect(group(page).getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Del más reciente al más antiguo (§6.5, punto 4).
    const titles = page.locator("[data-project-list] h2 a");
    await expect(titles.first()).toHaveAttribute("href", "/proyectos/apubot-2-csj-ancash/");
    await expect(titles.last()).toHaveAttribute(
      "href",
      "/proyectos/procesamiento-de-datos-unasam/",
    );
  });

  test("filtrar por sector muestra solo esos proyectos y lo anuncia", async ({ page }) => {
    await page.goto("/proyectos/");
    for (const sector of sectorSlugs) {
      const button = group(page).locator(`button[data-sector="${sector}"]`);
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(group(page).locator('button[aria-pressed="true"]')).toHaveCount(1);

      const visible = cards(page).filter({ visible: true });
      await expect(visible).toHaveCount(EXPECTED[sector] ?? -1);
      const sectors = await visible.evaluateAll((els) =>
        els.map((el) => (el as HTMLElement).dataset.sector),
      );
      expect(new Set(sectors)).toEqual(new Set([sector]));
      // Las tarjetas ocultas usan `hidden` (§6.5).
      await expect(page.locator("[data-project-list] > li[hidden]")).toHaveCount(
        projectSlugs.length - (EXPECTED[sector] ?? 0),
      );

      await expect(status(page)).toHaveText(`Mostrando ${EXPECTED[sector]} proyectos`);
      await expect(page).toHaveURL(new RegExp(`/proyectos/\\?sector=${sector}$`));
    }

    await group(page).getByRole("button", { name: "Todos" }).click();
    await expect(cards(page).filter({ visible: true })).toHaveCount(projectSlugs.length);
    await expect(status(page)).toHaveText(`Mostrando ${projectSlugs.length} proyectos`);
    await expect(page).toHaveURL(/\/proyectos\/$/);
  });

  test("lee ?sector= de la URL al cargar", async ({ page }) => {
    await page.goto("/proyectos/?sector=educacion-superior");
    await expect(group(page).getByRole("button", { name: "Educación superior" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(cards(page).filter({ visible: true })).toHaveCount(4);
    await expect(status(page)).toHaveText("Mostrando 4 proyectos");
  });

  test("ignora un sector desconocido en la URL", async ({ page }) => {
    await page.goto("/proyectos/?sector=%3Cscript%3E");
    await expect(group(page).getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(cards(page).filter({ visible: true })).toHaveCount(projectSlugs.length);
  });

  test.describe("sin JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("muestra todos los proyectos y no muestra el filtro", async ({ page }) => {
      await page.goto("/proyectos/?sector=justicia");
      await expect(cards(page).filter({ visible: true })).toHaveCount(projectSlugs.length);
      await expect(page.locator("[data-filter-group]")).toHaveAttribute("hidden", "");
      await expect(page.getByRole("group", { name: "Filtrar por sector" })).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Justicia" })).toHaveCount(0);
    });
  });

  test("las tarjetas muestran sector, año y hasta 2 servicios", async ({ page }) => {
    await page.goto("/proyectos/");
    // P2 tiene 3 servicios: solo se muestran los 2 primeros.
    const card = cards(page).filter({
      has: page.locator('a[href="/proyectos/mesa-de-partes-virtual-inaigem/"]'),
    });
    await expect(card.locator("ul").first().locator("li")).toHaveText([
      "Investigación y ambiente",
      "2026",
    ]);
    await expect(card.getByRole("list", { name: "Servicios" }).locator("li")).toHaveText([
      "Sistemas de gestión",
      "Consultoría TI",
    ]);
    await expect(card.getByText("INAIGEM", { exact: true })).toBeVisible();
  });
});

test.describe("detalle de proyecto", () => {
  test("ficha, secciones, JSON-LD y navegación anterior/siguiente", async ({ page }) => {
    await page.goto("/proyectos/planillas-inaigem/");
    await expect(page.locator("h1")).toHaveText(
      "Módulo de control de pago de planillas (segunda etapa)",
    );
    const facts = page.locator("main dl").first();
    await expect(facts.locator("dt")).toHaveText(["Cliente", "Sector", "Fecha", "Servicios"]);
    await expect(facts.locator("dd").nth(2)).toHaveText("Diciembre 2024");
    await expect(facts.getByRole("link", { name: "Sistemas de gestión" })).toHaveAttribute(
      "href",
      "/servicios/sistemas-de-gestion/",
    );
    for (const name of ["Contexto", "Solución", "Aporte"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");

    // Migas: Inicio › Proyectos › {shortTitle}.
    await expect(page.getByRole("navigation", { name: "Ruta de navegación" })).toContainText(
      "Módulo de planillas",
    );

    const data = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? "{}")));
    const work = data.find((item) => item["@type"] === "CreativeWork");
    expect(work).toMatchObject({
      name: "Módulo de control de pago de planillas (segunda etapa)",
      dateCreated: "2024-12",
      creator: { "@id": "https://bcscode.com/#organization" },
    });

    // Por fecha: anterior = más antiguo (2024-07), siguiente = más reciente (2025-05).
    const pager = page.getByRole("navigation", { name: "Proyecto anterior y siguiente" });
    await expect(pager.getByRole("link")).toHaveCount(2);
    await expect(
      pager.getByRole("link", { name: /^Proyecto anterior ?: ?Aplicativo de cotizaciones/ }),
    ).toHaveAttribute("href", "/proyectos/cotizaciones-expomoto-yamaha/");
    await expect(
      pager.getByRole("link", { name: /^Proyecto siguiente ?: ?Piloto de registro/ }),
    ).toHaveAttribute("href", "/proyectos/registro-compra-clientes-yamaha/");
  });

  test("el más antiguo no tiene anterior y el más reciente no tiene siguiente", async ({
    page,
  }) => {
    await page.goto("/proyectos/procesamiento-de-datos-unasam/");
    let pager = page.getByRole("navigation", { name: "Proyecto anterior y siguiente" });
    await expect(pager.getByRole("link")).toHaveCount(1);
    await expect(pager.getByRole("link")).toContainText("Proyecto siguiente");

    await page.goto("/proyectos/apubot-2-csj-ancash/");
    pager = page.getByRole("navigation", { name: "Proyecto anterior y siguiente" });
    await expect(pager.getByRole("link")).toHaveCount(1);
    await expect(pager.getByRole("link")).toContainText("Proyecto anterior");
  });
});
