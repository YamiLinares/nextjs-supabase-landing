-- =====================================================================
-- Explora El Salvador: esquema del catálogo de destinos
-- Crea las tablas `categories` y `destinations`, sus relaciones,
-- restricciones, índices y políticas de Row Level Security (RLS).
--
-- Es idempotente: puede ejecutarse varias veces sin borrar datos.
-- No elimina ni modifica otras tablas del proyecto.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabla: categories
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id          bigint generated always as identity primary key,
  name        text        not null check (char_length(name) between 2 and 80),
  slug        text        not null unique
                          check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text        not null default '',
  created_at  timestamptz not null default now()
);

comment on table public.categories is
  'Categorías de destinos turísticos (playas, volcanes, pueblos, etc.).';

-- ---------------------------------------------------------------------
-- Tabla: destinations
-- ---------------------------------------------------------------------
create table if not exists public.destinations (
  id               bigint generated always as identity primary key,
  name             text        not null check (char_length(name) between 2 and 120),
  slug             text        not null unique
                               check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary          text        not null default '',
  description      text        not null default '',
  location         text        not null default '',
  image_url        text        not null default '',
  image_alt        text        not null default '',
  image_credit     text        not null default '',
  image_license    text        not null default '',
  image_source_url text        not null default '',
  highlights       text[]      not null default '{}',
  category_id      bigint      not null
                               references public.categories (id)
                               on update cascade on delete restrict,
  featured         boolean     not null default false,
  published        boolean     not null default true,
  created_at       timestamptz not null default now()
);

comment on table public.destinations is
  'Destinos turísticos de El Salvador. Solo las filas con published = true son públicas.';
comment on column public.destinations.published is
  'Si es false, la fila queda oculta para los usuarios anónimos por la política RLS.';

-- Índices para las consultas más frecuentes
create index if not exists destinations_category_id_idx
  on public.destinations (category_id);

create index if not exists destinations_featured_idx
  on public.destinations (featured)
  where published;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.categories   enable row level security;
alter table public.destinations enable row level security;

-- Lectura pública de categorías
drop policy if exists "Lectura pública de categorías" on public.categories;
create policy "Lectura pública de categorías"
  on public.categories
  for select
  to anon, authenticated
  using (true);

-- Lectura pública solo de destinos publicados
drop policy if exists "Lectura pública de destinos publicados" on public.destinations;
create policy "Lectura pública de destinos publicados"
  on public.destinations
  for select
  to anon, authenticated
  using (published = true);

-- No se crean políticas de INSERT, UPDATE ni DELETE: con RLS activo,
-- cualquier escritura desde el cliente público queda denegada.
-- Como defensa adicional se retiran los privilegios de escritura.
revoke insert, update, delete, truncate on public.categories   from anon, authenticated;
revoke insert, update, delete, truncate on public.destinations from anon, authenticated;

grant select on public.categories   to anon, authenticated;
grant select on public.destinations to anon, authenticated;
