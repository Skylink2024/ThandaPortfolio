"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section-pad flex min-h-[50vh] flex-col items-center justify-center text-center">
          <p className="font-[family-name:var(--font-display)] text-3xl text-gold">
            Something went wrong
          </p>
          <p className="mt-3 max-w-md text-cream-dim">
            Please refresh the page and try again.
          </p>
          <button
            type="button"
            className="mt-6 border border-gold/40 px-5 py-2 text-sm tracking-wide text-gold transition hover:bg-gold/10"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
