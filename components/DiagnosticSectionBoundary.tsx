"use client";

import { Component, type ReactNode } from "react";
import { DiagnosticScreen } from "./DiagnosticScreen";
import { classifyDiagnostic, reportDiagnostic, type DiagnosticKind } from "@/lib/clientDiagnostic";

/** Explicit locations survive production minification; never inspect stack text. */
export class DiagnosticSectionBoundary extends Component<
  { section: "SiteHeader" | "Mascot"; children: ReactNode },
  { kind: DiagnosticKind | null }
> {
  state: { kind: DiagnosticKind | null } = { kind: null };
  static getDerivedStateFromError(error: unknown) { return { kind: classifyDiagnostic(error) }; }
  componentDidCatch(error: unknown) {
    reportDiagnostic("SCI-REACT", classifyDiagnostic(error), this.props.section);
  }
  render() {
    return this.state.kind === null ? this.props.children :
      <DiagnosticScreen code="SCI-REACT" kind={this.state.kind} component={this.props.section} />;
  }
}
