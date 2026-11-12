// Rutas del sitio que se prueban (§5.1, §18).
export const serviceSlugs = [
  "desarrollo-de-software",
  "inteligencia-artificial",
  "portales-web",
  "sistemas-de-gestion",
  "cloud-e-infraestructura",
  "consultoria-ti",
  "redes-y-soporte",
];

export const productCategorySlugs = [
  "equipos-de-computo",
  "servidores-y-almacenamiento",
  "redes-y-telecomunicaciones",
  "impresion-y-consumibles",
  "perifericos-y-accesorios",
  "videoconferencia-y-audio",
  "software-y-licencias",
  "robotica-e-inteligencia-artificial",
];

export const projectSlugs = [
  "apubot-2-csj-ancash",
  "mesa-de-partes-virtual-inaigem",
  "gestion-documental-inaigem",
  "ia-juzgados-huaraz-csj-ancash",
  "registro-compra-clientes-yamaha",
  "planillas-inaigem",
  "cotizaciones-expomoto-yamaha",
  "hosting-dominio-csj-ancash",
  "aplicativos-institucionales-csj-ancash",
  "certificados-ssl-unasam",
  "portal-fec-unasam",
  "plataforma-web-institucional-unasam",
  "procesamiento-de-datos-unasam",
  "consentimientos-datos-personales-yamaha",
];

export const sectorSlugs = [
  "justicia",
  "investigacion-y-ambiente",
  "educacion-superior",
  "empresa-privada",
];

/** Todas las rutas del mapa del sitio (§5.1), salvo la 404. */
export const routes: string[] = [
  "/",
  "/servicios/",
  ...serviceSlugs.map((slug) => `/servicios/${slug}/`),
  "/productos/",
  "/proyectos/",
  ...projectSlugs.map((slug) => `/proyectos/${slug}/`),
  "/nosotros/",
  "/contacto/",
  "/libro-de-reclamaciones/",
  "/privacidad/",
  "/accesibilidad/",
];

// Ruta inexistente para probar la página 404 propia.
export const notFoundPath = "/no-existe/";

/**
 * Rutas del mapa del sitio que aún no se construyen (los enlaces hacia ellas se toleran hasta su
 * tramo). Desde el Tramo 3 está vacía: todas las rutas de §5.1 existen.
 */
export const plannedRoutes: string[] = [];

export const SITE_URL = "https://bcscode.com";
