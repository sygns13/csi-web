// Formulario de contacto sin backend (§8): validación, mensaje, URLs de WhatsApp/correo y
// prellenado por URL. Funciones puras (sin DOM, i18n ni `site`) para el script de /contacto/ y las
// pruebas: los destinos llegan como parámetro (la página los toma de `src/config/site.ts`), así el
// script del navegador no incluye todo el objeto `site`.

export const NAME_MIN = 3;
export const NAME_MAX = 80;
export const ORGANIZATION_MAX = 100;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 1000;
/** El contador del mensaje solo se anuncia al acercarse al límite (§8.1). */
export const MESSAGE_ANNOUNCE_FROM = 900;

export type ContactChannel = "whatsapp" | "email";
export type ContactField = "name" | "type" | "message";

export interface ContactValues {
  name: string;
  organization: string;
  /** Valor del tipo de requerimiento (slug de servicio, `bienes` u `otro`). */
  type: string;
  message: string;
}

/** Campos de una línea: recorta y colapsa todos los espacios. */
export function normalizeInline(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Mensaje: recorta y colapsa los espacios de cada línea, pero conserva los saltos de línea del
 * usuario (como máximo una línea en blanco seguida).
 */
export function normalizeMultiline(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => normalizeInline(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Campos inválidos, en el orden del formulario (§8.2). */
export function validateContact(
  values: ContactValues,
  allowedTypes: readonly string[],
): ContactField[] {
  const errors: ContactField[] = [];
  const name = normalizeInline(values.name);
  if (name.length < NAME_MIN || name.length > NAME_MAX) errors.push("name");
  if (!allowedTypes.includes(values.type)) errors.push("type");
  const message = normalizeMultiline(values.message);
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) errors.push("message");
  return errors;
}

export interface MessageInput {
  name: string;
  organization?: string;
  /** Etiqueta visible del tipo de requerimiento. */
  typeLabel: string;
  message: string;
}

/**
 * Mensaje preparado (§8.2, punto 3):
 *
 *   Hola, mi nombre es {nombre}{ — {entidad}}.
 *   Tipo de requerimiento: {etiqueta del tipo}
 *   {mensaje}
 *
 *   (Mensaje enviado desde bcscode.com)
 */
export function buildContactMessage(input: MessageInput): string {
  const name = normalizeInline(input.name);
  const organization = normalizeInline(input.organization ?? "").slice(0, ORGANIZATION_MAX);
  return [
    `Hola, mi nombre es ${name}${organization ? ` — ${organization}` : ""}.`,
    `Tipo de requerimiento: ${normalizeInline(input.typeLabel)}`,
    normalizeMultiline(input.message),
    "",
    "(Mensaje enviado desde bcscode.com)",
  ].join("\n");
}

/** Asunto del correo (§8.2, punto 5). */
export const emailSubject = (typeLabel: string): string =>
  `Solicitud web: ${normalizeInline(typeLabel)}`;

/** Destinos del mensaje: `site.whatsapp.waMe` y `site.email`. */
export interface ContactTargets {
  waMe: string;
  email: string;
}

/** URL que abre el canal elegido con el mensaje (§8.2, puntos 4 y 5). */
export function contactUrl(
  channel: ContactChannel,
  typeLabel: string,
  message: string,
  targets: ContactTargets,
): string {
  const text = encodeURIComponent(message);
  return channel === "whatsapp"
    ? `${targets.waMe}?text=${text}`
    : `mailto:${targets.email}?subject=${encodeURIComponent(emailSubject(typeLabel))}&body=${text}`;
}

export interface Prefill {
  type?: string;
  message?: string;
}

/**
 * Prellenado desde los botones "Solicitar cotización" (§8.2, punto 7): `?tipo=` y `?categoria=`
 * solo con valores de la lista blanca; el resto se ignora.
 */
export function parsePrefill(
  search: string,
  allowedTypes: readonly string[],
  categories: ReadonlyMap<string, string>,
): Prefill {
  const params = new URLSearchParams(search);
  const prefill: Prefill = {};
  const type = params.get("tipo");
  if (type && allowedTypes.includes(type)) prefill.type = type;
  const category = categories.get(params.get("categoria") ?? "");
  if (prefill.type === "bienes" && category) prefill.message = `Deseo cotizar: ${category}. `;
  return prefill;
}
