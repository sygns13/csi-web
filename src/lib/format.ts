/** Año de compilación (para el © del pie de página). */
export const buildYear = new Date().getFullYear();

/** Colapsa espacios y recorta. */
export function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Fecha ISO ("YYYY-MM-DD") en formato largo de Perú: "12 de noviembre de 2026". */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
