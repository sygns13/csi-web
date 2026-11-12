# Especificación del Sitio Web Corporativo — Construyendo Soluciones Informáticas E.I.R.L.

| Campo | Valor |
|---|---|
| Documento | `sitio-web-csi.spec.md` |
| Versión | 1.2 (1.1: respuestas a los pendientes P1–P8; 1.2: títulos SEO acortados, D21) |
| Fecha | 12/11/2026 |
| Repositorio | `E:\NewProyectos\2026\csi\workspace\csi-web` (git ya iniciado, rama `master`, remoto `https://github.com/sygns13/csi-web.git`) |
| Propietario | Gerente General de Construyendo Soluciones Informáticas E.I.R.L. |
| Estado | Aprobado para construcción (las decisiones del propietario están en la §2) |
| Iteración | v1: sitio informativo estático, **sin backend propio** |
| Stack | Astro 7 (estático) + TypeScript estricto + Tailwind CSS 4 |
| Despliegue | VPS propio (Docker + Traefik ya existentes), dominio raíz `bcscode.com` |

> **Copia redactada del repositorio.** Esta copia omite datos del servidor y nombres vetados (§1.4), reemplazados
> por marcadores (`<IP_DEL_VPS>`, `<RUTA_…>`). La spec original completa está en el workspace, fuera del repositorio.

---

## 0. Cómo usar este documento (léelo primero)

Este documento es **la única fuente de verdad** para construir el sitio. Se escribió para leerse en una sesión
nueva, sin acceso a la conversación que lo originó. Reglas para quien construye:

1. **Lee el documento completo antes de escribir código.** Después ejecuta **solo el tramo que te indiquen**
   (§18). No adelantes trabajo de otros tramos.
2. **No inventes contenido.** Todos los textos visibles del sitio están en este documento (§6, §7 y Anexo A). Si un
   texto no existe aquí, usa el marcador `TODO(CONTENIDO): …` y regístralo en `docs/PROGRESO.md`. Nunca
   completes con datos supuestos: cifras, clientes, certificaciones, horarios, direcciones o testimonios.
3. **Confidencialidad (§1.4) por encima de todo.** Ante la duda, omite el dato.
4. Los textos marcados **[VALIDAR]** van como están, pero se listan en `docs/PROGRESO.md` como pendientes de
   validación del propietario.
5. Si una API de Astro, Tailwind u otra librería no coincide con lo descrito (las versiones evolucionan), gana el
   **resultado** que pide la spec. Adapta la implementación a la documentación oficial vigente y anota la
   desviación en `docs/PROGRESO.md`.
6. Idioma: **todo el texto visible en español (Perú)**. El código, los identificadores y los nombres de archivo van en
   inglés. Los comentarios de código pueden ir en español.
7. No hagas `git commit` ni `git push`, no despliegues y no toques el VPS salvo que el propietario lo pida
   expresamente en esa sesión.
8. Al cerrar cada sesión, actualiza `docs/PROGRESO.md`: qué se hizo, qué falta, desviaciones y pendientes.
9. El repositorio `csi-web/` está **dentro** de `E:\NewProyectos\2026\csi\workspace`, una carpeta con
   documentación confidencial de la empresa (contratos, facturas, informes de clientes, datos personales).
   - **Nunca** leas, copies ni referencies archivos de `../documentos`, `../documentos_Cristian` u otras carpetas
     del workspace.
   - Las únicas excepciones son los recursos gráficos listados en §4.1 y §6.7.
   - Ningún archivo fuera de `csi-web/` entra al repositorio.
   - El `CLAUDE.md` del workspace describe la carpeta de documentos. Para el código del sitio mandan esta spec y el
     `CLAUDE.md` propio de `csi-web/`.

---

## 1. Contexto y objetivos

### 1.1. La empresa (datos oficiales verificados)

| Dato | Valor | Publicar |
|---|---|---|
| Razón social | CONSTRUYENDO SOLUCIONES INFORMÁTICAS E.I.R.L. | Sí |
| Nombre comercial | BUILDING COMPUTER SOLUTIONS | Sí |
| Sigla del logo | CSI | Sí |
| RUC | 20606674415 | Sí |
| Tipo | Empresa Individual de Responsabilidad Limitada | Sí (en Nosotros) |
| Fundación | Fines de 2020, Huaraz, Áncash (inicio de actividades: 01/11/2020) | Sí |
| Actividad económica principal | CIIU 6202: Consultoría de informática y gestión de instalaciones informáticas | Sí |
| Actividades secundarias | CIIU 4741: Venta al por menor de ordenadores, equipo periférico, programas de informática y equipo de telecomunicaciones. CIIU 4651: Venta al por mayor de ordenadores, equipo periférico y programas de informática | Sí |
| Registro Nacional de Proveedores (RNP) | Inscripción como proveedor de **bienes** y de **servicios** (desde 17/03/2021) | Sí, como "Inscrita en el RNP" |
| Comprobantes electrónicos | Emisor electrónico (boletas y facturas) desde junio de 2021 | Sí (en Nosotros) |
| Ciudad | Huaraz, Áncash, Perú | Sí (solo la ciudad) |
| Dirección | — | **No** (decisión del propietario) |
| Gerente General | Cristian Fernando Chávez Torres | Sí |

### 1.2. Objetivo del sitio

Presentar a la empresa con un sitio profesional, accesible y bien posicionado que:

1. Muestre que su actividad principal es la **consultoría y el desarrollo de software**, con experiencia demostrable
   en el sector público y en el privado.
2. Muestre también que puede atender **cualquier requerimiento de bienes o servicios afines** a informática,
   sistemas, software, hardware, inteligencia artificial y robótica.
3. Convierta visitas en contactos: WhatsApp, llamada o correo, y solicitudes de cotización.
4. Transmita formalidad: RUC, RNP, trayectoria y casos reales.

### 1.3. Audiencias

| Audiencia | Qué busca | Qué le damos |
|---|---|---|
| Áreas de TI, abastecimiento y logística de entidades públicas | Proveedor formal, con experiencia en TDR y entregables | RUC, RNP, proyectos del sector público, proceso de trabajo |
| Empresas privadas (medianas y grandes) | Desarrollo a medida, IA, cloud, soporte | Servicios, casos privados, contacto rápido |
| MYPEs y negocios locales | Sistemas de gestión, facturación, equipos, redes | Catálogo de bienes, sistemas de gestión, WhatsApp |

### 1.4. Reglas de confidencialidad (obligatorias)

**Está prohibido** incluir en el sitio, en el código, en los comentarios, en los metadatos o en los nombres de
archivo:

- El stack tecnológico **asociado a un proyecto o cliente concreto**: lenguajes, frameworks, proveedores de IA,
  nubes, bases de datos, nombres de microservicios, servicios de mensajería, etc. En las páginas de servicios sí se
  pueden nombrar tecnologías como **capacidades generales**, sin vincularlas a un cliente (§7.1).
- URLs, dominios, subdominios o IPs de sistemas de clientes.
- Números de órdenes de servicio, contratos, montos, cotizaciones o facturas.
- Nombres de personas de los clientes ni del personal de la empresa, salvo el Gerente General.
- Capturas de pantalla de sistemas de clientes, logotipos de clientes y marcas registradas de terceros como imagen.
  Los nombres de las entidades van **solo como texto** (§2).
- Nombres internos de plataformas de clientes que no aparecen en este documento.
- DNI, correos personales, la dirección fiscal o cualquier dato personal que no esté marcado "Publicar: Sí".
- Datos del VPS (IP, rutas del servidor) o credenciales en **cualquier** archivo del repositorio, incluida la
  documentación (usa marcadores como `<IP_DEL_VPS>`).
- Nombres de plataformas o sistemas internos de clientes y de proveedores de terceros usados en un proyecto.

### 1.5. Alcance

**Incluido en v1:**
- 13 tipos de página (§5.1), con un total aproximado de 31 URLs.
- Modo claro (principal) y modo oscuro.
- Diseño responsive (320 px en adelante).
- WCAG 2.2 nivel AA.
- SEO técnico y de contenido.
- Contacto sin backend: arma el mensaje y lo abre en WhatsApp o en el correo.
- Pruebas automatizadas (Playwright + axe).
- Imagen Docker con nginx y despliegue detrás del Traefik existente.

**Fuera de alcance en v1** (el diseño debe permitir agregarlos después sin rehacer):
- Versión en inglés (§12 deja todo preparado).
- Blog o noticias.
- Libro de Reclamaciones con formulario (requiere backend).
- Analítica.
- Mapa y dirección.
- Testimonios.
- Tienda o precios.

---

## 2. Decisiones del propietario (12/11/2026)

| # | Tema | Decisión |
|---|---|---|
| D1 | Marca | **Logo CSI** (hexágono azul) + bloque de texto "Construyendo Soluciones / Informáticas E.I.R.L.", como en el brochure. El nombre comercial **"Building Computer Solutions"** se usa como antetítulo y en los metadatos. El logo "BCS" **no** se usa |
| D2 | Dominio | Raíz `https://bcscode.com` (canónico). `www.bcscode.com` → redirección 301 a la raíz. La raíz está libre en el VPS |
| D3 | Idioma | Solo español en v1, con la arquitectura preparada para agregar inglés |
| D4 | Clientes | Se nombran las entidades y los sistemas (como en el brochure), con **descripción funcional genérica**, sin stack ni datos internos |
| D5 | Yamaha | Se lista como cliente de la empresa |
| D6 | Capturas | **No** se usan. Se usan ilustraciones y maquetas genéricas propias (§4.6) |
| D7 | Proyectos | Los del brochure + los aplicativos de la CSJ Áncash de 2022 + el hosting y dominio de la CSJ Áncash de 2023 |
| D8 | Perfil del Gerente | Breve (profesión, maestría, especialidades), **mencionando empleadores** |
| D9 | Equipo | Se muestran las **áreas** del organigrama, sin nombres de personas |
| D10 | Contacto | Correo: `construyendosolucionesbcs@gmail.com`. WhatsApp: **+1 717-883-9161**. Llamadas: **975 114 780** (+51). Dirección: no se muestra. RUC: sí |
| D11 | Formulario | Sin terceros: el formulario arma el mensaje y abre WhatsApp o el correo |
| D12 | Analítica | Ninguna en v1, sin cookies |
| D13 | Libro de Reclamaciones | Página informativa con canal por correo |
| D14 | Redes | Facebook y YouTube (URLs en §3.6) |
| D15 | Bienes | Catálogo por categorías, **sin precios ni marcas**, con botón "Solicitar cotización". Categorías en §7.2 |
| D16 | Repositorio | `E:\NewProyectos\2026\csi\workspace\csi-web`, ya iniciado (rama `master`, remoto `github.com/sygns13/csi-web`) |
| D17 | Proyecto de consentimientos (Yamaha) | **Se publica** (§7.3, P14) |
| D18 | Gerente | **Se publica su foto** y los enlaces a LinkedIn (`https://www.linkedin.com/in/cristian-chavez-38272b120`) y GitHub (`https://github.com/sygns13`) |
| D19 | Visión y valores | Aprobados de forma provisional. Se mantienen como **[VALIDAR]** para revisarlos durante la construcción |
| D20 | Horario, textos legales, tratamiento y cifras | Sin horario. Los textos legales se mantienen como borradores [VALIDAR]. Se confirma el tratamiento de "usted". Se confirman las cifras de Inicio |
| D21 | Títulos SEO de más de 60 caracteres | Se acortan quitando palabras del original (Tramo 2): servicio `inteligencia-artificial` (§7.1), proyectos P11 y P14 (§7.3) |

---

## 3. Stack, estándares técnicos y configuración

### 3.1. Versiones (fijadas con `--save-exact`)

Son las versiones usadas en el último proyecto del propietario:

| Paquete | Versión |
|---|---|
| `astro` | 7.4.2 |
| `@astrojs/check` | 0.9.12 |
| `typescript` | 6.0.3 |
| `tailwindcss` | 4.3.3 |
| `@tailwindcss/vite` | 4.3.3 |
| `@playwright/test` | 1.64.1 |

Paquetes adicionales: instala la **última versión estable compatible** con lo anterior y fíjala exacta (`npm i -E`).
- `@astrojs/sitemap`
- `@axe-core/playwright`
- `@fontsource-variable/inter`
- `@fontsource-variable/sora`
- `@lucide/astro` (si no existe o no es compatible, copia los SVG de Lucide a componentes propios; licencia ISC)
- `sharp` (dev; scripts de recursos gráficos)
- `prettier` + `prettier-plugin-astro` + `prettier-plugin-tailwindcss` (dev)

**Node**: 24 LTS (Astro 7 exige Node ≥ 22.23.4).
- Antes de empezar, verifica con `node --version`.
- En esta PC, el `node` del PATH de Git Bash reportó **v16.20.2**. Si sale eso, usa la instalación de Node 24 (nvm u
  otra) antes de seguir.
- Agrega `"engines": { "node": ">=22.23.4" }` y un `.nvmrc` con `24`.

### 3.2. Reglas de arquitectura

- `output: "static"`. Sin SSR, sin adaptadores, sin backend.
- **Sin frameworks de UI**: nada de React, Vue, Svelte, Preact, Solid ni sus integraciones `@astrojs/*`.
  - La interactividad va en TypeScript plano dentro de `<script>` de componentes o páginas.
  - Presupuesto total de JS: **≤ 20 KB gzip por página**.
- TypeScript **estricto** (`astro/tsconfigs/strict`). `astro check` sin errores ni advertencias.
- Tailwind CSS 4 vía `@tailwindcss/vite`, sin `tailwind.config`.
  - Colores **solo** mediante tokens (§4.2). Prohibido usar hex en el marcado (`bg-[#...]`).
  - Un color nuevo se crea primero como token.
- Sin `style="…"` en línea, para que la CSP pueda usar `style-src 'self'`. Las variaciones van con clases o
  atributos `data-*`.
- Sin scripts ni recursos de terceros: ni CDNs, ni fuentes de Google en tiempo de ejecución, ni iframes, ni píxeles.
  Todo se sirve desde el propio dominio.
- Sin `localStorage` salvo la preferencia de tema (clave `csi-theme`).
- **Una única fuente para los datos de contacto**: `src/config/site.ts` (§3.6). Ningún componente escribe a mano el
  teléfono, el correo ni las URLs de redes.
- Textos de interfaz reutilizables (navegación, botones, etiquetas) en `src/i18n/es.ts` (§12).

### 3.3. `astro.config.mjs` (resultado esperado)

```js
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bcscode.com",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  i18n: {
    defaultLocale: "es",
    locales: ["es"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({ filter: (page) => !page.includes("/404") }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Todo script procesado sale como archivo en /_astro/ (no inline) → CSP sin 'unsafe-inline'.
    build: { assetsInlineLimit: 0 },
  },
});
```

Notas:
- Las URLs terminan en `/` (`/servicios/`). nginx redirige `/servicios` → `/servicios/` con un 301.
- El único `<script>` en línea permitido es el de inicialización del tema (§4.8), con su hash en la CSP (§16.3).
  Los `<script type="application/ld+json">` no se ejecutan y están permitidos.
- Una prueba automatizada verifica en `dist/` que no haya otros scripts en línea ni atributos `style=` (§17).

### 3.4. Estructura del repositorio

```
csi-web/
├── .nvmrc
├── .editorconfig
├── .prettierrc.mjs
├── .gitignore
├── .dockerignore
├── astro.config.mjs
├── package.json / package-lock.json
├── tsconfig.json
├── playwright.config.ts            # pruebas contra `astro preview`
├── playwright.docker.config.ts     # mismas pruebas contra el contenedor (puerto 8080)
├── Dockerfile
├── docker-compose.yml              # despliegue en el VPS (§16)
├── nginx/
│   ├── default.conf
│   └── security-headers.conf
├── CLAUDE.md                       # guía corta para futuras sesiones (crear en el Tramo 1)
├── docs/
│   ├── sitio-web-csi.spec.md       # copia de esta spec
│   ├── PROGRESO.md                 # bitácora entre sesiones
│   ├── DESPLIEGUE.md               # guía operativa del VPS (Tramo 4)
│   └── CREDITOS.md                 # fuentes y licencias de fuentes tipográficas, íconos e imágenes
├── scripts/
│   └── generate-brand-assets.mjs   # favicons, imagen OG, PNGs del logo (con sharp)
├── public/
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png        # 180×180
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── site.webmanifest
│   ├── robots.txt
│   └── og/default.png              # 1200×630
├── src/
│   ├── assets/brand/               # logo optimizado (SVG) y fuentes de los recursos
│   ├── assets/team/                # foto del Gerente General (§6.7)
│   ├── components/
│   │   ├── layout/                 # Header, Footer, MobileMenu, ThemeToggle, SkipLink, Breadcrumbs, WhatsAppFab
│   │   ├── ui/                     # Button, Card, Badge, SectionHeading, Container, HexIcon, Icon, LinkArrow
│   │   ├── sections/               # Hero, ServicesGrid, Stats, Process, WhyUs, CtaBand, ProjectsGrid, ProductsGrid…
│   │   └── visuals/                # HeroVisual, ProjectVisual (maquetas genéricas), patrones SVG
│   ├── config/site.ts              # datos de la empresa y de contacto (única fuente)
│   ├── content.config.ts           # colecciones de contenido (§7)
│   ├── content/
│   │   ├── services/*.md
│   │   ├── projects/*.md
│   │   └── product-categories/*.yaml
│   ├── i18n/
│   │   ├── es.ts
│   │   └── index.ts                # helper t()
│   ├── layouts/BaseLayout.astro
│   ├── lib/                        # seo.ts, jsonld.ts, contact-message.ts, theme.ts, format.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── servicios/index.astro
│   │   ├── servicios/[slug].astro
│   │   ├── productos/index.astro
│   │   ├── proyectos/index.astro
│   │   ├── proyectos/[slug].astro
│   │   ├── nosotros/index.astro
│   │   ├── contacto/index.astro
│   │   ├── libro-de-reclamaciones/index.astro
│   │   ├── privacidad/index.astro
│   │   ├── accesibilidad/index.astro
│   │   └── 404.astro
│   └── styles/global.css
└── e2e/
    ├── routes.ts                   # lista de rutas para las pruebas
    ├── smoke.spec.ts
    ├── a11y.spec.ts
    ├── navigation.spec.ts
    ├── theme.spec.ts
    ├── contact.spec.ts
    ├── projects-filter.spec.ts
    └── build-output.spec.ts        # sin scripts inline extra, sin style=, hash CSP coincide
```

