// Colecciones de contenido (§7). Todo el contenido va en el frontmatter; el cuerpo Markdown no se usa.
import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { iconNames } from "./components/ui/icon-names";
import { projectVisuals, sectors } from "./config/taxonomy";
import { defaultLang, languages, type Lang } from "./i18n";

const langs = Object.keys(languages) as [Lang, ...Lang[]];

/** Idioma de la entrada (§12): mañana podrán convivir `services/en/*.md` y los actuales. */
const lang = z.enum(langs).default(defaultLang);
const text = z.string().trim().min(1);

/** SEO por entrada (§7.1): título ≤ 60 caracteres y descripción ≤ 155. */
const seo = z.object({
  title: text.max(60),
  description: text.max(155),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    lang,
    title: text,
    navLabel: text,
    order: z.number().int().positive(),
    icon: z.enum(iconNames),
    summary: text.max(160),
    intro: text,
    includes: z.array(text).min(5).max(8),
    benefits: z
      .array(z.object({ title: text, text }))
      .min(3)
      .max(4),
    capabilities: z.array(text).min(1).optional(),
    faq: z
      .array(z.object({ q: text, a: text }))
      .min(2)
      .max(3),
    seo,
    /** Uso interno (mapa de keywords, §9.4). No se emite `<meta name="keywords">`. */
    keywords: z.array(text).min(1),
  }),
});

const productCategories = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/product-categories" }),
  schema: z.object({
    lang,
    name: text,
    order: z.number().int().positive(),
    icon: z.enum(iconNames),
    description: text,
    items: z.array(text).min(1),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    lang,
    title: text,
    shortTitle: text,
    client: text,
    sector: z.enum(sectors),
    /** "YYYY-MM", para ordenar. */
    date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/, "Formato esperado: YYYY-MM"),
    dateLabel: text,
    services: z.array(reference("services")).min(1),
    visual: z.enum(projectVisuals),
    featured: z.boolean().default(false),
    /** true = no se publica ni entra al sitemap. */
    draft: z.boolean().default(false),
    summary: text.max(180),
    context: text,
    solution: z.array(text).min(1),
    contribution: z.array(text).min(1),
    seo,
  }),
});

export const collections = { services, productCategories, projects };
