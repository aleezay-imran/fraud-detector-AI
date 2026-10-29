import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, AnalyzeRequest } from "@/lib/types";

export const maxDuration = 60;

const MODEL_ID = "gemma-4-26b-a4b-it";

// Validate the structure returned by the AI model
function isValidAnalysisResult(obj: unknown): obj is AnalysisResult {
  if (typeof obj !== "object" || obj === null) return false;
  const result = obj as Record<string, unknown>;

  const validRiskLevels = ["LOW", "MEDIUM", "HIGH"];
  if (!validRiskLevels.includes(result.risk_level as string)) return false;
  if (!Array.isArray(result.suspicious_phrases)) return false;
  if (!Array.isArray(result.explanations)) return false;
  if (!Array.isArray(result.safe_actions)) return false;
  if (typeof result.uncertainty_warning !== "string") return false;
  if (result.scam_type !== undefined && typeof result.scam_type !== "string") return false;
  if (result.how_it_works !== undefined && !Array.isArray(result.how_it_works)) return false;

  return true;
}

const SYSTEM_PROMPT = `You are DhokaCheck AI, an expert cybersecurity analyst specializing in identifying scams, phishing attempts, fraudulent job offers, fake scholarships, and suspicious payment requests.

Your task is to analyze the provided message and return a structured JSON assessment. You MUST follow these rules:
0. Respond with ONLY a valid JSON object. No markdown, no code fences, no explanation before or after.
1. Return ONLY valid JSON — no markdown fences, no explanation text outside the JSON.
2. Never claim a message is "definitely" fraudulent unless you have strong, specific evidence.
3. Be especially careful with messages in Roman Urdu — analyze them with the same rigor as English.
4. Your assessment must be evidence-based: cite specific phrases or patterns that support your conclusion.
5. The uncertainty_warning field must be non-empty whenever evidence is ambiguous or insufficient.
6. Keep the response very short: at most 3 suspicious phrases, at most 3 explanations (each under 12 words), and at most 3 safe actions (each under 12 words).
7. how_it_works: if risk is MEDIUM or HIGH, give exactly 3 steps (each under 10 words) describing the general pattern of this scam type, not claims about this specific sender. If risk is LOW, return an empty array.
8. Do not think at length. Decide quickly and output the JSON immediately.

Return this exact JSON structure:
{
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "suspicious_phrases": ["phrase1", "phrase2"],
  "explanations": ["explanation1", "explanation2"],
  "safe_actions": ["action1", "action2"],
  "uncertainty_warning": "string (empty string if confident, otherwise a clear disclaimer)",
  "scam_type": "short name of the scam pattern, e.g. Advance-fee scholarship scam. Use 'None detected' if risk is LOW",
  "how_it_works": ["step 1", "step 2", "step 3"]
}

Risk level guide:
- LOW: Message appears legitimate with no significant red flags
- MEDIUM: Message contains some warning signs but could be legitimate; caution advised
- HIGH: Message contains multiple strong indicators of fraud, scam, or phishing

Examples of suspicious patterns:
- Requests for upfront payment to receive a prize or job
- Urgency tactics ("respond within 24 hours or lose your offer")
- Requests for sensitive data (CNIC, PIN, OTP, passport number)
- Suspicious links or mismatched email domains
- Offers that seem too good to be true
- Requests to keep the message secret
- Unsolicited financial opportunities`;

// Decide whether an error is temporary and worth retrying
function isRetryableError(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  if (status === 500 || status === 503 || status === 429) return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(500|503|429)\b|INTERNAL|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded/i.test(msg);
}

async function generateWithRetry(ai: GoogleGenAI, prompt: string, maxAttempts = 3) {
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent({
        model: MODEL_ID,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      });
    } catch (err) {
      lastErr = err;
      console.error(`Gemma attempt ${attempt + 1}/${maxAttempts} failed:`, err);
      if (!isRetryableError(err) || attempt === maxAttempts - 1) break;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt)); // 1s, 2s, 4s
    }
  }
  throw lastErr;
}

// Extract only the real answer text (skip "thinking" parts)
function extractText(response: Awaited<ReturnType<typeof generateWithRetry>>): string {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const answerText = parts
    .filter((p) => !(p as { thought?: boolean }).thought)
    .map((p) => p.text ?? "")
    .join("");
  if (answerText.trim()) return answerText;

  // Fallback: SDK helper, then all parts
  const helperText = response.text ?? "";
  if (helperText.trim()) return helperText;
  return parts.map((p) => p.text ?? "").join("");
}

export async function POST(request: NextRequest) {
  // Validate API key is configured
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY environment variable is not set");
    return NextResponse.json(
      {
        success: false,
        error:
          "Server configuration error: API key is not configured. Please set GEMINI_API_KEY in your environment.",
      },
      { status: 500 }
    );
  }

  // Parse and validate the request body
  let body: AnalyzeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request: body must be JSON." },
      { status: 400 }
    );
  }

  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json(
      { success: false, error: "Request must include a non-empty message field." },
      { status: 400 }
    );
  }

  if (message.length > 10000) {
    return NextResponse.json(
      { success: false, error: "Message is too long. Please limit to 10,000 characters." },
      { status: 400 }
    );
  }

  // Call Gemma via Google GenAI SDK
  let rawText = "";
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await generateWithRetry(
      ai,
      `${SYSTEM_PROMPT}\n\n---\n\nAnalyze the following message:\n\n${message}`
    );

    console.log("finishReason:", response.candidates?.[0]?.finishReason);
    console.log("promptFeedback:", JSON.stringify(response.promptFeedback));
    console.log("usage:", JSON.stringify(response.usageMetadata));

    rawText = extractText(response);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Gemma API error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error:
          "The AI service returned an error. This may be due to API quota limits or a temporary outage. Please try again shortly.",
      },
      { status: 502 }
    );
  }

  console.log("Gemma raw output:", rawText.slice(0, 2000));

  // Clean the model's text: strip code fences, then keep only first "{" to last "}"
  let cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // Parse and validate the response
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("Failed to parse AI response as JSON:", parseErr);
    console.error("Cleaned text was:", cleaned.slice(0, 1000));
    return NextResponse.json(
      {
        success: false,
        error: "The AI service returned an unexpected response format. Please try again.",
      },
      { status: 422 }
    );
  }

  if (!isValidAnalysisResult(parsed)) {
    console.error("AI response failed schema validation. Parsed value:", parsed);
    return NextResponse.json(
      {
        success: false,
        error: "The AI analysis was incomplete or malformed. Please try again.",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({ success: true, data: parsed });
}