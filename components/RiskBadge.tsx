"use client";

import { RiskLevel } from "@/lib/types";

interface RiskBadgeProps {
  level: RiskLevel;
  large?: boolean;
}

const configs = {
  LOW: {
    label: "LOW RISK",
    bg: "bg-green-900/30",
    border: "border-green-700/60",
    text: "text-green-400",
    glow: "shadow-green-900/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    description: "This message appears relatively safe based on the AI analysis.",
  },
  MEDIUM: {
    label: "MEDIUM RISK",
    bg: "bg-amber-900/30",
    border: "border-amber-700/60",
    text: "text-amber-400",
    glow: "shadow-amber-900/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    description: "This message contains warning signs. Proceed with caution.",
  },
  HIGH: {
    label: "HIGH RISK",
    bg: "bg-red-900/30",
    border: "border-red-700/60",
    text: "text-red-400",
    glow: "shadow-red-900/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    description: "This message shows strong indicators of a scam or phishing attempt.",
  },
};

export default function RiskBadge({ level, large = false }: RiskBadgeProps) {
  const config = configs[level];

  if (large) {
    return (
      <div
        className={`flex items-center gap-4 p-4 rounded-xl border ${config.bg} ${config.border} shadow-lg ${config.glow}`}
        role="status"
        aria-label={`Risk level: ${config.label}`}
      >
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg} ${config.text}`}>
          {config.icon}
        </div>
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-0.5">
            Risk Assessment
          </p>
          <p className={`text-xl font-bold font-mono tracking-wider ${config.text}`}>
            {config.label}
          </p>
          <p className="text-xs text-slate-400 mt-1">{config.description}</p>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${config.bg} ${config.border} ${config.text}`}
      aria-label={`Risk level: ${config.label}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
