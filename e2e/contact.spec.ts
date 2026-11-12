import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  buildContactMessage,
  contactUrl,
  normalizeMultiline,
  parsePrefill,
  validateContact,
} from "../src/lib/contact-message";
import { site } from "../src/config/site";
import { productCategorySlugs, serviceSlugs } from "./routes";

// Formulario de contacto sin backend (§8, §17.2). Las URLs esperadas se arman aquí a mano, con el
// formato literal de §8.2, para no depender de la implementación.

const WA_BASE = "https://wa.me/17178839161?text=";
const EMAIL = "construyendosolucionesbcs@gmail.com";
const TYPES = [...serviceSlugs, "bienes", "otro"];
const TARGETS = { waMe: site.whatsapp.waMe, email: site.email };
const CATEGORIES = new Map([["servidores-y-almacenamiento", "Servidores y almacenamiento"]]);

const expectedWhatsapp = (message: string): string => `${WA_BASE}${encodeURIComponent(message)}`;
const expectedMailto = (typeLabel: string, message: string): string =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(`Solicitud web: ${typeLabel}`)}&body=${encodeURIComponent(message)}`;

// Datos de ejemplo (con espacios de más para probar la normalización).
const SAMPLE = {
  name: "  Ana   María  Pérez ",
  organization: " Municipalidad   de Huaraz ",
  type: "inteligencia-artificial",
  typeLabel: "Inteligencia artificial",
  message: "  Necesito un   asistente virtual.\n\n\n\nGracias.  ",
};
const SAMPLE_TEXT = [
  "Hola, mi nombre es Ana María Pérez — Municipalidad de Huaraz.",
  "Tipo de requerimiento: Inteligencia artificial",
  "Necesito un asistente virtual.",
  "",
  "Gracias.",
  "",
  "(Mensaje enviado desde bcscode.com)",
].join("\n");

interface Recorder {
  __opened: string[][];
  __navigations: string[];
}

interface NavigateEventLike extends Event {
  destination: { url: string };
}

/** Intercepta window.open y la navegación a mailto: (Navigation API) antes de cargar la página. */
async function intercept(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as Window & Recorder & { navigation?: EventTarget };
    w.__opened = [];
    w.__navigations = [];
    w.open = (...args: unknown[]) => {
      w.__opened.push(args.map(String));
      return null;
    };
    w.navigation?.addEventListener("navigate", (event) => {
      const e = event as NavigateEventLike;
      if (e.destination.url.startsWith("mailto:")) {
        w.__navigations.push(e.destination.url);
        e.preventDefault();
      }
    });
  });
}

const recorded = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as Recorder;
    return { opened: w.__opened, navigations: w.__navigations };
  });

async function fillSample(page: Page): Promise<void> {
  await page.getByLabel("Nombres y apellidos").fill(SAMPLE.name);
  await page.getByLabel("Entidad o empresa").fill(SAMPLE.organization);
  await page.getByLabel("Tipo de requerimiento").selectOption(SAMPLE.type);
  await page.getByLabel("Mensaje").fill(SAMPLE.message);
}

test.describe("contact-message (funciones puras)", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Sin navegador: una sola vez");
  });

  test("arma el mensaje con valores normalizados", () => {
    expect(
      buildContactMessage({
        name: SAMPLE.name,
        organization: SAMPLE.organization,
        typeLabel: SAMPLE.typeLabel,
        message: SAMPLE.message,
      }),
    ).toBe(SAMPLE_TEXT);
    expect(
      buildContactMessage({
        name: "Luis",
        organization: "  ",
        typeLabel: "Otro",
        message: "Hola.",
      }),
    ).toBe(
      "Hola, mi nombre es Luis.\nTipo de requerimiento: Otro\nHola.\n\n(Mensaje enviado desde bcscode.com)",
    );
    expect(normalizeMultiline("a\r\n\r\n\r\nb\t c")).toBe("a\n\nb c");
  });

  test("URLs de WhatsApp y de correo exactas (§8.2)", () => {
    expect(contactUrl("whatsapp", SAMPLE.typeLabel, SAMPLE_TEXT, TARGETS)).toBe(
      expectedWhatsapp(SAMPLE_TEXT),
    );
    expect(contactUrl("email", SAMPLE.typeLabel, SAMPLE_TEXT, TARGETS)).toBe(
      expectedMailto(SAMPLE.typeLabel, SAMPLE_TEXT),
    );
  });

  test("validación", () => {
    const ok = { name: "Ana", organization: "", type: "otro", message: "0123456789" };
    expect(validateContact(ok, TYPES)).toEqual([]);
    expect(validateContact({ ...ok, name: "  A  ", type: "", message: "corto" }, TYPES)).toEqual([
      "name",
      "type",
      "message",
    ]);
    expect(validateContact({ ...ok, type: "hackeo" }, TYPES)).toEqual(["type"]);
    // Longitudes sobre el valor normalizado: " A   b " → "A b" (3 caracteres).
    expect(validateContact({ ...ok, name: " A   b " }, TYPES)).toEqual([]);
    expect(validateContact({ ...ok, name: "x".repeat(81) }, TYPES)).toEqual(["name"]);
    expect(validateContact({ ...ok, message: "x".repeat(1001) }, TYPES)).toEqual(["message"]);
    expect(validateContact({ ...ok, message: `${"x".repeat(1000)}   ` }, TYPES)).toEqual([]);
  });

  test("prellenado con lista blanca", () => {
    expect(
      parsePrefill("?tipo=bienes&categoria=servidores-y-almacenamiento", TYPES, CATEGORIES),
    ).toEqual({ type: "bienes", message: "Deseo cotizar: Servidores y almacenamiento. " });
    expect(parsePrefill("?tipo=portales-web", TYPES, CATEGORIES)).toEqual({
      type: "portales-web",
    });
    // La categoría solo se usa con tipo=bienes.
    expect(
      parsePrefill("?tipo=otro&categoria=servidores-y-almacenamiento", TYPES, CATEGORIES),
    ).toEqual({ type: "otro" });
    expect(
      parsePrefill("?tipo=x&categoria=servidores-y-almacenamiento", TYPES, CATEGORIES),
    ).toEqual({});
    expect(parsePrefill("?tipo=bienes&categoria=__proto__", TYPES, CATEGORIES)).toEqual({
      type: "bienes",
    });
  });
});

test.describe("página de contacto", () => {
  test("canales visibles, sin CtaBand ni botón flotante", async ({ page }) => {
    await page.goto("/contacto/");
    const main = page.locator("main");
    for (const name of ["WhatsApp", "Llamadas", "Correo", "Redes sociales"]) {
      await expect(main.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    }
    await expect(main.getByRole("link", { name: /^Abrir WhatsApp/ })).toHaveAttribute(
      "href",
      `${WA_BASE}${encodeURIComponent("Hola, me comunico desde la página web de CSI.")}`,
    );
    await expect(main.getByRole("link", { name: "Llamar ahora" })).toHaveAttribute(
      "href",
      "tel:+51975114780",
    );
    await expect(main.getByRole("link", { name: "Enviar correo" })).toHaveAttribute(
      "href",
      `mailto:${EMAIL}`,
    );
    await expect(page.locator("[data-whatsapp-fab]")).toHaveCount(0);
    await expect(page.locator("#cta-band-title")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { level: 2, name: "Formulario de contacto" }),
    ).toBeVisible();
  });

  test("errores en línea y resumen con enlaces a cada campo", async ({ page }) => {
    await page.goto("/contacto/");
    await page.getByRole("button", { name: "Continuar en WhatsApp" }).click();

    const summary = page.getByRole("alert").filter({ hasText: "Revise los siguientes campos" });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("heading", { level: 2 })).toHaveText(
      "Revise los siguientes campos",
    );
    await expect(summary.getByRole("link")).toHaveText([
      "Ingrese sus nombres y apellidos (mínimo 3 caracteres).",
      "Seleccione el tipo de requerimiento.",
      "Escriba su mensaje (entre 10 y 1000 caracteres).",
    ]);

    const name = page.getByLabel("Nombres y apellidos");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription(
      "Ingrese sus nombres y apellidos (mínimo 3 caracteres).",
    );
    await expect(page.getByLabel("Tipo de requerimiento")).toHaveAttribute("aria-invalid", "true");
    const message = page.getByLabel("Mensaje");
    await expect(message).toHaveAttribute("aria-invalid", "true");
    await expect(message).toHaveAccessibleDescription(
      "Escriba su mensaje (entre 10 y 1000 caracteres). 0/1000",
    );
    // El campo opcional nunca se marca.
    await expect(page.getByLabel("Entidad o empresa")).not.toHaveAttribute("aria-invalid", "true");

    // El enlace del resumen lleva el foco al campo.
    await summary.getByRole("link", { name: /tipo de requerimiento/ }).click();
    await expect(page.getByLabel("Tipo de requerimiento")).toBeFocused();

    // Al corregir un campo, su error desaparece del campo y del resumen.
    await name.fill("Ana Pérez");
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-name-error")).toBeHidden();
    await expect(summary.getByRole("link")).toHaveCount(2);

    // Sin envío ni mensaje de estado mientras haya errores.
    await expect(page.locator("[data-form-status]")).toBeEmpty();
  });

  test("abre WhatsApp con el mensaje exacto y no limpia el formulario", async ({ page }) => {
    await intercept(page);
    await page.goto("/contacto/");
    await fillSample(page);
    await page.getByRole("button", { name: "Continuar en WhatsApp" }).click();

    const url = expectedWhatsapp(SAMPLE_TEXT);
    const { opened } = await recorded(page);
    expect(opened).toEqual([[url, "_blank", "noopener"]]);

    const status = page.getByRole("status").filter({ hasText: "Abrimos WhatsApp" });
    await expect(status).toContainText(
      "Abrimos WhatsApp con su mensaje. Si no se abrió, use este enlace:",
    );
    const link = status.getByRole("link", { name: /^Abrir WhatsApp/ });
    await expect(link).toHaveAttribute("href", url);
    await expect(link).toHaveAttribute("target", "_blank");

    await expect(page.getByLabel("Nombres y apellidos")).toHaveValue(SAMPLE.name);
    await expect(page.getByLabel("Mensaje")).toHaveValue(SAMPLE.message);
  });

  test("abre el correo con asunto y cuerpo exactos", async ({ page }) => {
    await intercept(page);
    await page.goto("/contacto/");
    await fillSample(page);
    await page.getByRole("radio", { name: "Correo electrónico" }).check();
    const submit = page.getByRole("button", { name: "Continuar en correo" });
    await expect(submit).toBeVisible();
    await submit.click();

    const url = expectedMailto(SAMPLE.typeLabel, SAMPLE_TEXT);
    await expect.poll(async () => (await recorded(page)).navigations).toEqual([url]);
    expect((await recorded(page)).opened).toEqual([]);

    const status = page.getByRole("status").filter({ hasText: "Abrimos su aplicación de correo" });
    await expect(status.getByRole("link", { name: "Abrir correo" })).toHaveAttribute("href", url);
    await expect(page).toHaveURL(/\/contacto\/$/);
  });

  test("prellenado por ?tipo=bienes&categoria=servidores-y-almacenamiento", async ({ page }) => {
    await page.goto("/contacto/?tipo=bienes&categoria=servidores-y-almacenamiento");
    await expect(page.getByLabel("Tipo de requerimiento")).toHaveValue("bienes");
    await expect(page.getByLabel("Mensaje")).toHaveValue(
      "Deseo cotizar: Servidores y almacenamiento. ",
    );
    await expect(page.locator("[data-counter]")).toHaveText("44/1000");
  });

  test("los enlaces de cotización de otras páginas prellenan el formulario", async ({ page }) => {
    for (const slug of serviceSlugs) {
      await page.goto(`/servicios/${slug}/`);
      await page.locator("main").getByRole("link", { name: "Solicitar cotización" }).click();
      await expect(page).toHaveURL(new RegExp(`/contacto/\\?tipo=${slug}$`));
      await expect(page.getByLabel("Tipo de requerimiento")).toHaveValue(slug);
      await expect(page.getByLabel("Mensaje")).toHaveValue("");
    }
    const [category] = productCategorySlugs;
    await page.goto(`/productos/#${category}`);
    await page
      .locator(`section#${category}`)
      .getByRole("link", { name: /^Solicitar/ })
      .click();
    await expect(page.getByLabel("Tipo de requerimiento")).toHaveValue("bienes");
    await expect(page.getByLabel("Mensaje")).toHaveValue("Deseo cotizar: Equipos de cómputo. ");
  });

  test("ignora valores fuera de la lista blanca", async ({ page }) => {
    await page.goto("/contacto/?tipo=%3Cimg%20src%3Dx%3E&categoria=servidores-y-almacenamiento");
    await expect(page.getByLabel("Tipo de requerimiento")).toHaveValue("");
    await expect(page.getByLabel("Mensaje")).toHaveValue("");

    await page.goto("/contacto/?tipo=bienes&categoria=%3Cb%3Ehola%3C%2Fb%3E");
    await expect(page.getByLabel("Tipo de requerimiento")).toHaveValue("bienes");
    await expect(page.getByLabel("Mensaje")).toHaveValue("");

    await page.goto("/contacto/?tipo=portales-web&categoria=servidores-y-almacenamiento");
    await expect(page.getByLabel("Tipo de requerimiento")).toHaveValue("portales-web");
    await expect(page.getByLabel("Mensaje")).toHaveValue("");
  });

  test("contador del mensaje: visible siempre, anuncio solo cerca del límite", async ({ page }) => {
    await page.goto("/contacto/");
    const message = page.getByLabel("Mensaje");
    const counter = page.locator("[data-counter]");
    const live = page.locator("[data-counter-live]");
    await expect(counter).toHaveText("0/1000");
    await expect(live).toHaveAttribute("aria-live", "polite");

    await message.fill("x".repeat(120));
    await expect(counter).toHaveText("120/1000");
    await expect(live).toHaveText("");

    await message.fill("x".repeat(950));
    await expect(counter).toHaveText("950/1000");
    await expect(live).toHaveText("950/1000");

    await message.fill("x".repeat(1005));
    await expect(counter).toHaveAttribute("data-over", "");
    await page.getByRole("button", { name: "Continuar en WhatsApp" }).click();
    await expect(message).toHaveAttribute("aria-invalid", "true");
  });

  test("axe sin infracciones con errores visibles", async ({ page }) => {
    for (const theme of ["light", "dark"]) {
      await page.addInitScript((value) => localStorage.setItem("csi-theme", value), theme);
      await page.goto("/contacto/");
      await page.getByRole("button", { name: "Continuar en WhatsApp" }).click();
      await expect(page.locator("[data-error-summary]")).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    }
  });

  test.describe("sin JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("el formulario se muestra deshabilitado con aviso; los canales funcionan", async ({
      page,
    }) => {
      await page.goto("/contacto/");
      await expect(page.locator("[data-form-fields]")).toHaveAttribute("disabled", "");
      await expect(page.getByLabel("Nombres y apellidos")).toBeDisabled();
      // Chromium con JS desactivado por emulación sigue analizando <noscript> como texto sin
      // renderizar; se verifica su contenido en lugar de su visibilidad.
      const noscript = await page
        .locator("noscript")
        .first()
        .evaluate((el) => el.textContent);
      expect(noscript).toContain(
        "Para usar el formulario active JavaScript, o escríbanos directamente por los canales de arriba.",
      );
      await expect(page.getByRole("link", { name: "Llamar ahora" })).toBeEnabled();
    });
  });
});
