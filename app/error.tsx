"use client";

import { ErrorFallback } from "@/components/ErrorFallback";

export default function ErrorPage({ error, unstable_retry, reset }: { error: Error; unstable_retry?: () => void; reset: () => void }) {
  return <ErrorFallback error={error} onRetry={unstable_retry ?? reset} />;
}
