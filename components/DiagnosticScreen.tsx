"use client";

import { useEffect } from "react";
import { reportDiagnostic, SCIENCE_DIAGNOSTIC_BUILD, type DiagnosticCode, type DiagnosticKind, type DiagnosticComponent } from "@/lib/clientDiagnostic";

/** Do not accept or render an Error, message, stack, digest, or learner data. */
export function DiagnosticScreen({ code, kind = "Unknown", component = "Unknown" }: { code: DiagnosticCode; kind?: DiagnosticKind; component?: DiagnosticComponent }) {
  useEffect(() => { reportDiagnostic(code, kind, component); }, [code, kind, component]);
  return (
    <main role="alert" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", background: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      <section style={{ maxWidth: "440px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Science couldn&apos;t open this screen</h1>
        <p>Further progress saves are paused on this page. Please share the code and build below so we can identify where it stopped.</p>
        <p><strong>Code: {code}</strong></p>
        <p>Category: {kind}</p>
        <p>Component: {component}</p>
        <p>Build: {SCIENCE_DIAGNOSTIC_BUILD}</p>
        <button type="button" onClick={() => window.location.reload()} style={{ marginTop: "12px", padding: "12px 20px", borderRadius: "10px", border: "1px solid #4f46e5", background: "#4f46e5", color: "white", fontWeight: 600 }}>Reload page</button>
      </section>
    </main>
  );
}
