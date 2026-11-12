# Despliegue — csi-web

Guía operativa del sitio `https://bcscode.com` en el VPS (spec §16). **El repositorio es público**: esta guía usa
marcadores en lugar de datos reales del servidor. Los valores reales los tiene el propietario.

| Marcador                  | Significado                                         |
| ------------------------- | --------------------------------------------------- |
| `<IP_DEL_VPS>`            | IP pública del VPS                                  |
| `<USUARIO_SSH>`           | Usuario con el que se entra por SSH                 |
| `<RUTA_BASE_PROYECTOS>`   | Carpeta del VPS donde se clonan los proyectos       |
| `<RUTA_DEL_PROYECTO>`     | `<RUTA_BASE_PROYECTOS>/csi-web`                     |
| `<RUTA_PROYECTO_TRAEFIK>` | Proyecto Docker Compose de Traefik (**no se toca**) |

## 1. Arquitectura

```
Internet ──► Traefik v2.11 (entrypoints web :80 y websecure :443, certresolver myresolver)
               │  red Docker externa onedoy_app-network
               ▼
             contenedor csi-web (nginx 1.28, puerto 80 interno, sin puertos publicados)
               └─ /usr/share/nginx/html = dist/ (sitio estático de Astro)
```

- La imagen se construye en el propio VPS (`docker compose up -d --build`): etapa Node 24 (`npm ci` +
  `npm run build`, que incluye `astro check`) y etapa nginx con `nginx/default.conf` y
  `nginx/security-headers.conf`.
- Traefik enruta `bcscode.com` y `www.bcscode.com` al contenedor y redirige `www` a la raíz con un 301
  (middleware `csi-web-www-redirect`, etiquetas en `docker-compose.yml`).
- Límite de memoria del contenedor: 64 MB. `restart: always`. `HEALTHCHECK` con `wget` a `/`.

## 2. Reglas del servidor (§16.1)

- No tocar `<RUTA_PROYECTO_TRAEFIK>` ni la configuración de Traefik.
- No ejecutar `docker system prune -a` ni `docker volume prune` (hay otras apps en producción).
- No publicar puertos nuevos: el contenedor solo se expone a través de Traefik.
- Todo lo de este sitio usa nombres `csi-web*` (proyecto, contenedor, imagen, routers y middlewares).
- Ningún dato del servidor ni credencial se escribe en el repositorio.

## 3. Primer despliegue

Cada paso se ejecuta solo con la autorización del propietario.

### 3.1. Verificar la red y los entrypoints de Traefik

```bash
ssh <USUARIO_SSH>@<IP_DEL_VPS>
docker inspect traefik --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}'
docker inspect traefik --format '{{json .Args}}'
```

Debe aparecer la red `onedoy_app-network`, los entrypoints `web` y `websecure` y el certresolver `myresolver`.
Si los nombres difieren, ajustar en `docker-compose.yml`: `traefik.docker.network`, `networks.proxy.name`,
`entrypoints` y `certresolver`.

### 3.2. Verificar que nadie usa la raíz del dominio

```bash
docker ps -q | xargs docker inspect --format '{{.Name}} {{json .Config.Labels}}' \
  | grep -E 'Host\(`(www\.)?bcscode\.com`\)'
```

La salida debe estar vacía (los otros sitios usan subdominios).

### 3.3. DNS en Hostinger (lo hace el propietario)

hPanel → Dominios → `bcscode.com` → DNS / Nameservers → Registros DNS:

1. Registro `A`, nombre `@`, apunta a `<IP_DEL_VPS>`, TTL 300 (durante el cambio).
2. Registro `CNAME`, nombre `www`, apunta a `bcscode.com`.
3. Eliminar los registros `A`, `AAAA` o `ALIAS` previos de `@` y de `www` que apunten a otro destino (por
   ejemplo, la página de estacionamiento de Hostinger).
4. **No tocar** MX, TXT (SPF, DKIM, verificaciones) ni los registros de los subdominios existentes.

Propagación (desde cualquier PC):

```powershell
Resolve-DnsName bcscode.com -Type A
Resolve-DnsName www.bcscode.com
```

```bash
dig +short bcscode.com
dig +short www.bcscode.com
```

Ambos deben resolver a `<IP_DEL_VPS>` antes de levantar el contenedor (Traefik pide el certificado al primer
acceso; si el DNS aún no apunta al VPS, el reto ACME falla y se reintenta más tarde). Al terminar, el TTL
puede volver a su valor por defecto.

### 3.4. Código y contenedor

```bash
cd <RUTA_BASE_PROYECTOS>
git clone https://github.com/sygns13/csi-web.git csi-web
cd csi-web
docker compose config --quiet && echo OK
docker compose up -d --build
docker compose ps        # estado "healthy" tras ~30 s
```

El repositorio es público: se clona por HTTPS, sin deploy key ni credenciales.

### 3.5. Verificaciones

```bash
curl -sI https://bcscode.com/                      # 200, cabeceras de seguridad, cache-control: no-cache
curl -sI https://www.bcscode.com/                  # 308 → https://bcscode.com/ (conserva ruta y query)
curl -sI http://bcscode.com/                       # 308 → https://bcscode.com/
curl -sI https://bcscode.com/servicios             # 301 → /servicios/
curl -s -o /dev/null -w '%{http_code}\n' https://bcscode.com/no-existe/   # 404 (página propia)
curl -s -o /dev/null -w '%{http_code}\n' https://bcscode.com/sitemap-index.xml   # 200
curl -s -o /dev/null -w '%{http_code}\n' https://bcscode.com/robots.txt          # 200
docker logs traefik 2>&1 | grep -i acme | tail     # sin errores de certificado
```

