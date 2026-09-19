import React from 'react';
import { Heart, RefreshCw, AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PetLife AI Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-slate-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center font-bold">
              <Heart className="w-7 h-7 text-amber-700" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">PetLife AI Application Notice</h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
              The application encountered a startup notice. If you are configuring Firebase, please ensure valid keys are provided in <code className="font-mono bg-white px-1 py-0.5 rounded">.env.local</code>.
            </p>

            {this.state.error?.message && (
              <p className="text-xs text-rose-600 font-mono bg-rose-50 p-2.5 rounded-xl border border-rose-200 break-all text-left">
                {this.state.error.message}
              </p>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
