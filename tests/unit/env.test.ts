import { describe, expect, it } from "vitest";
import { readSupabaseEnv, SupabaseConfigError } from "@/lib/env";

const URL_OK = "https://example-project.supabase.co";

function fakeJwt(payload: object) {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.firma`;
}

describe("readSupabaseEnv", () => {
  it("lee la URL y la clave publicable", () => {
    const env = readSupabaseEnv({
      NEXT_PUBLIC_SUPABASE_URL: `${URL_OK}/`,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_ejemplo",
    });
    expect(env).toEqual({ url: URL_OK, key: "sb_publishable_ejemplo" });
  });

  it("acepta la clave anon heredada como alternativa", () => {
    const anon = fakeJwt({ role: "anon" });
    const env = readSupabaseEnv({ NEXT_PUBLIC_SUPABASE_URL: URL_OK, NEXT_PUBLIC_SUPABASE_ANON_KEY: anon });
    expect(env.key).toBe(anon);
  });

  it("prioriza la clave publicable si existen ambas", () => {
    const env = readSupabaseEnv({
      NEXT_PUBLIC_SUPABASE_URL: URL_OK,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_a",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: fakeJwt({ role: "anon" }),
    });
    expect(env.key).toBe("sb_publishable_a");
  });

  it("falla con un mensaje claro si faltan variables", () => {
    expect(() => readSupabaseEnv({})).toThrow(SupabaseConfigError);
    expect(() => readSupabaseEnv({ NEXT_PUBLIC_SUPABASE_URL: URL_OK })).toThrow(/no está configurado/);
  });

  it("rechaza URLs inválidas o sin https", () => {
    expect(() =>
      readSupabaseEnv({ NEXT_PUBLIC_SUPABASE_URL: "no-es-url", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_a" }),
    ).toThrow(/URL válida/);
    expect(() =>
      readSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "http://example-project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_a",
      }),
    ).toThrow(/https/);
  });

  it("rechaza claves privilegiadas", () => {
    expect(() =>
      readSupabaseEnv({ NEXT_PUBLIC_SUPABASE_URL: URL_OK, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_secret_xyz" }),
    ).toThrow(/privilegiada/);
    expect(() =>
      readSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: URL_OK,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: fakeJwt({ role: "service_role" }),
      }),
    ).toThrow(/privilegiada/);
  });
});
