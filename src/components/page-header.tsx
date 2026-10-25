import Link from "next/link";
import type { ReactNode } from "react";

interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="font-medium text-ocean-700 underline-offset-4 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-sand-200 bg-sand-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && (
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-leaf-700">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ocean-900 sm:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{description}</p>}
        {children}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-leaf-700">{eyebrow}</p>
        <h2 id={id} className="mt-2 font-display text-3xl font-semibold tracking-tight text-ocean-900 sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
