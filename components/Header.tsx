"use client";

export default function Header() {
  return (
    <header className="relative border-b border-blue-900/40 bg-navy-800/80 backdrop-blur-sm">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-cyan-500" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            {/* Shield icon */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              {/* Pulse ring */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-navy-800 animate-ping-slow" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-white">Dhoka</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Check
                </span>
                <span className="text-slate-400 font-light ml-1.5 text-base sm:text-lg">AI</span>
              </h1>
              <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
                Scam &amp; Phishing Detector
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-700 border border-green-900/60 text-xs text-green-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              System Online
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-700 border border-blue-900/60 text-xs text-blue-400 font-mono">
              Gemma 4
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
