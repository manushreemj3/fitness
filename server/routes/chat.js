import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import ChatMessage from "../models/ChatMessage.js";
import { detectCrisis, crisisSupportMessage } from "../services/safetyService.js";
import { generateContent, hasGemini } from "../services/geminiService.js";

const router = Router();
router.use(requireAuth);

const VALID_MODES = new Set(["home", "physical", "mental", "nutrition"]);
const VALID_LANGUAGES = new Set(["en", "kn", "hi"]);

function modeInstruction(mode) {
  const instructions = {
    home: "Help with the user's overall fitness and wellbeing goals.",
    physical: "Focus on exercise, recovery, training consistency, and safe general fitness guidance.",
    mental: "Focus on emotional wellness, stress, motivation, overthinking, sleep, and listening support.",
    nutrition: "Focus on food, meals, calories, protein, carbohydrates, fat, hydration, and practical nutrition guidance.",
  };
  return instructions[mode] || instructions.home;
}

router.get("/:mode", async (req, res) => {
  if (!VALID_MODES.has(req.params.mode)) return res.status(400).json({ error: "Invalid chat mode" });
  try {
    const history = await ChatMessage.find({ userId: req.userId, mode: req.params.mode }).sort({ createdAt: 1 }).lean();
    res.json({ history });
  } catch (error) {
    console.error("Chat history error:", error);
    res.status(500).json({ error: "Unable to load chat history" });
  }
});

router.post("/:mode", async (req, res) => {
  const { text, language = "en" } = req.body || {};
  const { mode } = req.params;
  if (!VALID_MODES.has(mode)) return res.status(400).json({ error: "Invalid chat mode" });
  if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "Message is required" });
  const selectedLanguage = VALID_LANGUAGES.has(language) ? language : "en";
  if (text.length > 4000) return res.status(400).json({ error: "Message is too long" });

  const value = text.trim();
  const safety = detectCrisis(value);
  await ChatMessage.create({ userId: req.userId, mode, role: "user", text: value });

  if (safety.crisis) {
    const support = crisisSupportMessage();
    await ChatMessage.create({ userId: req.userId, mode, role: "safety", text: support.body, title: support.title, resources: support.resources });
  } else {
    let reply = null;
    if (hasGemini()) {
      const recent = await ChatMessage.find({ userId: req.userId, mode }).sort({ createdAt: -1 }).limit(12).lean();
      recent.reverse();
      const languageInstruction = selectedLanguage === "kn"
        ? "Respond entirely in Kannada (ಕನ್ನಡ). Keep fitness and nutrition terms understandable."
        : selectedLanguage === "hi"
          ? "Respond entirely in Hindi (हिन्दी). Keep fitness and nutrition terms understandable."
          : "Respond in English.";
      const context = [modeInstruction(mode), languageInstruction, "User message: " + value].join("\n\n");
      reply = await generateContent({ prompt: context, history: recent, language: selectedLanguage });
    }

    if (!reply) {
      reply = mode === "mental"
        ? "I'm here with you. Tell me a little more about what's been going on."
        : "I'm here. Tell me a little more about what you'd like help with.";
    }

    await ChatMessage.create({ userId: req.userId, mode, role: "assistant", text: reply });
  }

  const history = await ChatMessage.find({ userId: req.userId, mode }).sort({ createdAt: 1 }).lean();
  res.json({ history, crisis: safety.crisis, aiEnabled: hasGemini() });
});

export default router;
