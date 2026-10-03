"use client";

import { DiagnosticScreen } from "@/components/DiagnosticScreen";
import { classifyDiagnostic } from "@/lib/clientDiagnostic";

// Only classify the allowlisted name; ignore message, digest, and component details.
export default function ErrorPage({ error }: { error: unknown }) {
  return <DiagnosticScreen code="SCI-ROUTE" kind={classifyDiagnostic(error)} />;
}
