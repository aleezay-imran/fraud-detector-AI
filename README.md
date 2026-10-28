# DhokaCheck AI

An AI-powered scam and phishing detector built with Next.js and Gemma 4. Paste any suspicious message — job offers, scholarship emails, payment requests, lottery wins — and get an instant, evidence-based risk assessment.

Supports **English** and **Roman Urdu** input.

---

## Features

- **Risk level badge** — LOW / MEDIUM / HIGH with color coding
- **Suspicious phrase extraction** — highlights specific red-flag text
- **Evidence-based explanations** — not just "this looks bad", but why
- **Safe action recommendations** — concrete next steps
- **Uncertainty warnings** — the AI tells you when it's not sure
- **5 labeled demo samples** — ready to use out of the box
- **Responsive cybersecurity dashboard UI** — dark navy theme

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI SDK | `@google/genai` |
| Model | Gemma 4 (`gemma-4-26b-a4b-it`) via Gemini API |

---

## Prerequisites

- Node.js 18 or later
- A Google AI Studio API key with access to Gemma 4

---

## Installation

```bash
# 1. Clone or unzip the project into a folder
cd dhokacheck-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Open `.env.local` and replace the placeholder with your real key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> **Important:** Never commit `.env.local` to version control. It is already in `.gitignore`.

---

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with a Google account
3. Click **Create API key**
4. Copy the key into your `.env.local` file

> **Note on model access:** This project uses `gemma-4-26b-a4b-it`. If your account does not have access to this model, you may see a 502 error. You can change the model ID in `app/api/analyze/route.ts` to `gemini-2.0-flash` or another available model as a fallback.

---

## Testing the Application

### Manual Testing with Demo Samples

1. Start the dev server (`npm run dev`)
2. Open [http://localhost:3000](http://localhost:3000)
3. Click any of the **Demo Samples** cards to load a pre-written message
4. Click **Analyze** (or press Ctrl+Enter)
5. Review the risk level, flagged phrases, explanations, and safe actions

### Test Scenarios to Cover

| Scenario | Expected Behavior |
|----------|------------------|
| Click Analyze with empty input | Inline error: "Please paste or type a message" |
| Select "Scholarship Scam" sample and analyze | HIGH risk, multiple suspicious phrases |
| Select "Job Offer Fraud" sample and analyze | HIGH risk with upfront-payment flag |
| Select "Bank Phishing" sample and analyze | HIGH risk with suspicious domain flagged |
| Select "Lottery Scam (Roman Urdu)" and analyze | HIGH risk analysis in Roman Urdu context |
| Enter a genuine, normal message and analyze | LOW risk with uncertainty warning |
| Run with invalid/missing API key | User-friendly error, no stack trace shown |

### Building for Production

```bash
npm run build
npm run start
```

---

## Demo Instructions (Hackathon)

1. **Have the dev server running** before your presentation
2. **Open the browser** to [http://localhost:3000](http://localhost:3000)
3. Start with the **"Bank Phishing"** sample — it produces a dramatic HIGH risk result
4. Then switch to the **"Lottery Scam (Roman Urdu)"** sample to show bilingual support
5. Finally, type a normal, friendly message (e.g. "Hey, let's grab coffee tomorrow?") to show the LOW risk result
6. The results panel updates in real time — no page reloads needed

---

## Project Structure

```
dhokacheck-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # Server-side AI Route Handler
│   ├── globals.css             # Tailwind base + custom styles
│   ├── layout.tsx              # Root layout with metadata
│   └── page.tsx                # Main page (client component)
├── components/
│   ├── AnalysisResults.tsx     # Structured results display
│   ├── ErrorAlert.tsx          # Error message component
│   ├── Header.tsx              # App header with logo
│   ├── MessageInput.tsx        # Textarea + submit button
│   ├── RiskBadge.tsx           # Color-coded risk level badge
│   └── SampleMessages.tsx      # Demo sample cards
├── lib/
│   ├── samples.ts              # Sample message data
│   └── types.ts                # TypeScript interfaces
├── .env.example                # Environment variable template
├── .env.local                  # Your API key (not committed)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Security Notes

- The `GEMINI_API_KEY` is **only read server-side** in `app/api/analyze/route.ts`
- It is **never sent to the browser** or included in client bundles
- All AI calls go through the `/api/analyze` Route Handler
- No user data is stored or logged
- The app does not use authentication or a database

---

## Limitations

- This tool provides AI-assisted risk assessment, not legal or financial advice
- Accuracy depends on the AI model's training data
- The model may occasionally miss sophisticated scams or flag legitimate messages
- Results should be used as one input among many, not as a final verdict
