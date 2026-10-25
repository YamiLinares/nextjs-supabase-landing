/**
 * Pruebas de integración contra Supabase con la clave PÚBLICA (la misma que
 * usa la aplicación). Verifican datos, relaciones y políticas RLS.
 *
 * Ejecutar: npm run test:db  (requiere .env.local configurado)
 */
import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import { readSupabaseEnv } from "@/lib/env";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const { url, key } = readSupabaseEnv(process.env);
const supabase = createClient(url, key, { auth: { persistSession: false } });

const DRAFT_SLUG = "bahia-de-jiquilisco";

describe("Catálogo en Supabase (cliente público)", () => {
  let publishedCount = 0;

  beforeAll(async () => {
    const { count, error } = await supabase.from("destinations").select("id", { count: "exact", head: true });
    expect(error).toBeNull();
    publishedCount = count ?? 0;
  });

  it("hay al menos cinco destinos publicados", () => {
    expect(publishedCount).toBeGreaterThanOrEqual(5);
  });

  it("hay varias categorías y cada destino está relacionado con una", async () => {
    const { data: categories, error } = await supabase.from("categories").select("id, slug");
    expect(error).toBeNull();
    expect(categories!.length).toBeGreaterThanOrEqual(2);

    const { data: destinations, error: joinError } = await supabase
      .from("destinations")
      .select("slug, category:categories(slug)");
    expect(joinError).toBeNull();
    for (const row of destinations!) {
      expect(row.category, `destino ${row.slug} sin categoría`).toBeTruthy();
    }
  });

  it("recupera un destino por slug", async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("name, slug")
      .eq("slug", "playa-el-tunco")
      .maybeSingle();
    expect(error).toBeNull();
    expect(data?.name).toBe("Playa El Tunco");
  });

  it("un slug inexistente devuelve null, no un error", async () => {
    const { data, error } = await supabase.from("destinations").select("id").eq("slug", "no-existe").maybeSingle();
    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("RLS oculta los destinos no publicados", async () => {
    const { data, error } = await supabase.from("destinations").select("slug, published");
    expect(error).toBeNull();
    expect(data!.every((row) => row.published === true)).toBe(true);
    expect(data!.some((row) => row.slug === DRAFT_SLUG)).toBe(false);
  });

  it("RLS impide insertar destinos", async () => {
    const { error } = await supabase.from("destinations").insert({
      name: "Intruso",
      slug: "intruso-rls",
      category_id: 1,
    });
    expect(error).not.toBeNull();
  });

  it("RLS impide insertar categorías", async () => {
    const { error } = await supabase.from("categories").insert({ name: "Intrusa", slug: "intrusa-rls" });
    expect(error).not.toBeNull();
  });

  it("RLS impide modificar destinos", async () => {
    const { data, error } = await supabase
      .from("destinations")
      .update({ name: "Modificado" })
      .eq("slug", "playa-el-tunco")
      .select();
    // Según los privilegios, PostgREST responde con error o con 0 filas afectadas
    expect(error !== null || data?.length === 0).toBe(true);

    const { data: check } = await supabase.from("destinations").select("name").eq("slug", "playa-el-tunco").single();
    expect(check?.name).toBe("Playa El Tunco");
  });

  it("RLS impide borrar destinos", async () => {
    const { data, error } = await supabase.from("destinations").delete().eq("slug", "playa-el-tunco").select();
    expect(error !== null || data?.length === 0).toBe(true);

    const { count } = await supabase.from("destinations").select("id", { count: "exact", head: true });
    expect(count).toBe(publishedCount);
  });
});
