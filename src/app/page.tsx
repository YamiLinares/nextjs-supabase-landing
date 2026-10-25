import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import heroImage from "../../public/images/destinos/lago-de-coatepeque.jpg";
import { CategoryCard } from "@/components/category-card";
import { DestinationGrid } from "@/components/destination-card";
import { EmptyState } from "@/components/empty-state";
import { SectionHeading } from "@/components/page-header";
import { CategoryGridSkeleton, DestinationGridSkeleton } from "@/components/skeletons";
import { getCategories, getFeaturedDestinations } from "@/lib/data/catalog";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section aria-labelledby="destacados" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          id="destacados"
          eyebrow="Destinos destacados"
          title="Lugares para empezar tu viaje"
          description="Una selección de playas, volcanes, pueblos y sitios históricos que muestran la diversidad del país."
          action={
            <Link
              href="/destinos"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ocean-700 underline-offset-4 hover:underline"
            >
              Ver todos los destinos <span aria-hidden="true">→</span>
            </Link>
          }
        />
        <div className="mt-10">
          <Suspense fallback={<DestinationGridSkeleton count={6} />}>
            <FeaturedDestinations />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="categorias" className="border-y border-sand-200 bg-sand-100">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            id="categorias"
            eyebrow="Categorías"
            title="Explora según lo que te inspira"
            description="Cada categoría reúne destinos con un mismo carácter, del mar a las montañas."
          />
          <div className="mt-10">
            <Suspense fallback={<CategoryGridSkeleton />}>
              <CategoriesSection />
            </Suspense>
          </div>
        </div>
      </section>

      <FinalInvitation />
    </>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-ocean-950">
      <Image
        src={heroImage}
        alt="Lago de Coatepeque visto desde lo alto, con aguas color turquesa rodeadas de cerros verdes"
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ocean-950/90 via-ocean-950/65 to-ocean-950/20" />
      <div className="mx-auto flex min-h-[min(78vh,760px)] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sand-200">Explora El Salvador</p>
        <h1
          id="hero-title"
          className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl"
        >
          Destinos que inspiran, de la costa a los volcanes
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-100">
          Descubre playas de arena volcánica, lagos en antiguas calderas, pueblos coloniales y
          sitios arqueológicos en un país pequeño lleno de contrastes.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/destinos"
            className="rounded-full bg-leaf-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-leaf-700"
          >
            Explorar destinos
          </Link>
          <Link
            href="/categorias"
            className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Ver categorías
          </Link>
        </div>
      </div>
      <p className="absolute bottom-3 right-4 text-xs text-white/70">
        Foto: JMRAFFi, CC BY-SA 4.0 ·{" "}
        <Link href="/creditos" className="underline underline-offset-2 hover:text-white">
          créditos
        </Link>
      </p>
    </section>
  );
}

/** Server Component: consulta los destinos destacados en Supabase. */
async function FeaturedDestinations() {
  const destinations = await getFeaturedDestinations(6);

  if (destinations.length === 0) {
    return (
      <EmptyState
        title="Aún no hay destinos destacados"
        message="Cuando se marquen destinos como destacados aparecerán aquí. Mientras tanto, puedes recorrer el catálogo completo."
        action={{ href: "/destinos", label: "Ver catálogo" }}
      />
    );
  }

  return <DestinationGrid destinations={destinations} />;
}

/** Server Component: consulta las categorías y su número de destinos. */
async function CategoriesSection() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return <EmptyState title="Sin categorías por ahora" message="Todavía no hay categorías publicadas en el catálogo." />;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
}

function FinalInvitation() {
  return (
    <section aria-labelledby="invitacion" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-ocean-900 px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-leaf-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-ocean-600/40 blur-3xl"
        />
        <h2 id="invitacion" className="relative font-display text-3xl font-semibold text-white sm:text-4xl">
          Tu próxima aventura empieza aquí
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-sand-100">
          Recorre el catálogo completo, elige una categoría y descubre los detalles de cada destino
          antes de salir.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/destinos"
            className="rounded-full bg-sand-50 px-7 py-3.5 font-semibold text-ocean-900 transition hover:bg-white"
          >
            Ver todos los destinos
          </Link>
          <Link
            href="/categorias"
            className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
          >
            Explorar por categoría
          </Link>
        </div>
      </div>
    </section>
  );
}
