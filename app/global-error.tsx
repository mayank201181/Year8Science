"use client";

import { ErrorFallback } from "@/components/ErrorFallback";

// Replaces the root layout, so it must render its own html and body.
export default function GlobalError({ error, unstable_retry, reset }: { error: Error; unstable_retry?: () => void; reset: () => void }) {
  return <html lang="en"><body style={{ margin: 0 }}><ErrorFallback error={error} onRetry={unstable_retry ?? reset} /></body></html>;
}