Ubicación: `E:\NewProyectos\2026\csi\workspace\csi-web` (D16).
- El repositorio ya existe, con un `README.md` mínimo y un commit inicial. Crea el proyecto **dentro** de esa carpeta,
  sin `git init` ni un nuevo clon, y reemplaza el `README.md` por uno real (descripción, requisitos, comandos y
  despliegue resumido).
- La visibilidad del remoto en GitHub no está verificada. Por eso **ningún archivo del repositorio** contiene la IP
  del VPS, rutas del servidor ni credenciales; `docs/DESPLIEGUE.md` usa marcadores como `<IP_DEL_VPS>`.

### 3.5. Scripts de `package.json`

| Script | Comando |
|---|---|
| `dev` | `astro dev` |
| `build` | `astro check && astro build` |
| `preview` | `astro preview` |
| `format` | `prettier --write .` |
| `format:check` | `prettier --check .` |
| `test:e2e` | `playwright test` |
| `test:e2e:docker` | `playwright test -c playwright.docker.config.ts` |
| `brand:assets` | `node scripts/generate-brand-assets.mjs` |

### 3.6. `src/config/site.ts` (valores exactos)

```ts
export const site = {
  url: "https://bcscode.com",
  legalName: "Construyendo Soluciones Informáticas E.I.R.L.",
  legalNameUpper: "CONSTRUYENDO SOLUCIONES INFORMÁTICAS E.I.R.L.",
  shortName: "CSI",
  tradeName: "Building Computer Solutions", // siempre en <span lang="en">
  ruc: "20606674415",
  foundingYear: 2020,
  city: "Huaraz",
  region: "Áncash",
  country: "PE",
  email: "construyendosolucionesbcs@gmail.com",
  whatsapp: {
    e164: "+17178839161",
    display: "+1 717 883 9161",
    waMe: "https://wa.me/17178839161",
  },
  phone: {
    e164: "+51975114780",
    display: "975 114 780",
    tel: "tel:+51975114780",
  },
  social: {
    facebook: "https://www.facebook.com/people/CSI-Construyendo-Soluciones-Inform%C3%A1ticas/100077290210130/",
    youtube: "https://www.youtube.com/@construyendosolucionesinformat",
  },
  manager: {
    name: "Cristian Fernando Chávez Torres",
    role: "Gerente General",
    linkedin: "https://www.linkedin.com/in/cristian-chavez-38272b120",
    github: "https://github.com/sygns13",
  },
} as const;
```

---

## 4. Identidad visual y sistema de diseño

### 4.1. Logo

**Archivos fuente** (en la PC del propietario; cópialos al repositorio en el Tramo 1):

| Archivo | Uso |
|---|---|
| `E:\NewProyectos\2026\csi\workspace\imagenes\Logo.svg` | Isotipo CSI vectorial (sin texto) |
| `E:\NewProyectos\2026\csi\workspace\imagenes\sello\Logo Sello.png` | Isotipo en alta resolución (1827×1913) para rasterizar |
| `E:\NewProyectos\2026\csi\workspace\imagenes\logo-sin-letras-final-500x500.png` | Isotipo de 500×518, referencia visual |

**Preparación del SVG** (`src/assets/brand/csi-mark.svg`):

1. El `viewBox` original es `0 0 595.28 841.89`, con el isotipo en la parte superior. Recórtalo al contenido,
   aproximadamente `viewBox="78 58 451 471"`. **Verifícalo visualmente** (render a PNG con sharp) y ajústalo para
   que el hexágono quede con 2–4 unidades de margen.
2. Elimina el bloque `<style>` y las clases `st*`: conviértelos en atributos de presentación (`fill`, `stroke`,
   `stroke-width`). Requisito de la CSP (`style-src 'self'`). Elimina los grupos vacíos y el comentario de
   Illustrator.
3. Prefija los IDs de gradientes con `csi-` (`csi-g1`…). El logo se usa con `<img>`, así que no hay IDs duplicados en
   el DOM.
4. Colores del logo: degradado vertical de `#2274B9` (arriba) a `#1DB3E8` (abajo) y trazos blancos. **No se
   recolorea** en modo oscuro: se ve bien sobre fondos oscuros.
5. Agrega `role="img"` y `<title>CSI</title>`, aunque en el encabezado se use con `alt=""` porque el texto visible
   acompaña al logo.

**Composición del logo (lockup)**, igual a la del brochure:

```
[hexágono CSI]  Construyendo Soluciones      ← Sora 700, color --text-muted
                Informáticas E.I.R.L.        ← Sora 700, color --brand
```

- Encabezado: isotipo de 40 px de alto (36 px en < 640 px). Texto en dos líneas de 15–16 px con interlineado 1.1.
- El enlace del logo lleva a `/` y su nombre accesible es el texto visible.
- En < 360 px se permite reducir el texto a 13 px. **Nunca** se oculta el texto.
- Espacio de respeto alrededor del isotipo: ≥ 25 % de su ancho. Tamaño mínimo del isotipo: 24 px.
- Pie de página: el mismo lockup sobre el fondo del pie (§4.2), con el texto en `--footer-text` y `--footer-accent`.
- Prohibido deformar, rotar, recolorear, poner sombras o colocar el isotipo sobre fotos sin contraste.

### 4.2. Paleta de colores (tokens)

Criterio: predominan los **colores claros y fríos** en el modo claro (principal), para que el azul del logo destaque.
Todos los pares texto/fondo cumplen **WCAG AA**. Contrastes calculados con la fórmula de WCAG 2.x.

**Modo claro (`:root` y `[data-theme="light"]`)**

| Token | Hex | Uso | Contraste clave |
|---|---|---|---|
| `--bg` | `#F6F9FC` | Fondo general | — |
| `--surface` | `#FFFFFF` | Tarjetas, encabezado, formularios | — |
| `--surface-2` | `#EDF4FB` | Bandas alternas de sección | — |
| `--surface-tint` | `#E3F1FB` | Hero y banda de llamada a la acción | — |
| `--border` | `#D3E0EC` | Separadores decorativos (no como único límite de controles) | — |
| `--border-strong` | `#6F8399` | Bordes de campos y controles | ≥ 3.39:1 en todos los fondos |
| `--text` | `#0E1E33` | Texto principal | 15.9:1 sobre `--bg` |
| `--text-muted` | `#475A6E` | Texto secundario | ≥ 6.17:1 |
| `--brand` | `#2274B9` | Azul del logo: títulos grandes, íconos, acentos, segunda línea del logo | 4.92:1 sobre `--surface` y 4.66:1 sobre `--bg` (texto normal permitido **solo** sobre esos dos fondos). Sobre `--surface-2` (4.44) y `--surface-tint` (4.28): **solo** texto grande (≥ 18.66 px en negrita o ≥ 24 px) o íconos |
| `--brand-cyan` | `#1DB3E8` | Celeste del logo: **solo decorativo** (degradados, trazos, patrones) | 2.3:1 → nunca para texto ni para identificar controles |
| `--primary` | `#1C64A6` | Botones principales, enlaces, foco | 5.81:1 sobre `--bg`; texto blanco encima: 6.14:1 |
| `--primary-hover` | `#16518A` | Hover y activo de `--primary` | Texto blanco: 8.15:1 |
| `--on-primary` | `#FFFFFF` | Texto sobre `--primary` | — |
| `--link` | `#1C64A6` | Enlaces en el cuerpo del texto | ≥ 5.33:1 |
| `--accent-text` | `#0B6E8F` | Antetítulos y texto de insignias | ≥ 5.01:1 |
| `--focus` | `#1C64A6` | Anillo de foco | ≥ 5.33:1 |
| `--error` | `#B42318` | Mensajes de error | ≥ 5.71:1 |
| `--success` | `#067647` | Mensajes de éxito | ≥ 4.94:1 |
| `--footer-bg` | `#0B2540` | Fondo del pie (azul marino) | — |
| `--footer-text` | `#E7EEF6` | Texto del pie | 13.3:1 |
| `--footer-muted` | `#A9B8C8` | Texto secundario del pie | 7.7:1 |
| `--footer-accent` | `#38C4F2` | Enlaces y acentos del pie | 7.7:1 |

**Modo oscuro (`[data-theme="dark"]`)**

| Token | Hex | Contraste clave |
|---|---|---|
| `--bg` | `#0A1422` | — |
| `--surface` | `#0F1C2E` | — |
| `--surface-2` | `#14253A` | — |
| `--surface-tint` | `#0F2338` | — |
| `--border` | `#24384F` | decorativo |
| `--border-strong` | `#6A819A` | ≥ 3.85:1 |
| `--text` | `#E7EEF6` | 15.8:1 |
| `--text-muted` | `#A9B8C8` | ≥ 7.66:1 |
| `--brand` | `#4FA3E3` | ≥ 5.67:1 |
| `--brand-cyan` | `#38C4F2` | decorativo |
| `--primary` | `#38C4F2` | 9.1:1 sobre `--bg` |
| `--primary-hover` | `#6FD4F6` | — |
| `--on-primary` | `#04131F` | 9.25:1 sobre `--primary` |
| `--link` | `#6CCDF4` | ≥ 8.61:1 |
| `--accent-text` | `#5FD0E8` | ≥ 8.61:1 |
| `--focus` | `#6CCDF4` | — |
| `--error` | `#FF8A80` | ≥ 6.79:1 |
| `--success` | `#5DD39E` | ≥ 8.32:1 |
| `--footer-bg` | `#07101C` | — |
| `--footer-text` | `#E7EEF6` | — |
| `--footer-muted` | `#A9B8C8` | — |
| `--footer-accent` | `#38C4F2` | — |

**Degradado de marca** (decorativo): `linear-gradient(135deg, var(--brand) 0%, var(--brand-cyan) 100%)`. Nunca va
texto encima.

**Sombras**:
- Modo claro: `--shadow-sm: 0 1px 2px rgb(14 30 51 / .06)` y `--shadow-md: 0 1px 2px rgb(14 30 51 / .06), 0 8px 24px rgb(14 30 51 / .08)`.
- Modo oscuro: sin sombras, con bordes `--border` más visibles.

**Implementación en `src/styles/global.css`** (Tailwind 4):

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root, [data-theme="light"] { color-scheme: light; --bg: #F6F9FC; /* … todos los tokens claros … */ }
[data-theme="dark"] { color-scheme: dark; --bg: #0A1422; /* … todos los tokens oscuros … */ }

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-surface-tint: var(--surface-tint);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-brand: var(--brand);
  --color-brand-cyan: var(--brand-cyan);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-on-primary: var(--on-primary);
  --color-link: var(--link);
  --color-accent-text: var(--accent-text);
  --color-focus: var(--focus);
  --color-error: var(--error);
  --color-success: var(--success);
  --color-footer-bg: var(--footer-bg);
  --color-footer-text: var(--footer-text);
  --color-footer-muted: var(--footer-muted);
  --color-footer-accent: var(--footer-accent);
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Sora Variable", "Inter Variable", ui-sans-serif, system-ui, sans-serif;
}
```

### 4.3. Tipografía

| Rol | Familia | Pesos | Notas |
|---|---|---|---|
| Títulos (h1–h3, logo, cifras) | **Sora** (variable, OFL) | 600–700 | Geométrica y tecnológica, acorde al hexágono |
| Cuerpo e interfaz | **Inter** (variable, OFL) | 400, 500, 600 | Muy legible en pantalla |

- Se sirven con Fontsource (subconjunto `latin`). Solo se precarga Inter. `font-display: swap`.
- Registra las licencias en `docs/CREDITOS.md`.

**Escala tipográfica** (fluida con `clamp`; nunca bloquea el zoom):

| Elemento | Tamaño | Interlineado | Peso |
|---|---|---|---|
| h1 (hero) | `clamp(2rem, 1.4rem + 3vw, 3.5rem)` | 1.1 | Sora 700 |
| h1 (interior) | `clamp(1.875rem, 1.5rem + 2vw, 2.75rem)` | 1.15 | Sora 700 |
| h2 | `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` | 1.2 | Sora 700 |
| h3 | `1.25rem` | 1.3 | Sora 600 |
| Antetítulo | `0.8125rem`, mayúsculas, tracking `0.08em` | — | Inter 600, `--accent-text` |
| Cuerpo | `1rem` (mín. 16 px), párrafo destacado `1.125rem` | 1.65 | Inter 400 |
| Pequeño | `0.875rem` (mínimo para texto legal) | 1.5 | Inter 400 |

- Ancho máximo de párrafo: `65ch`.
- Espaciado de texto ajustable por el usuario sin pérdida (WCAG 1.4.12): sin alturas fijas en contenedores de texto.

### 4.4. Motivos gráficos (derivados del logo)

1. **Hexágono**:
   - Contenedores de íconos (`HexIcon`: hexágono con `clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)`,
     de 56 px, fondo `--surface-2` y el ícono en `--brand`).
   - Viñetas y marcos decorativos.
2. **Trazas de circuito**: líneas horizontales que terminan en círculos (como las del logo). Se dibujan en SVG
   decorativo (`aria-hidden="true"`) con `--brand-cyan` y `--brand` a baja opacidad. Se usan en el hero, la banda de
   llamada a la acción y los separadores de sección.
3. **Retícula de puntos**: patrón SVG sutil (puntos de 1 px cada 24 px, opacidad 0.25) en el fondo del hero.
4. **Degradado de marca**: barras finas (4 px) de acento sobre tarjetas destacadas y en la parte superior del pie.

### 4.5. Iconografía

- **Lucide** (ISC) para la interfaz y los servicios, con trazo de 1.75 y tamaños de 20/24/28 px. Los íconos
  decorativos llevan `aria-hidden="true"`. Un ícono que funciona solo (botón sin texto) necesita nombre accesible.
- Íconos de marca (WhatsApp, Facebook, YouTube, GitHub, LinkedIn): SVG de **Simple Icons** (CC0) como componentes
  propios, en `currentColor`. Si alguno no está disponible en Simple Icons (por ejemplo, LinkedIn), usa el ícono de
  Lucide del mismo nombre. Registra el origen y la licencia en `docs/CREDITOS.md`. Todo ícono de marca va acompañado
  de un nombre accesible.

Íconos por servicio:

| Servicio | Ícono |
|---|---|
| Desarrollo a medida | `code-xml` |
| IA | `brain-circuit` |
| Portales | `globe` |
| Gestión | `layout-dashboard` |
| Cloud | `cloud-cog` |
| Consultoría | `lightbulb` |
| Redes | `network` |

Íconos por categoría de bienes:

| Categoría | Ícono |
|---|---|
| Equipos de cómputo | `monitor` |
| Servidores | `server` |
| Redes | `router` |
| Impresión | `printer` |
| Periféricos | `keyboard` |
| Videoconferencia | `video` |
| Software | `package` |
| Robótica | `bot` |

### 4.6. Imágenes y maquetas

- **No hay capturas de clientes** (D6). Cada proyecto se ilustra con una **maqueta genérica** hecha en HTML/CSS/SVG
  (componente `ProjectVisual`):
  - Sin logos ni textos de clientes, con "texto" representado por barras grises.
  - Usa los tokens del tema, así que funciona en claro y en oscuro.
  - Es decorativa (`aria-hidden="true"`).
- Variantes de `ProjectVisual` (prop `variant`):

  | Variante | Contenido |
  |---|---|
  | `chat` | Ventana con burbujas de conversación y un indicador de "IA" (asistente virtual) |
  | `form` | Formulario público responsive en un marco de teléfono y de navegador |
  | `dashboard` | Panel con tarjetas de módulos de colores fríos y una barra lateral |
  | `documents` | Lista de documentos con ícono de firma digital y estados (derivado, firmado) |
  | `table` | Tabla de datos con filtros y paginación |
  | `portal` | Portal web con cabecera, banner y tarjetas de noticias |
  | `certificate` | Candado y escudo con trazas de circuito (SSL y seguridad) |
  | `server` | Rack o servidor con indicadores y nube (hosting e infraestructura) |

- El **visual del hero** (`HeroVisual`) es una composición de un hexágono grande con trazas de circuito, una
  ventana de navegador con un panel genérico y una tarjeta flotante de chat de IA. Es SVG/HTML, decorativo y sin
  animación por defecto.
- Fotografías: **no se requieren en v1**. Si más adelante se agregan, solo con licencia libre comercial (Unsplash o
  Pexels), registradas en `docs/CREDITOS.md`, en formatos AVIF/WebP con `<Image>` de Astro, con `alt` significativo
  o vacío si son decorativas.

### 4.7. Componentes y espaciado

| Elemento | Especificación |
|---|---|
| Contenedor | `max-width: 1200px`, márgenes laterales de 16 px (< 640), 24 px (≥ 640) y 32 px (≥ 1024) |
| Espaciado vertical de sección | 64 px en móvil, 96 px en escritorio |
| Radios | Tarjetas 16 px, botones 10 px, insignias 9999 px, campos 10 px |
| Botón primario | Fondo `--primary`, texto `--on-primary`, alto mínimo de 44 px, padding `0 20px`, Inter 600. Hover: `--primary-hover` |
| Botón secundario | Borde de 1.5 px `--primary`, texto `--primary`, fondo transparente. Hover: `--surface-2` |
| Botón fantasma | Texto `--link` con ícono de flecha. Hover: subrayado |
| Foco | `outline: 2px solid var(--focus); outline-offset: 2px` en **todos** los elementos interactivos (`:focus-visible`). Nunca `outline: none` sin reemplazo |
| Tarjeta | Fondo `--surface`, borde de 1 px `--border`, sombra `--shadow-sm`. En hover (solo en enlaces de tarjeta): `--shadow-md` y desplazamiento de −2 px (solo si no hay `prefers-reduced-motion`). Toda la tarjeta es clicable mediante el patrón de "enlace extendido" (el `::after` del enlace del título), sin anidar elementos interactivos |
| Insignia | Fondo `--surface-2`, texto `--accent-text`, 13 px Inter 600 |
| Campos de formulario | Fondo `--surface`, borde `--border-strong`, alto de 44 px, etiqueta visible arriba, ayuda debajo, error en `--error` con ícono y texto |

**Puntos de corte** (los de Tailwind): `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Diseño *mobile-first*.

