import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-proxio-darker text-proxio-text-main flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="max-w-md">
            <h1 className="text-proxio-text-main text-2xl font-bold">
              Algo correu mal · Something went wrong
            </h1>
            <p className="text-proxio-text-muted mt-3 text-base leading-relaxed">
              Ocorreu um erro inesperado. Por favor, recarrega a página.
              <br />
              <span className="text-sm">An unexpected error occurred. Please reload the page.</span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-proxio-accent hover:bg-proxio-accent-hover text-proxio-darker mt-8 rounded-md px-6 py-3 font-bold transition-colors"
            >
              Recarregar · Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
