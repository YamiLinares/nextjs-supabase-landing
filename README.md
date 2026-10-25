# Explora El Salvador — Destinos que inspiran

Landing page y catálogo visual para descubrir destinos turísticos de El Salvador: playas, volcanes, pueblos con encanto, lagos volcánicos y sitios arqueológicos. Los datos se guardan en **Supabase** (PostgreSQL) y se consultan desde **React Server Components** con el **App Router de Next.js 16**.

- **Repositorio:** https://github.com/YamiLinares/nextjs-supabase-landing
- **Sitio en producción:** https://nextjs-supabase-landing.vercel.app

## Objetivo académico

Actividad: *Dominio del App Router y Gestión de Datos: Construcción de Rutas Dinámicas y Persistencia con servicio serverless.*

El proyecto demuestra:

- Rutas dinámicas reales (`/destinos/[slug]` y `/categorias/[slug]`) que consultan la base de datos.
- Lectura de datos desde Server Components con caché de Next.js 16 (`"use cache"`).
- Persistencia en Supabase con tablas relacionadas y Row Level Security (RLS).
- Estados de carga, manejo de errores y páginas 404.
- Despliegue en Vercel con variables de entorno protegidas.

## Tecnologías

| Tecnología | Versión | Uso |
| --- | --- | --- |
| Next.js (App Router, Turbopack) | 16.4.3 | Framework, rutas, caché y renderizado |
| React | 19.3 | Interfaz (Server y Client Components) |
| TypeScript | 5.9 | Tipado estático |
| Tailwind CSS | 4.3 | Estilos |
| Supabase (`@supabase/supabase-js`) | 2.118 | Base de datos PostgreSQL y API serverless |
| Vitest | 5.0 | Pruebas unitarias y de integración |
| Vercel | — | Hosting de producción |

## Características

- **Portada** (`/`): navegación responsive, hero con imagen, llamadas a la acción, destinos destacados, categorías con su número de destinos, invitación final y footer con créditos.
- **Catálogo** (`/destinos`) y **categorías** (`/categorias`).
- **Detalle de destino** (`/destinos/[slug]`): imagen principal, descripción, categoría, ubicación, puntos destacados, crédito de la foto, destinos relacionados y enlaces para volver.
- **Detalle de categoría** (`/categorias/[slug]`): descripción, destinos de la categoría y acceso a otras categorías.
- **Créditos** (`/creditos`): autor, licencia y fuente de cada fotografía.
- `loading.tsx`, `<Suspense>` con esqueletos, `error.tsx` con botón de reintento, `not-found.tsx` y estados vacíos.
- 404 reales (código HTTP 404) para slugs inexistentes, inválidos o no publicados.
- Metadatos por página, Open Graph, HTML semántico, enlace para saltar al contenido, foco visible y `next/image`.
- Imagen de respaldo si una foto no carga.

## Capturas

Las capturas se pueden ver directamente en el sitio desplegado. En la validación se revisaron la portada, el detalle de destino, la categoría, el 404 y el estado de error en escritorio (1366 px) y móvil (390 px).

## Estructura de carpetas

```text
nextjs-supabase-landing/
├── public/images/destinos/        # Fotografías optimizadas (Wikimedia Commons)
├── scripts/smoke-test.mjs         # Prueba HTTP de rutas, 404, imágenes y claves
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Layout raíz, fuentes y metadatos
│   │   ├── page.tsx               # Portada
│   │   ├── error.tsx · not-found.tsx
│   │   ├── creditos/page.tsx
│   │   ├── destinos/
│   │   │   ├── (catalogo)/        # /destinos  (page, loading, error)
│   │   │   └── [slug]/            # /destinos/[slug]  (page, error, not-found)
│   │   └── categorias/
│   │       ├── (indice)/          # /categorias  (page, loading, error)
│   │       └── [slug]/            # /categorias/[slug]  (page, error, not-found)
│   ├── components/                # Tarjetas, navegación, esqueletos, errores…
│   └── lib/
│       ├── data/catalog.ts        # Todas las consultas a Supabase (server-only)
│       ├── supabase/server.ts     # Cliente de Supabase para el servidor
│       ├── env.ts                 # Validación de variables de entorno
│       ├── slug.ts · images.ts    # Validación de parámetros e imágenes
│       └── types.ts               # Tipos de dominio y de la base de datos
├── supabase/
│   ├── migrations/20261024000000_create_catalog.sql   # Tablas, índices y RLS
│   └── seed.sql                                       # Datos de ejemplo
├── tests/
│   ├── unit/                      # Pruebas sin red
│   └── db/                        # Pruebas contra Supabase (datos y RLS)
├── .env.example
└── next.config.ts
```

