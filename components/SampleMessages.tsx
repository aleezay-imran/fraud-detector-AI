"use client";

import { SAMPLE_MESSAGES } from "@/lib/samples";
import { SampleMessage } from "@/lib/types";

interface SampleMessagesProps {
  onSelect: (text: string) => void;
}

const categoryColors: Record<string, string> = {
  "Education Fraud": "text-purple-400 bg-purple-900/30 border-purple-800/50",
  "Employment Scam": "text-amber-400 bg-amber-900/30 border-amber-800/50",
  "Phishing Attempt": "text-red-400 bg-red-900/30 border-red-800/50",
  "Lottery Fraud": "text-pink-400 bg-pink-900/30 border-pink-800/50",
  "Investment Fraud": "text-cyan-400 bg-cyan-900/30 border-cyan-800/50",
};

function SampleCard({
  sample,
  onSelect,
}: {
  sample: SampleMessage;
  onSelect: (text: string) => void;
}) {
  const colorClass =
    categoryColors[sample.category] ??
    "text-blue-400 bg-blue-900/30 border-blue-800/50";

  return (
    <button
      type="button"
      onClick={() => onSelect(sample.text)}
      className="group w-full text-left p-3 rounded-lg border border-navy-600 bg-navy-800/60 hover:bg-navy-700/60 hover:border-blue-700/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      aria-label={`Load sample: ${sample.label}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight">
          {sample.label}
        </span>
        {sample.language === "Roman Urdu" || sample.language === "Mixed" ? (
          <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-indigo-900/40 border border-indigo-800/50 text-indigo-400 font-mono">
            UR
          </span>
        ) : null}
      </div>
      <span
        className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mb-2 ${colorClass}`}
      >
        {sample.category}
      </span>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed group-hover:text-slate-400 transition-colors">
        {sample.text.slice(0, 100)}…
      </p>
    </button>
  );
}

export default function SampleMessages({ onSelect }: SampleMessagesProps) {
  return (
    <section aria-labelledby="samples-heading">
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h2 id="samples-heading" className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Demo Samples
        </h2>
        <span className="text-xs text-slate-500 font-mono">— click to load</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {SAMPLE_MESSAGES.map((sample) => (
          <SampleCard key={sample.id} sample={sample} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
