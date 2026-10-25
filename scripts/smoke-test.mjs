#!/usr/bin/env node
/**
 * Prueba de humo HTTP contra un servidor en ejecución (local o producción).
 *
 *   npm run test:smoke -- http://localhost:3000
 *   npm run test:smoke -- https://tu-sitio.vercel.app
 *
 * Comprueba estados HTTP, contenido de las rutas dinámicas, imágenes y que
 * la clave de Supabase no aparezca en el HTML ni en el JavaScript del cliente.
 */
import { existsSync } from "node:fs";

const baseUrl = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const checks = [
  { path: "/", status: 200, includes: ["Destinos destacados", "Playa El Tunco", "Playas del Pacífico"] },
  { path: "/destinos", status: 200, includes: ["Todos los destinos", "Suchitoto", "Joya de Cerén"] },
  { path: "/destinos/playa-el-tunco", status: 200, includes: ["Playa El Tunco", "Tamanique, La Libertad", "/categorias/playas"] },
  { path: "/destinos/lago-de-coatepeque", status: 200, includes: ["Lago de Coatepeque", "Lagos volcánicos"] },
  { path: "/destinos/destino-que-no-existe", status: 404, includes: ["No encontramos ese destino"] },
  { path: "/destinos/SLUG%20invalido", status: 404, includes: ["No encontramos ese destino"] },
  { path: "/destinos/bahia-de-jiquilisco", status: 404, includes: [] }, // borrador oculto por RLS
  { path: "/categorias", status: 200, includes: ["Explora por categoría", "Sitios arqueológicos"] },
  { path: "/categorias/playas", status: 200, includes: ["Playas del Pacífico", "Playa El Sunzal", "/destinos/playa-el-cuco"] },
  { path: "/categorias/sitios-arqueologicos", status: 200, includes: ["Tazumal", "San Andrés"] },
  { path: "/categorias/categoria-inexistente", status: 404, includes: ["No encontramos esa categoría"] },
  { path: "/creditos", status: 200, includes: ["Créditos de imágenes", "Wikimedia Commons"] },
  { path: "/ruta/que/no/existe", status: 404, includes: ["Esta página no existe"] },
];

let failures = 0;
const report = (ok, label, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
};

const scripts = new Set();
const images = new Set();

for (const check of checks) {
  const res = await fetch(baseUrl + check.path, { redirect: "manual" });
  const html = await res.text();
  report(res.status === check.status, `${check.path} → ${res.status}`, res.status === check.status ? "" : `esperado ${check.status}`);
  for (const text of check.includes) {
    report(html.includes(text), `  contiene "${text}"`);
  }
  if (publicKey) report(!html.includes(publicKey), "  el HTML no contiene la clave de Supabase");
  for (const match of html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)) scripts.add(match[1]);
  for (const match of html.matchAll(/(?:src|srcSet)="(\/_next\/image\?url=[^"\s]+)/g)) images.add(match[1].replace(/&amp;/g, "&"));
}

// Imágenes optimizadas por next/image
const sample = [...images].slice(0, 6);
for (const src of sample) {
  const res = await fetch(baseUrl + src);
  const type = res.headers.get("content-type") ?? "";
  report(res.ok && type.startsWith("image/"), `imagen ${decodeURIComponent(src.split("url=")[1].split("&")[0])}`, `${res.status} ${type}`);
}
report(sample.length > 0, `se encontraron imágenes optimizadas (${images.size})`);

// La clave no debe estar incrustada en el JavaScript del cliente
if (publicKey) {
  let leaked = 0;
  for (const src of scripts) {
    const body = await (await fetch(baseUrl + src)).text();
    if (body.includes(publicKey)) leaked++;
  }
  report(leaked === 0, `ningún bundle JS del cliente contiene la clave (${scripts.size} archivos revisados)`);
} else {
  console.log("INFO no hay clave en .env.local: se omite la revisión de bundles");
}

console.log(failures === 0 ? "\nTodas las comprobaciones pasaron." : `\n${failures} comprobación(es) fallaron.`);
process.exit(failures === 0 ? 0 : 1);
