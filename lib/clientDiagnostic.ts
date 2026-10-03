import { currentProgressRenderHint, type ProgressRenderHint } from "./progressRenderHint";

/** Only fixed, non-identifying values may enter the diagnostic UI. */
export const SCIENCE_DIAGNOSTIC_BUILD = "SCI-20261003-03";
export const DIAGNOSTIC_CODES = ["SCI-REACT", "SCI-JS", "SCI-PROMISE", "SCI-ROUTE", "SCI-ROOT"] as const;
export type DiagnosticCode = typeof DIAGNOSTIC_CODES[number];
export type DiagnosticKind = "TypeError" | "RangeError" | "SecurityError" | "ChunkLoadError" | "Unknown";
export type DiagnosticComponent = "Home" | "SiteHeader" | "Mascot" | "ProgressProvider" | "AppGate" | "ProfilePicker" | "Unknown";
export interface DiagnosticFailure { code: DiagnosticCode; kind: DiagnosticKind; component: DiagnosticComponent; shape: ProgressRenderHint }
const COMPONENTS = ["Home", "SiteHeader", "Mascot", "ProgressProvider", "AppGate", "ProfilePicker"] as const;
/** Stack text is inspected only to select a fixed label, never retained or shown.
 * Production minification may leave this Unknown; the code/category remain useful.
 */
export function classifyComponent(stack: string | null | undefined): DiagnosticComponent {
  if (typeof stack !== "string") return "Unknown";
  for (const line of stack.split("\n")) {
    for (const component of COMPONENTS) {
      if (new RegExp("^\\s*(?:at|in) " + component + "(?:[ (]|$)").test(line)) return component;
    }
  }
  return "Unknown";
}
let blocked: DiagnosticFailure | null = null;
const listeners = new Set<(failure: DiagnosticFailure) => void>();
/** Read only the fixed name allowlist; never retain the error or any free text. */
export function classifyDiagnostic(error: unknown): DiagnosticKind {
  try {
    const name = typeof error === "object" && error !== null ? (error as { name?: unknown }).name : undefined;
    switch (name) {
      case "TypeError": case "RangeError": case "SecurityError": case "ChunkLoadError": return name;
      default: return "Unknown";
    }
  } catch { return "Unknown"; }
}
export function diagnosticBlocked(): boolean { return blocked !== null; }
export function reportDiagnostic(code: DiagnosticCode, kind: DiagnosticKind = "Unknown", component: DiagnosticComponent = "Unknown"): void {
  if (blocked !== null) return;
  blocked = { code, kind, component, shape: currentProgressRenderHint() };
  for (const listener of listeners) listener(blocked);
}
export function subscribeDiagnosticBlock(listener: (failure: DiagnosticFailure) => void): () => void {
  listeners.add(listener);
  if (blocked !== null) listener(blocked);
  return () => { listeners.delete(listener); };
}
