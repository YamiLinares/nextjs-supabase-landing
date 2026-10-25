"use client";

import { ErrorView } from "@/components/error-view";

export default function RootError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} title="No pudimos cargar esta página" />;
}
