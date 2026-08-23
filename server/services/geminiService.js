const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.7-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function hasGemini() {
  return Boolean(process.env.GEMINI_API_KEY);
}

async function generateContent({ prompt, image }) {
  if (!hasGemini()) return null;
  const parts = [{ text: prompt }];
  if (image?.data && image?.mimeType) {
    parts.push({ inline_data: { mime_type: image.mimeType, data: image.data } });
  }

  const response = await fetch(
    `${API_BASE}/${encodeURIComponent(DEFAULT_MODEL)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1200 },
      }),
    }
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error?.message || `Gemini request failed (${response.status})`;
    throw new Error(message);
  }
  return body?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || null;
}

export { hasGemini, generateContent, DEFAULT_MODEL };
