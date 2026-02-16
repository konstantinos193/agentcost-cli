'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger, AppError } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="terminal-card p-8 max-w-2xl">
            <div className="mb-6">
              <h1 className="terminal-title text-red-500 mb-2">
                SYSTEM_ERROR
              </h1>
              <div className="terminal-subtitle text-sm">
                &gt; CRITICAL_FAILURE_DETECTED
              </div>
            </div>
            
            <div className="mb-6">
              <div className="terminal-text-dim text-sm mb-2">
                An unexpected error occurred. The system has been notified.
              </div>
              {this.state.error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded">
                  <div className="terminal-text text-xs font-mono">
                    {this.state.error.message}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="terminal-btn"
              >
                [RELOAD_SYSTEM]
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="terminal-btn"
              >
                [RETRY_ACTION]
              </button>
            </div>

            <div className="mt-6 terminal-text-dim text-xs">
              Error ID: {Date.now()}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
