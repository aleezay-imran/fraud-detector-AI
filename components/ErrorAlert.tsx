"use client";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 p-4 rounded-xl border border-red-800/60 bg-red-900/20 animate-fade-in"
    >
      <svg
        className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-400 mb-0.5">Analysis Failed</p>
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded"
          aria-label="Dismiss error"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