## Requisitos previos

- Node.js 20.9 o superior (probado con Node.js 24) y npm.
- Git.
- Una cuenta gratuita de [Supabase](https://supabase.com).
- Una cuenta de [Vercel](https://vercel.com) para el despliegue.

## Instalación local (Windows PowerShell)

```powershell
git clone https://github.com/YamiLinares/nextjs-supabase-landing.git
cd nextjs-supabase-landing
npm install
Copy-Item .env.example .env.local
```

## Configuración de Supabase

1. En https://supabase.com/dashboard, pulsa **New project** y crea un proyecto exclusivo para esta app.
2. Espera a que el proyecto termine de prepararse.

### Creación de tablas y relaciones

En **SQL Editor → New query**, pega y ejecuta (**Run**) el contenido de:

```text
supabase/migrations/20261024000000_create_catalog.sql
```

Crea dos tablas:

**`categories`**

| Columna | Tipo | Restricciones |
| --- | --- | --- |
| `id` | `bigint` identity | Clave primaria |
| `name` | `text` | Obligatorio, 2–80 caracteres |
| `slug` | `text` | Único, formato `minusculas-con-guiones` |
| `description` | `text` | |
| `created_at` | `timestamptz` | `now()` por defecto |

**`destinations`**

| Columna | Tipo | Restricciones |
| --- | --- | --- |
| `id` | `bigint` identity | Clave primaria |
| `name` · `slug` | `text` | Obligatorio · único con formato validado |
| `summary` · `description` · `location` | `text` | |
| `image_url` · `image_alt` | `text` | Ruta local de la foto y texto alternativo |
| `image_credit` · `image_license` · `image_source_url` | `text` | Atribución de la foto |
| `highlights` | `text[]` | Puntos destacados |
| `category_id` | `bigint` | **FK → `categories.id`** (`on delete restrict`) |
| `featured` | `boolean` | Destacado en portada |
| `published` | `boolean` | Solo los publicados son visibles |
| `created_at` | `timestamptz` | `now()` por defecto |

Índices: `destinations(category_id)` y un índice parcial para los destacados publicados.

### Configuración de RLS

La misma migración activa **Row Level Security** en ambas tablas y crea solo políticas de lectura:

| Tabla | Política | Rol | Operación | Condición |
| --- | --- | --- | --- | --- |
| `categories` | Lectura pública de categorías | `anon`, `authenticated` | `SELECT` | `true` |
| `destinations` | Lectura pública de destinos publicados | `anon`, `authenticated` | `SELECT` | `published = true` |

No existen políticas de `INSERT`, `UPDATE` ni `DELETE`, así que cualquier escritura desde el cliente público se rechaza. Además se revocan esos privilegios a `anon` y `authenticated` como defensa adicional. RLS **nunca** se desactiva.

### Carga de los datos de ejemplo

En una nueva consulta del **SQL Editor**, ejecuta:

```text
supabase/seed.sql
```

Inserta **5 categorías** y **15 destinos**: 14 publicados y 1 borrador (`bahia-de-jiquilisco`, `published = false`) que sirve para comprobar que RLS lo oculta. El script es idempotente: puede ejecutarse varias veces sin duplicar datos.

> Alternativa con Supabase CLI: `npx supabase link --project-ref <ref>` y `npx supabase db push`, y después ejecutar `seed.sql`.

## Variables de entorno

| Variable | Obligatoria | Dónde obtenerla |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | Supabase → Project Settings → Data API → *Project URL* |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sí* | Supabase → Project Settings → API Keys → *Publishable key* (`sb_publishable_…`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Alternativa* | Clave `anon` heredada (JWT), solo si el proyecto no tiene clave publicable |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública del sitio para Open Graph (en Vercel se detecta sola) |

\* Usa una de las dos claves públicas. La app **rechaza** claves `sb_secret_…` o `service_role`.

Edita `.env.local` (este archivo nunca se sube a Git):

```powershell
code .env.local
```

## Ejecución local

```powershell
npm run dev            # http://localhost:3000 (desarrollo)
npm run build          # compilación de producción
npm run start          # sirve la compilación en http://localhost:3000
```

> La compilación consulta Supabase para prerenderizar las páginas, así que `.env.local` debe estar configurado antes de `npm run build`.

## Pruebas

```powershell
npm run lint           # ESLint
npm run typecheck      # Tipos de rutas de Next.js + TypeScript
npm test               # Pruebas unitarias (slugs, variables de entorno, imágenes)
npm run test:db        # Integración con Supabase: datos, relaciones y RLS
npm run build
npm run start          # en otra terminal:
npm run test:smoke -- http://localhost:3000
npm run verify         # lint + typecheck + test + build
```

`test:db` comprueba con la clave pública que:

- hay al menos 5 destinos y las relaciones con categorías funcionan;
- el borrador no publicado es invisible;
- `INSERT`, `UPDATE` y `DELETE` están bloqueados.

`test:smoke` revisa los códigos HTTP (200 y 404) y el contenido de cada ruta. También comprueba que las imágenes cargan y que la clave de Supabase no aparece ni en el HTML ni en el JavaScript del navegador.

## Comprobar las rutas dinámicas

| URL | Resultado esperado |
| --- | --- |
| `/destinos/playa-el-tunco` | Detalle de Playa El Tunco (200) |
| `/destinos/lago-de-coatepeque` | Detalle del Lago de Coatepeque (200) |
| `/destinos/destino-que-no-existe` | Página 404 de destino (404) |
| `/destinos/bahia-de-jiquilisco` | 404: existe en la base de datos, pero RLS lo oculta |
| `/categorias/playas` | Destinos de la categoría Playas (200) |
| `/categorias/sitios-arqueologicos` | Joya de Cerén, Tazumal y San Andrés (200) |
| `/categorias/categoria-inexistente` | Página 404 de categoría (404) |

Para confirmar que los datos vienen de Supabase, edita un registro en **Table Editor**, por ejemplo el `summary` de un destino. El cambio aparece en el sitio en un minuto como máximo: es el tiempo de revalidación del perfil de caché `minutes`.

## Despliegue en Vercel

1. Sube el código a GitHub (sin `.env.local`).
2. En https://vercel.com/new, importa el repositorio `nextjs-supabase-landing`. Vercel detecta Next.js automáticamente.
3. En **Environment Variables**, agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` para *Production*, *Preview* y *Development*.
4. Pulsa **Deploy**. Cada `git push` a `main` vuelve a desplegar.

Con Vercel CLI:

```powershell
npx vercel login
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
npx vercel deploy --prod
```

## Solución de problemas

| Problema | Solución |
| --- | --- |
| "Supabase no está configurado" | Falta `.env.local` o una de sus variables. Revisa `.env.example` y reinicia `npm run dev`. |
| "La clave configurada es privilegiada" | Pegaste la clave `sb_secret_…`/`service_role`. Usa la clave **publicable**. |
| El catálogo aparece vacío | Ejecuta `supabase/seed.sql` y revisa que los destinos tengan `published = true`. |
| `npm run build` falla al generar páginas | La compilación necesita conexión con Supabase: revisa las variables y que el proyecto no esté pausado (los proyectos gratuitos se pausan tras días sin uso). |
| En Vercel aparece la página de error | Agrega las variables de entorno en Vercel y vuelve a desplegar. |
| Un cambio en Supabase no aparece | Espera hasta un minuto (revalidación) o vuelve a desplegar. |

## Advertencias de seguridad

- `.env`, `.env.local` y cualquier `.env.*` están en `.gitignore`. Solo se versiona `.env.example`, sin valores.
- La app usa solo la clave **publicable**, que está diseñada para ser pública. La protección real la dan las políticas RLS.
- Las consultas se hacen en el servidor (`server-only`) y la clave no se incrusta en el JavaScript del cliente (lo verifica `test:smoke`).
- Nunca pongas la clave `service_role`/`sb_secret_…` en variables `NEXT_PUBLIC_*`, en el código ni en capturas.
- Si una clave secreta se expone, revócala de inmediato en Supabase → API Keys.
- Antes de publicar se ejecuta un escaneo de secretos con [Gitleaks](https://github.com/gitleaks/gitleaks): `gitleaks git -v` y `gitleaks dir -v`.

## Créditos de imágenes

Fotografías de [Wikimedia Commons](https://commons.wikimedia.org) bajo licencias CC0, CC BY y CC BY-SA. Se redimensionaron para la web. El autor y la licencia de cada una están en la base de datos y en la página `/creditos` del sitio.

---

Proyecto académico de **YamiLinares**.
