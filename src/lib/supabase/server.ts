import "server-only";

import { createClient } from "@supabase/supabase-js";
import { readSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/types";

/**
 * Cliente de Supabase para Server Components.
 * Usa solo la clave pública (publicable/anon): los permisos reales los
 * definen las políticas RLS de la base de datos.
 * `server-only` impide importar este módulo desde un Client Component.
 */
export function createServerSupabaseClient() {
  const { url, key } = readSupabaseEnv(process.env);
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
