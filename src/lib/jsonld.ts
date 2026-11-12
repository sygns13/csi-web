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

export interface ServiceInput {
  name: string;
  description: string;
  serviceType: string;
  /** Ruta de la página del servicio. */
  path: string;
}

/** Página de servicio (§9.3): `Service` con el proveedor enlazado a la organización. */
export function service(input: ServiceInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: absoluteUrl(input.path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: site.country,
  };
}

/** Catálogo de bienes (§9.3): un `Offer` por categoría, sin precios. */
export function offerCatalog(name: string, categories: string[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name,
    itemListElement: categories.map((category) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: category },
    })),
  };
}

export interface CreativeWorkInput {
  name: string;
  /** Resumen funcional del proyecto (sin stack, §1.4). */
  about: string;
  /** "YYYY-MM" (ISO 8601 parcial). */
  dateCreated: string;
  /** Ruta de la página del proyecto. */
  path: string;
}

/** Página de proyecto (§9.3): `CreativeWork` creado por la organización. */
export function creativeWork(input: CreativeWorkInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.name,
    about: input.about,
    dateCreated: input.dateCreated,
    url: absoluteUrl(input.path),
    inLanguage: "es-PE",
    creator: { "@id": ORGANIZATION_ID },
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
