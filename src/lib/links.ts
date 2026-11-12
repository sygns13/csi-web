import { site } from "../config/site";

/** Enlace de WhatsApp (wa.me) con mensaje opcional, codificado. */
export function whatsappUrl(message?: string): string {
  return message ? `${site.whatsapp.waMe}?text=${encodeURIComponent(message)}` : site.whatsapp.waMe;
}

/** Enlace mailto: con asunto y cuerpo opcionales, codificados. */
export function mailtoUrl(subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${site.email}${params.length ? `?${params.join("&")}` : ""}`;
}
