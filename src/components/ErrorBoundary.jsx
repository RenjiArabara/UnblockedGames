import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#34d399' }}>
            Nexus Arcade
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
            An unexpected error occurred while loading.
          </p>
          <pre style={{
            fontSize: '12px',
            backgroundColor: '#0f172a',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            color: '#f43f5e',
            maxWidth: '600px',
            overflow: 'auto',
            marginBottom: '16px'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: '#020617',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
