import { expect, test, type Locator, type Page } from "@playwright/test";
import { productCategorySlugs, serviceSlugs } from "./routes";

// Contenido del Tramo 2 (§6.1–6.4): secciones, tarjetas clicables, enlaces de cotización y JSON-LD.

/** Tipos de JSON-LD presentes en la página. */
async function jsonLdTypes(page: Page): Promise<string[]> {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
  return blocks.map((text) => (JSON.parse(text) as { "@type": string })["@type"]);
}

async function jsonLd<T>(page: Page, type: string): Promise<T> {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
  const found = blocks
    .map((text) => JSON.parse(text) as { "@type": string })
    .find((data) => data["@type"] === type);
  expect(found, `JSON-LD ${type}`).toBeTruthy();
  return found as T;
}

/** Clic con el ratón en el centro de un elemento cubierto por el enlace extendido de la tarjeta. */
async function clickThrough(page: Page, target: Locator): Promise<void> {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  expect(box).toBeTruthy();
  if (!box) return;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test.describe("Inicio", () => {
  test("estructura y contenido de las secciones", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(
      "Soluciones informáticas que impulsan la transformación digital de su organización",
    );
    const main = page.locator("main");

    // S3: 7 servicios + tarjeta de cierre; "Conocer más" con contexto (WCAG 2.4.4).
    for (const slug of serviceSlugs) {
      await expect(main.locator(`a[href="/servicios/${slug}/"]`).first()).toBeVisible();
    }
    const learnMore = main.getByRole("link", { name: /^Conocer más ?: / });
    await expect(learnMore).toHaveCount(7);
    await expect(main.getByRole("heading", { name: "¿Necesita otra solución?" })).toBeVisible();

    // S5: cifras.
    await expect(main.locator("dl dt")).toHaveText([
      "Año de fundación, en Huaraz",
      "Proyectos entregados",
      "Sectores atendidos",
      "Proveedor del Estado de bienes y servicios",
    ]);
    await expect(main.locator("dl dd")).toHaveText(["2020", "+10", "4", "RNP"]);

    // S6: 4 destacados, por fecha descendente.
    const featured = main.locator('section[aria-labelledby="proyectos-title"] li h3');
    await expect(featured).toHaveText([
      "APUBOT 2.0: asistente de inteligencia artificial para la labor jurisdiccional",
      "Mesa de Partes Virtual accesible conforme a WCAG 2.1 AA",
      "Optimización del Sistema de Gestión Documental",
      "Piloto de registro de compra de clientes",
    ]);

    // S7: 8 categorías con su ancla.
    for (const slug of productCategorySlugs) {
      await expect(main.locator(`a[href="/productos/#${slug}"]`)).toHaveCount(1);
    }

    // S8: 5 pasos.
    await expect(main.locator('section[aria-labelledby="como-trabajamos"] ol > li')).toHaveCount(5);

    expect(await jsonLdTypes(page)).toEqual(expect.arrayContaining(["Organization", "WebSite"]));
  });

  test("las tarjetas de servicio son clicables en toda su superficie", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("main li").filter({ hasText: "Portales web institucionales" });
    await clickThrough(page, card.locator("p").first());
    await expect(page).toHaveURL(/\/servicios\/portales-web\/$/);
  });
});

