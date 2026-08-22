import { read, write } from "./storage";
import { getCurrentUser } from "./authService";
import { detectCrisis, crisisSupportMessage } from "./safetyService";

function chatKey(userId, mode) {
  return `chat.${userId}.${mode}`;
}

const MOCK_REPLIES = {
  home: [
    "I’m here with you. What would make today feel a little lighter?",
    "Small steps count. Want to look at today’s workout, a meal, or a check-in?",
  ],
  physical: [
    "You can add a light accessory move like curls if your energy feels good and today’s session is already complete on the main lifts. Keep rest honest.",
    "If you feel worn down, swap intensity for a walk plus mobility. That’s still a full training day.",
  ],
  mental: [
    "Thanks for telling me. Let’s keep this simple: one slow breath, then one small next step you can actually do.",
    "Overwhelm is a lot to carry. A short walk or a five-minute stretch can be enough for now.",
  ],
};

function pickReply(mode, text) {
  const lower = text.toLowerCase();
  if (/stressed|stress/i.test(lower)) {
    return "I hear you. When stress piles up, your body just needs a quiet moment to reset. Try taking three slow, deep breaths with me right now.";
  }
  if (/anxiety|anxious/i.test(lower)) {
    return "Anxiety can feel overwhelming, but you are safe right here. Let’s focus on 5 things you can see around you, and take it one second at a time.";
  }
  if (/motivation|unmotivated|lazy/i.test(lower)) {
    return "It's completely okay to have low energy days. You don't need to force productivity right now. Rest is productive too.";
  }
  if (/overthink|racing|thoughts/i.test(lower)) {
    return "When thoughts spin in loops, getting into your body helps. Try stretching your shoulders or writing your thoughts down to let them go.";
  }
  if (/sleep|insomnia|rest/i.test(lower)) {
    return "Rest is so essential for your mind. Try dimming the lights, unclenching your jaw, and taking slow breaths as you settle in.";
  }
  if (/talk|listen|chat/i.test(lower)) {
    return "I’m right here listening without any judgment. Tell me whatever is on your mind — take all the time you need.";
  }
  if (/bicep|curl/i.test(text)) {
    return "If today’s session still has energy left, light bicep curls can fit after the main work. Keep the weight comfortable and stop if form slips.";
  }

  const list = MOCK_REPLIES[mode] || MOCK_REPLIES.home;
  return list[text.length % list.length];
}

export function getChatHistory(mode) {
  const user = getCurrentUser();
  if (!user) return [];
  return read(chatKey(user.id, mode), []);
}

export async function sendChatMessage({ mode = "home", text }) {
  const user = getCurrentUser();
  const safety = detectCrisis(text);
  const history = getChatHistory(mode);

  const userMessage = {
    id: crypto.randomUUID(),
    role: "user",
    text,
    at: new Date().toISOString(),
  };

  if (safety.crisis) {
    const support = crisisSupportMessage();
    const botMessage = {
      id: crypto.randomUUID(),
      role: "safety",
      text: support.body,
      title: support.title,
      resources: support.resources,
      at: new Date().toISOString(),
    };
    const next = [...history, userMessage, botMessage];
    if (user) write(chatKey(user.id, mode), next);
    return { history: next, crisis: true };
  }

  await new Promise((resolve) => setTimeout(resolve, 450));
  const botMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    text: pickReply(mode, text),
    pendingBackend: true,
    at: new Date().toISOString(),
  };
  const next = [...history, userMessage, botMessage];
  if (user) write(chatKey(user.id, mode), next);
  return { history: next, crisis: false };
}

export function seedChat(mode, opener) {
  const existing = getChatHistory(mode);
  if (existing.length) return existing;
  const history = [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: opener,
      at: new Date().toISOString(),
    },
  ];
  const user = getCurrentUser();
  if (user) write(chatKey(user.id, mode), history);
  return history;
}
