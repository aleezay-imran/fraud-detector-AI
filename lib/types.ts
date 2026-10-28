export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface AnalysisResult {
  risk_level: RiskLevel;
  suspicious_phrases: string[];
  explanations: string[];
  safe_actions: string[];
  uncertainty_warning: string;
    scam_type?: string;
  how_it_works?: string[];
}

export interface AnalyzeRequest {
  message: string;
}

export interface AnalyzeResponse {
  success: true;
  data: AnalysisResult;
}

export interface AnalyzeErrorResponse {
  success: false;
  error: string;
}

export interface SampleMessage {
  id: string;
  label: string;
  category: string;
  language: "English" | "Roman Urdu" | "Mixed";
  text: string;
}
