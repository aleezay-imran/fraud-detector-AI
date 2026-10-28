"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import SampleMessages from "@/components/SampleMessages";
import MessageInput from "@/components/MessageInput";
import AnalysisResults from "@/components/AnalysisResults";
import ErrorAlert from "@/components/ErrorAlert";
import { AnalysisResult } from "@/lib/types";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSampleSelect = useCallback((text: string) => {
    setMessage(text);
    setResult(null);
    setApiError(null);
    setInputError(null);
    // Scroll to the input area
    document.getElementById("message-input")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleAnalyze = useCallback(async () => {
    // Clear previous state
    setInputError(null);
    setApiError(null);
    setResult(null);

    const trimmed = message.trim();

    // Client-side validation
    if (!trimmed) {
      setInputError("Please paste or type a message before analyzing.");
      document.getElementById("message-input")?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setApiError(
          json.error ??
            "An unexpected error occurred. Please try again."
        );
        return;
      }

      setResult(json.data as AnalysisResult);
    } catch {
      setApiError(
        "Could not reach the server. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] bg-grid text-slate-200">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero blurb */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Paste any suspicious message — a job offer, scholarship email, payment request, or
            phishing text — and get an instant AI-powered risk assessment.
            Supports <span className="text-blue-400">English</span> &amp;{" "}
            <span className="text-indigo-400">Roman Urdu</span>.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
              No data stored
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Server-side AI
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" aria-hidden="true" />
              Free to use
            </span>
          </div>
        </div>

        {/* Main panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column: input + samples */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input card */}
            <div className="rounded-2xl border border-navy-600 bg-[#0d1526]/80 p-5 shadow-xl glow-blue">
              <MessageInput
                value={message}
                onChange={(v) => {
                  setMessage(v);
                  if (inputError) setInputError(null);
                }}
                onSubmit={handleAnalyze}
                isLoading={isLoading}
                error={inputError}
              />
            </div>

            {/* Samples card */}
            <div className="rounded-2xl border border-navy-600 bg-[#0d1526]/80 p-5 shadow-xl">
              <SampleMessages onSelect={handleSampleSelect} />
            </div>
          </div>

          {/* Right column: results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Results / placeholder */}
            <div className="rounded-2xl border border-navy-600 bg-[#0d1526]/80 p-5 shadow-xl min-h-[300px]">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 gap-4 animate-fade-in">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-blue-700/40" />
                    <div className="absolute inset-0 w-14 h-14 rounded-full border-t-2 border-blue-400 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-blue-400 font-mono">Analyzing message…</p>
                    <p className="text-xs text-slate-500 mt-1">Scanning for suspicious patterns</p>
                  </div>
                  {/* Animated dots */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        style={{ animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && apiError && (
                <ErrorAlert
                  message={apiError}
                  onDismiss={() => setApiError(null)}
                />
              )}

              {!isLoading && !apiError && result && (
                <AnalysisResults result={result} />
              )}

              {!isLoading && !apiError && !result && (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                  <div className="w-14 h-14 rounded-xl bg-navy-700 border border-navy-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">No analysis yet</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Paste a message or pick a sample,<br />then click Analyze
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="rounded-2xl border border-navy-600 bg-[#0d1526]/80 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">How It Works</p>
              <ol className="space-y-2">
                {[
                  ["Paste", "Copy a suspicious message into the input box"],
                  ["Analyze", "Our AI scans for known fraud and phishing patterns"],
                  ["Review", "Read the risk level, flagged phrases, and safe actions"],
                ].map(([step, desc], i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/50 border border-blue-800/50 text-blue-400 text-xs font-mono flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-slate-300">{step} </span>
                      <span className="text-xs text-slate-500">{desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-navy-700/40 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>DhokaCheck AI — AI-assisted scam detection tool</span>
          <span className="font-mono">Results are not legal or financial advice</span>
        </div>
      </footer>
    </div>
  );
}
