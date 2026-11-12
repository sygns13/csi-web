import type { UiKey } from "../i18n";
import type { IconName } from "../components/ui/icons";

export interface NavItem {
  key: UiKey;
  href: string;
}

/** Navegación principal (§5.2). "Servicios" se muestra como desplegable. */
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

export interface ServiceNavItem {
  slug: string;
  navLabel: string;
  icon: IconName;
  summary: string;
}

/**
 * Servicios para el desplegable y el pie (§5.2, §5.3). Textos tomados de §7.1.
 * TODO(Tramo 2): derivar esta lista de la colección `services` (getCollection) y borrar la copia.
 */
export const servicesNav: ServiceNavItem[] = [
  {
    slug: "desarrollo-de-software",
    navLabel: "Desarrollo de software",
    icon: "code-xml",
    summary:
      "Aplicaciones web, servicios backend e integraciones construidos a la medida de sus procesos, escalables y seguros.",
  },
  {
    slug: "inteligencia-artificial",
    navLabel: "Inteligencia artificial",
    icon: "brain-circuit",
    summary:
      "Asistentes virtuales, chatbots e IA generativa con modelos de lenguaje, RAG y visión por computadora para automatizar procesos.",
  },
  {
    slug: "portales-web",
    navLabel: "Portales web",
    icon: "globe",
    summary:
      "Portales institucionales, corporativos y académicos rápidos, accesibles (WCAG) y fáciles de administrar.",
  },
  {
    slug: "sistemas-de-gestion",
    navLabel: "Sistemas de gestión",
    icon: "layout-dashboard",
    summary:
      "Mesa de partes virtual, gestión documental, planillas, cotizaciones, ventas y facturación electrónica a la medida.",
  },
  {
    slug: "cloud-e-infraestructura",
    navLabel: "Cloud e infraestructura",
    icon: "cloud-cog",
    summary:
      "Migración a la nube, servidores, contenedores, certificados SSL, hosting y soporte para que sus sistemas estén siempre disponibles.",
  },
  {
    slug: "consultoria-ti",
    navLabel: "Consultoría TI",
    icon: "lightbulb",
    summary:
      "Consultoría en arquitectura de software, accesibilidad web, seguridad, procesamiento de datos y gestión de proyectos TI.",
  },
  {
    slug: "redes-y-soporte",
    navLabel: "Redes y soporte",
    icon: "network",
    summary:
      "Cableado estructurado, redes, seguridad perimetral, soporte técnico y mantenimiento de equipos informáticos.",
  },
];

export const serviceHref = (slug: string): string => `/servicios/${slug}/`;
