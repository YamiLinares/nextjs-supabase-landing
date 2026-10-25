import { NotFoundView } from "@/components/not-found-view";

export default function NotFound() {
  return (
    <NotFoundView
      title="Esta página no existe"
      message="El enlace que seguiste no lleva a ninguna parte del sitio. Prueba desde el catálogo de destinos."
      primary={{ href: "/destinos", label: "Ver destinos" }}
    />
  );
}