### 4.8. Modo oscuro

- Atributo `data-theme="light|dark"` en `<html>`.
- **Script en línea** (el único permitido), dentro de `<head>` y antes de cualquier hoja de estilos, para evitar el
  parpadeo:

```html
<script is:inline>
  (function () {
    var t = null;
    try { t = localStorage.getItem("csi-theme"); } catch (e) {}
    var dark = t === "dark" || (t !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  })();
</script>
```

- **Botón de tema** (`ThemeToggle`) en el encabezado (escritorio y menú móvil):
  - `<button type="button" aria-pressed="true|false">`, con un ícono de luna o sol y el texto
    `<span class="sr-only">Modo oscuro</span>`.
  - `aria-pressed="true"` cuando el tema activo es el oscuro.
  - Al pulsarlo, alterna el tema y lo guarda en `localStorage` (dentro de `try/catch`).
- Sin preferencia guardada, sigue al sistema y escucha los cambios de `prefers-color-scheme`.
- `<meta name="color-scheme" content="light dark">` y `theme-color` por esquema: `#F6F9FC` en claro y `#0A1422` en
  oscuro.
- La CSP lleva el **hash sha256** exacto de este script (§16.3). Cualquier cambio en el script obliga a recalcularlo.
  La prueba `build-output.spec.ts` lo verifica.

### 4.9. Movimiento

- Transiciones de 150–200 ms en color, sombra y desplazamiento.
- Con `@media (prefers-reduced-motion: reduce)` se desactivan todas las transformaciones y animaciones.
- Nada de carruseles, autoplay, parallax ni contenido que se mueva solo.

---

## 5. Arquitectura de información y navegación

### 5.1. Mapa del sitio

```
/                                   Inicio
/servicios/                         Servicios (índice)
/servicios/desarrollo-de-software/
/servicios/inteligencia-artificial/
/servicios/portales-web/
/servicios/sistemas-de-gestion/
/servicios/cloud-e-infraestructura/
/servicios/consultoria-ti/
/servicios/redes-y-soporte/
/productos/                         Venta de bienes tecnológicos (catálogo por categorías)
/proyectos/                         Proyectos (índice con filtro por sector)
/proyectos/{slug}/                  14 proyectos (§7.3)
/nosotros/                          Empresa, gerencia, organización y trayectoria
/contacto/                          Canales + formulario WhatsApp/correo
/libro-de-reclamaciones/            Página informativa
/privacidad/                        Política de privacidad
/accesibilidad/                     Declaración de accesibilidad
/404                                Página no encontrada (dist/404.html)
```

### 5.2. Encabezado (`Header`)

- Fijo arriba (`position: sticky`), alto de 64 px (móvil) o 72 px (≥ lg).
- Fondo `--surface` al 92 % de opacidad con `backdrop-filter: blur(8px)`, borde inferior `--border`. El texto
  siempre cumple el contraste sobre el color sólido equivalente.
- `scroll-padding-top` en `html` igual al alto del encabezado + 16 px, para que el foco no quede tapado (WCAG 2.4.11).

**Contenido en escritorio (≥ lg)**, de izquierda a derecha:
1. Lockup del logo.
2. Navegación principal:
   - **Servicios** (botón desplegable).
   - **Productos**, **Proyectos**, **Nosotros** y **Contacto**.
3. Botón de tema.
4. Botón primario **"Solicitar cotización"** (→ `/contacto/`).

**Desplegable "Servicios"**: sigue el patrón de *disclosure*, no un menú ARIA.
- `<button aria-expanded="false" aria-controls="nav-servicios">`.
- El panel muestra los 7 servicios en una cuadrícula de 2 columnas, cada uno con ícono, nombre y una línea de
  descripción, más el enlace "Ver todos los servicios".
- Se abre con clic, Enter o Espacio. Se cierra con Escape (y el foco vuelve al botón), al hacer clic fuera o al
  sacar el foco del bloque.
- No se abre al pasar el mouse.

**Móvil (< lg)**:
- Logo, botón de tema y botón "Menú" (`aria-expanded`, `aria-controls`, con ícono de hamburguesa y texto visible
  "Menú").
- El panel ocupa la pantalla bajo el encabezado e incluye:
  - Las secciones, con los servicios en un desplegable.
  - "Solicitar cotización".
  - Los accesos de contacto: WhatsApp y llamar.
- Escape cierra el menú. Mientras está abierto, el fondo no se desplaza y el foco circula dentro del panel.
- Al cerrarlo, el foco vuelve al botón.

**Enlace activo**: `aria-current="page"` en la página actual (en `/servicios/*` se marca "Servicios"). Se indica con
un subrayado de 2 px en `--brand`, no solo con color.

**Saltar al contenido**: primer elemento enfocable de cada página: "Saltar al contenido principal" → `#contenido`
(el `<main>`). Es visible al recibir el foco.

### 5.3. Pie de página (`Footer`)

Fondo `--footer-bg` con una barra superior de 4 px con el degradado de marca. Tiene 4 columnas en ≥ lg, 2 en md y
1 en móvil:

1. **Marca**: lockup del logo + "Consultoría informática, desarrollo de software a medida, inteligencia artificial y
   bienes tecnológicos para el sector público y privado." + "RUC 20606674415" + "Inscrita en el Registro Nacional de
   Proveedores (RNP)".
2. **Servicios**: los 7 servicios.
3. **Empresa**: Nosotros, Proyectos, Productos y Contacto.
4. **Contacto**:
   - WhatsApp +1 717 883 9161.
   - Llamadas 975 114 780.
   - El correo.
   - Íconos de Facebook y YouTube con nombre accesible ("Facebook de CSI (se abre en una pestaña nueva)").

**Franja inferior**: "© {año de compilación} Construyendo Soluciones Informáticas E.I.R.L. Todos los derechos
reservados." · Política de privacidad · Accesibilidad · Libro de Reclamaciones.

Los canales de contacto aparecen en el mismo lugar en todas las páginas (WCAG 3.2.6 "Ayuda coherente").

### 5.4. Botón flotante de WhatsApp (`WhatsAppFab`)

- Esquina inferior derecha, con `env(safe-area-inset-*)`. Círculo de 56 px con fondo `--primary` y el ícono de
  WhatsApp en `--on-primary`.
- Nombre accesible: "Escríbanos por WhatsApp (se abre en una pestaña nueva)".
- Enlace a `https://wa.me/17178839161?text=` + mensaje codificado: "Hola, me comunico desde la página web de CSI.".
- No debe tapar contenido ni foco: el `<body>` lleva `padding-bottom: 88px` en < md, y `scroll-padding-bottom`.
- Se oculta en `/contacto/`, que ya muestra los canales.

### 5.5. Migas de pan

- En todas las páginas excepto Inicio:
  `<nav aria-label="Ruta de navegación"><ol>…</ol></nav>`, con `aria-current="page"` en el último elemento.
- Llevan su JSON-LD `BreadcrumbList`.

### 5.6. Enlaces externos

- `target="_blank" rel="noopener noreferrer"`, con un ícono `external-link` decorativo y un texto `sr-only` "(se abre
  en una pestaña nueva)".
- Los enlaces `tel:` y `mailto:` no abren pestaña nueva.

---

## 6. Especificación por página

> Formato: cada sección indica componente, contenido exacto y comportamiento. El copy completo está aquí y en §7.
> Tratamiento: **usted** (registro formal, adecuado para entidades públicas). Cada página tiene **un solo `h1`** y
> una jerarquía de encabezados sin saltos.

### 6.1. Inicio (`/`)

**S1. Hero** (fondo `--surface-tint` + retícula de puntos + trazas de circuito decorativas)
- Disposición: texto a la izquierda y `HeroVisual` a la derecha (≥ lg). En móvil, el visual va debajo del texto en
  una versión reducida.
- Antetítulo: `<span lang="en">Building Computer Solutions</span>`
- **h1**: "Soluciones informáticas que impulsan la transformación digital de su organización"
- Párrafo: "Somos una empresa peruana especializada en consultoría informática, desarrollo de software a medida e
  inteligencia artificial. Además, proveemos bienes tecnológicos para entidades públicas y empresas privadas."
- Botones:
  - Primario: "Solicitar cotización" → `/contacto/`.
  - Secundario: "Ver proyectos" → `/proyectos/`.
- Línea de confianza (texto pequeño con íconos `badge-check`): "RUC 20606674415 · Inscrita en el RNP como proveedor
  de bienes y servicios · Desde 2020 en Huaraz, Áncash"

**S2. Franja "Confían en nosotros"** (fondo `--surface`, borde inferior)
- h2 visualmente discreto (16 px): "Instituciones y empresas que confían en nosotros"
- Lista horizontal, **solo texto**, sin logos (D6). Se envuelve en varias líneas en móvil:
  - Corte Superior de Justicia de Áncash
  - INAIGEM
  - UNASAM
  - Yamaha Perú
- Debajo, en texto pequeño: "Sectores: justicia · investigación científica y ambiente · educación superior ·
  empresa privada"

**S3. Servicios** (fondo `--bg`)
- Antetítulo "Servicios" · h2 "Lo que hacemos" · párrafo: "Diseñamos e implementamos soluciones tecnológicas
  robustas, adaptadas a las necesidades de cada cliente, desde la consultoría inicial hasta el soporte en
  producción."
- Cuadrícula de 7 tarjetas (`ServiceCard`) con ícono hexagonal, título, resumen (`summary` de §7.1) y el enlace
  "Conocer más" a la página del servicio. Columnas: 1 (móvil), 2 (md) o 3 (lg).
- Octava celda: tarjeta de cierre (estilo distinto, fondo `--surface-2`):
  - h3 "¿Necesita otra solución?"
  - Texto: "Atendemos todo requerimiento afín a informática, sistemas, software, hardware, inteligencia artificial y
    robótica."
  - Botón secundario "Cuéntenos su requerimiento" → `/contacto/`.

**S4. Inteligencia artificial aplicada** (fondo `--surface-2`; visual `ProjectVisual variant="chat"`)
- Antetítulo "Inteligencia artificial" · h2 "IA aplicada a problemas reales"
- Párrafo: "Desarrollamos asistentes virtuales y soluciones de IA generativa que ya operan en el sector justicia:
  generan borradores de documentos jurisdiccionales anclados a la normativa y al expediente, y atienden consultas
  de la ciudadanía por canales de mensajería."
- Lista con viñetas hexagonales:
  - Modelos de lenguaje (LLM) y generación aumentada por recuperación (RAG)
  - Asistentes virtuales y chatbots para atención ciudadana y de clientes
  - Automatización de documentos y procesos
  - Visión por computadora y aprendizaje automático
- Botones: "Ver el caso APUBOT 2.0" → `/proyectos/apubot-2-csj-ancash/` · "Servicio de IA" →
  `/servicios/inteligencia-artificial/`

**S5. Cifras** (`Stats`, fondo `--bg`). Lista `<dl>` de 4 elementos, con cifras grandes en Sora y color `--brand`:

| Cifra | Texto |
|---|---|
| "2020" | "Año de fundación, en Huaraz" |
| "+10" | "Proyectos entregados" |
| "4" | "Sectores atendidos" |
| "RNP" | "Proveedor del Estado de bienes y servicios" |

No se animan.

**S6. Proyectos destacados** (fondo `--bg`)
- Antetítulo "Proyectos" · h2 "Casos de éxito" · párrafo: "Sistemas críticos y portales de alto impacto entregados
  a instituciones públicas y empresas privadas."
- 4 tarjetas (`ProjectCard`) con `featured: true`, ordenadas por fecha descendente. Cada una muestra
  `ProjectVisual`, la insignia de sector, el cliente, el título, el resumen y la fecha.
- Botón secundario "Ver todos los proyectos" → `/proyectos/`.

**S7. Bienes tecnológicos** (fondo `--surface-2`)
- Antetítulo "Productos" · h2 "También proveemos bienes tecnológicos"
- Párrafo: "Cotizamos y suministramos equipos de cómputo, servidores, redes, impresión, licencias de software y más,
  con la formalidad que su institución requiere."
- Cuadrícula compacta de las 8 categorías (ícono + nombre, cada una enlaza a su ancla en `/productos/#{slug}`).
- Botón primario "Ver catálogo y cotizar" → `/productos/`.

**S8. Cómo trabajamos** (`Process`, fondo `--bg`)
- Antetítulo "Metodología" · h2 "Cómo trabajamos".
- Lista ordenada `<ol>` de 5 pasos, con número dentro de un hexágono. Horizontal en ≥ lg, con línea de circuito
  entre pasos; vertical en móvil.

| Paso | Título | Texto |
|---|---|---|
| 1 | Diagnóstico | Entendemos su necesidad, sus procesos y sus restricciones técnicas y normativas. |
| 2 | Propuesta | Definimos el alcance, los entregables, los plazos y la arquitectura de la solución. |
| 3 | Desarrollo iterativo | Construimos por entregas parciales, con revisiones y pruebas en cada etapa. |
| 4 | Implementación y capacitación | Desplegamos en su entorno, capacitamos a los usuarios y entregamos la documentación. |
| 5 | Soporte y mejora continua | Acompañamos la operación, atendemos incidencias y evolucionamos la solución. |

**S9. Por qué elegirnos** (`WhyUs`, fondo `--surface`). h2 "¿Por qué elegirnos?". 5 tarjetas con ícono:

| Título | Texto |
|---|---|
| Formalidad y cumplimiento | Empresa con RUC activo, inscrita en el RNP para bienes y servicios y emisora de comprobantes electrónicos. |
| Experiencia en el sector público | Conocemos los términos de referencia, los entregables, los informes técnicos y los procesos de conformidad. |
| Inteligencia artificial aplicada | Llevamos la IA generativa a producción, con resultados medibles para nuestros clientes. |
| Calidad y estándares | Aplicamos buenas prácticas de ingeniería de software, seguridad y accesibilidad web (WCAG). |
| Acompañamiento cercano | Comunicación directa, capacitación a usuarios y soporte después de la entrega. |

**S10. Banda de llamada a la acción** (`CtaBand`, fondo `--surface-tint` con trazas de circuito). Se reutiliza en
todas las páginas excepto Contacto:
- h2 "¿Tiene un proyecto o un requerimiento?"
- Texto: "Cuéntenos qué necesita y le responderemos a la brevedad con una propuesta."
- Botones:
  - Primario "Escribir por WhatsApp" (wa.me con el mensaje predeterminado).
  - Secundario "Llamar al 975 114 780" (`tel:`).
  - Fantasma "Enviar un correo" (`mailto:`).

### 6.2. Servicios — índice (`/servicios/`)

- Migas: Inicio › Servicios
- Encabezado de página (`PageHeader`, fondo `--surface-tint`, con antetítulo, h1 y bajada):
  - Antetítulo "Servicios"
  - h1 "Servicios de consultoría, desarrollo de software y tecnología"
  - Bajada: "Acompañamos a instituciones públicas y empresas privadas en cada etapa de su transformación digital:
    consultoría, desarrollo, implementación, infraestructura y soporte."
- Lista de 7 servicios en tarjetas grandes alternadas (ícono, título h2, `summary`, 3 elementos de `includes`
  como vista previa y el enlace "Ver detalle del servicio").
- Bloque "Otros requerimientos" (igual a la celda 8 de S3 en Inicio, como sección).
- `Process` (igual que en Inicio) y `CtaBand`.

### 6.3. Servicio — detalle (`/servicios/{slug}/`)

Plantilla común. El contenido está en §7.1:

1. Migas: Inicio › Servicios › {título}.
2. `PageHeader`:
   - Antetítulo "Servicio".
   - h1 = `title`.
   - Bajada = `intro`.
   - Ícono hexagonal grande a la derecha (≥ lg).
   - Botón primario "Solicitar cotización" → `/contacto/?tipo={slug}`.
3. h2 "¿Qué incluye?": lista `includes` con viñetas hexagonales, en 2 columnas en ≥ md.
4. h2 "Beneficios": `benefits` en 3–4 tarjetas.
5. h2 "Capacidades tecnológicas": `capabilities`, si existe, como insignias. Nota en texto pequeño: "Seleccionamos
   las tecnologías según las necesidades y el entorno de cada cliente."
6. h2 "Proyectos relacionados": tarjetas de los proyectos cuyo `services` incluye este slug (máximo 3, los más
   recientes). Si no hay ninguno, se omite la sección.
7. h2 "Preguntas frecuentes": `faq` con `<details><summary>`, sin JS. JSON-LD `FAQPage` **no** (solo
   `Service`).
8. `CtaBand`.
9. Navegación entre servicios: "Otros servicios", con 3 enlaces a servicios distintos del actual.

### 6.4. Productos (`/productos/`)

1. Migas: Inicio › Productos.
2. `PageHeader`:
   - Antetítulo "Venta de bienes".
   - h1 "Venta de equipos de cómputo y bienes tecnológicos".
   - Bajada: "Suministramos bienes de informática, redes, impresión, software y tecnología para entidades públicas y
     empresas privadas. Cotizamos según sus especificaciones técnicas, con comprobante electrónico y la formalidad
     de un proveedor inscrito en el RNP."
3. Índice de categorías (`<nav aria-label="Categorías de productos">`): enlaces de ancla a cada categoría.
4. Por cada categoría (§7.2), una sección `<section id="{slug}" aria-labelledby>` con:
   - Ícono hexagonal, h2 = nombre, descripción.
   - Lista de ejemplos (`items`) en 2–3 columnas.
   - Botón primario "Solicitar cotización", con `aria-describedby` apuntando al h2 o con texto `sr-only` "de
     {categoría}", → `/contacto/?tipo=bienes&categoria={slug}`.
   - Las secciones se presentan en tarjetas, con cuadrícula de 2 columnas en ≥ lg.
5. h2 "¿Cómo cotizar?" (lista ordenada de 3 pasos):
   1. "Envíenos su requerimiento o especificaciones técnicas por WhatsApp o correo."
   2. "Le enviamos una cotización formal con las alternativas disponibles."
   3. "Coordinamos la entrega y, si lo requiere, la instalación y configuración."
6. Nota: "¿No encuentra lo que busca? Atendemos todo requerimiento de bienes afines a informática, sistemas,
   hardware, inteligencia artificial y robótica." + enlace "Cuéntenos qué necesita" → `/contacto/?tipo=bienes`.
