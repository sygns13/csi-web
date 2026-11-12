import { getCollection, type CollectionEntry } from "astro:content";
import type { Sector } from "../config/taxonomy";
import { defaultLang, localizedPath, t, type Lang, type UiKey } from "../i18n";

// Acceso a las colecciones (§7): filtra por idioma y borradores, ordena y valida referencias.

export type Service = CollectionEntry<"services">;
export type ProductCategory = CollectionEntry<"productCategories">;
export type Project = CollectionEntry<"projects">;

/** Servicios ordenados por `order`. */
export async function getServices(lang: Lang = defaultLang): Promise<Service[]> {
  const entries = await getCollection("services", ({ data }) => data.lang === lang);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Categorías de bienes ordenadas por `order`. */
export async function getProductCategories(lang: Lang = defaultLang): Promise<ProductCategory[]> {
  const entries = await getCollection("productCategories", ({ data }) => data.lang === lang);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Proyectos publicados (sin borradores), del más reciente al más antiguo. Falla el build si un
 * proyecto referencia un servicio inexistente ("referencias validadas", §7.3).
 */
export async function getProjects(lang: Lang = defaultLang): Promise<Project[]> {
  const [entries, services] = await Promise.all([
    getCollection("projects", ({ data }) => data.lang === lang && !data.draft),
    getServices(lang),
  ]);
  const serviceIds = new Set(services.map((service) => service.id));
  for (const project of entries) {
    for (const ref of project.data.services) {
      if (!serviceIds.has(ref.id)) {
        throw new Error(
          `El proyecto "${project.id}" referencia el servicio inexistente "${ref.id}".`,
        );
      }
    }
  }
  return entries.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
}

/** Proyectos destacados para Inicio (§6.1 S6). */
export async function getFeaturedProjects(limit = 4, lang: Lang = defaultLang): Promise<Project[]> {
  return (await getProjects(lang)).filter((p) => p.data.featured).slice(0, limit);
}

/** Proyectos relacionados con un servicio: los más recientes primero (§6.3). */
export async function getProjectsByService(
  serviceId: string,
  limit = 3,
  lang: Lang = defaultLang,
): Promise<Project[]> {
  return (await getProjects(lang))
    .filter((p) => p.data.services.some((ref) => ref.id === serviceId))
    .slice(0, limit);
}

export const serviceHref = (id: string, lang: Lang = defaultLang): string =>
  localizedPath(`/servicios/${id}/`, lang);

export const projectHref = (id: string, lang: Lang = defaultLang): string =>
  localizedPath(`/proyectos/${id}/`, lang);

export const productCategoryHref = (id: string, lang: Lang = defaultLang): string =>
  localizedPath(`/productos/#${id}`, lang);

/** Enlace de cotización con prellenado del formulario (§8.2, punto 7). */
export function quoteHref(
  params: { tipo?: string; categoria?: string } = {},
  lang: Lang = defaultLang,
): string {
  const query = new URLSearchParams();
  if (params.tipo) query.set("tipo", params.tipo);
  if (params.categoria) query.set("categoria", params.categoria);
  const qs = query.toString();
  return localizedPath(`/contacto/${qs ? `?${qs}` : ""}`, lang);
}

export const sectorLabel = (sector: Sector, lang: Lang = defaultLang): string =>
  t(`sector.${sector}` as const, undefined, lang);

/**
 * Nombre del cliente en tarjetas (§7.3): la parte antes de " – " ("INAIGEM", "UNASAM").
 */
export function clientShortName(client: string): string {
  return client.split(" – ")[0] ?? client;
}

/** Valor de `datetime` para la fecha del proyecto: el año solo si la etiqueta es solo un año. */
export function projectDatetime(project: Project): string {
  const { date, dateLabel } = project.data;
  return /^\d{4}$/.test(dateLabel) ? date.slice(0, 4) : date;
}

/** Año del proyecto (insignia de la tarjeta, §6.5). */
export const projectYear = (project: Project): string => project.data.date.slice(0, 4);

/**
 * Proyectos vecinos por fecha (§6.6, punto 7): "anterior" es el más antiguo y "siguiente" el más
 * reciente. `projects` viene de `getProjects()` (orden descendente).
 */
export function adjacentProjects(
  projects: readonly Project[],
  id: string,
): { prev?: Project; next?: Project } {
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) throw new Error(`Proyecto inexistente: "${id}".`);
  return { prev: projects[index + 1], next: projects[index - 1] };
}

/** Valores del campo "Tipo de requerimiento" (§8.1): slugs de servicio + `bienes` + `otro`. */
export async function getContactTypes(
  lang: Lang = defaultLang,
): Promise<{ value: string; label: string }[]> {
  const services = await getServices(lang);
  const values = [...services.map((service) => service.id), "bienes", "otro"];
  return values.map((value) => {
    const label = t(`form.type.${value}` as UiKey, undefined, lang) as string | undefined;
    if (!label) throw new Error(`Falta la etiqueta "form.type.${value}" en src/i18n.`);
    return { value, label };
  });
}
