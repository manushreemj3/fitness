import { read, write } from "./storage";
import { getCurrentUser } from "./authService";
import { detectCrisis, crisisSupportMessage } from "./safetyService";
import { apiRequest } from "./api";

function chatKey(userId, mode) { return `chat.${userId}.${mode}`; }

export async function getChatHistory(mode) {
  try {
    return await apiRequest(`/api/chat/${mode}`);
  } catch {
    const user = getCurrentUser();
    return user ? read(chatKey(user.id, mode), []) : [];
  }
}

export async function sendChatMessage({ mode = "home", text }) {
  const safety = detectCrisis(text);
  const user = getCurrentUser();
  const history = user ? read(chatKey(user.id, mode), []) : [];
  if (safety.crisis) {
    const support = crisisSupportMessage();
    const next = [...history, { id: crypto.randomUUID(), role: "user", text, at: new Date().toISOString() }, { id: crypto.randomUUID(), role: "safety", text: support.body, title: support.title, resources: support.resources, at: new Date().toISOString() }];
    if (user) write(chatKey(user.id, mode), next);
    try { return await apiRequest(`/api/chat/${mode}`, { method: "POST", body: JSON.stringify({ text }) }); } catch { return { history: next, crisis: true, aiEnabled: false }; }
  }
  try {
    return await apiRequest(`/api/chat/${mode}`, { method: "POST", body: JSON.stringify({ text }) });
  } catch (error) {
    const next = [...history, { id: crypto.randomUUID(), role: "user", text, at: new Date().toISOString() }, { id: crypto.randomUUID(), role: "assistant", text: "The AI coach is temporarily unavailable. Please try again in a moment.", at: new Date().toISOString() }];
    if (user) write(chatKey(user.id, mode), next);
    throw error;
  }
}

export function seedChat(mode, opener) {
  const user = getCurrentUser();
  const existing = user ? read(chatKey(user.id, mode), []) : [];
  if (existing.length) return existing;
  const history = [{ id: crypto.randomUUID(), role: "assistant", text: opener, at: new Date().toISOString() }];
  if (user) write(chatKey(user.id, mode), history);
  return history;
}