7. Bloque "Servicios complementarios": "Instalación, configuración, puesta en marcha y mantenimiento de los equipos
   suministrados." → `/servicios/redes-y-soporte/`.
8. `CtaBand`.

**No se muestran** precios, marcas, stock, fichas técnicas ni fotos de producto (D15).

### 6.5. Proyectos — índice (`/proyectos/`)

1. Migas: Inicio › Proyectos.
2. `PageHeader`:
   - Antetítulo "Proyectos".
   - h1 "Proyectos y casos de éxito".
   - Bajada: "A lo largo de nuestra trayectoria hemos entregado sistemas críticos, soluciones de inteligencia
     artificial y portales de alto impacto para instituciones públicas y empresas privadas."
3. **Filtro por sector** (mejora progresiva):
   - Sin JS se ven todos los proyectos y **no se muestra** el filtro (se renderiza con `hidden` y el JS lo
     muestra).
   - Grupo `<div role="group" aria-label="Filtrar por sector">` con botones `aria-pressed`:
     - Todos (activo por defecto)
     - Justicia
     - Investigación y ambiente
     - Educación superior
     - Empresa privada
   - Al filtrar se ocultan las tarjetas con `hidden` y se anuncia en una región `role="status"`: "Mostrando N
     proyectos".
   - El filtro se refleja en la URL (`?sector=justicia`) con `history.replaceState` y se lee al cargar.
4. Cuadrícula de `ProjectCard` (1, 2 o 3 columnas), con todos los proyectos no-borrador por fecha descendente.
   La tarjeta tiene:
   - `ProjectVisual`.
   - Insignias: sector y año.
   - h2 = título (enlace extendido).
   - Cliente (texto `--text-muted`).
   - `summary`.
   - Hasta 2 insignias de servicios.
5. `CtaBand`.

### 6.6. Proyecto — detalle (`/proyectos/{slug}/`)

1. Migas: Inicio › Proyectos › {shortTitle}.
2. `PageHeader`:
   - Antetítulo = cliente.
   - h1 = `title`.
   - Bajada = `summary`.
   - Ficha (lista `<dl>`): Cliente · Sector · Fecha (`dateLabel`) · Servicios (enlaces a sus páginas).
3. `ProjectVisual` grande (decorativo).
4. h2 "Contexto": `context`.
5. h2 "Solución": `solution` (lista).
6. h2 "Aporte": `contribution` (lista, cualitativo; **sin cifras inventadas**).
7. Navegación: "Proyecto anterior / siguiente" (por fecha), con el título en cada enlace.
8. `CtaBand`.

### 6.7. Nosotros (`/nosotros/`)

1. Migas: Inicio › Nosotros.
2. `PageHeader`:
   - Antetítulo "Nosotros".
   - h1 "Construyendo Soluciones Informáticas".
   - Bajada: "Fundada a fines de 2020 en la ciudad de Huaraz, Áncash, nacimos con la misión de impulsar la
     transformación digital en los sectores público y privado."
3. h2 "Quiénes somos": "Somos una empresa especializada en consultoría informática, desarrollo de software a medida
   y gestión de instalaciones tecnológicas. Nuestro nombre comercial es <span lang="en">Building Computer
   Solutions</span>. Contamos con inscripción en el Registro Nacional de Proveedores (RNP) para bienes y servicios,
   lo que respalda el cumplimiento, la formalidad y la calidad de cada uno de nuestros compromisos institucionales."
4. Dos tarjetas lado a lado:
   - h2 "Misión": "Impulsar la transformación digital de las organizaciones públicas y privadas mediante consultoría
     informática, desarrollo de software a medida, inteligencia artificial y gestión de instalaciones tecnológicas,
     con formalidad, cumplimiento y alta calidad."
   - h2 "Visión" **[VALIDAR]**: "Ser una empresa referente en soluciones informáticas e inteligencia artificial
     aplicada en el Perú, reconocida por la calidad, la accesibilidad y el impacto de sus soluciones."
5. h2 "Nuestros valores" **[VALIDAR]**: 6 elementos con ícono:

   | Valor | Texto |
   |---|---|
   | Compromiso | Cumplimos lo que ofrecemos, en plazo y alcance. |
   | Calidad técnica | Aplicamos buenas prácticas de ingeniería en cada entrega. |
   | Innovación responsable | Incorporamos inteligencia artificial con criterio y ética. |
   | Accesibilidad e inclusión | Diseñamos soluciones que todas las personas puedan usar. |
   | Transparencia | Comunicación clara y documentación de lo que construimos. |
   | Cercanía | Acompañamos a nuestros clientes antes, durante y después del proyecto. |

6. h2 "Datos de la empresa" (lista `<dl>`):
   - Razón social: Construyendo Soluciones Informáticas E.I.R.L.
   - Nombre comercial: Building Computer Solutions
   - RUC: 20606674415
   - Tipo de empresa: Empresa Individual de Responsabilidad Limitada
   - Inicio de actividades: noviembre de 2020
   - Actividad principal: Consultoría de informática y gestión de instalaciones informáticas
   - Actividades secundarias: Venta al por menor y al por mayor de equipos de cómputo, periféricos, programas
     informáticos y equipos de telecomunicaciones
   - Registro Nacional de Proveedores: Proveedor de bienes y de servicios
   - Comprobantes: Emisor electrónico de boletas y facturas
   - Ciudad: Huaraz, Áncash, Perú
