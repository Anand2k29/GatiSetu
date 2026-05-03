import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[GatiSetu] Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8">
          <div className="glass-card p-8 max-w-md text-center space-y-4">
            <h2 className="text-xl font-bold text-danger">System Error</h2>
            <p className="text-sm text-text-secondary">{this.state.error?.message || 'Something went wrong'}</p>
            <button onClick={() => window.location.reload()} className="btn-cta">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