Cabeceras esperadas en todas las respuestas: `content-security-policy` (con el hash del script de tema),
`strict-transport-security: max-age=31536000` (sin `includeSubDomains`), `x-content-type-options`,
`referrer-policy`, `x-frame-options: DENY`, `cross-origin-opener-policy` y `permissions-policy`. Caché:
`no-cache` en HTML, `public, max-age=31536000, immutable` en `/_astro/` y `public, max-age=604800` en
imágenes, íconos y `site.webmanifest` (`application/manifest+json`).

Traefik v2.11 responde **308** (permanente, equivale a 301 para los buscadores) tanto en la redirección
`www` → raíz (`redirectregex` con `permanent=true`) como en la de http → https. En este servidor la redirección de
`web` a `websecure` ya es global (argumentos de Traefik), así que no hace falta un router propio para http.

Con certificado válido, la consola del navegador debe quedar sin infracciones de CSP en todas las páginas. Para
repetir en producción las suites de Playwright, basta una configuración temporal que extienda `baseConfig` de
`playwright.config.ts` con `use.baseURL = "https://bcscode.com"` (y sin `webServer`).

**Si algún día `http://bcscode.com/` devuelve 404 de Traefik** (sin redirección global de `web` a `websecure`), agregar
a `docker-compose.yml` un router propio, sin tocar Traefik:

```yaml
- "traefik.http.routers.csi-web-http.rule=Host(`bcscode.com`) || Host(`www.bcscode.com`)"
- "traefik.http.routers.csi-web-http.entrypoints=web"
- "traefik.http.routers.csi-web-http.middlewares=csi-web-https"
- "traefik.http.middlewares.csi-web-https.redirectscheme.scheme=https"
- "traefik.http.middlewares.csi-web-https.redirectscheme.permanent=true"
```

### 3.6. Después del despliegue

- Lighthouse móvil en producción (objetivo §11: Rendimiento ≥ 95; Accesibilidad, Buenas prácticas y SEO 100).
- Validador de Schema.org (manual: bloquea las consultas automatizadas), con cada tipo de página:
  <https://validator.schema.org/#url=https%3A%2F%2Fbcscode.com%2F>,
  <https://validator.schema.org/#url=https%3A%2F%2Fbcscode.com%2Fservicios%2Finteligencia-artificial%2F>,
  <https://validator.schema.org/#url=https%3A%2F%2Fbcscode.com%2Fproductos%2F>,
  <https://validator.schema.org/#url=https%3A%2F%2Fbcscode.com%2Fproyectos%2Fapubot-2-csj-ancash%2F> y
  <https://validator.schema.org/#url=https%3A%2F%2Fbcscode.com%2Fnosotros%2F>.
- El propietario da de alta el sitio en Google Search Console y Bing Webmaster Tools y envía
  `https://bcscode.com/sitemap-index.xml` (ver §7).

## 4. Actualizaciones

```bash
cd <RUTA_DEL_PROYECTO>
git pull
docker compose up -d --build
```

Cada reconstrucción deja la imagen anterior sin etiqueta (`<none>`). Para liberar espacio, borrar solo las de
este sitio: `docker images --filter "dangling=true"` y `docker rmi <ID>` de las que correspondan a `csi-web`
(nunca `docker system prune -a`).

Antes de publicar, en local: `npm run build`, `npm run test:e2e` y, con la imagen, `npm run test:e2e:docker`
(§5).

**Volver a una versión anterior**: `git log --oneline`, luego `git checkout <commit>` y
`docker compose up -d --build`. Para regresar a la rama: `git checkout master && git pull`.

**Si cambia el script de tema** (`src/lib/theme-init.ts`): `npm run build && node scripts/csp-hash.mjs --write`
y versionar `nginx/security-headers.conf`. La prueba `build-output` falla si el hash no coincide.

## 5. Prueba local de la imagen

```bash
docker build -t csi-web:latest .
docker run --rm csi-web:latest nginx -t                      # sintaxis de nginx
docker run -d --rm --name csi-web-local -p 8080:80 csi-web:latest
npm run test:e2e:docker                                      # mismas pruebas + cabeceras y CSP (headers.spec.ts)
docker stop csi-web-local
```

## 6. Diagnóstico

| Síntoma                                  | Revisar                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| 404 de Traefik en `https://bcscode.com/` | `docker compose ps` (¿contenedor arriba?), etiquetas y red del contenedor              |
| Certificado no válido                    | DNS apuntando al VPS; `docker logs traefik 2>&1 \| grep -i acme`                       |
| 502/504                                  | `docker compose logs web`; `traefik.http.services.csi-web.loadbalancer.server.port=80` |
| Infracciones de CSP en la consola        | Hash del script de tema (§4 de esta guía)                                              |
| El contenedor no queda `healthy`         | `docker inspect --format '{{json .State.Health}}' csi-web`                             |

## 7. Alta en buscadores (propietario)

1. Google Search Console → Agregar propiedad → Dominio `bcscode.com` → verificar con el registro TXT que indica
   (en Hostinger, DNS → agregar TXT en `@`; no borrar otros TXT). Luego Sitemaps → `sitemap-index.xml`.
2. Bing Webmaster Tools → importar desde Search Console (o verificar con su registro) y enviar el mismo sitemap.
