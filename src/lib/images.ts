/**
 * Las fotografías se sirven desde /public/images/destinos para no depender
 * de servidores externos. Solo se aceptan rutas locales seguras; cualquier
 * otro valor hace que la interfaz muestre la imagen de respaldo.
 */
const LOCAL_IMAGE_PATTERN = /^\/images\/[a-z0-9/_-]+\.(?:jpe?g|png|webp|avif)$/i;

export function isAllowedImageSrc(src: string | null | undefined): src is string {
  return typeof src === "string" && LOCAL_IMAGE_PATTERN.test(src) && !src.includes("..");
}
