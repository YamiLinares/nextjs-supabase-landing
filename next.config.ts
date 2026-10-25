import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: las consultas a Supabase usan "use cache".
  cacheComponents: true,
  // Desactivado para que las rutas dinámicas esperen la consulta antes de
  // responder: así un slug inexistente devuelve un 404 HTTP real.
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
