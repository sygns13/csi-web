import { site } from "../config/site";
import { defaultLang, htmlLang, ogLocale, type Lang } from "../i18n";

export interface Alternate {
  lang: string;
  href: string;
}

export interface SeoInput {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  /** Versiones en otros idiomas (vacío en v1, §12). */
  alternates?: Alternate[];
  lang?: Lang;
}

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  htmlLang: string;
  alternates: Alternate[];
  og: {
    type: "website" | "article";
    title: string;
    description: string;
    url: string;
    image: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    locale: string;
    siteName: string;
  };
  twitterCard: "summary_large_image";
}

export const OG_SITE_NAME = "CSI – Construyendo Soluciones Informáticas";
export const OG_IMAGE_PATH = "/og/default.png";
export const OG_IMAGE_ALT =
  "Logo de CSI junto al texto Construyendo Soluciones Informáticas: software, inteligencia artificial y tecnología";

/** Convierte una ruta interna en URL absoluta del dominio canónico. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

/** Normaliza la ruta canónica: empieza y termina en "/" (trailingSlash: "always"). */
export function normalizePath(path: string): string {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

export function buildSeo(input: SeoInput): SeoData {
  const lang = input.lang ?? defaultLang;
  const canonical = absoluteUrl(normalizePath(input.canonicalPath));
  return {
    title: input.title,
    description: input.description,
    canonical,
    robots: input.noindex ? "noindex,follow" : "index,follow",
    htmlLang: htmlLang[lang],
    alternates: input.alternates ?? [],
    og: {
      type: input.ogType ?? "website",
      title: input.title,
      description: input.description,
      url: canonical,
      image: absoluteUrl(OG_IMAGE_PATH),
      imageAlt: OG_IMAGE_ALT,
      imageWidth: 1200,
      imageHeight: 630,
      locale: ogLocale[lang],
      siteName: OG_SITE_NAME,
    },
    twitterCard: "summary_large_image",
  };
}