test.describe("Servicios", () => {
  test("índice: 7 tarjetas grandes con título h2 enlazado", async ({ page }) => {
    await page.goto("/servicios/");
    const titles = page.locator("main ul h2 a");
    await expect(titles).toHaveCount(7);
    for (const [i, slug] of serviceSlugs.entries()) {
      await expect(titles.nth(i)).toHaveAttribute("href", `/servicios/${slug}/`);
    }
    await expect(page.getByRole("link", { name: /^Ver detalle del servicio ?: / })).toHaveCount(7);
    await expect(page.getByRole("heading", { level: 2, name: "Cómo trabajamos" })).toBeVisible();
  });

  for (const slug of serviceSlugs) {
    test(`detalle: ${slug}`, async ({ page }) => {
      await page.goto(`/servicios/${slug}/`);
      const h1 = (await page.locator("h1").textContent())?.trim() ?? "";

      await expect(page.locator("main a", { hasText: "Solicitar cotización" })).toHaveAttribute(
        "href",
        `/contacto/?tipo=${slug}`,
      );
      for (const name of ["¿Qué incluye?", "Beneficios", "Preguntas frecuentes"]) {
        await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
      }

      // Preguntas frecuentes con <details> nativo (sin JS).
      const first = page.locator("main details").first();
      await expect(first).not.toHaveAttribute("open", "");
      await first.locator("summary").click();
      await expect(first).toHaveAttribute("open", "");

      // Otros servicios: 3 enlaces a servicios distintos del actual.
      const others = page.getByRole("navigation", { name: "Otros servicios" }).getByRole("link");
      await expect(others).toHaveCount(3);
      const hrefs = await others.evaluateAll((els) => els.map((a) => a.getAttribute("href")));
      expect(hrefs).not.toContain(`/servicios/${slug}/`);
      expect(new Set(hrefs).size).toBe(3);

      const data = await jsonLd<{ name: string; provider: { "@id": string } }>(page, "Service");
      expect(data.name).toBe(h1);
      expect(data.provider["@id"]).toBe("https://bcscode.com/#organization");
      expect(await jsonLdTypes(page)).toContain("BreadcrumbList");
    });
  }

  test("las secciones opcionales se omiten si no hay contenido", async ({ page }) => {
    // "Redes y soporte" no tiene capacidades ni proyectos relacionados (§7.1, §7.3).
    await page.goto("/servicios/redes-y-soporte/");
    await expect(page.getByRole("heading", { name: "Capacidades tecnológicas" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Proyectos relacionados" })).toHaveCount(0);

    await page.goto("/servicios/inteligencia-artificial/");
    await expect(page.getByRole("heading", { name: "Capacidades tecnológicas" })).toBeVisible();
    const related = page.locator('section[aria-labelledby="relacionados-title"] li');
    await expect(related).toHaveCount(2);
    await expect(related.locator("h3").first()).toContainText("APUBOT 2.0");
  });
});

test.describe("Productos", () => {
  test("categorías con ancla, cotización prellenada y OfferCatalog", async ({ page }) => {
    await page.goto("/productos/");
    const index = page.getByRole("navigation", { name: "Categorías de productos" });
    await expect(index.getByRole("link")).toHaveCount(8);

    for (const slug of productCategorySlugs) {
      const section = page.locator(`section#${slug}`);
      await expect(section).toHaveCount(1);
      const name = (await section.locator("h2").textContent())?.trim() ?? "";
      const quote = section.getByRole("link", { name: `Solicitar cotización de ${name}` });
      await expect(quote).toHaveAttribute("href", `/contacto/?tipo=bienes&categoria=${slug}`);
    }

    // El ancla lleva a la sección sin quedar tapada por el encabezado fijo.
    await index.getByRole("link", { name: "Software y licencias" }).click();
    await expect(page).toHaveURL(/#software-y-licencias$/);
    const top = await page
      .locator("#software-y-licencias h2")
      .evaluate((el) => el.getBoundingClientRect().top);
    const header = await page
      .locator("[data-site-header]")
      .evaluate((el) => el.getBoundingClientRect().bottom);
    expect(top).toBeGreaterThanOrEqual(header);

    const catalog = await jsonLd<{ itemListElement: { itemOffered: { name: string } }[] }>(
      page,
      "OfferCatalog",
    );
    expect(catalog.itemListElement).toHaveLength(8);
    expect(catalog.itemListElement[0]?.itemOffered.name).toBe("Equipos de cómputo");
    expect(JSON.stringify(catalog)).not.toMatch(/price/i);
  });
});
