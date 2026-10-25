/** Datos generales del sitio usados en metadatos y navegación. */
export const site = {
  name: "Explora El Salvador",
  tagline: "Destinos que inspiran",
  description:
    "Descubre playas, volcanes, pueblos coloniales, lagos y sitios arqueológicos de El Salvador. Un catálogo visual de destinos para planificar tu próxima aventura.",
  repositoryUrl: "https://github.com/YamiLinares/nextjs-supabase-landing",
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/destinos", label: "Destinos" },
    { href: "/categorias", label: "Categorías" },
  ],
} as const;

/** URL base para metadatos absolutos (Open Graph). */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (explicit) return new URL(explicit);
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}
