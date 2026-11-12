# csi-web

Sitio web corporativo de **Construyendo Soluciones Informáticas E.I.R.L.** (<span lang="en">Building Computer
Solutions</span>), publicado en `https://bcscode.com`.

Sitio estático, sin backend: Astro 7 + TypeScript estricto + Tailwind CSS 4, servido por nginx en Docker detrás
de Traefik.

La fuente de verdad es [`docs/sitio-web-csi.spec.md`](docs/sitio-web-csi.spec.md). El avance entre sesiones está en
[`docs/PROGRESO.md`](docs/PROGRESO.md).

## Requisitos

- Node.js ≥ 22.23.4 (recomendado 24 LTS, ver `.nvmrc`).
- Para las pruebas: navegador Chromium de Playwright (`npx playwright install chromium`).
- Para el despliegue: Docker y Docker Compose.

## Comandos

| Comando                                   | Qué hace                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `npm install`                             | Instala dependencias (versiones exactas)                                                 |
| `npm run dev`                             | Servidor de desarrollo                                                                   |
| `npm run build`                           | `astro check` + build estático en `dist/`                                                |
| `npm run preview`                         | Sirve `dist/` localmente                                                                 |
| `npm run format` / `npm run format:check` | Prettier (con plugins de Astro y Tailwind)                                               |
| `npm run test:e2e`                        | Pruebas Playwright + axe contra `astro preview` (construye antes)                        |
| `npm run test:e2e:docker`                 | Las mismas pruebas contra el contenedor en `http://localhost:8080`                       |
| `npm run brand:assets`                    | Regenera favicons, íconos, logo PNG e imagen OG (manual; se versionan)                   |
| `node scripts/csp-hash.mjs --write`       | Recalcula el hash CSP del script de tema en `nginx/security-headers.conf` (tras `build`) |

## Estructura

```
src/config/site.ts      Datos de la empresa y de contacto (única fuente)
src/content.config.ts   Colecciones: servicios, categorías de bienes y proyectos
src/content/            Contenido de las colecciones (Markdown/YAML, solo frontmatter)
src/i18n/               Textos de interfaz (es) y helpers t() / localizedPath()
src/lib/                SEO, JSON-LD, acceso al contenido, tema, enlaces
src/layouts/            BaseLayout
src/components/         layout/, ui/, sections/, visuals/
src/styles/global.css   Tokens de color, tipografía y estilos base
scripts/                Generación de recursos de marca y hash CSP
e2e/                    Pruebas Playwright
nginx/, Dockerfile, docker-compose.yml   Imagen y despliegue
docs/                   Spec, progreso, créditos y (Tramo 4) guía de despliegue
```

## Despliegue (resumen)

En el servidor, dentro de la carpeta del proyecto:

```bash
git pull
docker compose up -d --build
```

La imagen construye el sitio con Node 24 y lo sirve con nginx (puerto 80 interno). Traefik enruta `bcscode.com`
y redirige `www.bcscode.com` a la raíz. La guía completa estará en `docs/DESPLIEGUE.md` (Tramo 4). Este
repositorio no contiene IPs, rutas del servidor ni credenciales.
