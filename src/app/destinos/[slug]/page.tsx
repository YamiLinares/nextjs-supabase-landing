import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinationGrid, PinIcon } from "@/components/destination-card";
import { Breadcrumbs } from "@/components/page-header";
import { SafeImage } from "@/components/safe-image";
import { DestinationGridSkeleton } from "@/components/skeletons";
import {
  getDestinationBySlug,
  getDestinations,
  getRelatedDestinations,
} from "@/lib/data/catalog";
import { isValidSlug } from "@/lib/slug";

/**
 * Ruta dinámica /destinos/[slug].
 * El destino se consulta en Supabase antes de cualquier <Suspense> para que
 * un slug inexistente devuelva un 404 real (no un 200 con streaming).
 * Por eso esta ruta se marca como no instantánea de forma explícita.
 */
export const instant = false;

/** Prerenderiza en la compilación todos los destinos publicados. */
export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: PageProps<"/destinos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = isValidSlug(slug) ? await getDestinationBySlug(slug) : null;

  if (!destination) {
    return { title: "Destino no encontrado", robots: { index: false } };
  }

  const title = destination.name;
  const description = destination.summary;
  return {
    title,
    description,
    alternates: { canonical: `/destinos/${destination.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/destinos/${destination.slug}`,
      images: destination.imageUrl ? [{ url: destination.imageUrl, alt: destination.imageAlt }] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: PageProps<"/destinos/[slug]">) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const { category } = destination;

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-ocean-950">
        <div className="absolute inset-0 -z-10">
          <SafeImage
            src={destination.imageUrl}
            alt={destination.imageAlt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ocean-950/95 via-ocean-950/55 to-ocean-950/20" />
        <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <div className="[&_a]:text-sand-100 [&_li]:text-sand-200 [&_span]:text-sand-200">
            <Breadcrumbs
              items={[
                { href: "/", label: "Inicio" },
                { href: "/destinos", label: "Destinos" },
                { label: destination.name },
              ]}
            />
          </div>
          {category && (
            <Link
              href={`/categorias/${category.slug}`}
              className="mt-5 inline-flex w-fit rounded-full bg-leaf-600 px-3.5 py-1 text-sm font-semibold text-white transition hover:bg-leaf-700"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            {destination.name}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-lg font-medium text-sand-100">
            <PinIcon />
            {destination.location}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div>
          <p className="font-display text-2xl leading-snug text-ocean-900">{destination.summary}</p>
          <p className="mt-6 text-lg leading-relaxed text-ink">{destination.description}</p>

          {destination.highlights.length > 0 && (
            <section aria-labelledby="imprescindibles" className="mt-10">
              <h2 id="imprescindibles" className="font-display text-2xl font-semibold text-ocean-900">
                Lo que no te puedes perder
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {destination.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 rounded-xl border border-sand-200 bg-white p-4 text-sm font-medium text-ink"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-px shrink-0 text-leaf-600">
                      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside aria-label="Información del destino" className="space-y-6">
          <dl className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Ubicación</dt>
              <dd className="mt-1 font-semibold text-ocean-900">{destination.location}</dd>
            </div>
            {category && (
              <div className="mt-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Categoría</dt>
                <dd className="mt-1">
                  <Link
                    href={`/categorias/${category.slug}`}
                    className="font-semibold text-leaf-700 underline-offset-4 hover:underline"
                  >
                    {category.name}
                  </Link>
                </dd>
              </div>
            )}
            {destination.imageCredit && (
              <div className="mt-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Fotografía</dt>
                <dd className="mt-1 text-sm text-ink-muted">
                  {destination.imageCredit}
                  {destination.imageLicense && <>, {destination.imageLicense}</>}
                  {destination.imageSourceUrl && (
                    <>
                      {" · "}
                      <a
                        href={destination.imageSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ocean-700 underline underline-offset-2"
                      >
                        fuente
                      </a>
                    </>
                  )}
                </dd>
              </div>
            )}
          </dl>

          <div className="flex flex-col gap-3">
            {category && (
              <Link
                href={`/categorias/${category.slug}`}
                className="rounded-full bg-ocean-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-ocean-800"
              >
                Más destinos de {category.name.toLowerCase()}
              </Link>
            )}
            <Link
              href="/destinos"
              className="rounded-full border border-ocean-900/20 px-5 py-3 text-center text-sm font-semibold text-ocean-900 transition hover:bg-sand-200"
            >
              ← Volver al catálogo
            </Link>
          </div>
        </aside>
      </div>

      {category && (
        <section aria-labelledby="relacionados" className="border-t border-sand-200 bg-sand-100">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 id="relacionados" className="font-display text-3xl font-semibold text-ocean-900">
              También en {category.name.toLowerCase()}
            </h2>
            <div className="mt-8">
              <Suspense fallback={<DestinationGridSkeleton count={3} label="Cargando destinos relacionados…" />}>
                <RelatedDestinations categoryId={category.id} slug={destination.slug} />
              </Suspense>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

async function RelatedDestinations({ categoryId, slug }: { categoryId: number; slug: string }) {
  const related = await getRelatedDestinations(categoryId, slug, 3);

  if (related.length === 0) {
    return (
      <p className="text-ink-muted">
        Por ahora este es el único destino de la categoría.{" "}
        <Link href="/destinos" className="font-semibold text-ocean-700 underline underline-offset-4">
          Explora el catálogo completo
        </Link>
        .
      </p>
    );
  }

  return <DestinationGrid destinations={related} />;
}
