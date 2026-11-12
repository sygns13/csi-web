// Script de inicialización del tema (§4.8): el ÚNICO <script> en línea permitido.
// Se ejecuta en <head>, antes de las hojas de estilo, para evitar el parpadeo.
//
// IMPORTANTE: la CSP de nginx (nginx/security-headers.conf) lleva el sha256 de este texto exacto.
// Si lo cambias, ejecuta `npm run build && node scripts/csp-hash.mjs --write`.
// La prueba e2e/build-output.spec.ts verifica que coincidan.
export const themeInitScript =
  '(function(){var t=null;try{t=localStorage.getItem("csi-theme")}catch(e){}var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")})();';