7. h2 "Gerencia" (tarjeta con foto, D18):
   - **Foto**:
     - Fuente: la entrega el propietario en `E:\NewProyectos\2026\csi\workspace\imagenes\gerente\` (cualquier
       `.jpg` o `.png`). Cópiala a `csi-web/src/assets/team/gerente.{ext}`.
     - Se muestra con `<Image>` de Astro (AVIF/WebP, 240 px y 480 px para 2x, `loading="lazy"`), recortada en
       **hexágono** (`clip-path` de §4.4) y con un borde del degradado de marca.
     - `alt`: "Cristian Fernando Chávez Torres, Gerente General de Construyendo Soluciones Informáticas".
     - Requisitos de la foto: cuadrada, ≥ 800×800 px, rostro centrado, fondo neutro. Si la carpeta no existe o está
       vacía al construir, usa de forma temporal un **monograma "CC" dentro de un hexágono** con el degradado de
       marca y registra el pendiente en `docs/PROGRESO.md`. No uses fotos de otras fuentes.
   - h3 "Cristian Fernando Chávez Torres" · "Gerente General".
   - Enlaces (botones secundarios pequeños con ícono de marca y texto visible; externos, §5.6):
     - "LinkedIn" → `site.manager.linkedin`.
     - "GitHub" → `site.manager.github`.
   - Párrafo: "Ingeniero de Sistemas e Informática por la Universidad Nacional Santiago Antúnez de Mayolo (UNASAM),
     con más de 8 años de experiencia en análisis, arquitectura, desarrollo e implementación de software backend y
     full-stack, en arquitecturas monolíticas, de microservicios y orientadas a eventos. Cursa la Maestría en
     Inteligencia Artificial en la Universidad Nacional de Ingeniería (UNI) y se especializa en sistemas
     inteligentes: generación aumentada por recuperación (RAG), modelos de lenguaje, procesamiento de lenguaje
     natural, aprendizaje automático y visión por computadora."
   - h4 "Trayectoria" (lista):
     - Ingeniero de software backend en el Banco de Crédito del Perú (BCP), desde 2022.
     - Analista de sistemas en la Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT),
       2019–2022.
     - Jefe de la Unidad de Gestión de Sistemas y Desarrollo de Software de la UNASAM, 2017–2019.
   - h4 "Certificaciones y formación" (lista):
     - Certificación Microsoft Azure Fundamentals (AZ-900).
     - Certificación GitHub Foundations.
     - Certificación Apollo GraphQL Developer – Associate.
     - Formación en Azure AI Fundamentals (AI-900), RAG y modelos de lenguaje, arquitectura limpia y hexagonal,
       microservicios orientados a eventos y seguridad en microservicios.
     - Ponente en encuentros regionales sobre modernización de la gestión pública (Huaraz, 2017).
8. h2 "Nuestra organización": "Contamos con un equipo organizado en áreas especializadas:" + cuadrícula de 7
   tarjetas pequeñas con ícono (sin nombres de personas):

   | Área | Texto |
   |---|---|
   | Gerencia General | Dirección estratégica y relación con clientes. |
   | Arquitectura de Software | Diseño de soluciones escalables, seguras y mantenibles. |
   | Desarrollo de Software | Construcción de aplicaciones web, servicios e integraciones. |
   | Calidad de Software | Pruebas funcionales y aseguramiento de la calidad. |
   | Soporte de Sistemas | Implementación, soporte técnico y mantenimiento. |
   | Economía y Contabilidad | Gestión administrativa, tributaria y financiera. |
   | Atención al Cliente | Comunicación, cotizaciones y seguimiento. |

9. h2 "Trayectoria" (línea de tiempo `<ol>` vertical, con el año en un hexágono):

   | Año | Hitos |
   |---|---|
   | 2020 | Constitución de la empresa en Huaraz, Áncash. |
   | 2021 | Inscripción en el RNP como proveedor de bienes y servicios. Inicio como emisor electrónico. Primeros servicios para la UNASAM: procesamiento de datos, consultoría para la plataforma web institucional y portal de la Facultad de Economía y Contabilidad. |
   | 2022 | Certificados digitales SSL para la UNASAM. Aplicativos institucionales para la Corte Superior de Justicia de Áncash. |
   | 2023 | Servicio de hosting y dominio para la Corte Superior de Justicia de Áncash. |
   | 2024 | Aplicativo de cotizaciones para el evento Expomoto (Yamaha). Módulo de control de pago de planillas (INAIGEM). |
   | 2025 | Piloto de registro de compra de clientes (Yamaha). Soluciones de inteligencia artificial para los Juzgados de Paz Letrado y de Familia de Huaraz (CSJ Áncash). Optimización del Sistema de Gestión Documental (INAIGEM). |
   | 2026 | Mesa de Partes Virtual accesible conforme a WCAG 2.1 AA (INAIGEM). APUBOT 2.0, asistente de IA para la labor jurisdiccional (CSJ Áncash). Plataforma de gestión de consentimientos de datos personales (Yamaha). |

10. `CtaBand`.

### 6.8. Contacto (`/contacto/`)

1. Migas: Inicio › Contacto.
2. `PageHeader`:
   - Antetítulo "Contacto".
   - h1 "Conversemos sobre su proyecto".
   - Bajada: "Escríbanos por WhatsApp, llámenos o envíenos un correo. También puede completar el formulario y lo
     enviaremos por el canal que prefiera."
3. **Canales** (4 tarjetas, visibles sin JS):

   | Canal | Contenido | Botón |
   |---|---|---|
   | WhatsApp | "+1 717 883 9161" · "Mensajes por WhatsApp" | "Abrir WhatsApp" (wa.me con el mensaje predeterminado) |
   | Llamadas | "975 114 780" · "Solo llamadas" | "Llamar ahora" (`tel:+51975114780`) |
   | Correo | `construyendosolucionesbcs@gmail.com` | "Enviar correo" (`mailto:`) |
   | Redes sociales | Enlaces a Facebook y YouTube | — |

4. **Formulario** (h2 "Formulario de contacto"). Comportamiento en §8.
5. Texto: "Atendemos a instituciones públicas y empresas privadas." **[VALIDAR]** (no se mencionan horarios; ver §19,
   P5).
6. Sin `CtaBand` (la página ya es de contacto) y sin el botón flotante de WhatsApp.

### 6.9. Libro de Reclamaciones (`/libro-de-reclamaciones/`) [VALIDAR con asesoría legal]

1. Migas: Inicio › Libro de Reclamaciones.
2. h1 "Libro de Reclamaciones".
3. Texto: "Conforme al Código de Protección y Defensa del Consumidor (Ley N.° 29571), Construyendo Soluciones
   Informáticas E.I.R.L. (RUC 20606674415) pone a su disposición un Libro de Reclamaciones. Para registrar un
   reclamo o una queja, envíenos un correo a {email} con el asunto «Libro de Reclamaciones – Reclamo» o «Libro de
   Reclamaciones – Queja», incluyendo la siguiente información:"
4. Lista:
   - Nombres y apellidos.
   - Tipo y número de documento de identidad.
   - Domicilio, teléfono y correo electrónico.
   - En caso de menores de edad, los datos de su padre, madre o apoderado.
   - Identificación del bien o servicio contratado y monto reclamado, si corresponde.
   - Detalle del reclamo o queja.
   - Pedido concreto.
5. h2 "Diferencia entre reclamo y queja":
   - "**Reclamo**: disconformidad relacionada con los bienes adquiridos o los servicios prestados."
   - "**Queja**: disconformidad no relacionada con los bienes o servicios, o malestar respecto de la atención
     recibida."
6. Texto: "Le enviaremos una constancia de recepción y atenderemos su reclamo o queja dentro del plazo establecido
   por la normativa vigente. La formulación del reclamo no impide acudir a otras vías de solución de controversias
   ni es requisito previo para interponer una denuncia ante el INDECOPI."
7. Botón primario "Enviar reclamo o queja por correo": `mailto:` con el asunto «Libro de Reclamaciones» y un cuerpo
   que trae la lista anterior como plantilla.

### 6.10. Política de privacidad (`/privacidad/`) [VALIDAR con asesoría legal]

- h1 "Política de privacidad".
- Fecha de actualización: "Última actualización: {fecha de publicación}".
- Secciones (h2):

| Sección | Texto |
|---|---|
| 1. Responsable | Construyendo Soluciones Informáticas E.I.R.L., RUC 20606674415, con domicilio fiscal en Huaraz, Áncash, Perú. Contacto: {email}. |
| 2. Qué datos tratamos | Este sitio web no tiene formularios que almacenen información en nuestros servidores. Cuando usted nos escribe por WhatsApp o por correo, sea directamente o mediante el formulario de contacto, que solo prepara el mensaje en su dispositivo, tratamos los datos que usted decida compartir (nombre, entidad o empresa, datos de contacto y el contenido de su consulta). |
| 3. Finalidad | Atender su consulta, elaborar cotizaciones y mantener la comunicación comercial que usted solicite. |
| 4. Cookies y almacenamiento local | No usamos cookies, herramientas de analítica ni rastreadores de terceros. Solo guardamos en su navegador su preferencia de modo claro u oscuro (`localStorage`), que no permite identificarlo. |
| 5. Servicios de terceros | Al usar WhatsApp o su cliente de correo, se aplican también las políticas de privacidad de esos servicios. Los enlaces a nuestras redes sociales (Facebook y YouTube) llevan a sitios de terceros con sus propias políticas. |
| 6. Conservación | Conservamos las comunicaciones durante el tiempo necesario para atender su solicitud y cumplir nuestras obligaciones legales. |
| 7. Sus derechos | Conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su reglamento, puede ejercer sus derechos de acceso, rectificación, cancelación y oposición escribiendo a {email}. También puede acudir a la Autoridad Nacional de Protección de Datos Personales. |
| 8. Cambios | Podemos actualizar esta política. La versión vigente estará siempre publicada en esta página. |

### 6.11. Declaración de accesibilidad (`/accesibilidad/`)

- h1 "Declaración de accesibilidad".
- Texto: "Construyendo Soluciones Informáticas E.I.R.L. se compromete a que este sitio web sea accesible para todas
  las personas. Lo diseñamos y desarrollamos con el objetivo de cumplir las Pautas de Accesibilidad para el
  Contenido Web (WCAG) 2.2, nivel AA."
- h2 "Medidas adoptadas" (lista):
  - Navegación completa con teclado y foco visible.
  - Contraste de color conforme a AA en los modos claro y oscuro.
  - Estructura semántica de encabezados y regiones.
  - Textos alternativos.
  - Formularios con etiquetas e instrucciones.
  - Respeto de la preferencia de movimiento reducido.
  - Diseño adaptable hasta 320 px de ancho y con zoom de hasta 400 %.
- h2 "Evaluación": "Evaluado mediante pruebas automatizadas (axe) y revisión manual con teclado y lector de
  pantalla. Fecha de la última evaluación: {fecha de publicación}."
- h2 "¿Encontró una barrera?": "Si tiene dificultades para acceder a algún contenido, escríbanos a {email} o por
  WhatsApp al +1 717 883 9161. Le responderemos y le brindaremos la información en un formato accesible."

### 6.12. Página 404

- h1 "Página no encontrada".
- Texto: "La página que busca no existe o fue movida."
- Enlaces: "Ir al inicio", "Ver servicios", "Contactarnos".
- `noindex`. Visual: hexágono con trazas de circuito cortadas (decorativo).

---

## 7. Contenido estructurado (colecciones)

Se definen en `src/content.config.ts` con el *content layer* (`glob` loader) y esquemas Zod. Adapta los imports a la
API de Astro 7.4. El cuerpo Markdown no se usa: todo va en el *frontmatter*, por consistencia.

### 7.1. Colección `services` (`src/content/services/{slug}.md`)

Esquema:
```ts
{
  title: string;               // h1 y nombre
  navLabel: string;            // texto corto para menús
  order: number;               // orden de presentación
  icon: string;                // nombre del ícono Lucide
  summary: string;             // ≤ 160 caracteres (tarjetas)
  intro: string;               // bajada del PageHeader
  includes: string[];          // 5–8 elementos
  benefits: { title: string; text: string }[];  // 3–4
  capabilities?: string[];     // tecnologías como capacidades generales
  faq: { q: string; a: string }[];              // 2–3
  seo: { title: string; description: string };  // título ≤ 60, descripción ≤ 155
  keywords: string[];          // uso interno (mapa de keywords, §9.4); NO se emite meta keywords
}
```

#### 1. `desarrollo-de-software` (order 1, icon `code-xml`)

- **title**: Desarrollo de software a medida
- **navLabel**: Desarrollo de software
- **summary**: Aplicaciones web, servicios backend e integraciones construidos a la medida de sus procesos, escalables y seguros.
- **intro**: Diseñamos y construimos software a la medida de sus procesos: aplicaciones web, servicios backend de alto rendimiento, APIs e integraciones entre sistemas, con arquitecturas escalables y documentación completa.

**includes**:
- Análisis de requerimientos y modelado de procesos
- Diseño de arquitectura de software (monolítica, microservicios u orientada a eventos)
- Desarrollo de aplicaciones web responsivas
- Servicios backend y APIs (REST, GraphQL, gRPC)
- Integración con sistemas existentes y servicios del Estado
- Pruebas unitarias y funcionales
- Despliegue, capacitación y documentación técnica y de usuario
- Mantenimiento evolutivo y correctivo

**benefits**:
- Hecho para su proceso: el software se adapta a su organización, no al revés.
- Escalable y mantenible: arquitecturas limpias que facilitan el crecimiento.
- Seguro desde el diseño: buenas prácticas de seguridad en cada capa.
- Propiedad y documentación: entregamos código fuente, manuales y transferencia de conocimiento.

**capabilities**: Java (Spring Boot, Quarkus) · Go · Python (FastAPI) · Node.js · PHP (Laravel) · Astro · Angular · Vue · React · Bases de datos SQL y NoSQL

**faq**:
- **¿Entregan el código fuente?** Sí. Al cierre del proyecto entregamos el código fuente, los scripts de base de datos y la documentación técnica y de usuario, según lo acordado.
- **¿Trabajan con términos de referencia (TDR) del Estado?** Sí. Tenemos experiencia ejecutando servicios bajo TDR, con entregables, informes técnicos y actas de conformidad.
- **¿Pueden mejorar un sistema que ya tenemos?** Sí. Analizamos su sistema actual y proponemos nuevos módulos, optimizaciones o una modernización por etapas.

**seo**:
- Título: Desarrollo de software a medida en Perú | CSI
- Descripción: Desarrollo de software a medida para entidades públicas y empresas: aplicaciones web, APIs e integraciones escalables y seguras. Huaraz, Áncash.

**keywords**: desarrollo de software a medida, empresa de desarrollo de software en Perú, desarrollo de software Huaraz, desarrollo de aplicaciones web, desarrollo de APIs

#### 2. `inteligencia-artificial` (order 2, icon `brain-circuit`)

- **title**: Inteligencia artificial y machine learning
- **navLabel**: Inteligencia artificial
- **summary**: Asistentes virtuales, chatbots e IA generativa con modelos de lenguaje, RAG y visión por computadora para automatizar procesos.
- **intro**: Implementamos soluciones de inteligencia artificial que resuelven problemas concretos: asistentes virtuales que generan borradores de documentos, chatbots de atención, búsqueda inteligente sobre su información y modelos de visión por computadora.

**includes**:
- Asistentes virtuales con modelos de lenguaje (LLM)
- Generación aumentada por recuperación (RAG) sobre documentos y normativa de su organización
- Chatbots para la atención ciudadana o de clientes en web y mensajería
- Automatización de la redacción y clasificación de documentos
- Visión por computadora (detección y reconocimiento de objetos)
- Modelos de aprendizaje automático y aprendizaje profundo
- Prototipos y pruebas de concepto
- Capacitación de usuarios y criterios de uso responsable de la IA

**benefits**:
- Más productividad: automatice tareas repetitivas y concéntrese en lo importante.
- Respuestas ancladas a sus datos: la IA responde basada en su información y normativa, no en suposiciones.
- Atención continua: canales de consulta disponibles a toda hora.
- Adopción responsable: supervisión humana y criterios éticos en el uso de la IA.

**capabilities**: Modelos de lenguaje (LLM) · RAG · Procesamiento de lenguaje natural · Visión por computadora (YOLO, PyTorch) · Aprendizaje profundo · Aprendizaje por refuerzo · Prompt engineering · Agentes inteligentes

**faq**:
- **¿La IA reemplaza al personal?** No. Nuestras soluciones asisten al personal: generan borradores y respuestas que una persona revisa y valida.
- **¿Pueden usar los documentos de mi institución?** Sí. Con técnicas como RAG, la IA consulta sus documentos y normativa para responder con fundamento, respetando la confidencialidad de la información.
- **¿Por dónde empezamos?** Con un diagnóstico y una prueba de concepto acotada que demuestre el valor antes de escalar.

**seo**:
- Título: Inteligencia artificial y asistentes virtuales | CSI
- Descripción: Soluciones de inteligencia artificial para entidades públicas y empresas: asistentes virtuales, chatbots, RAG y visión por computadora en Perú.

**keywords**: inteligencia artificial para empresas, inteligencia artificial sector público, chatbot con inteligencia artificial Perú, asistente virtual con IA, RAG, IA generativa, visión por computadora

#### 3. `portales-web` (order 3, icon `globe`)

- **title**: Portales web institucionales y corporativos
- **navLabel**: Portales web
- **summary**: Portales institucionales, corporativos y académicos rápidos, accesibles (WCAG) y fáciles de administrar.
- **intro**: Diseñamos y desarrollamos portales web corporativos, institucionales y académicos con alta disponibilidad, excelente experiencia de usuario y cumplimiento de las pautas de accesibilidad web (WCAG).

**includes**:
- Arquitectura de información y diseño de interfaz
- Portales institucionales, corporativos y académicos
- Sitios administrables (noticias, eventos, comunicados, documentos)
- Accesibilidad web conforme a WCAG 2.1 y 2.2, nivel AA
- Optimización para buscadores (SEO) y rendimiento
- Diseño responsive para móviles, tabletas y computadoras
- Intranets y portales de servicios
- Migración de contenidos y capacitación

**benefits**:
- Accesibles para todos: cumplimiento de estándares de accesibilidad exigidos a las entidades del Estado.
- Rápidos y visibles: buen rendimiento y SEO para que lo encuentren.
- Fáciles de administrar: su equipo actualiza los contenidos sin depender de terceros.

**capabilities**: Astro · Angular · Vue · React · JavaScript moderno · Accesibilidad WCAG 2.2 · SEO técnico

**faq**:
- **¿El portal cumple con accesibilidad?** Sí. Diseñamos y verificamos conforme a WCAG 2.1 y 2.2, nivel AA, con pruebas automatizadas y manuales.
- **¿Podremos actualizar los contenidos?** Sí. Según la necesidad, implementamos un panel de administración o un flujo de publicación sencillo y capacitamos a su equipo.

**seo**:
- Título: Portales web institucionales y corporativos | CSI
- Descripción: Diseño y desarrollo de portales web institucionales, corporativos y académicos, accesibles (WCAG), rápidos y administrables. Perú.

**keywords**: desarrollo de portales web institucionales, diseño de páginas web Huaraz, accesibilidad web WCAG Perú, portal web universidad, página web corporativa

#### 4. `sistemas-de-gestion` (order 4, icon `layout-dashboard`)

- **title**: Sistemas de gestión y back-office
- **navLabel**: Sistemas de gestión
- **summary**: Mesa de partes virtual, gestión documental, planillas, cotizaciones, ventas y facturación electrónica a la medida.
- **intro**: Desarrollamos sistemas de gestión que ordenan y automatizan sus procesos internos: mesa de partes virtual, gestión documental con firma digital, recursos humanos y planillas, cotizaciones, ventas, inventarios y facturación electrónica.

**includes**:
- Mesa de partes virtual y trámite documentario
- Sistemas de gestión documental orientados a la política de cero papel
- Recursos humanos: planillas, escalafón y control de asistencia
- Cotizaciones, ventas y control de inventario
- Facturación electrónica
- Gestión académica
- Paneles administrativos (back-office) y reportes
- Análisis de datos e indicadores de gestión

**benefits**:
- Procesos ordenados: información centralizada y trazable.
- Menos papel y menos tiempo: digitalización y automatización de trámites.
- Mejores decisiones: reportes e indicadores al día.

**faq**:
- **¿Se integran con lo que ya usamos?** Sí. Diseñamos integraciones con sus sistemas existentes y con servicios externos cuando corresponde.
- **¿Ofrecen capacitación?** Sí. Cada implementación incluye capacitación a usuarios y manuales.

**seo**:
- Título: Sistemas de gestión: documental, planillas y más | CSI
- Descripción: Sistemas de gestión a medida: mesa de partes virtual, gestión documental, planillas, cotizaciones, ventas y facturación electrónica.

**keywords**: mesa de partes virtual, sistema de gestión documental, sistema de planillas, sistema de trámite documentario, sistema de ventas e inventario, sistema de facturación electrónica

#### 5. `cloud-e-infraestructura` (order 5, icon `cloud-cog`)

- **title**: Cloud, infraestructura y DevOps
- **navLabel**: Cloud e infraestructura
- **summary**: Migración a la nube, servidores, contenedores, certificados SSL, hosting y soporte para que sus sistemas estén siempre disponibles.
- **intro**: Desplegamos y operamos su infraestructura tecnológica para que sus aplicaciones sean rápidas, seguras y estén disponibles: migraciones a la nube, servidores virtuales, contenedores, certificados digitales, hosting, dominios y monitoreo.

**includes**:
- Migración de aplicaciones a la nube (Azure, AWS y Google Cloud)
- Servidores privados virtuales (VPS) y servidores dedicados
- Contenedores, proxy inverso y automatización de despliegues (CI/CD)
- Certificados digitales SSL/TLS
- Hosting, dominios, DNS y copias de seguridad
- Monitoreo, pruebas de carga y optimización de rendimiento
- Soporte técnico crítico para eventos y operaciones de alta demanda
- Control de costos y buenas prácticas de seguridad en la nube

**benefits**:
- Alta disponibilidad: su servicio en línea cuando más lo necesita.
- Seguridad: cifrado, cortafuegos y accesos controlados.
- Costos bajo control: la infraestructura dimensionada a su necesidad real.

**capabilities**: Microsoft Azure · AWS · Google Cloud · Docker · Kubernetes · Nginx · CI/CD · Linux

**faq**:
- **¿Pueden migrar mi aplicación a mi propia suscripción en la nube?** Sí. Planificamos la migración, la ventana de corte y el plan de retorno para garantizar la continuidad del servicio.
- **¿Brindan soporte durante eventos?** Sí. Ofrecemos monitoreo y soporte técnico dedicado durante eventos y periodos de alta demanda.

**seo**:
- Título: Cloud, servidores y DevOps para su organización | CSI
- Descripción: Migración a la nube, servidores VPS, contenedores, certificados SSL, hosting, dominios y soporte técnico para sistemas críticos.

**keywords**: migración a la nube Azure, servicios cloud Perú, hosting y dominio para empresas, certificados SSL, DevOps, servidores VPS

#### 6. `consultoria-ti` (order 6, icon `lightbulb`)

- **title**: Consultoría informática
- **navLabel**: Consultoría TI
- **summary**: Consultoría en arquitectura de software, accesibilidad web, seguridad, procesamiento de datos y gestión de proyectos TI.
- **intro**: Le ayudamos a tomar mejores decisiones tecnológicas: evaluamos sus sistemas, definimos arquitecturas, implementamos criterios de accesibilidad y seguridad, procesamos sus datos y acompañamos la gestión de sus proyectos de TI.

**includes**:
- Diagnóstico y evaluación de sistemas existentes
- Arquitectura de software y planes de modernización
- Implementación de criterios de accesibilidad digital (WCAG 2.1 y 2.2)
- Revisión de seguridad de aplicaciones y código
- Procesamiento, migración y depuración de datos
- Elaboración de términos de referencia y especificaciones técnicas
- Gestión de proyectos de TI con enfoque ágil
- Capacitación técnica

**benefits**:
- Decisiones informadas: diagnósticos claros con recomendaciones accionables.
- Cumplimiento normativo: accesibilidad y seguridad conforme a estándares.
- Menos riesgo: planificación por etapas y transferencia de conocimiento.

**faq**:
- **¿Qué es la accesibilidad digital y por qué importa?** Es lograr que todas las personas, incluidas las personas con discapacidad, puedan usar sus servicios digitales. Las entidades del Estado peruano toman las pautas WCAG como referencia para sus plataformas.
- **¿Pueden ayudarnos a elaborar los términos de referencia?** Sí. Acompañamos la definición técnica del requerimiento para que sea claro, medible y viable.

**seo**:
- Título: Consultoría informática y accesibilidad WCAG | CSI
- Descripción: Consultoría informática: arquitectura de software, accesibilidad web WCAG, seguridad de aplicaciones, procesamiento de datos y gestión de proyectos TI.

**keywords**: consultoría informática Huaraz, consultoría TI Perú, consultoría en accesibilidad web WCAG, arquitectura de software, auditoría de sistemas

#### 7. `redes-y-soporte` (order 7, icon `network`)

- **title**: Redes, soporte técnico y mantenimiento
- **navLabel**: Redes y soporte
- **summary**: Cableado estructurado, redes, seguridad perimetral, soporte técnico y mantenimiento de equipos informáticos.
- **intro**: Mantenemos operativa su infraestructura informática: diseño e instalación de redes de datos, seguridad perimetral, soporte técnico a usuarios y mantenimiento preventivo y correctivo de equipos.

**includes**:
- Diseño e instalación de redes de datos y cableado estructurado
- Configuración de equipos de red, redes privadas virtuales (VPN) y seguridad perimetral
- Soporte técnico a usuarios
- Mantenimiento preventivo y correctivo de equipos informáticos
- Instalación y configuración de equipos y software
- Administración del parque informático
- Instalación de sistemas de videoconferencia

**benefits**:
- Continuidad operativa: menos interrupciones en su trabajo diario.
- Seguridad de la red: protección frente a accesos no autorizados.
- Equipos en buen estado: mayor vida útil de su inversión tecnológica.

**faq**:
- **¿Instalan los equipos que nos venden?** Sí. Ofrecemos instalación, configuración y puesta en marcha de los bienes que suministramos.
- **¿Brindan mantenimiento preventivo?** Sí. Podemos programar mantenimientos periódicos según su parque informático.

**seo**:
- Título: Redes, soporte técnico y mantenimiento | CSI
- Descripción: Instalación de redes y cableado estructurado, seguridad perimetral, soporte técnico y mantenimiento de equipos informáticos en Áncash.

**keywords**: cableado estructurado Huaraz, instalación de redes, soporte técnico informático, mantenimiento de computadoras, seguridad perimetral

### 7.2. Colección `productCategories` (`src/content/product-categories/{slug}.yaml`)

Esquema: `{ name: string; order: number; icon: string; description: string; items: string[] }`

| slug | name | icon | description | items |
|---|---|---|---|---|
| `equipos-de-computo` (1) | Equipos de cómputo | `monitor` | Computadoras para oficinas, laboratorios y áreas técnicas, configuradas según sus especificaciones. | Computadoras de escritorio · Laptops · Equipos todo en uno · Estaciones de trabajo · Clientes ligeros · Tabletas · Monitores |
| `servidores-y-almacenamiento` (2) | Servidores y almacenamiento | `server` | Infraestructura para sus aplicaciones y datos, con capacidad y respaldo adecuados. | Servidores en torre y en rack · Servidores de gama alta · Servidores de acceso y de impresión · Almacenamiento en red (NAS) · Discos y unidades de respaldo · Sistemas de energía ininterrumpida (UPS) |
| `redes-y-telecomunicaciones` (3) | Redes y telecomunicaciones | `router` | Equipamiento para redes de datos cableadas e inalámbricas, seguras y estables. | Switches y routers · Puntos de acceso inalámbrico · Cortafuegos y equipos VPN · Cable de red, coaxial y de cobre · Gabinetes, patch panels y accesorios · Repetidores de telecomunicaciones |
| `impresion-y-consumibles` (4) | Impresión y consumibles | `printer` | Impresoras para cada necesidad y sus suministros. | Impresoras láser y de inyección de tinta · Impresoras matriciales · Impresoras de tickets (POS) y de etiquetas · Fotocopiadoras y multifuncionales · Tintas, tóneres y cintas · Papel y kits de mantenimiento |
| `perifericos-y-accesorios` (5) | Periféricos y accesorios | `keyboard` | Complementos para el trabajo diario y el cuidado de sus equipos. | Teclados y ratones · Parlantes y audífonos · Cámaras web · Soportes y mesas para computadoras · Maletines y fundas · Kits de limpieza y de herramientas |
| `videoconferencia-y-audio` (6) | Videoconferencia y audio | `video` | Soluciones para reuniones híbridas, capacitaciones y audiencias virtuales. | Sistemas de videoconferencia · Cámaras para salas · Micrófonos y altavoces de conferencia · Grabadoras de voz digitales · Pantallas |
| `software-y-licencias` (7) | Software y licencias | `package` | Licenciamiento original para su organización. | Sistemas operativos · Ofimática y colaboración · Antivirus y seguridad · Software de respaldo y archivado · Software de punto de venta · Herramientas de desarrollo |
| `robotica-e-inteligencia-artificial` (8) | Robótica e inteligencia artificial | `bot` | Equipamiento para proyectos de innovación, educación tecnológica e IA, bajo pedido. | Kits de robótica educativa · Placas de desarrollo y microcontroladores · Sensores y actuadores · Hardware para IA en el borde (edge) · Componentes electrónicos |

### 7.3. Colección `projects` (`src/content/projects/{slug}.md`)

Esquema:
```ts
{
  title: string;            // h1
  shortTitle: string;       // migas y navegación
  client: string;           // nombre a mostrar (solo texto)
  sector: "justicia" | "investigacion-y-ambiente" | "educacion-superior" | "empresa-privada";
  date: string;             // "YYYY-MM" (para ordenar)
  dateLabel: string;        // "Octubre 2026"
  services: string[];       // slugs de §7.1 (referencias validadas)
  visual: "chat" | "form" | "dashboard" | "documents" | "table" | "portal" | "certificate" | "server";
  featured: boolean;
  draft: boolean;           // true = no se publica ni entra al sitemap
  summary: string;          // ≤ 180 caracteres
  context: string;
  solution: string[];
  contribution: string[];
  seo: { title: string; description: string };
}
```

Etiquetas de sector:

| Valor | Etiqueta |
|---|---|
| `justicia` | Justicia |
| `investigacion-y-ambiente` | Investigación y ambiente |
| `educacion-superior` | Educación superior |
| `empresa-privada` | Empresa privada |

Nombres de cliente:

| Cliente | Nombre a mostrar |
|---|---|
| CSJ Áncash | "Corte Superior de Justicia de Áncash" |
| INAIGEM | "INAIGEM – Instituto Nacional de Investigación en Glaciares y Ecosistemas de Montaña" (en tarjetas, solo "INAIGEM") |
| UNASAM | "UNASAM – Universidad Nacional Santiago Antúnez de Mayolo" (en tarjetas, solo "UNASAM") |
| Yamaha | "Yamaha Perú" |

> Regla: las descripciones son **funcionales**. Nunca se mencionan lenguajes, frameworks, nubes ni proveedores
> usados en el proyecto (§1.4).

#### P1. `apubot-2-csj-ancash`

- **title**: APUBOT 2.0: asistente de inteligencia artificial para la labor jurisdiccional
- **shortTitle**: APUBOT 2.0
- **Datos**: Corte Superior de Justicia de Áncash · justicia · 2026-10 · "Octubre 2026" · services: inteligencia-artificial, desarrollo-de-software · visual: chat · featured: true
- **summary**: Solución de IA generativa que genera calificaciones de demanda y proyectos de sentencia, y optimiza los servicios de inteligencia artificial de la Corte.
- **context**: Los Juzgados de Paz Letrado y de Familia de Huaraz necesitaban acelerar la elaboración de documentos jurisdiccionales y ampliar los canales de atención a la ciudadanía, manteniendo el rigor jurídico y la supervisión del personal.

**solution**:
- Generación de borradores de calificación de demanda (autos admisorios y de inadmisibilidad) y de proyectos de sentencia.
- Respuestas ancladas a la normativa y a los documentos del expediente, mediante técnicas de recuperación de información (RAG).
- Módulo de administración para habilitar dependencias judiciales y gestionar usuarios y roles de forma dinámica.
- Ampliación del chatbot de atención con nuevas consultas sobre el estado de los expedientes.

**contribution**:
- Herramientas de IA generativa al servicio del personal jurisdiccional, con revisión humana.
- Reducción del trabajo repetitivo en la redacción de documentos.
- Alcance funcional configurable sin necesidad de nuevos despliegues.

**seo**:
- Título: APUBOT 2.0: IA para la labor jurisdiccional | CSI
- Descripción: Caso APUBOT 2.0: asistente de IA generativa que genera calificaciones de demanda y proyectos de sentencia para la Corte Superior de Justicia de Áncash.

#### P2. `mesa-de-partes-virtual-inaigem`

- **title**: Mesa de Partes Virtual accesible conforme a WCAG 2.1 AA
- **shortTitle**: Mesa de Partes Virtual
- **Datos**: INAIGEM · investigacion-y-ambiente · 2026-05 · "Mayo 2026" · services: sistemas-de-gestion, consultoria-ti, portales-web · visual: form · featured: true
- **summary**: Diseño y desarrollo web para el mejoramiento de la Mesa de Partes Virtual, con criterios de accesibilidad digital WCAG 2.1 nivel AA.
- **context**: La institución necesitaba que su Mesa de Partes Virtual Externa garantizara un acceso equitativo e inclusivo a la ciudadanía y optimizara la gestión de los expedientes presentados.

**solution**:
- Adecuación a los criterios de accesibilidad visual, motora, cognitiva y documental de WCAG 2.1 nivel AA.
- Mejora de los módulos de registro, administración y gestión de usuarios.
- Optimización del seguimiento, la observación y la subsanación de expedientes, de las notificaciones y de los reportes.
- Panel de métricas y bandejas de trabajo para el personal.

**contribution**:
- Servicio digital más inclusivo para la ciudadanía.
- Cumplimiento de las obligaciones institucionales en accesibilidad digital.
- Gestión documentaria más ágil y trazable.

**seo**:
- Título: Mesa de Partes Virtual accesible (WCAG) – INAIGEM | CSI
- Descripción: Caso de mejoramiento de la Mesa de Partes Virtual del INAIGEM con criterios de accesibilidad WCAG 2.1 AA y optimización de la gestión de expedientes.

#### P3. `gestion-documental-inaigem`

- **title**: Optimización del Sistema de Gestión Documental
- **shortTitle**: Sistema de Gestión Documental
- **Datos**: INAIGEM · investigacion-y-ambiente · 2025-11 · "Noviembre 2025" · services: sistemas-de-gestion, desarrollo-de-software · visual: documents · featured: true
- **summary**: Análisis, desarrollo y mantenimiento de aplicaciones web para optimizar el Sistema de Gestión Documental institucional.
- **context**: El sistema de trámite documentario debía adaptarse a la evolución de los procesos administrativos y avanzar hacia la política de cero papel.

**solution**:
- Nuevos módulos funcionales para el control y la gestión de documentos institucionales.
- Emisión y envío de documentos digitales con firma digital, en reemplazo del papel.
- Digitalización de los documentos ingresados por mesa de partes.
- Revisión, derivación y firma de documentos en bandejas de despacho digitales.
- Mejoras en la interfaz y la experiencia de usuario.

**contribution**:
- Avance hacia una gestión documental sin papel.
- Mayor trazabilidad de los documentos.
- Mejor experiencia para los usuarios internos.

**seo**:
- Título: Sistema de Gestión Documental – INAIGEM | CSI
- Descripción: Caso de optimización del Sistema de Gestión Documental del INAIGEM: firma digital, digitalización y despacho de documentos hacia el cero papel.

#### P4. `ia-juzgados-huaraz-csj-ancash`

- **title**: Inteligencia artificial para los Juzgados de Paz Letrado y de Familia de Huaraz
- **shortTitle**: IA para juzgados de Huaraz
- **Datos**: Corte Superior de Justicia de Áncash · justicia · 2025-08 · "Agosto 2025" · services: inteligencia-artificial, desarrollo-de-software · visual: chat · featured: false
- **summary**: Desarrollo e implementación de soluciones tecnológicas con inteligencia artificial para el personal jurisdiccional y para la atención a los justiciables.
- **context**: Los juzgados buscaban agilizar la elaboración de documentos legales y facilitar el acceso de la ciudadanía a la información de sus procesos.

**solution**:
- Asistente virtual (ApuBot) que proyecta documentos legales para el personal jurisdiccional.
- Chatbot de atención para consultar el estado de expedientes, de demandas y de depósitos judiciales.
- Capacitación al personal usuario.

**contribution**:
- Primeras herramientas de IA en producción para estos juzgados.
- Acceso más rápido y transparente a la información para los justiciables.

**seo**:
- Título: IA para juzgados de Huaraz – CSJ Áncash | CSI
- Descripción: Soluciones de inteligencia artificial para los Juzgados de Paz Letrado y de Familia de Huaraz: asistente virtual y chatbot de atención ciudadana.

#### P5. `registro-compra-clientes-yamaha`

- **title**: Piloto de registro de compra de clientes
- **shortTitle**: Registro de compra de clientes
- **Datos**: Yamaha Perú · empresa-privada · 2025-05 · "Mayo 2025" · services: desarrollo-de-software, sistemas-de-gestion · visual: form · featured: true
- **summary**: Aplicación web piloto para que la marca capture directamente los datos de sus clientes finales y los vincule con el vehículo adquirido.
- **context**: La empresa necesitaba obtener información directa de sus clientes finales, sin depender del reporte de terceros.

**solution**:
- Formularios públicos responsivos, con dos alternativas: registro del código del vehículo digitado o mediante fotografía.
- Panel administrativo con acceso seguro para el personal central.
- Listado de registros con filtros y visualización de las evidencias adjuntas.

**contribution**:
- Información de clientes de primera mano para la marca.
- Implementación rápida mediante un enfoque ágil por fases.

**seo**:
- Título: Registro de compra de clientes – Yamaha | CSI
- Descripción: Caso de aplicación web piloto para el registro directo de compras de clientes finales, con formularios responsivos y panel administrativo.

#### P6. `planillas-inaigem`

- **title**: Módulo de control de pago de planillas (segunda etapa)
- **shortTitle**: Módulo de planillas
- **Datos**: INAIGEM · investigacion-y-ambiente · 2024-12 · "Diciembre 2024" · services: sistemas-de-gestion, desarrollo-de-software · visual: table · featured: false
- **summary**: Análisis, diseño y desarrollo de la segunda etapa del módulo de control de pago de planillas del sistema de recursos humanos.
- **context**: El sistema de recursos humanos de la institución requería ampliar sus funcionalidades para automatizar reportes y procesos de planillas.

**solution**:
- Definición de requerimientos y reglas de negocio.
- Construcción y automatización de módulos de reportes y procesos de planillas.
- Pruebas de funcionamiento y puesta en producción.

**contribution**:
- Procesos de planillas más ágiles y confiables.
- Reportes automatizados para la gestión de recursos humanos.

**seo**:
- Título: Módulo de planillas – INAIGEM | CSI
- Descripción: Caso de desarrollo del módulo de control de pago de planillas del sistema de recursos humanos del INAIGEM: reportes y procesos automatizados.

#### P7. `cotizaciones-expomoto-yamaha`

- **title**: Aplicativo de cotizaciones para el evento Expomoto
- **shortTitle**: Cotizaciones Expomoto
- **Datos**: Yamaha Perú · empresa-privada · 2024-07 · "Julio 2024" · services: desarrollo-de-software, sistemas-de-gestion · visual: dashboard · featured: false
- **summary**: Aplicativo web de cotizaciones y registro de ventas para la fuerza de ventas durante la feria Expomoto.
- **context**: El equipo comercial necesitaba cotizar y registrar ventas de forma ágil y simultánea durante una feria de alta concurrencia.

**solution**:
- Módulos de cotizaciones, ventas y reportes.
- Gestión de usuarios y del tipo de cambio.
- Acceso seguro para los asesores de venta.

**contribution**:
- Cotizaciones y ventas centralizadas durante el evento.
- Reportes disponibles para el seguimiento comercial.

**seo**:
- Título: Aplicativo de cotizaciones Expomoto – Yamaha | CSI
- Descripción: Caso de aplicativo web de cotizaciones y registro de ventas para la feria Expomoto: módulos de cotizaciones, ventas, reportes y usuarios.

#### P8. `hosting-dominio-csj-ancash`

- **title**: Servicio de hosting y dominio institucional
- **shortTitle**: Hosting y dominio
- **Datos**: Corte Superior de Justicia de Áncash · justicia · 2023-10 · "Octubre 2023" · services: cloud-e-infraestructura · visual: server · featured: false
- **summary**: Contratación y administración del servicio de hosting y dominio para una oficina de la Corte.
- **context**: Una oficina de la Corte requería un alojamiento web propio y confiable para publicar y administrar su información.

**solution**:
- Registro del dominio y configuración de DNS.
- Hosting con administración de base de datos y archivos.
- Copias de seguridad y acceso FTP.

**contribution**:
- Presencia web propia, administrable y respaldada.

**seo**:
- Título: Hosting y dominio – CSJ Áncash | CSI
- Descripción: Caso de servicio de hosting y dominio institucional para la Corte Superior de Justicia de Áncash: DNS, base de datos, archivos y copias de seguridad.

#### P9. `aplicativos-institucionales-csj-ancash`

- **title**: Aplicativos institucionales para la Corte Superior de Justicia de Áncash
- **shortTitle**: Aplicativos institucionales
- **Datos**: Corte Superior de Justicia de Áncash · justicia · 2022-12 · "2022" · services: desarrollo-de-software, sistemas-de-gestion · visual: form · featured: false
- **summary**: Desarrollo de aplicativos web para la ciudadanía y para la gestión interna de la Corte.
- **context**: La Corte requería digitalizar trámites dirigidos a la ciudadanía y procesos internos de registro y de gestión de la calidad.

**solution**:
- Formato digital de propuesta de liquidación de pensiones alimenticias devengadas, que permite a los demandantes registrarlo sin necesidad de un abogado, con validación de identidad.
- Sistema de registro de la descarga procesal de expedientes judiciales.
- Aplicativo de apoyo al Sistema de Gestión de la Calidad y repositorio de sus documentos.
- Mejoras al sistema de consultas de orientación jurídica gratuita.

**contribution**:
- Trámites más accesibles para la ciudadanía.
- Registro y control digital de procesos internos.

**seo**:
- Título: Aplicativos institucionales – CSJ Áncash | CSI
- Descripción: Caso de aplicativos web para la Corte Superior de Justicia de Áncash: liquidación de devengados, descarga procesal y gestión de la calidad.

#### P10. `certificados-ssl-unasam`

- **title**: Instalación y configuración de certificados digitales SSL
- **shortTitle**: Certificados SSL
- **Datos**: UNASAM · educacion-superior · 2022-05 · "Mayo 2022" · services: cloud-e-infraestructura · visual: certificate · featured: false
- **summary**: Adquisición, instalación y configuración de certificados digitales SSL para el dominio institucional y sus subdominios.
- **context**: La universidad necesitaba cifrar las comunicaciones de su portal y de sus servicios web.

**solution**:
- Adquisición de certificados digitales SSL con vigencia de cinco años.
- Instalación y configuración en el dominio principal y en los subdominios institucionales.

**contribution**:
- Conexiones cifradas y confianza para los usuarios de los servicios web de la universidad.

**seo**:
- Título: Certificados SSL – UNASAM | CSI
- Descripción: Caso de adquisición, instalación y configuración de certificados digitales SSL para el dominio y los subdominios de la UNASAM.

#### P11. `portal-fec-unasam`

- **title**: Portal institucional de la Facultad de Economía y Contabilidad
- **shortTitle**: Portal de la FEC
- **Datos**: UNASAM – Facultad de Economía y Contabilidad · educacion-superior · 2021-12 · "Diciembre 2021" · services: portales-web · visual: portal · featured: false
- **summary**: Servicio de implementación del portal institucional de la Facultad de Economía y Contabilidad.
- **context**: La facultad requería un portal propio para comunicar su información institucional y académica.

**solution**:
- Secciones de noticias, eventos y comunicados.
- Información institucional: historia, misión, visión, políticas de calidad y directorio.
- Información de los programas de estudio y de los documentos normativos.
- Galería de fotos y contenidos de responsabilidad social.

**contribution**:
- Comunicación institucional centralizada y actualizable.

**seo**:
- Título: Portal de Economía y Contabilidad – UNASAM | CSI
- Descripción: Caso de implementación del portal institucional de la Facultad de Economía y Contabilidad de la UNASAM.

#### P12. `plataforma-web-institucional-unasam`

- **title**: Consultoría para la implementación de la plataforma web institucional
- **shortTitle**: Plataforma web institucional
- **Datos**: UNASAM · educacion-superior · 2021-12 · "Diciembre 2021" · services: portales-web, consultoria-ti · visual: portal · featured: false
- **summary**: Servicio de consultoría para la implementación de la plataforma web institucional de la universidad.
- **context**: La universidad necesitaba renovar su plataforma web e integrar la información de sus facultades y programas de estudio.

**solution**:
- Componente de portal institucional.
- Componentes por facultad y por programa de estudios.
- Organización de la información para los procesos de acreditación.

**contribution**:
- Información institucional y académica integrada en una sola plataforma.

**seo**:
- Título: Plataforma web institucional – UNASAM | CSI
- Descripción: Caso de consultoría para la implementación de la plataforma web institucional de la UNASAM, con componentes por facultad y programa.

#### P13. `procesamiento-de-datos-unasam`

- **title**: Procesamiento de datos y ampliación de la base de datos del Sistema de Recojo de Información
- **shortTitle**: Sistema de Recojo de Información
- **Datos**: UNASAM · educacion-superior · 2021-07 · "Julio 2021" · services: consultoria-ti, desarrollo-de-software · visual: table · featured: false
- **summary**: Servicio de procesamiento de datos para la ampliación de la base de datos del Sistema de Recojo de Información.
- **context**: La universidad requería ampliar la base de datos de su sistema de recojo de información para atender nuevos requerimientos.

**solution**:
- Procesamiento de datos y ampliación de la base de datos.
- Entrega de la nueva versión del sistema y de los scripts de actualización.
- Apoyo en la instalación y capacitación.

**contribution**:
- Sistema actualizado y con capacidad para los nuevos requerimientos de información.

**seo**:
- Título: Sistema de Recojo de Información – UNASAM | CSI
- Descripción: Caso de procesamiento de datos y ampliación de la base de datos del Sistema de Recojo de Información de la UNASAM.

#### P14. `consentimientos-datos-personales-yamaha` (se publica, D17)

- **title**: Plataforma de gestión de consentimientos de datos personales
- **shortTitle**: Gestión de consentimientos
- **Datos**: Yamaha Perú · empresa-privada · 2026-10 · "Octubre 2026" · services: desarrollo-de-software, cloud-e-infraestructura · visual: form · featured: false · draft: false
- **summary**: Plataforma para gestionar de forma digital y trazable las conformidades de tratamiento de datos personales de los clientes finales.
- **context**: La empresa necesitaba obtener y registrar el consentimiento de sus clientes para el tratamiento de sus datos personales y para fines de marketing, de manera digital, ágil y con evidencia verificable.

**solution**:
- Servicios de integración que reciben los datos del cliente desde la plataforma comercial de la empresa y le informan el resultado del consentimiento.
- Envío automático de la solicitud de consentimiento por mensajería instantánea, con un enlace único y con vigencia.
- Página de consentimiento accesible y adaptada a móviles, en la que el cliente acepta o rechaza cada autorización por separado.
- Registro de trazabilidad y auditoría de cada consentimiento (fecha y hora, versión de la política aceptada y datos técnicos del dispositivo).
- Despliegue en la infraestructura cloud del cliente.

**contribution**:
- Consentimientos digitales con evidencia trazable, que respetan la decisión del cliente, incluido el rechazo.
- Menos gestión manual en la obtención de autorizaciones.
- Integración directa con los procesos comerciales de la empresa.

**seo**:
- Título: Gestión de consentimientos – Yamaha | CSI
- Descripción: Caso de plataforma digital para gestionar y registrar con trazabilidad los consentimientos de tratamiento de datos personales de clientes finales.

> No mencionar los nombres de las plataformas del cliente ni de los proveedores de mensajería o de nube (§1.4).

---

## 8. Contacto sin backend (formulario)

### 8.1. Campos

| Campo | Tipo | Obligatorio | Validación y notas |
|---|---|---|---|
| Nombres y apellidos | `input text`, `autocomplete="name"` | Sí | 3–80 caracteres |
| Entidad o empresa | `input text`, `autocomplete="organization"` | No | máx. 100 |
| Tipo de requerimiento | `select` | Sí | Opciones: Desarrollo de software a medida · Inteligencia artificial · Portal web · Sistema de gestión · Cloud e infraestructura · Consultoría informática · Redes y soporte técnico · Venta de bienes tecnológicos · Otro. Los valores coinciden con los slugs de servicio + `bienes` + `otro` |
| Mensaje | `textarea` (6 filas) | Sí | 10–1000 caracteres; contador visible "N/1000" con `aria-live="polite"` que solo anuncia al acercarse al límite |
| Enviar por | `fieldset` + 2 `radio` | Sí | "WhatsApp" (por defecto) · "Correo electrónico" |

- Indicador de campos obligatorios: el texto "(obligatorio)" en la etiqueta, no solo un asterisco.
- Aviso antes del botón: "Al continuar, se abrirá WhatsApp o su aplicación de correo con el mensaje preparado. Este
  sitio no almacena sus datos. Consulte nuestra [política de privacidad](/privacidad/)."
- El botón de envío cambia de texto según el canal: "Continuar en WhatsApp" o "Continuar en correo".

### 8.2. Comportamiento

1. Sin JS: el formulario se muestra deshabilitado (`<fieldset disabled>`) con el mensaje `<noscript>`: "Para usar el
   formulario active JavaScript, o escríbanos directamente por los canales de arriba." Los canales de §6.8 funcionan
   sin JS.
2. Validación al enviar, con `novalidate` y validación propia:
   - Para cada campo inválido: `aria-invalid="true"`, mensaje bajo el campo (`id` referenciado en
     `aria-describedby`).
   - Arriba del formulario, un **resumen de errores** (`role="alert"`, h2 "Revise los siguientes campos") con
     enlaces a cada campo. El foco va al resumen.
   - Mensajes de error:

     | Caso | Mensaje |
     |---|---|
     | Nombre | "Ingrese sus nombres y apellidos (mínimo 3 caracteres)." |
     | Tipo | "Seleccione el tipo de requerimiento." |
     | Mensaje | "Escriba su mensaje (entre 10 y 1000 caracteres)." |

3. Construcción del mensaje en `src/lib/contact-message.ts`: funciones puras con pruebas. Usa los valores escritos
   por el usuario con `trim()` y espacios colapsados:

```
Hola, mi nombre es {nombre}{ — {entidad}}.
Tipo de requerimiento: {etiqueta del tipo}
{mensaje}

