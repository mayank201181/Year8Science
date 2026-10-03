"use client";

import { useStore } from "@/lib/store";
import { SCIENCE_DIAGNOSTIC_BUILD } from "@/lib/clientDiagnostic";

const STAGES = { loading: "Loading", anon: "Sign-in", "no-profile": "Choose learner", ready: "Learning", "load-error": "Progress unavailable" } as const;
export function DiagnosticStatus() {
  const { status } = useStore();
  return <div aria-label="Diagnostic build and stage" style={{ position: "fixed", bottom: 0, left: 0, zIndex: 60, padding: "3px 6px", maxWidth: "100%", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", font: "11px system-ui, sans-serif" }}>
    Build: {SCIENCE_DIAGNOSTIC_BUILD} · Stage: {STAGES[status]}
  </div>;
}
