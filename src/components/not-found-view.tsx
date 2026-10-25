import Link from "next/link";

interface NotFoundViewProps {
  title: string;
  message: string;
  primary: { href: string; label: string };
}

export function NotFoundView({ title, message, primary }: NotFoundViewProps) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl font-semibold text-sand-300" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ocean-900 sm:text-4xl">{title}</h1>
      <p className="mt-4 leading-relaxed text-ink-muted">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={primary.href}
          className="rounded-full bg-ocean-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-800"
        >
          {primary.label}
        </Link>
        <Link
          href="/"
          className="rounded-full border border-ocean-900/20 px-6 py-3 text-sm font-semibold text-ocean-900 transition hover:bg-sand-200"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
