import type { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getCategories } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora los destinos de El Salvador por categoría: playas, volcanes, pueblos, lagos y sitios arqueológicos.",
  alternates: { canonical: "/categorias" },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Categorías" }]}
        eyebrow="Categorías"
        title="Explora por categoría"
        description="Elige el tipo de experiencia que buscas y descubre los destinos que la ofrecen."
      />
      <section aria-label="Listado de categorías" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <EmptyState
            title="Sin categorías por ahora"
            message="Todavía no hay categorías en el catálogo."
            action={{ href: "/", label: "Volver al inicio" }}
          />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.id}>
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
