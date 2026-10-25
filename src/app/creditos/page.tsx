import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getDestinations } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Créditos de imágenes",
  description: "Autores y licencias de las fotografías usadas en Explora El Salvador.",
  alternates: { canonical: "/creditos" },
};

export default async function CreditsPage() {
  const destinations = await getDestinations();
  const credited = destinations.filter((destination) => destination.imageCredit);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Créditos" }]}
        eyebrow="Atribuciones"
        title="Créditos de imágenes"
        description="Las fotografías provienen de Wikimedia Commons y se usan según sus licencias. Fueron redimensionadas para la web; no se alteró su contenido."
      />
      <section aria-label="Lista de créditos" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        {credited.length === 0 ? (
          <EmptyState title="Sin créditos que mostrar" message="No hay fotografías publicadas en el catálogo." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <caption className="sr-only">Autor y licencia de cada fotografía</caption>
              <thead className="bg-sand-100 text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th scope="col" className="px-2.5 py-3 break-words sm:px-5 font-semibold">Destino</th>
                  <th scope="col" className="px-2.5 py-3 break-words sm:px-5 font-semibold">Autor</th>
                  <th scope="col" className="px-2.5 py-3 break-words sm:px-5 font-semibold">Licencia</th>
                  <th scope="col" className="px-2.5 py-3 break-words sm:px-5 font-semibold">Fuente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {credited.map((destination) => (
                  <tr key={destination.id}>
                    <td className="px-2.5 py-3 break-words sm:px-5 font-medium">
                      <Link href={`/destinos/${destination.slug}`} className="text-ocean-700 underline-offset-4 hover:underline">
                        {destination.name}
                      </Link>
                    </td>
                    <td className="px-2.5 py-3 break-words sm:px-5">{destination.imageCredit}</td>
                    <td className="px-2.5 py-3 break-words sm:px-5">{destination.imageLicense}</td>
                    <td className="px-2.5 py-3 break-words sm:px-5">
                      {destination.imageSourceUrl ? (
                        <a
                          href={destination.imageSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ocean-700 underline underline-offset-2"
                        >
                          Wikimedia Commons<span className="sr-only"> (abre en otra pestaña)</span>
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-6 text-sm text-ink-muted">
          La imagen de portada es la fotografía del Lago de Coatepeque incluida en la tabla.
        </p>
      </section>
    </>
  );
}
