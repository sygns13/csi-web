import { es, type UiKey } from "./es";

// Preparado para agregar inglés (§12): basta con crear `en.ts` (`satisfies typeof es`) y registrarlo aquí.
export const defaultLang = "es" as const;
export const languages = { es: "Español" } as const;
export type Lang = keyof typeof languages;

/** Valor de `<html lang>` y de `og:locale` por idioma. */
export const htmlLang: Record<Lang, string> = { es: "es-PE" };
export const ogLocale: Record<Lang, string> = { es: "es_PE" };

const dictionaries: Record<Lang, typeof es> = { es };

export type { UiKey };

/**
 * Devuelve el texto de interfaz para `key`, reemplazando marcadores `{nombre}` con `params`.
 */
export function t(
  key: UiKey,
  params?: Record<string, string | number>,
  lang: Lang = defaultLang,
): string {
  const text = dictionaries[lang][key];
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/**
 * Construye una ruta interna para el idioma indicado. El español no lleva prefijo (§12).
 * Siempre termina en "/" (trailingSlash: "always"), salvo que incluya ancla o query.
 */
export function localizedPath(path: string, lang: Lang = defaultLang): string {
  const cut = path.search(/[?#]/);
  const pathname = cut === -1 ? path : path.slice(0, cut);
  const suffix = cut === -1 ? "" : path.slice(cut);
  let clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!clean.endsWith("/")) clean = `${clean}/`;
  const prefix = lang === defaultLang ? "" : `/${lang}`;
  return `${prefix}${clean}${suffix}`;
}
