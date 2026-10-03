"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorFallback } from "./ErrorFallback";

/**
 * Catches render errors below it. `silent` is for optional chrome (header,
 * mascot): if it breaks, it disappears instead of replacing the whole page.
 */
export class ErrorBoundary extends Component<{ children: ReactNode; silent?: boolean }, { failed: boolean; error: unknown }> {
  state = { failed: false, error: null as unknown };

  static getDerivedStateFromError(error: unknown) {
    return { failed: true, error };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.silent) return null;
    return <ErrorFallback error={this.state.error} onRetry={() => this.setState({ failed: false, error: null })} />;
  }
}
