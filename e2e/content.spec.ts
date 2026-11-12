import { expect, test, type Locator, type Page } from "@playwright/test";
import { englishPhrases } from "../src/lib/foreign-terms";
import { notFoundPath, productCategorySlugs, routes, serviceSlugs } from "./routes";

// Contenido (§6): secciones, tarjetas clicables, enlaces de cotización, JSON-LD, páginas
// institucionales y legales, robots.txt y sitemap.

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
    const related = page.locator('section[aria-labelledby="relacionados-title"] h3');
    await expect(related).toHaveCount(2);
    await expect(related.first()).toContainText("APUBOT 2.0");
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

test.describe("Nosotros", () => {
  test("secciones, datos de la empresa, gerencia y trayectoria", async ({ page }) => {
    await page.goto("/nosotros/");
    await expect(page.locator("h1")).toHaveText("Construyendo Soluciones Informáticas");
    const main = page.locator("main");
    for (const name of [
      "Quiénes somos",
      "Misión",
      "Visión",
      "Nuestros valores",
      "Datos de la empresa",
      "Gerencia",
      "Nuestra organización",
      "Trayectoria",
    ]) {
      await expect(main.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    }
    await expect(
      main.locator('[lang="en"]', { hasText: "Building Computer Solutions" }),
    ).toHaveCount(2);

    const values = main.locator('section[aria-labelledby="valores-title"] h3');
    await expect(values).toHaveText([
      "Compromiso",
      "Calidad técnica",
      "Innovación responsable",
      "Accesibilidad e inclusión",
      "Transparencia",
      "Cercanía",
    ]);

    const data = main.locator('section[aria-labelledby="datos-title"] dl');
    await expect(data.locator("dt")).toHaveCount(10);
    await expect(
      data.locator("dt", { hasText: "RUC" }).locator("xpath=following-sibling::dd[1]"),
    ).toHaveText("20606674415");

    await expect(main.locator('section[aria-labelledby="organizacion-title"] h3')).toHaveCount(7);
    const years = main.locator('section[aria-labelledby="trayectoria-title"] ol > li h3');
    await expect(years).toHaveText(["2020", "2021", "2022", "2023", "2024", "2025", "2026"]);

    // Gerencia: nombre, cargo y enlaces externos (§5.6).
    const manager = main.locator('section[aria-labelledby="gerencia-title"]');
    await expect(manager.getByRole("heading", { level: 3 })).toHaveText(
      "Cristian Fernando Chávez Torres",
    );
    await expect(manager.getByRole("heading", { level: 4 })).toHaveText([
      "Trayectoria",
      "Certificaciones y formación",
    ]);
    const linkedin = manager.getByRole("link", { name: /^LinkedIn/ });
    await expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/cristian-chavez-38272b120",
    );
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
    await expect(manager.getByRole("link", { name: /^GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/sygns13",
    );
  });

  test("foto del Gerente o monograma, coherente con el JSON-LD", async ({ page }) => {
    await page.goto("/nosotros/");
    const portrait = page.locator("[data-manager-portrait]");
    const mode = await portrait.getAttribute("data-manager-portrait");
    const org = await jsonLd<{ founder: { image?: string; jobTitle: string } }>(
      page,
      "Organization",
    );
    expect(org.founder.jobTitle).toBe("Gerente General");

    if (mode === "photo") {
      const img = portrait.getByRole("img", {
        name: "Cristian Fernando Chávez Torres, Gerente General de Construyendo Soluciones Informáticas",
      });
      await expect(img).toHaveAttribute("loading", "lazy");
      await expect(portrait.locator('source[type="image/avif"]')).toHaveCount(1);
      expect(org.founder.image).toMatch(/^https:\/\/bcscode\.com\/_astro\/.+\.webp$/);
    } else {
      // Monograma temporal (§6.7): decorativo y sin imagen en el JSON-LD.
      expect(mode).toBe("monogram");
      await expect(portrait.locator('[aria-hidden="true"]')).toHaveText("CC");
      await expect(portrait.locator("img")).toHaveCount(0);
      expect(org.founder.image).toBeUndefined();
    }
  });
});

test.describe("Páginas legales", () => {
  test("Libro de Reclamaciones: requisitos y correo con plantilla", async ({ page }) => {
    await page.goto("/libro-de-reclamaciones/");
    await expect(page.locator("h1")).toHaveText("Libro de Reclamaciones");
    await expect(page.locator("main")).toContainText("Ley N.º 29571");
    const button = page.getByRole("link", { name: "Enviar reclamo o queja por correo" });
    const href = (await button.getAttribute("href")) ?? "";
    expect(href.startsWith("mailto:construyendosolucionesbcs@gmail.com?subject=")).toBe(true);
    const params = new URLSearchParams(href.slice(href.indexOf("?") + 1));
    expect(params.get("subject")).toBe("Libro de Reclamaciones");
    const body = params.get("body") ?? "";
    expect(body).toContain("Nombres y apellidos: ");
    expect(body).toContain("Pedido concreto: ");
    await expect(
      page.getByRole("heading", { name: "Diferencia entre reclamo y queja" }),
    ).toBeVisible();
  });

  test("Privacidad: fecha de actualización y 8 secciones", async ({ page }) => {
    await page.goto("/privacidad/");
    await expect(page.locator("main time").first()).toHaveAttribute(
      "datetime",
      /^\d{4}-\d{2}-\d{2}$/,
    );
    await expect(page.locator("main")).toContainText(
      /Última actualización: \d{1,2} de \p{L}+ de \d{4}/u,
    );
    const sections = page.locator("main h2").filter({ hasText: /^\d\. / });
    await expect(sections).toHaveCount(8);
    await expect(sections.first()).toHaveText("1. Responsable");
  });

  test("Accesibilidad: medidas, evaluación y contacto", async ({ page }) => {
    await page.goto("/accesibilidad/");
    await expect(page.locator("main h2")).toHaveText([
      "Medidas adoptadas",
      "Evaluación",
      "¿Encontró una barrera?",
      "¿Tiene un proyecto o un requerimiento?",
    ]);
    await expect(page.locator("main")).toContainText("Fecha de la última evaluación:");
    await expect(
      page.locator("main").getByRole("link", { name: /^\+1 717 883 9161/ }),
    ).toHaveAttribute("target", "_blank");
  });
});

test.describe("robots.txt y sitemap", () => {
  test("robots.txt según §9.5", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect((await res.text()).trim()).toBe(
      "User-agent: *\nAllow: /\nSitemap: https://bcscode.com/sitemap-index.xml",
    );
  });

  test("el sitemap lista todas las rutas, sin la 404", async ({ request }) => {
    const index = await (await request.get("/sitemap-index.xml")).text();
    const sitemaps = [...index.matchAll(/<loc>https:\/\/bcscode\.com(\/[^<]+)<\/loc>/g)].map(
      (m) => m[1] ?? "",
    );
    const locs: string[] = [];
    for (const path of sitemaps) {
      const xml = await (await request.get(path)).text();
      locs.push(
        ...[...xml.matchAll(/<loc>https:\/\/bcscode\.com([^<]*)<\/loc>/g)].map((m) => m[1] ?? ""),
      );
    }
    expect(locs.sort()).toEqual([...routes].sort());
  });
});

test.describe("idioma de las partes (WCAG 3.1.2)", () => {
  test("las frases en inglés van con lang=en en todas las rutas", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Mismo HTML en ambos proyectos");
    const found = new Set<string>();
    for (const route of [...routes, notFoundPath]) {
      await page.goto(route);
      const result = await page.evaluate(
        (phrases) => {
          const bad: string[] = [];
          const ok: string[] = [];
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            const text = node.textContent ?? "";
            for (const phrase of phrases) {
              if (!text.includes(phrase)) continue;
              const lang = node.parentElement?.closest("[lang]")?.getAttribute("lang");
              (lang === "en" && text.trim() === phrase ? ok : bad).push(phrase);
            }
          }
          return { bad, ok };
        },
        englishPhrases as readonly string[],
      );
      expect(result.bad, route).toEqual([]);
      result.ok.forEach((phrase) => found.add(phrase));
    }
    // Cada frase de la lista aparece al menos una vez (la lista no tiene entradas muertas).
    expect([...found].sort()).toEqual([...englishPhrases].sort());
  });
});
