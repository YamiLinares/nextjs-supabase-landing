/**
 * Lectura y validación de las variables de entorno de Supabase.
 *
 * Se acepta la clave publicable moderna (`sb_publishable_...`) o, como
 * alternativa, la clave `anon` tradicional. Ambas son claves públicas
 * pensadas para usarse junto con Row Level Security.
 * Nunca se debe usar aquí una clave `service_role` ni una `sb_secret_...`.
 */

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

export interface SupabaseEnv {
  url: string;
  key: string;
}

type EnvSource = Record<string, string | undefined>;

export function readSupabaseEnv(env: EnvSource): SupabaseEnv {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key) {
    throw new SupabaseConfigError(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY) " +
        "en .env.local. Consulta .env.example y el README.",
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new SupabaseConfigError(
      "NEXT_PUBLIC_SUPABASE_URL no es una URL válida (ejemplo: https://abcd.supabase.co).",
    );
  }
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
    throw new SupabaseConfigError("NEXT_PUBLIC_SUPABASE_URL debe usar https.");
  }

  if (key.startsWith("sb_secret_") || looksLikeServiceRoleJwt(key)) {
    throw new SupabaseConfigError(
      "La clave configurada es privilegiada (service_role/secret). " +
        "Usa solo la clave publicable o anon en la aplicación.",
    );
  }

  return { url: parsed.origin, key };
}

/** Detecta claves JWT heredadas cuyo rol es `service_role`. */
function looksLikeServiceRoleJwt(key: string): boolean {
  const parts = key.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"),
    ) as { role?: unknown };
    return payload.role === "service_role";
  } catch {
    return false;
  }
}
