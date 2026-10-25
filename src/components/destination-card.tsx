import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import type { Destination } from "@/lib/types";

export function DestinationCard({ destination, priority = false }: { destination: Destination; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-within:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        <SafeImage
          src={destination.imageUrl}
          alt={destination.imageAlt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          preload={priority}
        />
        {destination.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ocean-900 shadow-sm">
            {destination.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold text-ocean-900">
          <Link
            href={`/destinos/${destination.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {destination.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-leaf-700">
          <PinIcon />
          {destination.location}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">{destination.summary}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-ocean-700" aria-hidden="true">
          Ver destino <span className="inline-block transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </article>
  );
}

export function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination, index) => (
        <li key={destination.id}>
          <DestinationCard destination={destination} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}

export function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 22s7-6.3 7-12a7 7 0 10-14 0c0 5.7 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </svg>
  );
}
