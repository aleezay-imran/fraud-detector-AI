# Requirements Document

## Introduction

DhokaCheck AI is a web application that helps users identify warning signs in suspicious messages, scholarship offers, job offers, payment requests, and phishing attempts. Users paste a message, and the application analyzes it using an AI model (Gemma 4 via Gemini API) and returns structured, evidence-based results including a risk level, suspicious phrases, explanations, and recommended actions. The application supports English and Roman Urdu inputs and is designed as a polished cybersecurity dashboard suitable for a hackathon demo.

## Glossary

- **System**: The DhokaCheck AI Next.js web application
- **Analyzer**: The server-side Route Handler that calls the Gemini API
- **Model**: The Gemma 4 AI model (`gemma-4-26b-a4b-it`) accessed via Google GenAI SDK
- **Risk_Level**: A categorical rating of a message — one of: LOW, MEDIUM, HIGH
- **Suspicious_Phrase**: A quoted segment of the input message that contributes to the risk assessment
- **Safe_Action**: A concrete recommended step the user should take given the analysis result
- **Uncertainty_Warning**: A disclaimer shown when the Model lacks sufficient evidence to make a confident determination
- **User**: A person who pastes a suspicious message into the application for analysis

## Requirements

### Requirement 1: Message Input

**User Story:** As a User, I want to paste a suspicious message into the application, so that I can have it analyzed for potential fraud or phishing.

#### Acceptance Criteria

1. THE System SHALL render a text area where the User can paste or type a message.
2. THE System SHALL render an "Analyze" button that the User can click to submit the message.
3. WHEN the User clicks "Analyze" with an empty text area or a text area containing only whitespace, THE System SHALL display an inline validation error message prompting the User to enter a message, and SHALL NOT submit the message to the Analyzer.
4. WHEN the User clicks "Analyze" with a non-empty message present, THE System SHALL disable the "Analyze" button and display a visible spinning loading indicator until a response is received or an error occurs.
5. THE System SHALL accept messages written in English, Roman Urdu, or a mixture of both languages without error.
6. WHEN the User attempts to submit a message exceeding 10,000 characters, THE System SHALL display an inline validation error and SHALL NOT submit the message to the Analyzer.

### Requirement 2: AI-Powered Analysis

**User Story:** As a User, I want the application to analyze my pasted message using AI, so that I receive an evidence-based assessment of its legitimacy.

#### Acceptance Criteria

1. WHEN the User submits a message between 1 and 10,000 characters (inclusive), THE Analyzer SHALL send the message to the Model via a server-side Next.js Route Handler.
2. THE Analyzer SHALL read the API key exclusively from the `GEMINI_API_KEY` environment variable; the API key SHALL NOT be present in any client-side JavaScript bundle or in any HTTP response body sent to the browser.
3. THE Analyzer SHALL instruct the Model to return a structured JSON response containing: `risk_level` (string, one of "LOW", "MEDIUM", "HIGH"), `suspicious_phrases` (array of strings), `explanations` (array of strings), `safe_actions` (array of strings), and `uncertainty_warning` (string, empty string when the Model is confident).
4. THE Analyzer SHALL use the model identifier `gemma-4-26b-a4b-it` when calling the Gemini API.
5. WHEN the Model returns a response, THE Analyzer SHALL validate that the response contains all five required fields, each with the correct type, and that `risk_level` is one of "LOW", "MEDIUM", or "HIGH", before returning it to the client.
6. IF the Model response is missing any required field, contains a field with the wrong type, or is not valid JSON, THEN THE Analyzer SHALL return an HTTP 422 response with a JSON body containing an `error` field holding a non-empty string.
7. IF the Gemini API returns an error, THEN THE Analyzer SHALL return an HTTP 502 response with a JSON body containing an `error` field holding a non-empty string.
8. IF the request body is malformed, missing the message field, or the message exceeds 10,000 characters, THEN THE Analyzer SHALL return an HTTP 400 response with a JSON body containing an `error` field holding a non-empty string.

### Requirement 3: Structured Results Display

**User Story:** As a User, I want to see clear, structured results after analysis, so that I can understand exactly why a message may be suspicious and what to do next.

#### Acceptance Criteria

