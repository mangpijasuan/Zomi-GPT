
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary class component to catch rendering errors in the component tree.
 */
class ErrorBoundary extends Component<Props, State> {
  // Fix: The state is initialized directly. The redundant constructor is removed.
  public state: State = { hasError: false };

  /**
   * Automatically update state when a child component throws an error.
   */
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  /**
   * Lifecycle method to handle error logging.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#0a0a0a]">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Something went wrong</h2>
          <p className="text-gray-400 mb-8 max-w-sm">We encountered an unexpected error. Don't worry, your data is safe.</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
          >
            <RotateCcw size={18} />
            Reload Application
          </button>
        </div>
      );
    }

    /**
     * Return children from props when no error has occurred.
     */
    // Fix: Using type assertion to any for 'this' to resolve property recognition issues with 'props' 
    // in certain TypeScript environments where inheritance from React.Component might not be correctly recognized.
    return (this as any).props.children;
  }
}

export default ErrorBoundary;
