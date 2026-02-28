'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: any[]
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: Props) {
    // If resetKeys change and there's an error, reset the error boundary
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])
    ) {
      this.reset()
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 
                      flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Icon */}
            <div className="text-center mb-8">
              <div className="inline-block text-8xl mb-4 animate-bounce">
                ⚠️
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-400 text-lg">
                We're sorry for the inconvenience. Please try again.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-8">
                <p className="text-red-400 font-mono text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-red-400 text-xs">
                    <summary className="cursor-pointer mb-2">Stack Trace</summary>
                    <pre className="whitespace-pre-wrap font-mono">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 
                         text-white rounded-lg font-semibold hover:scale-105 
                         transition-all flex items-center justify-center gap-2"
              >
                <span>↻</span>
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 
                         text-white rounded-lg font-semibold transition-colors
                         flex items-center justify-center gap-2"
              >
                <span>🏠</span>
                Go Home
              </button>

              <Link
                href="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 
                         text-white rounded-lg font-semibold transition-colors
                         flex items-center justify-center gap-2"
              >
                <span>📞</span>
                Contact Support
              </Link>
            </div>

            {/* Error ID */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Error ID: {Date.now().toString(36)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                If this problem persists, please contact support.
              </p>
            </div>

            {/* Admin Info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Admin: <span className="text-yellow-400">Hafiz Sajid Syed</span>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}