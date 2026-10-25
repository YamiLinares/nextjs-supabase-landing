"use client";

// Client Component: los límites de error de React se ejecutan en el
// navegador y el botón de reintento necesita un manejador de eventos.
import Link from "next/link";

interface ErrorViewProps {
  error: unknown;
  retry: () => void;
  title?: string;
}

const CONFIG_HINT = "Supabase no está configurado";

export function ErrorView({ error, retry, title = "No pudimos cargar los destinos" }: ErrorViewProps) {
  // En producción Next.js oculta el mensaje real del servidor; solo en
  // desarrollo mostramos la pista de configuración para facilitar el arranque.
  const message = error instanceof Error ? error.message : "";
  const showConfigHint = process.env.NODE_ENV === "development" && message.includes(CONFIG_HINT);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6" role="alert">
      <p className="text-sm font-semibold uppercase tracking-wider text-leaf-700">Algo salió mal</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ocean-900 sm:text-4xl">{title}</h1>
      <p className="mt-4 leading-relaxed text-ink-muted">
        Hubo un problema al conectar con el catálogo. Puede ser algo temporal: intenta de nuevo
        en unos segundos.
      </p>
      {showConfigHint && (
        <p className="mt-4 rounded-xl border border-sand-300 bg-sand-100 px-4 py-3 text-left text-sm text-ink">
          <strong>Modo desarrollo:</strong> {message}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-ocean-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-800"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-ocean-900/20 px-6 py-3 text-sm font-semibold text-ocean-900 transition hover:bg-sand-200"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
