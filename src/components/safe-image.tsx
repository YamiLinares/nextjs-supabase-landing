"use client";

// Client Component: necesita el evento onError del navegador para mostrar
// un respaldo digno si la fotografía no se puede cargar.
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { isAllowedImageSrc } from "@/lib/images";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !isAllowedImageSrc(src)) {
    return <ImageFallback label={alt} />;
  }

  return <Image src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}

export function ImageFallback({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={`${label} (imagen no disponible)`}
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-800 via-ocean-700 to-leaf-700"
    >
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white/70">
        <path d="M3 18l6-8 4 5 3-4 5 7H3z" fill="currentColor" />
        <circle cx="17" cy="7" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
