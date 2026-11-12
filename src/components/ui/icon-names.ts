// Nombres de los íconos Lucide registrados en `icons.ts`. Módulo sin dependencias para que
// `content.config.ts` pueda validar el campo `icon` de las colecciones.
export const iconNames = [
  "arrow-right",
  "award",
  "badge-check",
  "bot",
  "brain-circuit",
  "chevron-down",
  "circle-check",
  "cloud",
  "cloud-cog",
  "code-xml",
  "external-link",
  "file-text",
  "globe",
  "handshake",
  "image",
  "keyboard",
  "landmark",
  "layout-dashboard",
  "lightbulb",
  "lock",
  "mail",
  "menu",
  "monitor",
  "moon",
  "network",
  "package",
  "pen-line",
  "phone",
  "printer",
  "router",
  "search",
  "send",
  "server",
  "shield-check",
  "sparkles",
  "sun",
  "video",
  "x",
] as const;

export type IconName = (typeof iconNames)[number];

export const isIconName = (value: string): value is IconName =>
  (iconNames as readonly string[]).includes(value);
