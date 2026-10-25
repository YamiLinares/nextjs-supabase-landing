"use client";

import { ErrorView } from "@/components/error-view";

export default function DestinationsError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} title="No pudimos cargar el catálogo" />;
}
