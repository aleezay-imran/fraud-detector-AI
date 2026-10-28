"use client";

import { AnalysisResult } from "@/lib/types";
import RiskBadge from "./RiskBadge";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-navy-600 bg-navy-800/50 overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-navy-600/60 ${color}`}>
        <span className="flex-shrink-0">{icon}</span>
        <h3 className="text-xs font-semibold uppercase tracking-wider font-mono">{title}</h3>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <section
      className="space-y-4 animate-fade-in"
      aria-label="Analysis Results"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center gap-2 pt-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-800/60 to-transparent" />
        <div className="flex items-center gap-2 px-3">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
            Analysis Report
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-800/60 to-transparent" />
      </div>

      {/* Risk Level */}
      <RiskBadge level={result.risk_level} large />

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 italic px-1">
        This is an AI-assisted assessment, not a definitive determination. Always use your own judgment and consult official sources when in doubt.
      </p>

      {/* Uncertainty Warning */}
      {result.uncertainty_warning && (
        <div className="flex gap-3 p-3 rounded-xl border border-indigo-800/50 bg-indigo-900/20">
          <svg
            className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold text-indigo-400 mb-1 font-mono uppercase tracking-wider">
              Uncertainty Notice
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{result.uncertainty_warning}</p>
          </div>
        </div>
      )}
            {/* How This Scam Works */}
      {result.how_it_works && result.how_it_works.length > 0 && (
        <Section
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          title="How This Trap Works"
          color="bg-purple-900/20 text-purple-400"
        >
          {result.scam_type && result.scam_type !== "None detected" && (
            <p className="mb-3 inline-block text-xs font-mono font-semibold uppercase tracking-wider text-purple-300 bg-purple-900/30 border border-purple-800/60 px-2.5 py-1 rounded-full">
              {result.scam_type}
            </p>
          )}
          <ol className="space-y-3" role="list">
            {result.how_it_works.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-900/40 border border-purple-800/60 text-purple-300 text-xs font-mono flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-slate-500 italic">
            General pattern of this type of scam, not a claim about the specific sender.
          </p>
        </Section>
      )}

      {/* Suspicious Phrases */}
      <Section
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        }
        title="Suspicious Phrases Detected"
        color="bg-red-900/20 text-red-400"
      >
        {result.suspicious_phrases.length > 0 ? (
          <ul className="space-y-2" role="list">
            {result.suspicious_phrases.map((phrase, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden="true" />
                <code className="text-sm text-red-300 bg-red-900/20 px-2 py-0.5 rounded border border-red-900/40 font-mono leading-relaxed break-words min-w-0">
                  &ldquo;{phrase}&rdquo;
                </code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">None identified</p>
        )}
      </Section>

      {/* Explanations */}
      <Section
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="Why This Looks Suspicious"
        color="bg-amber-900/20 text-amber-400"
      >
        {result.explanations.length > 0 ? (
          <ol className="space-y-3" role="list">
            {result.explanations.map((explanation, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-900/40 border border-amber-800/60 text-amber-400 text-xs font-mono flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-slate-500 italic">None identified</p>
        )}
      </Section>

      {/* Safe Actions */}
      <Section
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
        title="Recommended Safe Actions"
        color="bg-green-900/20 text-green-400"
      >
        {result.safe_actions.length > 0 ? (
          <ul className="space-y-2" role="list">
            {result.safe_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-slate-300 leading-relaxed">{action}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">None identified</p>
        )}
      </Section>

      {/* Footer note */}
      <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Analysis powered by Gemma 4 via Gemini API</span>
      </div>
    </section>
  );
}
