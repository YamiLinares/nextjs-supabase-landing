import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationGrid } from "@/components/destination-card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import {
  getCategories,
  getCategoryBySlug,
  getDestinationsByCategory,
} from "@/lib/data/catalog";
import { isValidSlug } from "@/lib/slug";

/**
 * Ruta dinámica /categorias/[slug].
 * La categoría se consulta antes de empezar el streaming para que un slug
 * inexistente devuelva un 404 real.
 */
export const instant = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categorias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = isValidSlug(slug) ? await getCategoryBySlug(slug) : null;

  if (!category) {
    return { title: "Categoría no encontrada", robots: { index: false } };
  }

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categorias/${category.slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      url: `/categorias/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/categorias/[slug]">) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [destinations, allCategories] = await Promise.all([
    getDestinationsByCategory(category.id),
    getCategories(),
  ]);
  const otherCategories = allCategories.filter((item) => item.slug !== category.slug);

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/categorias", label: "Categorías" },
          { label: category.name },
        ]}
        eyebrow="Categoría"
        title={category.name}
        description={category.description}
      >
        <p className="mt-6 text-sm font-semibold text-ocean-700">
          {destinations.length === 1 ? "1 destino" : `${destinations.length} destinos`}
        </p>
      </PageHeader>

      <section aria-label={`Destinos de ${category.name}`} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {destinations.length === 0 ? (
          <EmptyState
            title="Sin destinos en esta categoría"
            message="Todavía no hay destinos publicados en esta categoría. Explora otras opciones del catálogo."
            action={{ href: "/destinos", label: "Ver todos los destinos" }}
          />
        ) : (
          <DestinationGrid destinations={destinations} />
        )}
      </section>

      {otherCategories.length > 0 && (
        <nav aria-labelledby="otras-categorias" className="border-t border-sand-200 bg-sand-100">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 id="otras-categorias" className="font-display text-2xl font-semibold text-ocean-900">
              Otras categorías
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {otherCategories.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/categorias/${item.slug}`}
                    className="inline-flex rounded-full border border-ocean-900/15 bg-white px-4 py-2 text-sm font-semibold text-ocean-900 transition hover:border-leaf-600 hover:text-leaf-700"
                  >
                    {item.name}
                    <span className="ml-1.5 text-ink-muted">({item.destinationCount})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