(Mensaje enviado desde bcscode.com)
```

4. WhatsApp: `https://wa.me/17178839161?text=${encodeURIComponent(mensaje)}`, abierto con
   `window.open(url, "_blank", "noopener")`.
5. Correo: `mailto:construyendosolucionesbcs@gmail.com?subject=${encodeURIComponent("Solicitud web: " + tipo)}&body=${encodeURIComponent(mensaje)}`,
   abierto con `location.href`.
6. Después de enviar, una región `role="status"` muestra: "Abrimos {WhatsApp|su aplicación de correo} con su
   mensaje. Si no se abrió, use este enlace: [Abrir WhatsApp|Abrir correo]" (el enlace lleva la URL construida). El
   formulario **no** se limpia.
7. **Prellenado por URL** (desde los botones "Solicitar cotización"):
   - `?tipo={slug}`: solo valores de la lista blanca (slugs de servicio, `bienes`, `otro`). Selecciona la opción.
   - `?categoria={slug}`: solo slugs de §7.2. Cuando `tipo=bienes`, el mensaje empieza con "Deseo cotizar:
     {nombre de la categoría}. ".
   - Cualquier valor fuera de la lista blanca se ignora. Nunca se usa `innerHTML` con datos de la URL.

---

## 9. SEO

### 9.1. Por página

