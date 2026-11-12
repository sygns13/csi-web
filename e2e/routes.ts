// Rutas construidas que se prueban (se amplía en cada tramo, §18).
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

export const routes: string[] = [
  "/",
  "/servicios/",
  ...serviceSlugs.map((slug) => `/servicios/${slug}/`),
  "/productos/",
];

// Ruta inexistente para probar la página 404 propia.
export const notFoundPath = "/no-existe/";

/**
 * Rutas del mapa del sitio (§5.1) que aún no se construyen. Los enlaces hacia ellas se permiten
 * (devuelven 404) hasta su tramo; al construir una ruta, muévela a `routes`.
 * TODO(Tramo 3): esta lista debe quedar vacía.
 */
export const plannedRoutes: string[] = [
  "/proyectos/",
  ...projectSlugs.map((slug) => `/proyectos/${slug}/`),
  "/nosotros/",
  "/contacto/",
  "/libro-de-reclamaciones/",
  "/privacidad/",
  "/accesibilidad/",
];

export const SITE_URL = "https://bcscode.com";
