import type { Metadata } from "next";
import Link from "next/link";
import { DestinationGrid } from "@/components/destination-card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getCategories, getDestinations } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Destinos",
  description:
    "Catálogo de destinos turísticos de El Salvador: playas, volcanes, pueblos con encanto, lagos y sitios arqueológicos.",
  alternates: { canonical: "/destinos" },
};

export default async function DestinationsPage() {
  const [destinations, categories] = await Promise.all([getDestinations(), getCategories()]);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Destinos" }]}
        eyebrow="Catálogo"
        title="Todos los destinos"
        description="Explora lugares de todo el país y abre cada uno para conocer su ubicación, qué lo hace especial y otros destinos similares."
      >
        {categories.length > 0 && (
          <nav aria-label="Filtrar por categoría" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categorias/${category.slug}`}
                    className="inline-flex rounded-full border border-ocean-900/15 bg-white px-4 py-2 text-sm font-semibold text-ocean-900 transition hover:border-leaf-600 hover:text-leaf-700"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageHeader>

      <section aria-label="Listado de destinos" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {destinations.length === 0 ? (
          <EmptyState
            title="Todavía no hay destinos publicados"
            message="El catálogo está vacío por ahora. Vuelve pronto para descubrir nuevos lugares."
            action={{ href: "/", label: "Volver al inicio" }}
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-muted">
              {destinations.length === 1 ? "1 destino disponible" : `${destinations.length} destinos disponibles`}
            </p>
            <DestinationGrid destinations={destinations} />
          </>
        )}
      </section>
    </>
  );
}
