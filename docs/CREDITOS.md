# Créditos y licencias

Recursos de terceros incluidos en el sitio. Todo se sirve desde el propio dominio (sin CDNs).

## Tipografías

| Recurso                             | Uso                   | Licencia                                                     | Origen                                                                    |
| ----------------------------------- | --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Inter (variable, subconjunto latin) | Cuerpo e interfaz     | SIL Open Font License 1.1 — © 2016 The Inter Project Authors | `@fontsource-variable/inter` 5.3.0 (https://github.com/rsms/inter)        |
| Sora (variable, subconjunto latin)  | Títulos, logo, cifras | SIL Open Font License 1.1 — © 2019 The Sora Project Authors  | `@fontsource-variable/sora` 5.3.0 (https://github.com/sora-xor/sora-font) |

La imagen Open Graph (`public/og/default.png`) contiene texto en Sora e Inter convertido a trazos (OFL permite
incrustar la fuente en documentos e imágenes).

## Íconos

| Recurso                                           | Uso                               | Licencia | Origen                                                                                                                             |
| ------------------------------------------------- | --------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Lucide                                            | Íconos de interfaz y de servicios | ISC      | `@lucide/astro` 1.72.0 (https://lucide.dev)                                                                                        |
| Lucide `linkedin`                                 | Enlace a LinkedIn del Gerente     | ISC      | `lucide-static` 0.499.0 (las versiones 1.x ya no incluyen íconos de marca). Trazado copiado en `src/components/ui/BrandIcon.astro` |
| Simple Icons: WhatsApp, Facebook, YouTube, GitHub | Íconos de marca                   | CC0 1.0  | `simple-icons` 16.37.0 (https://simpleicons.org). Trazados copiados en `src/components/ui/BrandIcon.astro`                         |

Las marcas WhatsApp, Facebook, YouTube, GitHub y LinkedIn pertenecen a sus titulares; se usan solo para
identificar los enlaces a esos servicios.

## Imágenes

| Recurso                                                                | Licencia                                                   | Notas                                                                               |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Isotipo CSI (`src/assets/brand/csi-mark.svg` y derivados en `public/`) | Propiedad de Construyendo Soluciones Informáticas E.I.R.L. | Derivado de `imagenes/Logo.svg` del propietario (recortado y sin estilos en línea)  |
| Foto del Gerente General (`src/assets/team/`, §6.7)                    | Entregada por el propietario                               | Pendiente: hoy se muestra el monograma "CC" (la foto entregada no cumple el tamaño) |
| Otras fotografías                                                      | —                                                          | No se usan en v1                                                                    |

## Herramientas de desarrollo (no se distribuyen en el sitio)

- `sharp` (Apache-2.0) y `fontkit` (MIT): generación de favicons e imagen OG (`scripts/generate-brand-assets.mjs`).
