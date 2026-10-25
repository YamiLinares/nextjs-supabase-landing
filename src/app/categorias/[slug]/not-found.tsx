import { NotFoundView } from "@/components/not-found-view";

export default function CategoryNotFound() {
  return (
    <NotFoundView
      title="No encontramos esa categoría"
      message="La categoría que buscas no existe o cambió de nombre. Revisa las categorías disponibles."
      primary={{ href: "/categorias", label: "Ver categorías" }}
    />
  );
}
