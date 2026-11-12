// Frases en inglés dentro de textos en español (§10, WCAG 3.1.2): se envuelven en
// `<span lang="en">` al renderizar (componente `LangText`) para que los lectores de pantalla las
// pronuncien en inglés. Criterio: solo frases; las palabras sueltas de uso común en el español
// técnico (software, backend, hosting, chatbots, DevOps…) y las marcas de una sola palabra no se marcan.

export const englishPhrases = [
  "Building Computer Solutions",
  "machine learning",
  "Prompt engineering",
  "patch panels",
  "Microsoft Azure Fundamentals",
  "Azure AI Fundamentals",
  "GitHub Foundations",
  "Apollo GraphQL Developer – Associate",
] as const;

export interface TextSegment {
  text: string;
  lang?: "en";
}

const escapeRe = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Las frases más largas primero, para que una frase contenida en otra no la corte.
const PHRASES_RE = new RegExp(
  `(${[...englishPhrases]
    .sort((a, b) => b.length - a.length)
    .map(escapeRe)
    .join("|")})`,
);

/** Divide un texto en tramos, marcando con `lang: "en"` las frases de `englishPhrases`. */
export function splitForeignPhrases(text: string): TextSegment[] {
  return text
    .split(PHRASES_RE)
    .filter((part) => part !== "")
    .map((part) =>
      (englishPhrases as readonly string[]).includes(part)
        ? { text: part, lang: "en" as const }
        : { text: part },
    );
}
