/** Esqueletos de carga reutilizados por loading.tsx y <Suspense>. */

export function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-sand-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-sand-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-sand-100" />
        <div className="h-4 w-full animate-pulse rounded bg-sand-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-sand-100" />
      </div>
    </div>
  );
}

export function DestinationGridSkeleton({ count = 6, label = "Cargando destinos…" }: { count?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <DestinationCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando categorías…</span>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="rounded-2xl border border-sand-200 bg-white p-6 shadow-card" aria-hidden="true">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-sand-200" />
            <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-sand-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-sand-100" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-sand-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="bg-sand-100" aria-hidden="true">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="h-4 w-32 animate-pulse rounded bg-sand-200" />
        <div className="mt-4 h-10 w-2/3 max-w-md animate-pulse rounded bg-sand-200" />
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-sand-200" />
      </div>
    </div>
  );
}
