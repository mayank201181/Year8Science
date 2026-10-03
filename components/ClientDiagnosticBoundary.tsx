"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { currentProgressRenderHint } from "@/lib/progressRenderHint";
import { DiagnosticScreen } from "./DiagnosticScreen";
import { classifyComponent, classifyDiagnostic, reportDiagnostic, subscribeDiagnosticBlock, type DiagnosticFailure } from "@/lib/clientDiagnostic";

/** Wrap the provider too: errors in a same-segment layout bypass app/error.tsx. */
export class ClientDiagnosticBoundary extends Component<{ children: ReactNode }, { failure: DiagnosticFailure | null }> {
  state: { failure: DiagnosticFailure | null } = { failure: null };
  private unsubscribe: (() => void) | undefined;
  static getDerivedStateFromError(error: unknown) {
    return { failure: { code: "SCI-REACT" as const, kind: classifyDiagnostic(error), component: "Unknown" as const, shape: currentProgressRenderHint() } };
  }
  componentDidCatch(error: unknown, info: ErrorInfo) {
    const failure: DiagnosticFailure = { code: "SCI-REACT", kind: classifyDiagnostic(error), component: classifyComponent(info.componentStack), shape: currentProgressRenderHint() };
    reportDiagnostic(failure.code, failure.kind, failure.component);
    this.setState({ failure });
  }
  // Never inspect error.message, error.stack, URL, event.message, or learner data.
  private onError = (event: ErrorEvent) => { reportDiagnostic("SCI-JS", classifyDiagnostic(event.error)); };
  private onRejection = (event: PromiseRejectionEvent) => { reportDiagnostic("SCI-PROMISE", classifyDiagnostic(event.reason)); };
  componentDidMount() {
    this.unsubscribe = subscribeDiagnosticBlock(failure => {
      this.setState(previous => previous.failure === null ? { failure } : previous);
    });
    window.addEventListener("error", this.onError);
    window.addEventListener("unhandledrejection", this.onRejection);
  }
  componentWillUnmount() {
    this.unsubscribe?.();
    window.removeEventListener("error", this.onError);
    window.removeEventListener("unhandledrejection", this.onRejection);
  }
  render() {
    return this.state.failure === null ? this.props.children : <DiagnosticScreen {...this.state.failure} />;
  }
}
