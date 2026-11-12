import { site } from "../config/site";
import { absoluteUrl } from "./seo";

// Datos estructurados (§9.3). Solo se publican datos marcados "Publicar: Sí" (§1.1).

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const LOGO_PATH = "/brand/csi-logo-512.png";

type JsonLd = Record<string, unknown>;

export interface OrganizationOptions {
  /** URL (ruta o absoluta) de la foto optimizada del Gerente General, si existe (Tramo 3). */
  founderImage?: string;
}

export function organization(options: OrganizationOptions = {}): JsonLd {
  const founder: JsonLd = {
    "@type": "Person",
    name: site.manager.name,
    jobTitle: site.manager.role,
    sameAs: [site.manager.linkedin, site.manager.github],
  };
  if (options.founderImage) founder.image = absoluteUrl(options.founderImage);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.legalName,
    legalName: site.legalName,
    alternateName: [site.shortName, site.tradeName],
    url: `${site.url}/`,
    logo: absoluteUrl(LOGO_PATH),
    taxID: site.ruc,
    foundingDate: String(site.foundingYear),
    founder,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.country,
    email: site.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+1-717-883-9161",
        availableLanguage: "es",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+51-975-114-780",
        availableLanguage: "es",
      },
    ],
    sameAs: [site.social.facebook, site.social.youtube],
  };
}

export function website(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.legalName,
    url: `${site.url}/`,
    inLanguage: "es-PE",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbList(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

/**
 * Serializa JSON-LD para un <script type="application/ld+json"> sin permitir cerrar la etiqueta.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
