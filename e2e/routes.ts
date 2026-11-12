// Rutas construidas que se prueban (se amplía en cada tramo, §18).
export const routes: string[] = ["/"];

// Ruta inexistente para probar la página 404 propia.
export const notFoundPath = "/no-existe/";

/**
 * Rutas del mapa del sitio (§5.1) que aún no se construyen. Los enlaces hacia ellas se permiten
 * (devuelven 404) hasta su tramo; al construir una ruta, muévela a `routes`.
 * TODO(Tramo 3): esta lista debe quedar vacía.
 */
export const plannedRoutes: string[] = [
  "/servicios/",
  "/servicios/desarrollo-de-software/",
  "/servicios/inteligencia-artificial/",
  "/servicios/portales-web/",
  "/servicios/sistemas-de-gestion/",
  "/servicios/cloud-e-infraestructura/",
  "/servicios/consultoria-ti/",
  "/servicios/redes-y-soporte/",
  "/productos/",
  "/proyectos/",
  "/nosotros/",
  "/contacto/",
  "/libro-de-reclamaciones/",
  "/privacidad/",
  "/accesibilidad/",
];

export const SITE_URL = "https://bcscode.com";
