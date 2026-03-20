import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Maaden prototype error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: 32,
            background: '#f4f1ea',
            color: '#0f1210',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: 18, marginBottom: 12 }}>The app hit a runtime error</h1>
          <p style={{ color: '#5c5a55', marginBottom: 16, maxWidth: 560 }}>
            Copy the message below if you are reporting the issue. Try a normal browser tab (Chrome/Safari) at{' '}
            <code style={{ background: '#e8e4dc', padding: '2px 6px' }}>http://localhost:5173/cost</code>
          </p>
          <pre
            style={{
              background: '#1a1c1b',
              color: '#faf8f4',
              padding: 16,
              borderRadius: 4,
              overflow: 'auto',
              fontSize: 13,
            }}
          >
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
