"use client";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function MessageInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
}: MessageInputProps) {
  const charCount = value.length;
  const maxChars = 10000;
  const isNearLimit = charCount > maxChars * 0.8;
  const isOverLimit = charCount > maxChars;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <section aria-labelledby="input-heading">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4 text-blue-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <h2 id="input-heading" className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Message to Analyze
        </h2>
      </div>

      <div className="space-y-3">
        {/* Textarea */}
        <div className="relative">
          <textarea
            id="message-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste a suspicious message here — job offer, scholarship, payment request, or any message that doesn't feel right…&#10;&#10;Roman Urdu bhi likh sakte hain / Roman Urdu is also supported"
            rows={8}
            maxLength={maxChars}
            disabled={isLoading}
            aria-label="Suspicious message input"
            aria-describedby={error ? "input-error" : "input-hint"}
            className={`w-full bg-navy-900/80 border rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 resize-none font-mono leading-relaxed transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed ${
              error
                ? "border-red-700/70 focus:ring-red-500/40 focus:border-red-600"
                : "border-navy-600 focus:ring-blue-500/40 focus:border-blue-600 hover:border-navy-500"
            }`}
          />

          {/* Char counter */}
          <span
            className={`absolute bottom-3 right-3 text-xs font-mono ${
              isOverLimit
                ? "text-red-400"
                : isNearLimit
                ? "text-amber-400"
                : "text-slate-600"
            }`}
            aria-live="polite"
            aria-label={`${charCount} of ${maxChars} characters used`}
          >
            {charCount.toLocaleString()}/{maxChars.toLocaleString()}
          </span>
        </div>

        {/* Validation error */}
        {error && (
          <p
            id="input-error"
            role="alert"
            className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg px-3 py-2"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}

        {/* Submit row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p id="input-hint" className="text-xs text-slate-500">
            {isLoading ? (
              <span className="text-blue-400 font-mono animate-pulse">
                Analyzing message…
              </span>
            ) : (
              <>
                Press{" "}
                <kbd className="px-1 py-0.5 rounded bg-navy-700 border border-navy-500 text-slate-400 font-mono text-xs">
                  Ctrl+Enter
                </kbd>{" "}
                or click Analyze to scan
              </>
            )}
          </p>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || isOverLimit}
            aria-busy={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-700/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500/60 active:scale-95 min-w-[130px] justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing…
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                  />
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
