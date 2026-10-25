import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200/80 bg-sand-50/90 backdrop-blur supports-[backdrop-filter]:bg-sand-50/75">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name}, ir al inicio`}>
          <Logo />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-ocean-900">{site.name}</span>
            <span className="hidden text-xs font-medium text-ink-muted sm:block">{site.tagline}</span>
          </span>
        </Link>
        <MainNav items={site.nav} />
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <circle cx="18" cy="18" r="18" fill="#0b2e4f" />
      <path d="M7 25 L15 13 L19 19 L22 15 L29 25 Z" fill="#f7f0e3" />
      <path d="M15 13 L17.2 16.3 L15 17.5 L12.8 16.3 Z" fill="#2e7a4d" />
      <path d="M6 27.5 C10 25.5 14 29.5 18 27.5 S26 25.5 30 27.5" stroke="#7fb3d9" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
