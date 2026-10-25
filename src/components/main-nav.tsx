"use client";

// Client Component: necesita estado para abrir/cerrar el menú móvil y
// usePathname para marcar el enlace activo.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Cierra el menú móvil al cambiar de ruta
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const linkClass = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive(pathname, href)
        ? "bg-ocean-900 text-white"
        : "text-ocean-900 hover:bg-sand-200"
    }`;

  return (
    <>
      <nav aria-label="Principal" className="hidden md:block">
        <ul className="flex items-center gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={linkClass(item.href)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ocean-900 hover:bg-sand-200 md:hidden"
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <nav
        id="menu-movil"
        aria-label="Principal móvil"
        className={`absolute inset-x-0 top-full border-b border-sand-200 bg-sand-50 shadow-lg md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block ${linkClass(item.href)} py-3 text-base`}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
