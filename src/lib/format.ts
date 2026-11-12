/** Año de compilación (para el © del pie de página). */
export const buildYear = new Date().getFullYear();

/** Colapsa espacios y recorta. */
export function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
