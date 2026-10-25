import Link from "next/link";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: { href: string; label: string };
}

/** Estado vacío: la consulta funcionó pero no devolvió resultados. */
export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-sand-300 bg-white/60 px-6 py-12 text-center">
      <p className="font-display text-xl font-semibold text-ocean-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{message}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex rounded-full bg-ocean-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean-800"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
