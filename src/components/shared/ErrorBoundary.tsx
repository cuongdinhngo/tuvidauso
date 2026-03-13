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
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md bg-gray-900 border border-red-900/50 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Lỗi không mong muốn</h2>
            <p className="text-sm text-gray-400 mb-4">
              {this.state.error?.message || 'Đã xảy ra lỗi khi hiển thị trang.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '#/';
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm"
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
