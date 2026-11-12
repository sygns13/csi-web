import type { UiKey } from "../i18n";

export interface NavItem {
  key: UiKey;
  href: string;
}

/**
 * Navegación principal (§5.2). "Servicios" se muestra como desplegable con los servicios de la
 * colección `services` (Header y Footer los obtienen con `getServices()` de `src/lib/content.ts`).
 */
export const mainNav: NavItem[] = [
  { key: "nav.products", href: "/productos/" },
  { key: "nav.projects", href: "/proyectos/" },
  { key: "nav.about", href: "/nosotros/" },
  { key: "nav.contact", href: "/contacto/" },
];

/** Columna "Empresa" del pie (§5.3). */
export const companyNav: NavItem[] = [
  { key: "nav.about", href: "/nosotros/" },
  { key: "nav.projects", href: "/proyectos/" },
  { key: "nav.products", href: "/productos/" },
  { key: "nav.contact", href: "/contacto/" },
];

/** Franja inferior del pie (§5.3). */
export const legalNav: NavItem[] = [
  { key: "footer.privacy", href: "/privacidad/" },
  { key: "footer.accessibility", href: "/accesibilidad/" },
  { key: "footer.complaints", href: "/libro-de-reclamaciones/" },
];
