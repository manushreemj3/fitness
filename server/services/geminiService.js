// Server-only Gemini REST helper.
// Keep the API key on Render; never expose it to Vite/Vercel.

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const normalizeModel = (value) => String(value || "").trim().replace(/^models\//i, "");

function configuredModels() {
  const configured = normalizeModel(process.env.GEMINI_MODEL);
  const configuredFallbacks = String(process.env.GEMINI_FALLBACK_MODELS || "")
    .split(",").map(normalizeModel).filter(Boolean);
  return [...new Set([configured || DEFAULT_MODEL, ...configuredFallbacks, ...FALLBACK_MODELS])];
}

function hasGemini() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function toGeminiContents(history = [], prompt) {
  const previous = Array.isArray(history) ? history.slice(-12) : [];
  const contents = previous
    .filter((message) => message?.text && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.text) }],
    }));

  if (!contents.length || contents[contents.length - 1]?.role !== "user" || contents[contents.length - 1]?.parts?.[0]?.text !== prompt) {
    contents.push({ role: "user", parts: [{ text: prompt }] });
  }
  return contents;
}

async function requestModel(model, { systemInstruction, history, prompt }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(
      `${API_BASE}/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: toGeminiContents(history, prompt),
          generationConfig: { maxOutputTokens: 800 },
        }),
        signal: controller.signal,
      }
    );

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body?.error?.message || `Gemini request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }

    const text = body?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim();

    return text || null;
  } finally {
    clearTimeout(timeout);
  }
}

async function generateContent({ prompt, history = [], language = "en" }) {
  if (!hasGemini()) return null;

  let lastError;
  const languageInstruction = language === "kn"
    ? "Respond entirely in Kannada (ಕನ್ನಡ)."
    : language === "hi"
      ? "Respond entirely in Hindi (हिन्दी)."
      : "Respond in English.";
  const systemInstruction = `You are FitBuddy, a supportive fitness and emotional-wellness companion. You are not a doctor or therapist and must not diagnose. Be conversational, concise, warm, and practical. The user is in ${String(prompt || "").includes("MENTAL") ? "mental" : "general"} mode. For ordinary stress, anxiety, motivation, sleep, or overwhelm, respond normally and empathetically. Crisis handling is performed separately by the application safety layer. ${languageInstruction}`;

  for (const model of configuredModels()) {
    try {
      const result = await requestModel(model, { systemInstruction, history, prompt });
      if (result) return result;
      lastError = new Error(`Gemini returned no text for ${model}`);
    } catch (error) {
      lastError = error;
      console.error(`Gemini model ${model} failed:`, error.message);
      if (![400, 404, 429, 500, 502, 503, 504].includes(error.status)) break;
    }
  }

  console.warn("All Gemini models failed:", lastError?.message || "unknown error");
  return null;
}

export { hasGemini, generateContent, DEFAULT_MODEL };
