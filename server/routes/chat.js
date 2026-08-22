import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import ChatMessage from "../models/ChatMessage.js";
import { detectCrisis, crisisSupportMessage } from "../services/safetyService.js";

const router = Router();
router.use(requireAuth);

const VALID_MODES = new Set(["home", "physical", "mental", "nutrition"]);

router.get("/:mode", async (req, res) => {
  if (!VALID_MODES.has(req.params.mode)) return res.status(400).json({ error: "Invalid chat mode" });
  const history = await ChatMessage.find({ userId: req.userId, mode: req.params.mode }).sort({ createdAt: 1 });
  res.json(history);
});

router.post("/:mode", async (req, res) => {
  const { text } = req.body || {};
  const { mode } = req.params;
  if (!VALID_MODES.has(mode)) return res.status(400).json({ error: "Invalid chat mode" });
  if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "Message is required" });
  if (text.length > 4000) return res.status(400).json({ error: "Message is too long" });

  const userMessage = await ChatMessage.create({ userId: req.userId, mode, role: "user", text: text.trim() });
  const safety = detectCrisis(text);

  if (safety.crisis) {
    const support = crisisSupportMessage();
    await ChatMessage.create({
      userId: req.userId,
      mode,
      role: "safety",
      text: support.body,
      title: support.title,
      resources: support.resources,
    });
  } else {
    await ChatMessage.create({
      userId: req.userId,
      mode,
      role: "assistant",
      text: "I’m here with you. This response is a placeholder until the FitBuddy companion model is connected.",
    });
  }

  const history = await ChatMessage.find({ userId: req.userId, mode }).sort({ createdAt: 1 });
  res.json({ history, crisis: safety.crisis });
});

export default router;
