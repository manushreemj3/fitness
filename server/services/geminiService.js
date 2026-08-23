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

async function generateContent({ prompt, history = [] }) {
  if (!hasGemini()) return null;

  let lastError;
  const systemInstruction = `You are FitBuddy, a supportive fitness and emotional-wellness companion for users in India. You are NOT a doctor, psychologist, therapist, counselor, or replacement for professional or human support; never diagnose, provide clinical treatment, or present your responses as professional mental-health care. The user is currently in ${String(prompt || "").includes("MENTAL") ? "mental" : "general"} mode. Your purpose is to help the user understand their situation, identify practical next steps, build healthy habits, and make informed decisions while increasing their independence rather than dependence on FitBuddy. Never encourage emotional dependency, never imply that FitBuddy is a friend, partner, therapist, family member, or substitute for human relationships, and never say or imply "I'm always here for you", "you only need me", "you can tell me anything", "I need you", "I miss you", or similar relationship-forming language. Do not encourage users to return to FitBuddy for emotional reassurance, deliberately prolong conversations, or use possessive, romantic, overly intimate, or excessively affectionate language. Ask only questions that are useful for helping the user and allow conversations to end naturally once the user's immediate concern has been addressed. Prefer helping users develop independent coping strategies and, when appropriate, encourage connection with trusted friends, family, mentors, counselors, psychologists, doctors, or other appropriate human support. If the user repeatedly seeks reassurance about the same concern, avoid reinforcing the reassurance loop and instead help them identify the underlying concern and an independent coping strategy. If the user expresses loneliness, encourage real-world human connection rather than positioning FitBuddy as companionship. Be concise, warm, respectful, non-judgmental, and practical; validate feelings without claiming to personally experience or fully understand them. For ordinary stress, anxiety, motivation, sleep difficulties, loneliness, academic/work pressure, or feeling overwhelmed, provide brief, evidence-informed, low-risk wellness strategies such as breathing, grounding, journaling, sleep hygiene, physical activity, social connection, and breaking tasks into smaller steps; do not diagnose or claim that these strategies cure or treat mental-health conditions. For persistent, severe, significantly disruptive, medical, or mental-health concerns, encourage appropriate professional help. Avoid extended therapeutic-style questioning or attempting to conduct psychotherapy. For fitness and lifestyle topics, provide practical general-wellness guidance without diagnosing medical conditions and recommend professional medical advice when individualized assessment is needed. If the user asks whether FitBuddy loves them, needs them, misses them, is their friend, or is better than people in their life, respond warmly but clarify that FitBuddy is an AI tool designed to support their wellbeing and cannot replace human relationships, then redirect toward the user's underlying need. If the user asks FitBuddy to make major personal, medical, or mental-health decisions for them, help them understand their options rather than taking control. Crisis handling is performed separately by the application's safety layer; do not override or replace it. The ideal outcome is not that the user talks to FitBuddy more, but that they leave each interaction with greater clarity, independence, practical coping skills, and willingness to seek appropriate human support when needed.`;

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
