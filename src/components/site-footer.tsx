import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ocean-950 text-sand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-white">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-sand-200">
            Un catálogo visual para descubrir playas, volcanes, pueblos, lagos y sitios
            arqueológicos de El Salvador.
          </p>
        </div>

        <nav aria-label="Secundaria">
          <p className="text-sm font-semibold uppercase tracking-wider text-sand-300">Explorar</p>
          <ul className="mt-3 space-y-2 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sand-100 underline-offset-4 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/creditos" className="text-sand-100 underline-offset-4 hover:text-white hover:underline">
                Créditos de imágenes
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm text-sand-200">
          <p className="text-sm font-semibold uppercase tracking-wider text-sand-300">Sobre el proyecto</p>
          <p className="mt-3 leading-relaxed">
            Proyecto académico construido con Next.js (App Router) y Supabase. Fotografías de
            Wikimedia Commons bajo licencias Creative Commons; consulta los{" "}
            <Link href="/creditos" className="font-semibold text-white underline underline-offset-4">
              créditos
            </Link>
            .
          </p>
          <p className="mt-3">
            <a
              href={site.repositoryUrl}
              className="font-semibold text-white underline underline-offset-4"
              rel="noopener noreferrer"
              target="_blank"
            >
              Código fuente en GitHub
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-sand-300 sm:px-6 lg:px-8">
          La información es orientativa; confirma horarios, accesos y condiciones antes de viajar.
        </p>
      </div>
    </footer>
  );
}
