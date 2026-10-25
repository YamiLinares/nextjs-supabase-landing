import Link from "next/link";
import type { CategoryWithCount } from "@/lib/types";

export function CategoryCard({ category }: { category: CategoryWithCount }) {
  const count = category.destinationCount;
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-leaf-600/40 hover:shadow-card-hover focus-within:shadow-card-hover">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
        <CategoryIcon slug={category.slug} />
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold text-ocean-900">
        <Link
          href={`/categorias/${category.slug}`}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {category.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{category.description}</p>
      <p className="mt-4 text-sm font-semibold text-ocean-700">
        {count === 1 ? "1 destino" : `${count} destinos`}
        <span aria-hidden="true" className="ml-1 inline-block transition group-hover:translate-x-1">
          →
        </span>
      </p>
    </article>
  );
}

export function CategoryIcon({ slug }: { slug: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (slug) {
    case "playas":
      return (
        <svg {...common}>
          <circle cx="17" cy="6" r="2.5" />
          <path d="M2 15c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5-.5M2 19.5c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5-.5" />
        </svg>
      );
    case "volcanes-y-montanas":
      return (
        <svg {...common}>
          <path d="M2 20l7-11 3 4 2-3 8 10H2z" />
          <path d="M9 9l1.5-4M11 6l1-2" />
        </svg>
      );
    case "pueblos-con-encanto":
      return (
        <svg {...common}>
          <path d="M4 21V10l4-3 4 3v11M12 21V8l4-4 4 4v13M2 21h20" />
          <path d="M16 4V2M7 21v-4h2v4M16 12h0" />
        </svg>
      );
    case "lagos-volcanicos":
      return (
        <svg {...common}>
          <path d="M3 14l5-7 3 3 3-4 7 8" />
          <ellipse cx="12" cy="17.5" rx="8" ry="3" />
        </svg>
      );
    case "sitios-arqueologicos":
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21v-4h14v4M7 17v-4h10v4M9 13V9h6v4M11 9V6h2v3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
        </svg>
      );
  }
}
