import { describe, expect, it } from "vitest";
import { isValidSlug } from "@/lib/slug";

describe("isValidSlug", () => {
  it.each(["playa-el-tunco", "suchitoto", "lago-de-coatepeque", "ruta-2"])("acepta %s", (slug) => {
    expect(isValidSlug(slug)).toBe(true);
  });

  it.each([
    "",
    "Playa-El-Tunco",
    "playa el tunco",
    "-inicio",
    "fin-",
    "doble--guion",
    "../secreto",
    "café",
    "a".repeat(101),
  ])("rechaza %j", (slug) => {
    expect(isValidSlug(slug)).toBe(false);
  });

  it("rechaza valores que no son texto", () => {
    expect(isValidSlug(undefined)).toBe(false);
    expect(isValidSlug(42)).toBe(false);
    expect(isValidSlug(["playas"])).toBe(false);
  });
});
