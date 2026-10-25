/** Formato de slug permitido: minúsculas, números y guiones simples. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 100;

/**
 * Valida un parámetro dinámico antes de consultarlo en la base de datos.
 * Así se evita enviar a Supabase valores arbitrarios desde la URL.
 */
export function isValidSlug(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_SLUG_LENGTH &&
    SLUG_PATTERN.test(value)
  );
}
