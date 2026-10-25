import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SupabaseConfigError } from "@/lib/env";
import type {
  Category,
  CategorySummary,
  CategoryWithCount,
  Destination,
} from "@/lib/types";

/**
 * Consultas centralizadas al catálogo en Supabase.
 *
 * Todas usan `"use cache"` (Cache Components de Next.js 16): el resultado
 * se reutiliza entre peticiones y se revalida según el perfil `minutes`
 * (revalidación cada minuto, caducidad de una hora).
 *
 * Errores: si Supabase falla se lanza `CatalogError` (lo captura error.tsx).
 * Un recurso inexistente devuelve `null` y una lista vacía devuelve `[]`,
 * de modo que un fallo de conexión nunca se confunde con un catálogo vacío.
 */

export class CatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogError";
  }
}

const DESTINATION_COLUMNS =
  "id, name, slug, summary, description, location, image_url, image_alt, image_credit, image_license, image_source_url, highlights, featured, category:categories(id, name, slug)" as const;

interface DestinationRow {
  id: number;
  name: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  image_url: string;
  image_alt: string;
  image_credit: string;
  image_license: string;
  image_source_url: string;
  highlights: string[] | null;
  featured: boolean;
  category: CategorySummary | CategorySummary[] | null;
}

function toDestination(row: DestinationRow): Destination {
  const category = Array.isArray(row.category) ? (row.category[0] ?? null) : row.category;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    location: row.location,
    imageUrl: row.image_url,
    imageAlt: row.image_alt || row.name,
    imageCredit: row.image_credit,
    imageLicense: row.image_license,
    imageSourceUrl: row.image_source_url,
    highlights: row.highlights ?? [],
    featured: row.featured,
    category,
  };
}

/** Registra el error de forma segura en el servidor y lanza uno genérico. */
function fail(operation: string, error: { code?: string; message?: string }): never {
  console.error(`[catalog] ${operation} falló`, { code: error.code, message: error.message });
  throw new CatalogError(`No se pudo completar la consulta: ${operation}.`);
}

function getClient() {
  try {
    return createServerSupabaseClient();
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      console.error(`[catalog] ${error.message}`);
    }
    throw error;
  }
}

/** Lista todos los destinos publicados, ordenados por nombre. */
export async function getDestinations(): Promise<Destination[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("destinations");

  const { data, error } = await getClient()
    .from("destinations")
    .select(DESTINATION_COLUMNS)
    .eq("published", true)
    .order("name");

  if (error) fail("listar destinos", error);
  return (data as DestinationRow[]).map(toDestination);
}

/** Destinos marcados como destacados para la portada. */
export async function getFeaturedDestinations(limit = 6): Promise<Destination[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("destinations");

  const { data, error } = await getClient()
    .from("destinations")
    .select(DESTINATION_COLUMNS)
    .eq("published", true)
    .eq("featured", true)
    .order("name")
    .limit(limit);

  if (error) fail("listar destinos destacados", error);
  return (data as DestinationRow[]).map(toDestination);
}

/** Recupera un destino por su slug. Devuelve `null` si no existe. */
export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("destinations", `destination:${slug}`);

  const { data, error } = await getClient()
    .from("destinations")
    .select(DESTINATION_COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) fail("obtener destino", error);
  return data ? toDestination(data as DestinationRow) : null;
}

/** Destinos que pertenecen a una categoría. */
export async function getDestinationsByCategory(categoryId: number): Promise<Destination[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("destinations", `category-destinations:${categoryId}`);

  const { data, error } = await getClient()
    .from("destinations")
    .select(DESTINATION_COLUMNS)
    .eq("published", true)
    .eq("category_id", categoryId)
    .order("name");

  if (error) fail("listar destinos de la categoría", error);
  return (data as DestinationRow[]).map(toDestination);
}

/** Otros destinos de la misma categoría, excluyendo el actual. */
export async function getRelatedDestinations(
  categoryId: number,
  excludeSlug: string,
  limit = 3,
): Promise<Destination[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("destinations");

  const { data, error } = await getClient()
    .from("destinations")
    .select(DESTINATION_COLUMNS)
    .eq("published", true)
    .eq("category_id", categoryId)
    .neq("slug", excludeSlug)
    .order("name")
    .limit(limit);

  if (error) fail("listar destinos relacionados", error);
  return (data as DestinationRow[]).map(toDestination);
}

/** Lista las categorías con la cantidad de destinos publicados. */
export async function getCategories(): Promise<CategoryWithCount[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories", "destinations");

  const { data, error } = await getClient()
    .from("categories")
    .select("id, name, slug, description, destinations(count)")
    .order("name");

  if (error) fail("listar categorías", error);

  return (data ?? []).map((row) => {
    const counts = row.destinations as unknown as { count: number }[] | null;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      destinationCount: counts?.[0]?.count ?? 0,
    };
  });
}

/** Recupera una categoría por su slug. Devuelve `null` si no existe. */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories", `category:${slug}`);

  const { data, error } = await getClient()
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) fail("obtener categoría", error);
  return data;
}
