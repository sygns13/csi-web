import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

// Foto del Gerente General (§6.7, D18). El propietario la entrega y se copia como
// `src/assets/team/gerente.{jpg,png}`. Si no existe, /nosotros/ muestra el monograma "CC" y el
// JSON-LD `Organization.founder` va sin `image` (§9.3: "si existe").

/** Requisitos de la foto (§6.7): cuadrada y de al menos 800×800 px. */
export const MANAGER_PHOTO_MIN_SIZE = 800;
/** Anchos generados (240 px y 480 px para pantallas 2x). */
export const MANAGER_PHOTO_WIDTHS = [240, 480] as const;

const found = Object.entries(
  import.meta.glob<ImageMetadata>("../assets/team/gerente.{jpg,jpeg,png,webp}", {
    eager: true,
    import: "default",
  }),
);

if (found.length > 1) {
  throw new Error(
    `Hay más de una foto del Gerente en src/assets/team/: ${found.map(([path]) => path).join(", ")}.`,
  );
}

const photo = found[0]?.[1];

if (photo && (photo.width !== photo.height || photo.width < MANAGER_PHOTO_MIN_SIZE)) {
  throw new Error(
    `La foto del Gerente (src/assets/team/) debe ser cuadrada y de al menos ` +
      `${MANAGER_PHOTO_MIN_SIZE}×${MANAGER_PHOTO_MIN_SIZE} px (§6.7); mide ${photo.width}×${photo.height}. ` +
      `Retírela para usar el monograma "CC".`,
  );
}

export const managerPhoto: ImageMetadata | undefined = photo;

/** URL (ruta) de la foto optimizada para el JSON-LD, o `undefined` si no hay foto. */
export async function managerPhotoUrl(): Promise<string | undefined> {
  if (!managerPhoto) return undefined;
  const image = await getImage({
    src: managerPhoto,
    width: MANAGER_PHOTO_WIDTHS[1],
    format: "webp",
  });
  return image.src;
}
