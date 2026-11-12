# Progreso — csi-web

Bitácora entre sesiones (§0, regla 8). La spec (`docs/sitio-web-csi.spec.md`) sigue siendo la fuente de verdad.

## Estado

| Tramo                                           | Estado                 | Fecha      |
| ----------------------------------------------- | ---------------------- | ---------- |
| 1. Fundaciones y sistema de diseño              | **Hecho** (sin commit) | 12/11/2026 |
| 2. Servicios, productos e Inicio                | **Hecho** (sin commit) | 12/11/2026 |
| 3. Proyectos, institucional, contacto y legales | Pendiente              | —          |
| 4. QA final y despliegue                        | Pendiente              | —          |

---

## Sesión 1 — Tramo 1 (12/11/2026)

### Hecho

1. Proyecto Astro dentro del repositorio existente (se conservó `.git`; README reemplazado). Copia **redactada** de
   la spec en `docs/sitio-web-csi.spec.md` (ver desviación D2).
2. Dependencias con versiones exactas (§3.1): astro 7.4.2, @astrojs/check 0.9.12, typescript 6.0.3, tailwindcss y
   @tailwindcss/vite 4.3.3, @playwright/test 1.64.1; adicionales: @astrojs/sitemap 3.7.4, @axe-core/playwright
   4.14.0, @fontsource-variable/inter y sora 5.3.0, @lucide/astro 1.72.0, sharp 0.35.5, prettier 3.10.0,
   prettier-plugin-astro 1.1.2, prettier-plugin-tailwindcss 0.8.1 y fontkit 3.0.0 (D9). Config: `astro.config.mjs`
   (§3.3), `tsconfig` estricto, Prettier, `.editorconfig`, `.nvmrc` (24), `engines`, scripts de §3.5.
3. `src/styles/global.css`: todos los tokens claro/oscuro (§4.2), escala tipográfica (§4.3), radios, contenedor,
   utilidades de motivos (`clip-hex`, `bg-brand-gradient`, `bg-dot-grid`, `shadow-card*`, `link`, `link-stretched`),
   foco visible, `scroll-padding`, movimiento reducido.
