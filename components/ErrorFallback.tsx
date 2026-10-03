"use client";

// Shown when part of the app fails to render. Inline styles so it still looks
// right from global-error.tsx, where the app stylesheet may not have loaded.

const BUILD = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

function describe(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 300);
  return String(error).slice(0, 300);
}

export function ErrorFallback({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const button = { padding: "12px 20px", borderRadius: "12px", fontWeight: 600, fontSize: "16px", cursor: "pointer" } as const;
  return (
    <main role="alert" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", background: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      <section style={{ maxWidth: "420px", textAlign: "center" }}>
        <div style={{ fontSize: "48px" }} aria-hidden>🧪</div>
        <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "12px 0 8px" }}>Oops, that experiment fizzled</h1>
        <p style={{ color: "#475569", lineHeight: 1.5 }}>
          Something went wrong on this screen. Your saved progress is safe. Try again, or head back to the home page.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
          <button type="button" onClick={() => (onRetry ? onRetry() : window.location.reload())}
            style={{ ...button, border: "1px solid #4f46e5", background: "#4f46e5", color: "white" }}>
            Try again
          </button>
          <button type="button" onClick={() => { window.location.href = "/"; }}
            style={{ ...button, border: "1px solid #cbd5e1", background: "white", color: "#334155" }}>
            Go to home
          </button>
        </div>
        <details style={{ marginTop: "24px", fontSize: "12px", color: "#64748b", textAlign: "left" }}>
          <summary style={{ cursor: "pointer", textAlign: "center" }}>Details for grown-ups</summary>
          <p style={{ marginTop: "8px", wordBreak: "break-word", fontFamily: "ui-monospace, monospace" }}>{describe(error)}</p>
          <p style={{ fontFamily: "ui-monospace, monospace" }}>Build {BUILD}</p>
        </details>
      </section>
    </main>
  );
}
