import { NotFoundView } from "@/components/not-found-view";

export default function DestinationNotFound() {
  return (
    <NotFoundView
      title="No encontramos ese destino"
      message="Puede que el enlace esté mal escrito o que el destino ya no esté disponible en el catálogo."
      primary={{ href: "/destinos", label: "Ver todos los destinos" }}
    />
  );
}
