import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import ChatMessage from "../models/ChatMessage.js";
import { detectCrisis, crisisSupportMessage } from "../services/safetyService.js"; // move your existing logic server-side

const router = Router();
router.use(requireAuth);

router.get("/:mode", async (req, res) => {
  const history = await ChatMessage.find({ userId: req.userId, mode: req.params.mode }).sort({ createdAt: 1 });
  res.json(history);
});

router.post("/:mode", async (req, res) => {
  const { text } = req.body;
  const { mode } = req.params;
  const userMessage = await ChatMessage.create({ userId: req.userId, mode, role: "user", text });

  const safety = detectCrisis(text);
  if (safety.crisis) {
    const support = crisisSupportMessage();
    const botMessage = await ChatMessage.create({
      userId: req.userId, mode, role: "safety", text: support.body, title: support.title, resources: support.resources,
    });
    return res.json({ history: [userMessage, botMessage], crisis: true });
  }

  // TODO: replace with real LLM call
  const botMessage = await ChatMessage.create({ userId: req.userId, mode, role: "assistant", text: "…" });
  res.json({ history: [userMessage, botMessage], crisis: false });
});

export default router;