4. Marca: `src/assets/brand/csi-mark.svg` limpio (sin `<style>`, IDs `csi-g1…g8`, `role="img"` + `<title>`,
   `viewBox="81 60 444.5 465"`, verificado al renderizar: ~3 u de margen). Script `generate-brand-assets.mjs`
   generó `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (fondo blanco, 12 %), `icon-192/512.png`,
   `brand/csi-logo-512.png` y `og/default.png` (1200×630). `site.webmanifest` (§9.5).
5. `src/config/site.ts` (valores exactos §3.6), `src/i18n/{es,index}.ts` (Anexo A + claves de textos de la spec
   usados en layout; `t()` con parámetros y `localizedPath()`), `src/lib/{seo,jsonld,theme,theme-init,links,format}.ts`
   (`Organization`, `WebSite`, `BreadcrumbList`).
6. Layout: `BaseLayout` (orden de `<head>` §13), `SkipLink`, `Header` (desplegable _disclosure_ + menú móvil con
   foco circular, Escape, fondo inerte y bloqueo de scroll), `ThemeToggle` + script de tema, `Footer`,
   `WhatsAppFab`, `Breadcrumbs`, `PageHeader`, `CtaBand`, `Logo`, visuales `CircuitTraces` y `BrokenHexVisual`.
7. UI: `Button` (primario/secundario/fantasma, externo), `Card`, `Badge`, `SectionHeading`, `Container`, `HexIcon`,
   `Icon` (registro Lucide en `ui/icons.ts`), `BrandIcon`, `LinkArrow`.
8. Página `404` (§6.12) y `/` temporal "Sitio en construcción".
9. `nginx/default.conf`, `nginx/security-headers.conf` (hash CSP calculado:
   `sha256-DY5wqlASD1WVLWMUbdlcl1zK9YSYPaXOg0iGej/CiRs=`), `Dockerfile`, `.dockerignore`, `docker-compose.yml`,
   `scripts/csp-hash.mjs`.
10. Playwright (`mobile` Pixel 7 + `desktop`) con `e2e/routes.ts` y suites `smoke` (incluye reflujo a 320 px),
    `a11y` (axe, ambos temas, también con menú/desplegable abiertos), `navigation`, `theme` y `build-output`.
11. `CLAUDE.md` del repositorio, `docs/PROGRESO.md` y `docs/CREDITOS.md`.

### Verificación

- `npm run build`: 0 errores, 0 advertencias, 0 sugerencias (`astro check`).
- `npm run test:e2e`: **43 pasan, 9 omitidas** (omitidas por diseño: verificaciones estáticas solo en `desktop`,
  pruebas de escritorio/móvil en el otro proyecto y `/proyectos/` aún inexistente).
- `npm run format:check`: OK.
- Revisión visual (capturas) a 320, 768, 1024 y 1440 px en ambos temas: encabezado y pie sin desbordes; menú móvil
  y desplegable correctos.
- Presupuesto actual: JS 1.0 KB + 0.5 KB gzip; CSS 6.6 KB gzip; 2 woff2 (Inter y Sora latin).
- El detector de datos vetados se probó contra la spec original (detecta IP y términos) y la copia redactada (limpia).

### Desviaciones (con motivo)

- **D1. Node 24** (resuelto, 12/11/2026): por pedido del propietario se instaló **Node 24.22.3 (x64)** con nvm
  (`nvm install 24.22.3 64`; `nvm install 24` intentaba la variante arm64). **No** se cambió el Node global (sigue
  22.23.4, para no afectar otros proyectos): usar `nvm use 24.22.3`, o en PowerShell
  `$env:Path = "$env:APPDATA\nvm\v24.22.3;" + $env:Path`. Con Node 24 + npm 11.19.1 se verificó: build sin
  errores, 43 pruebas en verde, Prettier OK y el mismo hash CSP. `npm ci` falló una vez por un `.node` de Astro
  bloqueado por un proceso externo (editor o antivirus); se reparó con `npm install`. El `Dockerfile` usa
  `node:24-slim`. En Git Bash el `node` del PATH es v16.
- **D2. Copia redactada de la spec en `docs/`** (**aprobada** por el propietario): la spec original contiene la IP
  del VPS, rutas del servidor y nombres vetados, que §1.4/§3.4 prohíben en el repositorio. En la copia se
  reemplazaron por marcadores (`<IP_DEL_VPS>`, `<RUTA_…>`) y se añadió una nota al inicio. La original sigue en el
  workspace.
- **D3. `build-output.spec.ts` guarda los datos vetados como hashes SHA-256** (IP del VPS, dominio del correo
  personal y nombres de plataformas/proveedores de terceros), no en claro, porque el repositorio es **público**
  (P11). Recorre `dist/` y todo el repo.
- **D4. Tailwind escanea solo `src/`** (`@import "tailwindcss" source(none); @source "../";`): con la detección
  automática generaba clases basura desde `docs/` (p. ej. `bg-[#...]`).
- **D5. Paleta y sombras por defecto de Tailwind desactivadas** (`--color-*: initial`, `--shadow-*: initial`) para
  forzar el uso de tokens. Sombras vía utilidades `shadow-card` / `shadow-card-hover` (tokens `--shadow-sm/md`).
- **D6. Fuentes**: `@font-face` propias en `global.css` apuntando a los woff2 latin de Fontsource (importar el CSS
  de Fontsource cargaría todos los subconjuntos). La precarga de Inter usa el mismo archivo con hash.
- **D7. Retícula de puntos con CSS** (`radial-gradient`) en vez de `<pattern>` SVG: mismo resultado, sin IDs
  duplicados.
- **D8. Íconos de marca**: Lucide 1.x ya no incluye `linkedin`/`github`. GitHub, WhatsApp, Facebook y YouTube de
  Simple Icons (CC0); LinkedIn de `lucide-static` 0.499.0 (ISC). Ver `docs/CREDITOS.md`.
- **D9. `fontkit` (dev) para la imagen OG**: el FreeType de sharp no lee woff2, así que el texto se convierte a
  trazos con Sora/Inter reales (opción prevista en §15).
- **D10. `overrides: { "playwright-core": "1.64.1" }`**: `@axe-core/playwright` traía playwright-core 1.65 y
  rompía los tipos en `astro check`.
- **D11. nginx `location ^~ /_astro/`**: sin `^~`, la location regex de extensiones capturaba los `.woff2`/`.svg`
  con hash y perdían `immutable`.
- **D12. Espacio del botón flotante**: el espacio inferior de 96 px va dentro del pie (`Footer withFab`) en todos
  los anchos, en lugar de `padding-bottom` del `<body>` en < md (evita una franja clara bajo el pie oscuro y protege
  el foco también en escritorio). `scroll-padding-bottom: 88px` en `html` cuando hay botón.
- **D13. Encabezado en pantallas estrechas** (medido; logo + tema + "Menú" no caben; **aprobado** por el
  propietario):
  - < 640 px: botón "Menú" con ícono sobre el texto (el texto sigue visible).
  - < 400 px: el botón de tema pasa al panel del menú móvil, con texto visible "Modo oscuro" (§4.8 permite el tema
    "en el menú móvil").
  - Entre 1024 y 1279 px: navegación compacta (15 px, menos padding y gaps) para caber a 1024 (39 px de holgura).
    Texto del logo 15 px hasta xl y 16 px desde 1280. Separación isotipo-texto 10 px (≥ 25 % del ancho del isotipo).
- **D14. Fondo difuminado del encabezado en una capa hija**: `backdrop-filter` en `<header>` crea un bloque
  contenedor para `position: fixed` y rompía el panel móvil.
- **D15. Servicios del menú y del pie en `src/config/navigation.ts`** (copia textual de §7.1) hasta que exista la
  colección `services`. TODO(Tramo 2): derivarlos con `getCollection` y borrar la copia. El desplegable muestra el
  `summary` recortado a una línea (`line-clamp-1`).
- **D16. `aria-current`**: `"page"` en el enlace de la página exacta; `"true"` en la sección contenedora (botón
  Servicios en `/servicios/*`, Proyectos en `/proyectos/{slug}/`). Indicador visual: subrayado de 2 px en `--brand`.
- **D17. Prueba de enlaces internos**: los enlaces a rutas aún no construidas (`plannedRoutes` en `e2e/routes.ts`)
  se toleran hasta su tramo. TODO(Tramo 3): la lista debe quedar vacía.
- **D18. Playwright `reuseExistingServer: true`**: sin `process` no se puede detectar CI. Astro 7 no permite dos
  `astro preview` simultáneos: si hay uno abierto, `npx astro preview stop`.
- **D19. Página 404**: sin `<link rel="canonical">` (es `noindex`); incluye la `CtaBand` (§6.1 S10: "todas las páginas
  excepto Contacto").
- **D20. `theme-color`**: si el usuario elige un tema, el script del botón actualiza las metas `theme-color` para que
  la barra del navegador coincida.

### Pendientes para próximos tramos

- Tramo 2: colecciones (`content.config.ts`), contenido §7.1–7.3, secciones de Inicio, `/servicios/`,
  `/servicios/[slug]/`, `/productos/`, JSON-LD `Service`/`OfferCatalog`; reemplazar `/` temporal; mover rutas de
  `plannedRoutes` a `routes`; derivar `servicesNav` de la colección (D15).
- Tramo 3: `public/robots.txt` (§9.5; el sitemap ya se genera), foto del Gerente en `Organization.founder.image`
  (`organization({ founderImage })`), resto de rutas y suites `contact` y `projects-filter`.
- Tramo 4: probar la imagen Docker (`nginx -t`, tipo MIME de `.webmanifest`, cabeceras) y `test:e2e:docker`.

### Acciones del propietario

- **Foto del Gerente (P3)**: la imagen actual en `imagenes/gerente/` mide **340×402** (no cuadrada, menor a
  800×800). Se necesita una cuadrada ≥ 800×800, rostro centrado y fondo neutro antes del Tramo 3. Al copiarla se
  renombrará a `src/assets/team/gerente.{ext}` (el nombre de archivo actual contiene un número identificador que no
  debe entrar al repositorio).

### Decisiones del propietario (12/11/2026)

- **P11 resuelto: el repositorio en GitHub es público.** Se mantienen estrictas las reglas de §1.4: ningún archivo
  del repo contiene IP, rutas del servidor, credenciales ni nombres vetados. En el VPS se puede clonar por HTTPS sin
  deploy key (Tramo 4).
- D2 (copia redactada de la spec) y D13 (tema dentro del menú en < 400 px) aprobados.
- Node 24 instalado (D1).

### Textos [VALIDAR] (pendientes de validación del propietario)

Aún no publicados (se construyen en el Tramo 3), se listan para seguimiento:

- `/nosotros/`: Visión y Nuestros valores (§6.7, D19/P4).
- `/contacto/`: "Atendemos a instituciones públicas y empresas privadas." (§6.8).
- `/libro-de-reclamaciones/` y `/privacidad/`: textos legales completos (§6.9, §6.10, P6), pendientes de asesoría
  legal.

### TODO(CONTENIDO)

- Ninguno en este tramo.

---

## Sesión 2 — Tramo 2 (12/11/2026)

### Hecho

1. `src/content.config.ts` con las colecciones `services`, `productCategories` y `projects` (esquemas de §7, `glob`
   loader, Zod de `astro/zod`). Campo `lang` opcional (por defecto `"es"`, §12) y `draft` en proyectos. `icon`
   validado contra los íconos registrados; `services` de proyectos con `reference("services")` y verificación
   adicional en `getProjects()` (el build falla si un slug no existe).
2. Contenido completo, **idéntico a la spec**: 7 servicios (`src/content/services/*.md`), 8 categorías
   (`src/content/product-categories/*.yaml`) y los 14 proyectos (`src/content/projects/*.md`, todos
   `draft: false`). Se generó con un script a partir del texto de §7 (sin transcripción manual; el script no se
   versiona).
3. `src/lib/content.ts`: `getServices`, `getProductCategories`, `getProjects` (sin borradores, por fecha
   descendente), `getFeaturedProjects`, `getProjectsByService`, `serviceHref`, `projectHref`,
   `productCategoryHref`, `quoteHref` (`/contacto/?tipo=…&categoria=…`), `sectorLabel`, `clientShortName`.
   `src/config/taxonomy.ts` (sectores y variantes de maqueta). JSON-LD nuevo en `src/lib/jsonld.ts`: `Service` y
   `OfferCatalog`.
4. **D15 resuelto**: el desplegable y el pie derivan los servicios de la colección (`getServices()` en `Header` y
   `Footer`); se borró la copia `servicesNav` de `src/config/navigation.ts`.
5. Componentes de sección: `ServiceCard` (variantes `compact` y `large`), `ServicesGrid`, `OtherNeeds` (celda 8 y
   bloque "Otros requerimientos"), `Stats`, `Process`, `WhyUs`, `ProductsGrid`, `ProjectCard`. Visuales:
   `HeroVisual` y `ProjectVisual` con las 8 variantes (`visuals/mockups/*Mock.astro` + `MockWindow`). UI:
   `HexList` (viñetas hexagonales). `Card` (prop `padded` y anillo de foco de tarjeta), `HexIcon` (prop `tone`),
   `Icon` (props `x`/`y` para anidarlo en SVG). Textos reutilizables nuevos en `src/i18n/es.ts` (pasos de "Cómo
   trabajamos", etiquetas de sector, "¿Necesita otra solución?", etc.).
6. Páginas: Inicio completo (§6.1, S1–S10; reemplaza la página temporal), `/servicios/` (§6.2),
   `/servicios/[slug]/` (§6.3, 7 páginas) y `/productos/` (§6.4), con su JSON-LD (`WebSite`, `Service`,
   `OfferCatalog`, `BreadcrumbList` + `Organization`).
7. `e2e/routes.ts`: las 10 rutas construidas pasan a `routes`; `plannedRoutes` conserva las del Tramo 3 más los 14
   detalles de proyecto (las tarjetas ya enlazan a ellos). Nueva suite `e2e/content.spec.ts`.

### Verificación

- `npm run build`: `astro check` 0 errores, 0 advertencias, 0 sugerencias; build sin advertencias (11 páginas).
- `npm run test:e2e`: **121 pasan, 9 omitidas** (omitidas por diseño, igual que en el Tramo 1). axe sin
  infracciones en las 10 rutas + 404, en ambos temas y en `mobile` y `desktop`; reflujo a 320 px sin desplazamiento
  horizontal en todas las rutas.
- `npm run format:check`: OK.
- Contenido: un script comparó los 665 bloques de texto visibles de `<main>` de las 10 páginas con la spec: todos
  coinciden literalmente (salvo mayúsculas iniciales, ver D22).
- Capturas a 320, 768, 1024 y 1440 px en ambos temas de `/`, `/servicios/`, `/servicios/inteligencia-artificial/`,
  `/servicios/redes-y-soporte/` y `/productos/` (40 capturas, fuera del repositorio): sin desbordes; menú,
  tarjetas, maquetas y tema oscuro correctos.
- Presupuesto (§11), Inicio: JS 1.3 KB gzip (2 scripts: encabezado y tema), CSS 7.9 KB gzip, HTML 18 KB gzip,
  2 woff2 (80 KB). Primera carga ≈ 115 KB (límite 450 KB).
- Sitemap: 10 URLs (sin la 404).

### Desviaciones (con motivo)

- **D21. Tres títulos SEO de la spec acortados** (**aprobado** por el propietario, 12/11/2026): medían más de
  los 60 caracteres que pide §7.1. Se acortaron solo quitando palabras del original (se conservan la keyword, el
  cliente y "| CSI"); el esquema vuelve a exigir ≤ 60:
  - `inteligencia-artificial`: "Inteligencia artificial, chatbots y asistentes virtuales | CSI" (62) →
    "Inteligencia artificial y asistentes virtuales | CSI" (52).
  - `portal-fec-unasam`: "Portal de la Facultad de Economía y Contabilidad – UNASAM | CSI" (63) → "Portal de
    Economía y Contabilidad – UNASAM | CSI" (48).
  - `consentimientos-datos-personales-yamaha`: "Gestión de consentimientos de datos personales – Yamaha | CSI"
    (61) → "Gestión de consentimientos – Yamaha | CSI" (41).

  La spec original (workspace) y la copia de `docs/` se actualizaron a la versión 1.2 con estos títulos y la
  decisión D21 en su §2.

- **D22. `benefits`**: la spec los escribe como "Título: texto"; se separaron en `{ title, text }` y el texto
  empieza con mayúscula ("El software se adapta…") porque va solo en la tarjeta.
- **D23. Cliente en tarjetas**: `client` guarda el nombre completo de la tabla "Nombres de cliente" (§7.3); las
  tarjetas muestran la parte anterior a " – " ("INAIGEM", "UNASAM"). P11 ("UNASAM – Facultad de Economía y
  Contabilidad") se muestra como "UNASAM" en tarjetas.
- **D24. Maquetas en SVG escalable** (`viewBox` 400×250) con colores por clases de tokens (`fill-*`, `stroke-*`),
  sin IDs ni degradados SVG, para que puedan repetirse en una página. `HeroVisual` anida las maquetas de panel y de
  chat. El texto "IA" de la maqueta de chat usa `--on-primary` sobre `--primary` (≥ 6.14:1).
- **D25. Íconos no fijados por la spec** (decorativos, Lucide; los de "¿Por qué elegirnos?" **aprobados** por el
  propietario): "¿Por qué elegirnos?" → `shield-check`,
  `landmark`, `sparkles`, `award`, `handshake`; "¿Necesita otra solución?" → `lightbulb`; maquetas → `bot`, `send`,
  `file-text`, `pen-line`, `circle-check`, `search`, `image`, `lock`, `cloud`.
- **D26. Foco en tarjetas clicables**: el anillo de foco del enlace extendido se dibuja alrededor de toda la
  tarjeta (`Card interactive` con `:has(.link-stretched:focus-visible)`); el enlace pierde su propio `outline` solo
  si el navegador soporta `:has()`.
- **D27. "Conocer más" / "Ver detalle del servicio"**: contexto con texto `sr-only` (opción de §10, 2.4.4). Chrome
  calcula el nombre como "Conocer más : {título}" (espacio antes de los dos puntos por el `sr-only` absoluto); no
  afecta la comprensión. El título de la tarjeta también es enlace (enlace extendido, §4.7), así que cada tarjeta
  tiene dos paradas de tabulación hacia la misma página.
- **D28. Cifras (S5) sin encabezado**: la spec no da un h2; se usa `<div>` con el `<dl>` (no `<section>`).
- **D29. Proyectos destacados en 2×2** (en lugar de 4 columnas en ≥ xl): a 4 columnas los títulos ocupaban
  5 líneas.
- **D30. Fondos alternos** en el detalle de servicio según las secciones presentes (capacidades y proyectos
  relacionados son opcionales). "Redes y soporte" no muestra "Proyectos relacionados" (ningún proyecto lo
  referencia) ni "Capacidades" (§7.1 no las define), como pide §6.3.
- **D31. "Otros servicios"**: los 3 siguientes por `order`, de forma circular.
- **D32. `/servicios/`**: "tarjetas grandes alternadas" = columnas invertidas en las tarjetas pares (≥ lg); la vista
  previa de `includes` va en un panel `--surface-2`. `Process` usa fondo `--surface-2` aquí para alternar con
  "Otros requerimientos".
- **D33. `/productos/` "Servicios complementarios"**: la spec no da texto de enlace; se usa el título del servicio
  enlazado ("Redes, soporte técnico y mantenimiento"), tomado de la colección. Lleva h2 "Servicios
  complementarios".
- **D34. Cuadrículas con `grid-cols-1` explícito** en móvil: sin él, la palabra más larga de un título
  ("telecomunicaciones") fijaba el ancho mínimo de la pista y desbordaba a 320 px. En `/productos/`, el ícono va
  sobre el título en < 400 px.
- **D35. Suite extra `e2e/content.spec.ts`** (no listada en §17.2): verifica secciones de Inicio, tarjetas
  clicables en toda su superficie, enlaces de cotización prellenados, "Otros servicios", `<details>` de preguntas
  frecuentes, anclas de `/productos/` sin quedar bajo el encabezado y el JSON-LD `Service`/`OfferCatalog`.
- **D36. Textos reutilizados** (pasos de `Process`, "¿Necesita otra solución?", sectores) en `src/i18n/es.ts`; el
  copy exclusivo de una página (hero, cifras, "¿Por qué elegirnos?", productos) queda en la página, porque una
  versión en inglés tendrá sus propias páginas en `src/pages/en/` (§12).
- **D37. Node**: el Node global ya es 24.22.3 (también en Git Bash); no hace falta `nvm use` ni cambiar el `PATH`.

### Pendientes para próximos tramos

- Tramo 3: `/proyectos/` y `/proyectos/[slug]/` (las tarjetas de Inicio y de servicios ya enlazan a los 14
  detalles, hoy en `plannedRoutes`). `ProjectCard` ya admite `headingLevel={2}`; falta agregar la insignia de año y
  hasta 2 insignias de servicios (§6.5). El filtro debe usar `sectorLabel()` y `sectors` de
  `src/config/taxonomy.ts`. Los botones "Solicitar cotización" ya generan `?tipo=` y `?categoria=` con los slugs
  de la lista blanca de §8.2.
- Tramo 3: lo ya listado en la sesión 1 (`robots.txt`, foto del Gerente, contacto, legales, suites `contact` y
  `projects-filter`); al terminar, `plannedRoutes` debe quedar vacía.
- Tramo 4: revisar si términos en inglés del contenido ("machine learning", "Prompt engineering") requieren
  `<span lang="en">` (§10, 3.1.2); hoy se tratan como tecnicismos.

### Decisiones del propietario (12/11/2026, cierre de la sesión 2)

- Acortar los tres títulos SEO de más de 60 caracteres (aplicado, D21).
- Íconos de "¿Por qué elegirnos?" aprobados (D25).

### Textos [VALIDAR]

- Ninguno nuevo publicado en este tramo (los de §6.7–6.10 siguen pendientes para el Tramo 3, ver sesión 1).

### TODO(CONTENIDO)

- Ninguno: todo el texto de las páginas del Tramo 2 está en la spec.