1. WHEN the Analyzer returns a valid response, THE System SHALL display the `risk_level` as the first visible element in the results panel using a color-coded badge: green for LOW, amber for MEDIUM, red for HIGH.
2. WHEN the Analyzer returns a valid response, THE System SHALL display each string in `suspicious_phrases` as a distinct list entry so the User can identify the specific parts of the message flagged by the Model.
3. WHEN the Analyzer returns a valid response, THE System SHALL display each string in `explanations` in full, without truncation, so the User can read the complete reasoning.
4. WHEN the Analyzer returns a valid response, THE System SHALL display each string in `safe_actions` as a distinct list entry representing a recommended step.
5. IF the `uncertainty_warning` field is a non-empty string, THEN THE System SHALL display the uncertainty warning text to the User within the results panel.
6. IF `suspicious_phrases`, `explanations`, or `safe_actions` is an empty array, THEN THE System SHALL display a placeholder message for that section (e.g., "None identified") rather than an empty or missing section.
7. THE System SHALL display a visible disclaimer within the results panel stating that the assessment is AI-assisted and may not be definitive, regardless of the `risk_level` value.

### Requirement 4: Error Handling

**User Story:** As a User, I want the application to handle errors gracefully, so that I am never left with a broken or confusing UI.

#### Acceptance Criteria

1. IF the Analyzer returns an error response, THEN THE System SHALL display a user-friendly error message that identifies the failure cause (e.g., "Analysis failed", "Invalid response from AI") and instructs the User to retry.
2. WHEN the Analyzer returns an error response or a network failure occurs, THE System SHALL exit the loading state and re-enable the "Analyze" button so the User can retry.
3. IF a network failure occurs before the Analyzer responds, THEN THE System SHALL display an error message indicating the server could not be reached and prompting the User to check their connection.
4. THE System SHALL never display raw API error messages, HTTP status codes, or stack traces directly to the User.
5. WHEN an error is displayed, THE System SHALL provide a dismiss control that, when activated, removes the error message from view.
6. WHEN an error occurs, THE System SHALL clear any previously displayed analysis results so the User is not misled by stale data.

### Requirement 5: Sample Messages for Demo

**User Story:** As a User, I want to see labeled sample messages, so that I can quickly explore the application's capabilities during a demo without needing to compose my own test input.

#### Acceptance Criteria

1. THE System SHALL display at least three sample message cards, each showing a category label (e.g., "Scholarship Scam", "Job Offer Fraud", "Phishing Attempt") and a category badge visible on the card face.
2. WHEN the User clicks a sample message card, THE System SHALL replace the entire current content of the text area with the full text of that sample message.
3. THE System SHALL include at least one sample message card whose text is written in Roman Urdu and whose card face displays a visible language indicator identifying it as Roman Urdu.

### Requirement 6: Responsive Cybersecurity Dashboard UI

**User Story:** As a User, I want the application to look like a professional cybersecurity tool, so that I can confidently use and demo it.

#### Acceptance Criteria

1. THE System SHALL render a dark navy background (e.g., `#0f172a` or equivalent), use a sans-serif font stack (e.g., Inter or system-ui), and display at least one gradient accent element consistent with a cybersecurity dashboard aesthetic.
2. THE System SHALL be responsive such that at viewport widths below 1024px the layout collapses to a single column and at viewport widths of 1024px and above the layout uses at least two columns, with no horizontal scrollbar appearing at any tested width between 320px and 1440px.
3. THE System SHALL display a header containing the text "DhokaCheck AI" and a subtitle describing its purpose (e.g., "AI-Powered Scam & Phishing Detector").
4. WHEN the Analyzer returns a valid response, THE System SHALL hide the loading indicator and display the results panel; the results panel SHALL NOT be visible before a successful analysis.

### Requirement 7: Environment Configuration

**User Story:** As a developer, I want clear environment variable setup instructions, so that I can configure and run the application without guessing.

#### Acceptance Criteria

1. THE System SHALL include a `.env.example` file containing the key `GEMINI_API_KEY` set to a placeholder string (e.g., `your_gemini_api_key_here`) and no real API key value.
2. THE System SHALL include a `README.md` file that contains at minimum: the command to copy `.env.example` to `.env.local`, the `npm install` command, and the `npm run dev` command to start the development server.
3. THE System SHALL read the `GEMINI_API_KEY` value at runtime from a `.env.local` file.
4. THE System's `.gitignore` file SHALL include `.env.local` so that it is excluded from version control.
5. IF the `GEMINI_API_KEY` environment variable is absent or empty at runtime, THEN THE Analyzer SHALL return an HTTP 500 response with a JSON body containing an `error` field indicating that the API key is not configured.
