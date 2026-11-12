// Única fuente de los datos de la empresa y de contacto (§3.6).
// Ningún componente escribe a mano el teléfono, el correo ni las URLs de redes.
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
    facebook:
      "https://www.facebook.com/people/CSI-Construyendo-Soluciones-Inform%C3%A1ticas/100077290210130/",
    youtube: "https://www.youtube.com/@construyendosolucionesinformat",
  },
  manager: {
    name: "Cristian Fernando Chávez Torres",
    role: "Gerente General",
    linkedin: "https://www.linkedin.com/in/cristian-chavez-38272b120",
    github: "https://github.com/sygns13",
  },
} as const;
