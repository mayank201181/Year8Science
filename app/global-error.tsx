"use client";

import { DiagnosticScreen } from "@/components/DiagnosticScreen";
import { classifyDiagnostic } from "@/lib/clientDiagnostic";

// Next requires this fallback to replace the root html/body itself.
export default function GlobalError({ error }: { error: unknown }) {
  return <html lang="en"><body><DiagnosticScreen code="SCI-ROOT" kind={classifyDiagnostic(error)} /></body></html>;
}
