import { describe, expect, it } from "vitest";
import { isAllowedImageSrc } from "@/lib/images";

describe("isAllowedImageSrc", () => {
  it("acepta imágenes locales del catálogo", () => {
    expect(isAllowedImageSrc("/images/destinos/playa-el-tunco.jpg")).toBe(true);
    expect(isAllowedImageSrc("/images/destinos/foto.webp")).toBe(true);
  });

  it("rechaza URLs externas, rutas peligrosas y valores vacíos", () => {
    expect(isAllowedImageSrc("https://example.com/foto.jpg")).toBe(false);
    expect(isAllowedImageSrc("//example.com/foto.jpg")).toBe(false);
    expect(isAllowedImageSrc("/images/../.env.jpg")).toBe(false);
    expect(isAllowedImageSrc("/images/destinos/script.svg")).toBe(false);
    expect(isAllowedImageSrc("")).toBe(false);
    expect(isAllowedImageSrc(null)).toBe(false);
    expect(isAllowedImageSrc(undefined)).toBe(false);
  });
});