- `<title>` y `<meta name="description">` según §7 y la tabla de §9.2.
- `<link rel="canonical">` absoluto con la barra final.
- `<meta name="robots" content="index,follow">`, salvo en la 404 (`noindex`).
- Open Graph:
  - `og:type` (`website` en Inicio, `article` en proyectos), `og:title`, `og:description`, `og:url`,
    `og:image` = `https://bcscode.com/og/default.png` (1200×630, con `og:image:alt`), `og:locale` = `es_PE`,
    `og:site_name` = "CSI – Construyendo Soluciones Informáticas".
  - `twitter:card` = `summary_large_image`.
- `<html lang="es-PE">`. Cuando exista inglés: `hreflang` (`es-PE`, `en`, `x-default`) mediante el componente SEO,
  ya preparado para recibir alternativas (§12).
- Un `h1` por página que contenga la keyword principal de la página.
- URLs en español, cortas, en minúsculas y con guiones.

### 9.2. Títulos y descripciones de las páginas fijas

| Ruta | `<title>` | Descripción |
|---|---|---|
| `/` | Construyendo Soluciones Informáticas \| Software, IA y TI | Empresa de Huaraz, Áncash, especializada en consultoría informática, desarrollo de software a medida, inteligencia artificial y venta de bienes tecnológicos. |
| `/servicios/` | Servicios de consultoría y desarrollo de software \| CSI | Consultoría informática, desarrollo de software a medida, IA, portales web, sistemas de gestión, cloud, redes y soporte para entidades y empresas. |
| `/productos/` | Venta de equipos de cómputo y tecnología \| CSI | Venta de equipos de cómputo, servidores, redes, impresoras, software y licencias para entidades públicas y empresas. Proveedor inscrito en el RNP. |
| `/proyectos/` | Proyectos y casos de éxito \| CSI | Casos de éxito en inteligencia artificial, sistemas de gestión y portales web para la CSJ Áncash, INAIGEM, UNASAM y Yamaha Perú. |
| `/nosotros/` | Nosotros: empresa de soluciones informáticas \| CSI | Conozca a Construyendo Soluciones Informáticas E.I.R.L., empresa de Huaraz fundada en 2020, inscrita en el RNP como proveedor de bienes y servicios. |
| `/contacto/` | Contacto y cotizaciones \| CSI | Solicite una cotización por WhatsApp, llamada o correo. Atendemos a instituciones públicas y empresas privadas. |
| `/libro-de-reclamaciones/` | Libro de Reclamaciones \| CSI | Registre su reclamo o queja ante Construyendo Soluciones Informáticas E.I.R.L. |
| `/privacidad/` | Política de privacidad \| CSI | Cómo tratamos la información que usted nos comparte. Este sitio no usa cookies ni analítica. |
| `/accesibilidad/` | Declaración de accesibilidad \| CSI | Nuestro compromiso con la accesibilidad web: este sitio se diseñó para cumplir WCAG 2.2 nivel AA. |
| `/404` | Página no encontrada \| CSI | — |

### 9.3. Datos estructurados (JSON-LD, generados en `src/lib/jsonld.ts`)

- **Todas las páginas**: `Organization`:
  - `@id`: `https://bcscode.com/#organization`.
  - `name`: "Construyendo Soluciones Informáticas E.I.R.L.".
  - `legalName`: igual al `name`.
  - `alternateName`: ["CSI", "Building Computer Solutions"].
  - `url`.
  - `logo`: PNG de 512 px.
  - `taxID`: "20606674415".
  - `foundingDate`: "2020".
  - `founder`: `Person` con `name` (Gerente General), `jobTitle` "Gerente General", `image` (URL absoluta de la foto
    optimizada, si existe) y `sameAs` [LinkedIn, GitHub].
  - `address`: `PostalAddress` con **solo** `addressLocality` "Huaraz", `addressRegion` "Áncash" y
    `addressCountry` "PE".
  - `areaServed`: "PE".
  - `email`.
  - `contactPoint`: [{ `contactType`: "sales", `telephone`: "+1-717-883-9161", `availableLanguage`: "es" },
    { `contactType`: "customer service", `telephone`: "+51-975-114-780", `availableLanguage`: "es" }].
  - `sameAs`: [Facebook, YouTube].
- **Inicio**: además, `WebSite` (`name`, `url`, `inLanguage` "es-PE", `publisher` → `#organization`).
- **Servicio**: `Service` (`name`, `description`, `serviceType`, `provider` → `#organization`, `areaServed` "PE").
- **Productos**: `OfferCatalog` con un `itemListElement` por categoría (`Offer` con `itemOffered` `Product`
  {`name`}), sin precios.
- **Proyecto**: `CreativeWork` (`name`, `about`, `dateCreated` = `date`, `creator` → `#organization`).
- **Páginas internas**: `BreadcrumbList`.
- Valida con el validador de Schema.org (manual, en el Tramo 4).

### 9.4. Mapa de keywords (español, Perú)

| Página | Keyword principal | Secundarias |
|---|---|---|
| Inicio | empresa de soluciones informáticas en Huaraz | consultoría informática Áncash, desarrollo de software Perú, inteligencia artificial, proveedor del Estado tecnología |
| Servicios | servicios de consultoría y desarrollo de software | servicios informáticos para empresas, servicios TI para el sector público |
| Cada servicio | ver `keywords` en §7.1 | — |
| Productos | venta de equipos de cómputo | venta de computadoras Huaraz, venta de servidores, venta de impresoras, licencias de software, equipos de red, proveedor RNP bienes informáticos |
| Proyectos | casos de éxito en desarrollo de software | inteligencia artificial en el Poder Judicial, mesa de partes virtual accesible, sistema de gestión documental |
| Nosotros | empresa de software en Huaraz | Construyendo Soluciones Informáticas E.I.R.L., Building Computer Solutions, RUC 20606674415 |
| Contacto | cotización de software y equipos | contacto empresa de software, WhatsApp |

Reglas: las keywords se integran de forma natural en el h1, los h2, el primer párrafo, el `alt`, el título y la
descripción. Sin relleno de keywords y **sin `<meta name="keywords">`**.

### 9.5. Archivos

- `robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://bcscode.com/sitemap-index.xml
  ```
- Sitemap: generado por `@astrojs/sitemap` (excluye la 404 y los borradores).
- `site.webmanifest`: `name` "CSI – Construyendo Soluciones Informáticas", `short_name` "CSI", íconos de 192 y
  512, `theme_color` `#2274B9`, `background_color` `#F6F9FC`, `display` `browser`.
- Favicons: `favicon.svg` (isotipo recortado), `favicon-32.png` y `apple-touch-icon.png` (180, con fondo blanco y
  margen del 12 %).
- Imagen OG `og/default.png` (1200×630):
  - Fondo `#F6F9FC` con retícula de puntos.
  - Isotipo a la izquierda.
  - Texto "Construyendo Soluciones Informáticas" (Sora 700, `#0E1E33`) + "Software · Inteligencia artificial ·
    Tecnología" (`#475A6E`) + la barra con el degradado de marca.
  - Se genera con `scripts/generate-brand-assets.mjs` (sharp, SVG → PNG) y se versiona en git.

---

## 10. Accesibilidad (WCAG 2.2 AA): requisitos verificables

| Criterio | Requisito concreto |
|---|---|
| 1.1.1 | Imágenes informativas con `alt`. Decorativas con `alt=""` o `aria-hidden="true"`. Los íconos de los botones solo-ícono tienen nombre accesible |
| 1.3.1 | Regiones (`header`, `nav` con `aria-label` distinto cuando hay más de una, `main#contenido`, `footer`), encabezados en orden, listas reales, `dl` para fichas, `<table>` solo para datos |
| 1.3.5 | `autocomplete` en los campos personales |
| 1.4.1 | El enlace activo y los errores no dependen solo del color (subrayado, ícono, texto) |
| 1.4.3 / 1.4.11 | Contrastes de §4.2: texto ≥ 4.5:1, texto grande ≥ 3:1, controles y foco ≥ 3:1. `--brand-cyan` nunca es portador de información |
| 1.4.4 / 1.4.10 | Zoom al 200 % sin pérdida. Reflujo a 320 px sin desplazamiento horizontal (prueba automatizada) |
| 1.4.12 | Sin alturas fijas que corten el texto |
| 1.4.13 | El desplegable no se abre con hover. Los tooltips (si los hubiera) se pueden descartar con Escape |
| 2.1.1 / 2.1.2 | Todo es operable con teclado. Sin trampas de foco (el menú móvil encierra el foco solo mientras está abierto y se cierra con Escape) |
| 2.3.3 | `prefers-reduced-motion` respetado |
| 2.4.1 | Enlace "Saltar al contenido principal" |
| 2.4.2 | Títulos de página únicos y descriptivos |
| 2.4.3 | Orden de foco lógico. Al abrir el menú o el desplegable, el foco no salta inesperadamente |
| 2.4.4 | Enlaces con propósito claro. Los "Conocer más" llevan contexto (`aria-describedby` hacia el título de la tarjeta, o texto `sr-only`) |
| 2.4.7 / 2.4.11 | Foco visible (§4.7) y no tapado por el encabezado fijo ni por el botón flotante |
| 2.5.3 | El nombre accesible contiene el texto visible |
| 2.5.8 | Objetivos táctiles ≥ 24×24 px (meta del proyecto: 44×44 en los controles principales) |
| 3.1.1 / 3.1.2 | `lang="es-PE"`. "Building Computer Solutions" y otros términos en inglés envueltos en `<span lang="en">` cuando son frases |
| 3.2.6 | Contacto en el mismo lugar en todas las páginas (pie) |
| 3.3.1 / 3.3.2 / 3.3.3 | Etiquetas visibles, instrucciones, errores en texto con sugerencia, resumen de errores |
| 4.1.2 | `aria-expanded`, `aria-pressed`, `aria-current` y `aria-controls` correctos |
| 4.1.3 | Mensajes de estado con `role="status"` (filtro, resultado del formulario) |

Pruebas: axe sin infracciones (etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) en **todas las
rutas**, en **ambos temas** y en **ambos proyectos** (móvil y escritorio). Además, revisión manual con teclado y
lector de pantalla (NVDA + Firefox o Chrome) en el Tramo 4, con hallazgos en `docs/PROGRESO.md`.

---

## 11. Rendimiento

- Presupuestos por página (móvil): JS ≤ 20 KB gzip; CSS ≤ 35 KB gzip; peso total de Inicio ≤ 450 KB;
  fuentes ≤ 2 archivos woff2 en la primera carga.
- Lighthouse (móvil, en producción): Rendimiento ≥ 95; Accesibilidad 100; Buenas prácticas 100; SEO 100.
- Core Web Vitals objetivo: LCP < 2.0 s; CLS < 0.05; INP < 200 ms.
- Cada `img` lleva `width`/`height`. El visual del hero no es imagen raster. Sin JS de bloqueo.
- Precarga solo de la fuente Inter latin (peso variable).

---

## 12. Preparación para inglés (sin construirlo en v1)

- `astro.config` con `i18n` (`defaultLocale: "es"`, sin prefijo).
- Todo texto de interfaz reutilizable (navegación, botones, etiquetas, mensajes de error y de estado, títulos de
  sección repetidos) en `src/i18n/es.ts`, como un objeto tipado `ui` con un helper `t(key)` en
  `src/i18n/index.ts`. Un `en.ts` futuro debe tener el mismo tipo (`satisfies typeof es`).
- Las colecciones admitirán un campo opcional `lang` (por defecto `"es"`), de modo que mañana puedan coexistir
  `services/en/*.md`.
- El componente SEO acepta `alternates: { lang: string; href: string }[]` (vacío en v1).
- Las rutas futuras irán en `src/pages/en/…` (por ejemplo, `/en/services/…`). Ningún enlace se arma a mano: usa un
  helper `localizedPath(path, lang)`.

---

## 13. Estructura del layout base (`BaseLayout.astro`)

Props:
```ts
{
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  breadcrumbs?: { name: string; href: string }[];
  jsonLd?: object[];
  hideCtaFab?: boolean;
}
```

Orden en `<head>`:
1. `<meta charset>`.
2. Viewport.
3. Script de tema en línea.
4. `<title>` y las metas.
5. `color-scheme` y `theme-color`.
6. Canonical, OG y Twitter.
7. Precarga de Inter.
8. Íconos y manifest.
9. JSON-LD.

`<body>`: SkipLink → Header → (Breadcrumbs) → `<main id="contenido" tabindex="-1">` → Footer → WhatsAppFab.

---

## 14. Interactividad: inventario de scripts

| Script | Dónde | Tamaño objetivo |
|---|---|---|
| Inicialización del tema (inline) | `<head>` | < 0.5 KB |
| ThemeToggle | Header | < 1 KB |
| Desplegable de Servicios + menú móvil | Header | < 3 KB |
| Filtro de proyectos | `/proyectos/` | < 2 KB |
| Formulario de contacto | `/contacto/` | < 4 KB |

Todo en TypeScript con tipos estrictos, sin dependencias en tiempo de ejecución y escrito como mejora progresiva.

---

## 15. Contenido gráfico: tareas del script `generate-brand-assets.mjs`

1. Lee `src/assets/brand/csi-mark.svg` (ya limpio y recortado).
2. Genera:
   - `public/favicon.svg` (copia optimizada).
   - `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png` e `icon-512.png`.
   - `public/brand/csi-logo-512.png` (para el JSON-LD).
   - `public/og/default.png` (a partir de un SVG compuesto en el propio script; el texto usa las fuentes
     instaladas en Fontsource. Si sharp no puede incrustar la fuente, convierte el texto a trazos o usa la de
     sistema y documéntalo).
3. Es idempotente. Se ejecuta a mano (`npm run brand:assets`) y los resultados se versionan en git. No forma parte del
   `build`.

---

## 16. Despliegue en el VPS

### 16.1. Contexto del servidor (verificar antes de actuar)

| Elemento | Detalle |
|---|---|
| Servidor | VPS de Hostinger (Ubuntu 24.04) del propietario, IP `<IP_DEL_VPS>`. **Confírmala con el propietario.** El valor real vive solo en la spec original del workspace (fuera del repositorio) y nunca se escribe en archivos de `csi-web/` |
| Traefik | v2.11 ya en marcha (proveedor Docker), con entrypoint `websecure` y certresolver `myresolver`, en la red Docker `onedoy_app-network` (proyecto de `<RUTA_PROYECTO_TRAEFIK>`) |
| Otros sitios | Otras apps ya corren en subdominios de `bcscode.com` |

**Reglas**:
- No tocar `<RUTA_PROYECTO_TRAEFIK>`.
- No ejecutar `docker system prune -a` ni `docker volume prune`.
- No publicar puertos nuevos.
- Usar nombres únicos `csi-web*`.

### 16.2. Archivos del repositorio

**`Dockerfile`**
```dockerfile
# syntax=docker/dockerfile:1
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.28-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
```

**`.dockerignore`**:
```
node_modules
dist
.astro
test-results
playwright-report
.git
.env
.env.*
docs
e2e
```

**`nginx/security-headers.conf`**:
```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "DENY" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'sha256-REEMPLAZAR_HASH_TEMA'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" always;
```

