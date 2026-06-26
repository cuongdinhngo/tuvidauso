import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base flex items-center justify-center p-4">
          <div className="max-w-md bg-surface border border-bad/40 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-bad mb-2">Lỗi không mong muốn</h2>
            <p className="text-sm text-ink-muted mb-4">
              {this.state.error?.message || 'Đã xảy ra lỗi khi hiển thị trang.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '#/';
              }}
              className="px-4 py-2.5 min-h-[44px] bg-gold text-base font-semibold hover:bg-gold/90 rounded-md text-sm"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
