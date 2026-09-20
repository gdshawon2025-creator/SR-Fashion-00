import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught runtime error:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans text-neutral-900">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border border-neutral-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              অ্যাপ লোড হতে সাময়িক সমস্যা হয়েছে
            </h2>
            <p className="text-xs text-neutral-600">
              ব্রাউজারে সংরক্ষিত পুরনো ক্যাশ বা ডেটা সমস্যার কারণে এটি হতে পারে। নিচের বাটনে ক্লিক করে পুনরায় লোড করুন।
            </p>
            {this.state.error?.message && (
              <div className="text-[11px] font-mono text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 text-left overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                রিলোড করুন
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                রিসেট ও রিলোড
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
