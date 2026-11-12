// Valores cerrados de las colecciones de contenido (§7.3). Módulo sin dependencias para que
// `content.config.ts` y los componentes compartan los mismos tipos.

/** Sectores de los proyectos. La etiqueta visible está en `src/i18n/es.ts` (`sector.*`). */
export const sectors = [
  "justicia",
  "investigacion-y-ambiente",
  "educacion-superior",
  "empresa-privada",
] as const;
export type Sector = (typeof sectors)[number];

/** Variantes de la maqueta genérica `ProjectVisual` (§4.6). */
export const projectVisuals = [
  "chat",
  "form",
  "dashboard",
  "documents",
  "table",
  "portal",
  "certificate",
  "server",
] as const;
export type ProjectVisualVariant = (typeof projectVisuals)[number];
