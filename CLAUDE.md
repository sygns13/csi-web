# CLAUDE.md — csi-web

Guía corta para sesiones futuras. **La fuente de verdad es `docs/sitio-web-csi.spec.md`** (copia redactada de la
spec del workspace). Al empezar: lee la spec completa y `docs/PROGRESO.md`; ejecuta solo el tramo indicado (§18).

## Reglas

- No inventar contenido: todo texto visible sale de la spec. Si falta, `TODO(CONTENIDO): …` + registrarlo en PROGRESO.
- Confidencialidad (§1.4) por encima de todo: nada de stack por cliente, IPs, rutas del servidor, montos, nombres
  internos de plataformas ni datos personales. Nunca leer ni copiar `../documentos*` u otras carpetas del workspace
  (excepto los recursos gráficos de §4.1 y §6.7).
- Sin `git commit`/`push`, sin despliegues ni acceso al VPS salvo pedido expreso del propietario.
- Texto visible en español (Perú), trato de "usted". Código e identificadores en inglés.
- Al cerrar la sesión: actualizar `docs/PROGRESO.md`.

## Comandos

```bash
npm run build            # astro check + astro build (debe quedar sin errores ni advertencias)
npm run test:e2e         # construye, levanta preview en :4322 y corre Playwright (mobile + desktop)
npm run test:e2e:docker  # mismas pruebas + headers.spec.ts contra la imagen en :8080 (docs/DESPLIEGUE.md §5)
npm run format           # Prettier
npm run brand:assets     # favicons / OG (manual)
node scripts/csp-hash.mjs --write   # tras cambiar el script de tema
```

Node 24.22.3 es el global (PowerShell y Git Bash). Verificar con `node --version` al empezar.
En Git Bash, las rutas que empiezan con `/` como argumento se convierten a rutas de Windows: usar
`MSYS_NO_PATHCONV=1`.
**El repositorio es público**: nunca escribir datos confidenciales en ningún archivo (§1.4).
Astro 7 no admite dos `astro preview` a la vez: `npx astro preview stop` antes de `test:e2e`.

## Convenciones técnicas

- Estático, sin frameworks de UI; JS en `<script>` de componentes (TS estricto, ≤ 20 KB gzip por página).
- Colores **solo** con tokens (`bg-surface`, `text-text-muted`…, definidos en `src/styles/global.css`). La paleta por
  defecto de Tailwind está desactivada. Nada de hex en clases ni `style="…"`.
- Único script en línea: el de tema (`src/lib/theme-init.ts`). Si cambia, regenerar el hash CSP (la prueba
  `build-output` lo verifica).
- Datos de contacto solo desde `src/config/site.ts`; textos de interfaz en `src/i18n/es.ts` (`t()`); rutas con
  `localizedPath()`.
- Tailwind escanea solo `src/` (`source(none)` + `@source "../"`).
- Ojo: `hidden lg:inline-flex` sobre un componente cuya base ya tiene `inline-flex` no oculta (orden de utilidades):
  envolver en `<div class="hidden lg:block">`.
- Texto con varias expresiones (`{a} {b}`) en líneas separadas pierde el espacio al compilar: usar template literal.
- Enlaces externos: `target="_blank" rel="noopener noreferrer"` + ícono + `sr-only` "(se abre en una pestaña nueva)".
- Rutas nuevas: agregarlas a `e2e/routes.ts` (y quitarlas de `plannedRoutes`).
- Contenido en colecciones (`src/content.config.ts`, solo frontmatter). Acceso siempre vía `src/lib/content.ts`
  (filtra `lang` y `draft`, ordena, arma URLs: `serviceHref`, `projectHref`, `quoteHref`…). No editar el texto de
  las colecciones sin que lo diga la spec.
- Íconos: nombre en `src/components/ui/icon-names.ts` + componente en `icons.ts` (el `satisfies` exige ambos).
- Tarjeta clicable: `Card interactive` + enlace del título con `link-stretched` (el anillo de foco es de la
  tarjeta). `Card padded={false}` si el contenido maneja su relleno (no pasar `p-0`: choca con `p-6`).
- Maquetas (`visuals/mockups/*`): SVG 400×250 con clases de tokens (`fill-brand/15`…), sin IDs ni degradados.
- Cuadrículas de una columna en móvil: `grid-cols-1` explícito (evita desbordes por palabras largas a 320 px).
- Foto del Gerente: `src/assets/team/gerente.{jpg,png}` se detecta sola (`src/lib/team.ts`): `<Picture>` en
  /nosotros/ y `Organization.founder.image` en el JSON-LD. Sin foto, monograma "CC". El build falla si la foto no
  es cuadrada ≥ 800×800. El archivo original del propietario tiene un número en el nombre: siempre renombrarlo.
- Formulario de contacto: lógica pura en `src/lib/contact-message.ts` (sin `site` ni i18n, para que el script pese
  < 4 KB; los destinos llegan por `data-wa-me`/`data-email`). Pruebas en `e2e/contact.spec.ts`.
- Mostrar el correo con `<EmailText />` (corta en la "@") y `wrap-anywhere`, no `break-all`.
- Fechas de las páginas legales en `src/config/legal.ts` (actualizar solo al cambiar los textos).
- Frases en inglés dentro del texto (WCAG 3.1.2): lista en `src/lib/foreign-terms.ts`; `<LangText text={…} />` las
  envuelve en `<span lang="en">`. Ya lo usan `PageHeader`, `Breadcrumbs`, `ServiceCard`, `LinkArrow`, `HexList` y las
  capacidades. Solo frases (las palabras sueltas como software o backend no se marcan). Una prueba exige que cada
  frase de la lista aparezca marcada en alguna ruta.
- Fuentes: `"Inter Fallback"` y `"Sora Fallback"` (Arial con `size-adjust` y `*-override`, en `global.css`) evitan el
  CLS al cargar las woff2. Si cambian las fuentes, recalcular las métricas (fontkit: ancho medio y métricas
  verticales).
- `overflow-wrap: break-word` en `body`; un ítem flex o de cuadrícula con texto necesita `min-w-0` (o
  `grid-cols-1`) para que una palabra larga pueda partirse con texto grande o espaciado (WCAG 1.4.4/1.4.12). El
  logo puede ajustar su texto en varias líneas solo si falta espacio (el encabezado usa `min-h`, no `h`).
- El fondo del encabezado va al 97 %: con menos opacidad el texto `--brand` del logo baja de 4.5:1 sobre
  contenido oscuro (lo verifica `a11y.spec.ts`).
- Playwright con `javaScriptEnabled: false` en Chromium no renderiza `<noscript>`: verificar su contenido, no su
  visibilidad. `location.href = "mailto:…"` se intercepta con el evento `navigate` de la Navigation API.
- `e2e/headers.spec.ts` solo corre contra Docker (`baseURL` en :8080). Con la CSP real, `addStyleTag` falla: las
  pruebas que inyectan estilos usan `test.use({ bypassCSP: true })`.
- nginx: `.webmanifest` tiene una location propia (`types {}` + `default_type application/manifest+json`), porque
  el `mime.types` de nginx 1.28 no lo incluye.

## Estructura

`src/{config,i18n,lib,layouts,components/{layout,ui,sections,visuals},content,pages,styles,assets}`,
`src/content.config.ts`, `e2e/`, `scripts/`,
`nginx/`, `Dockerfile`, `docker-compose.yml`, `docs/`. Detalle en la spec §3.4.