- HSTS **sin** `includeSubDomains` ni `preload` en v1, para no afectar a los otros subdominios.
- `REEMPLAZAR_HASH_TEMA` es el sha256 en base64 del contenido exacto del script de tema que queda en `dist/`.
  Calcúlalo con un script (`node -e` con `crypto`) y verifícalo con `build-output.spec.ts`.

**`nginx/default.conf`**:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    server_tokens off;
    absolute_redirect off;
    charset utf-8;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json application/xml image/svg+xml application/manifest+json;

    error_page 404 /404.html;

    location /_astro/ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        try_files $uri =404;
    }

    location ~* \.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2|webmanifest)$ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=604800" always;
        try_files $uri =404;
    }

    location / {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "no-cache" always;
        try_files $uri $uri/ =404;
    }
}
```

En nginx, un `add_header` dentro de un `location` anula los heredados. Por eso cada bloque incluye el snippet.

**`docker-compose.yml`**:
```yaml
name: csi-web

services:
  web:
    build: .
    image: csi-web:latest
    container_name: csi-web
    restart: always
    networks: [proxy]
    deploy:
      resources:
        limits:
          memory: 64M
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=onedoy_app-network"
      - "traefik.http.routers.csi-web.rule=Host(`bcscode.com`) || Host(`www.bcscode.com`)"
      - "traefik.http.routers.csi-web.entrypoints=websecure"
      - "traefik.http.routers.csi-web.tls.certresolver=myresolver"
      - "traefik.http.routers.csi-web.middlewares=csi-web-www-redirect"
      - "traefik.http.middlewares.csi-web-www-redirect.redirectregex.regex=^https://www\\.bcscode\\.com/(.*)"
      - "traefik.http.middlewares.csi-web-www-redirect.redirectregex.replacement=https://bcscode.com/$${1}"
      - "traefik.http.middlewares.csi-web-www-redirect.redirectregex.permanent=true"
      - "traefik.http.services.csi-web.loadbalancer.server.port=80"

networks:
  proxy:
    external: true
    name: onedoy_app-network
```

- `$$` escapa el `$` en compose.
- Traefik obtiene un certificado para los dos hosts de la regla.

### 16.3. Procedimiento (Tramo 4; cada paso, solo con autorización del propietario)

1. **Verificar el nombre de la red y los entrypoints de Traefik** en el VPS:
   - `docker inspect traefik --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}'`
   - `docker inspect traefik --format '{{json .Args}}'` (o revisar `command:` en el compose de `<RUTA_PROYECTO_TRAEFIK>`).

   Si los nombres difieren, ajusta `traefik.docker.network`, `networks.proxy.name`, `entrypoints` y `certresolver`.
2. **Verificar que nadie usa la raíz**:
   ```bash
   docker ps -q | xargs docker inspect --format '{{.Name}} {{json .Config.Labels}}' | grep -E 'Host\(`(www\.)?bcscode\.com`\)'
   ```
   La salida debe estar vacía.
3. **DNS en Hostinger** (hPanel → Dominios → `bcscode.com` → DNS):
   - Registro `A` `@` → IP del VPS, TTL de 300 durante el cambio.
   - `CNAME` `www` → `bcscode.com`.
   - Elimina los registros `A`, `AAAA` o `ALIAS` previos de `@` y `www` que apunten a otro destino (por ejemplo,
     una página de estacionamiento de Hostinger).
   - **No toques** MX, TXT ni los registros de los subdominios existentes.
   - Espera la propagación:
     - `Resolve-DnsName bcscode.com -Type A` (PowerShell) o `dig +short bcscode.com` → debe devolver la IP del VPS.
     - Lo mismo con `www`.
4. **Código en el VPS**:
   ```bash
   cd <RUTA_BASE_PROYECTOS> && git clone https://github.com/sygns13/csi-web.git csi-web && cd csi-web
   # Si el repositorio es privado: usar una deploy key de solo lectura (SSH) o un token de solo lectura.
   # Nunca guardes credenciales en el repositorio.
   docker compose config --quiet && echo OK
   docker compose up -d --build
   ```
5. **Verificaciones**:
   - `curl -sI https://bcscode.com/` → `200` + cabeceras de seguridad + `cache-control: no-cache`.
   - `curl -sI https://www.bcscode.com/` → `301` a `https://bcscode.com/`.
   - `curl -sI http://bcscode.com/` → redirección a `https`.
     - Si devuelve `404` de Traefik, no existe una redirección global. Agrega un router `csi-web-http` en el
       entrypoint `web` con el middleware `redirectscheme` (`scheme=https`, `permanent=true`).
   - `curl -sI https://bcscode.com/servicios` → `301` a `/servicios/`.
   - `curl -s -o /dev/null -w '%{http_code}' https://bcscode.com/no-existe/` → `404` (página propia).
   - `https://bcscode.com/sitemap-index.xml` y `/robots.txt` → `200`.
   - Consola del navegador sin infracciones de CSP en todas las páginas.
   - `docker compose logs traefik | grep -i acme`: sin errores de certificado.
6. **Después del despliegue**:
   - Lighthouse móvil en producción (registrar los resultados).
   - Validador de Schema.org.
   - El propietario da de alta el sitio en Google Search Console y Bing Webmaster Tools, y envía el sitemap.
7. **Actualizaciones futuras**: `cd <RUTA_DEL_PROYECTO> && git pull && docker compose up -d --build`.
8. Documenta todo en `docs/DESPLIEGUE.md`, con marcadores (`<IP_DEL_VPS>`, `<RUTA_DEL_PROYECTO>`) en lugar de datos
   reales del servidor.

---

## 17. Calidad y pruebas

### 17.1. Playwright

- `playwright.config.ts`:
  - `webServer`: `npm run build && npm run preview -- --port 4322`, con `reuseExistingServer` fuera de CI.
  - `baseURL`: `http://localhost:4322`.
  - Proyectos: `mobile` (Pixel 7) y `desktop` (Desktop Chrome).
  - Sin `@types/node`: los archivos de configuración no usan `process`.
- `playwright.docker.config.ts`: igual, pero sin `webServer` y con `baseURL` `http://localhost:8080`, para probar la
  imagen (`docker run --rm -p 8080:80 csi-web:latest`).

### 17.2. Suites

| Archivo | Verifica |
|---|---|
| `smoke.spec.ts` | Cada ruta de `e2e/routes.ts` responde, tiene un solo `h1`, `title` y descripción no vacíos y únicos, canonical correcto, sin enlaces internos rotos (`href` internos → 200) |
| `a11y.spec.ts` | axe sin infracciones en cada ruta × tema claro/oscuro (forzado con `localStorage` + `addInitScript`) × proyecto |
| `navigation.spec.ts` | Saltar al contenido. Desplegable de Servicios con teclado (Enter, Escape, foco devuelto). Menú móvil (apertura, Escape, foco). `aria-current` correcto |
| `theme.spec.ts` | Respeta `prefers-color-scheme` (`colorScheme` emulado). El botón alterna y persiste tras recargar. `aria-pressed` refleja el estado |
| `contact.spec.ts` | Errores y resumen. URL de WhatsApp y `mailto:` generadas exactamente según §8 (con `window.open` y `location` interceptados por `addInitScript`). Prellenado por `?tipo=bienes&categoria=servidores-y-almacenamiento`. Los valores fuera de la lista blanca se ignoran |
| `projects-filter.spec.ts` | Filtrar por sector muestra solo esos proyectos. Anuncio en `role="status"`. `?sector=` en la URL al cargar |
| `build-output.spec.ts` | Lee `dist/` con `fs`: (a) ningún `style=`; (b) el único `<script>` sin `src` y distinto de `application/ld+json` es el del tema; (c) su sha256 coincide con el de `nginx/security-headers.conf`; (d) ningún texto prohibido de §1.4. Lista de cadenas a vigilar: nombres de lenguajes, frameworks y proveedores de nube o de IA **dentro de `/proyectos/`**; en todo `dist/` y en todo el repositorio (excepto este archivo de prueba), la IP del VPS, el dominio del correo personal del Gerente y los nombres vetados de plataformas y proveedores de terceros (en la prueba van como hashes SHA-256, nunca en claro) |
| Reflujo | En cada ruta, a 320 px, `document.documentElement.scrollWidth <= 320` |

### 17.3. Revisiones manuales (Tramo 4)

- Teclado completo en Chrome, Firefox y Edge.
- NVDA.
- Zoom al 200 % y 400 %.
- Safari iOS y Chrome Android (dispositivos reales o emulación).
- Revisión ortográfica de todos los textos.

---

## 18. Plan de construcción por tramos

Cada tramo cabe en una sesión de contexto. Al inicio de cada sesión, quien construye lee esta spec completa y
`docs/PROGRESO.md`.

### Tramo 1: Fundaciones y sistema de diseño

1. Crea el proyecto Astro **dentro** del repositorio existente `E:\NewProyectos\2026\csi\workspace\csi-web` (D16;
   sin `git init`, conservando `.git`). Reemplaza el `README.md`. Copia esta spec a `docs/sitio-web-csi.spec.md`.
2. Instala las dependencias (§3.1) y configura `astro.config.mjs`, `tsconfig`, Prettier, `.editorconfig`, `.nvmrc`
   y los scripts.
3. Escribe `src/styles/global.css` con todos los tokens (§4.2), la tipografía (§4.3) y los estilos base (foco,
   `sr-only`, movimiento reducido, `scroll-padding`).
4. Recursos de marca: limpia y recorta el SVG (§4.1), escribe `generate-brand-assets.mjs` y genera los favicons y la
   imagen OG (§15).
5. `src/config/site.ts`, `src/i18n/*`, `src/lib/seo.ts` y `src/lib/jsonld.ts` (`Organization`, `WebSite`,
   `BreadcrumbList`).
6. `BaseLayout`, `SkipLink`, `Header` (desplegable + menú móvil), `ThemeToggle` + script de tema, `Footer`,
   `WhatsAppFab`, `Breadcrumbs`, `PageHeader`, `CtaBand`.
7. Componentes UI: `Button`, `Card`, `Badge`, `SectionHeading`, `Container`, `HexIcon`, `Icon`, `LinkArrow`.
8. Página **404** y una página temporal `/` con "Sitio en construcción" que use el layout, para probarlo.
9. `nginx/`, `Dockerfile`, `.dockerignore`, `docker-compose.yml` y el hash CSP del script de tema.
10. Playwright + axe con `e2e/routes.ts` (rutas existentes) y las suites `smoke`, `a11y`, `navigation`, `theme` y
    `build-output`.
11. `CLAUDE.md` del repositorio (resumen de reglas, comandos y estructura; la spec sigue siendo la fuente de verdad)
    y `docs/PROGRESO.md`.

**Criterios de aceptación**:
- `npm run build` sin errores.
- Pruebas en verde.
- Encabezado y pie correctos a 320, 768, 1024 y 1440 px en ambos temas.
- axe sin infracciones.

### Tramo 2: Contenido de servicios, productos e Inicio

1. `src/content.config.ts` con las colecciones `services`, `productCategories` y `projects` (esquemas de §7).
2. Carga **todo** el contenido de §7.1, §7.2 y §7.3 (los 14 proyectos, todos publicados). Mantén el campo `draft`
   en el esquema para usos futuros.
3. Componentes de sección: `ServiceCard`, `ServicesGrid`, `Stats`, `Process`, `WhyUs`, `ProductsGrid`,
   `HeroVisual`, `ProjectVisual` (las 8 variantes) y `ProjectCard`.
4. Páginas: Inicio completo (§6.1), `/servicios/` (§6.2), `/servicios/[slug]/` (§6.3) y `/productos/` (§6.4), con
   su JSON-LD.
5. Agrega las rutas a `e2e/routes.ts`. Todas las pruebas en verde.

**Criterios**: el contenido es idéntico al de la spec, las tarjetas son clicables y accesibles, la sección de
proyectos destacados de Inicio funciona (ya existe la colección) y axe no reporta infracciones.

### Tramo 3: Proyectos, institucional, contacto y legales

1. `/proyectos/` con filtro (§6.5) y `/proyectos/[slug]/` (§6.6), excluyendo los borradores.
2. `/nosotros/` (§6.7), con la foto del Gerente tomada de `E:\NewProyectos\2026\csi\workspace\imagenes\gerente\`
   (o el monograma temporal si aún no existe) y los enlaces a LinkedIn y GitHub.
3. `/contacto/` con el formulario y `src/lib/contact-message.ts` (§8).
4. `/libro-de-reclamaciones/`, `/privacidad/` y `/accesibilidad/` (§6.9–6.11).
5. Sitemap y `robots.txt`. Revisa los títulos y descripciones de §9.2.
6. Suites `contact` y `projects-filter`. Rutas completas.

**Criterios**: todas las rutas de §5.1 existen, pruebas en verde, presupuestos de §11 cumplidos (medidos con
Lighthouse local en `preview`).

### Tramo 4: QA final y despliegue

1. Auditoría completa:
   - axe y Lighthouse.
   - Revisiones manuales (§17.3).
   - Revisión de confidencialidad (§1.4) página por página.
   - Ortografía.
2. Correcciones.
3. Prueba de la imagen Docker local + `test:e2e:docker` + verificación de la CSP en el navegador.
4. Con autorización expresa del propietario, despliegue según §16.3 y verificaciones.
5. `docs/DESPLIEGUE.md` y el cierre de `docs/PROGRESO.md` con los pendientes [VALIDAR].

### Effort recomendado por tramo

| Tramo | Effort | Motivo |
|---|---|---|
| 1 | **xhigh** | Define el sistema de diseño, la accesibilidad base, el tema y la CSP. Un error aquí se arrastra a todo el sitio |
| 2 | **high** | Mucho contenido y componentes visuales con reglas claras |
| 3 | **high** | Lógica del formulario y del filtro con pruebas; páginas con copy definido |
| 4 | **high** | Auditoría y despliegue en un servidor con otras apps en producción: requiere cuidado, no creatividad |

---

## 19. Pendientes y supuestos (validar con el propietario)

| # | Tema | Estado |
|---|---|---|
| P1 | Ruta y repositorio | **Resuelto** (D16): `E:\NewProyectos\2026\csi\workspace\csi-web` |
| P2 | Proyecto de consentimientos (Yamaha) | **Resuelto** (D17): se publica |
| P3 | Foto y enlaces del Gerente | **Resuelto** (D18). **Acción del propietario**: dejar la foto en `E:\NewProyectos\2026\csi\workspace\imagenes\gerente\` antes del Tramo 3 |
| P4 | Visión y valores (§6.7) | **Pendiente de revisión** (D19): van marcados [VALIDAR]. Al construir `/nosotros/`, preséntalos al propietario para su confirmación o ajuste |
| P5 | Horario de atención | **Resuelto**: no se muestra |
| P6 | Textos legales (Libro de Reclamaciones y Privacidad) | **Pendiente**: borradores [VALIDAR] hasta su revisión legal |
| P7 | Tratamiento formal "usted" | **Resuelto**: confirmado |
| P8 | Cifras de Inicio ("+10 proyectos", "4 sectores") | **Resuelto**: confirmadas |
| P9 | IP del VPS (`<IP_DEL_VPS>`), red `onedoy_app-network` y certresolver `myresolver` | **Verificar en el Tramo 4** (tomados del despliegue previo del propietario) |
| P10 | Verificación en Google Search Console | **Acción del propietario** después del despliegue |
| P11 | Visibilidad del repositorio en GitHub | **Verificar**: si es público, mantener las reglas de §1.4 (sin datos del servidor en el repositorio); si es privado, configurar la deploy key en el VPS (§16.3) |

---

## Anexo A. Textos de interfaz (`src/i18n/es.ts`)

| Clave | Texto |
|---|---|
| `nav.home` | Inicio |
| `nav.services` | Servicios |
| `nav.products` | Productos |
| `nav.projects` | Proyectos |
| `nav.about` | Nosotros |
| `nav.contact` | Contacto |
| `nav.allServices` | Ver todos los servicios |
| `nav.menu` | Menú |
| `nav.close` | Cerrar menú |
| `nav.main` | Navegación principal |
| `nav.footer` | Navegación del pie de página |
| `nav.breadcrumb` | Ruta de navegación |
| `cta.quote` | Solicitar cotización |
| `cta.whatsapp` | Escribir por WhatsApp |
| `cta.call` | Llamar al 975 114 780 |
| `cta.email` | Enviar un correo |
| `cta.learnMore` | Conocer más |
| `cta.viewProjects` | Ver proyectos |
| `cta.viewAllProjects` | Ver todos los proyectos |
| `theme.toggle` | Modo oscuro |
| `a11y.skip` | Saltar al contenido principal |
| `a11y.newTab` | (se abre en una pestaña nueva) |
| `wa.defaultMessage` | Hola, me comunico desde la página web de CSI. |
| `fab.whatsapp` | Escríbanos por WhatsApp |
| `projects.filterLabel` | Filtrar por sector |
| `projects.all` | Todos |
| `projects.showing` | Mostrando {n} proyectos |
| `projects.prev` | Proyecto anterior |
| `projects.next` | Proyecto siguiente |
| `projects.context` | Contexto |
| `projects.solution` | Solución |
| `projects.contribution` | Aporte |
| `services.includes` | ¿Qué incluye? |
| `services.benefits` | Beneficios |
| `services.capabilities` | Capacidades tecnológicas |
| `services.capabilitiesNote` | Seleccionamos las tecnologías según las necesidades y el entorno de cada cliente. |
| `services.related` | Proyectos relacionados |
| `services.faq` | Preguntas frecuentes |
| `services.others` | Otros servicios |
| `form.required` | (obligatorio) |
| `form.errorsTitle` | Revise los siguientes campos |
| `form.sendWhatsapp` | Continuar en WhatsApp |
| `form.sendEmail` | Continuar en correo |
| `form.opened` | Abrimos {canal} con su mensaje. Si no se abrió, use este enlace: |
| `footer.rights` | Todos los derechos reservados. |
| `footer.rnp` | Inscrita en el Registro Nacional de Proveedores (RNP) |
| `footer.privacy` | Política de privacidad |
| `footer.accessibility` | Accesibilidad |
| `footer.complaints` | Libro de Reclamaciones |
| `404.title` | Página no encontrada |
| `404.text` | La página que busca no existe o fue movida. |
