import { read, write } from "./storage";
import { getCurrentUser } from "./authService";
import { apiRequest } from "./api";
import { detectCrisis, crisisSupportMessage } from "./safetyService";

function chatKey(userId, mode) { return `chat.${userId}.${mode}`; }

function normalizeMessage(message, index = 0) {
  return {
    ...message,
    id: message.id || message._id || `${message.role || "message"}-${message.createdAt || message.at || index}`,
    text: typeof message.text === "string" ? message.text : "",
  };
}

function normalizeHistory(history) {
  return Array.isArray(history) ? history.map(normalizeMessage) : [];
}

function localFallback(mode) {
  const replies = {
    home: "I'm here. Tell me what you want to work on—training, food, hydration, recovery, or your goals.",
    physical: "I can help with your workout. Tell me what you trained recently and what you want to do today.",
    mental: "I'm here to listen. Tell me what's been difficult lately, and we'll take it one small step at a time.",
    nutrition: "I can help with meals, calories, protein, and hydration. Tell me what you've eaten so far today.",
  };
  return replies[mode] || replies.home;
}

export async function getChatHistory(mode) {
  try {
    const result = await apiRequest(`/api/chat/${encodeURIComponent(mode)}`);
    const history = Array.isArray(result) ? result : result?.history;
    if (Array.isArray(history)) {
      const normalized = normalizeHistory(history);
      const user = getCurrentUser();
      if (user) write(chatKey(user.id, mode), normalized);
      return normalized;
    }
  } catch (error) {
    console.warn("FitBuddy chat history unavailable; using local history:", error?.message || error);
  }

  const user = getCurrentUser();
  return user ? normalizeHistory(read(chatKey(user.id, mode), [])) : [];
}

export async function sendChatMessage({ mode = "home", text }) {
  const value = String(text || "").trim();
  if (!value) return { history: await getChatHistory(mode), crisis: false };

  const user = getCurrentUser();
  const history = user ? normalizeHistory(read(chatKey(user.id, mode), [])) : [];
  const safety = detectCrisis(value);

  // Safety is handled locally as a fail-safe if the backend is unreachable.
  if (safety.crisis) {
    const support = crisisSupportMessage();
    const next = [
      ...history,
      { id: crypto.randomUUID(), role: "user", text: value, at: new Date().toISOString() },
      { id: crypto.randomUUID(), role: "safety", text: support.body, title: support.title, resources: support.resources, at: new Date().toISOString() },
    ];
    if (user) write(chatKey(user.id, mode), next);
    try {
      const result = await apiRequest(`/api/chat/${encodeURIComponent(mode)}`, {
        method: "POST",
        body: JSON.stringify({ text: value }),
      });
      return { ...result, history: normalizeHistory(result?.history || next), crisis: true };
    } catch {
      return { history: next, crisis: true, aiEnabled: false, fallback: true };
    }
  }

  try {
    const result = await apiRequest(`/api/chat/${encodeURIComponent(mode)}`, {
      method: "POST",
      body: JSON.stringify({ text: value }),
    });
    const next = normalizeHistory(result?.history);
    if (user && next.length) write(chatKey(user.id, mode), next);
    return { ...result, history: next };
  } catch (error) {
    const next = [
      ...history,
      { id: crypto.randomUUID(), role: "user", text: value, at: new Date().toISOString() },
      { id: crypto.randomUUID(), role: "assistant", text: localFallback(mode), at: new Date().toISOString() },
    ];
    if (user) write(chatKey(user.id, mode), next);
    console.warn("FitBuddy chat API unavailable; using local fallback:", error?.message || error);
    return { history: next, crisis: false, aiEnabled: false, fallback: true, error: error?.message };
  }
}

export function seedChat(mode, opener) {
  const user = getCurrentUser();
  const existing = user ? normalizeHistory(read(chatKey(user.id, mode), [])) : [];
  if (existing.length) return existing;
  const history = [{ id: crypto.randomUUID(), role: "assistant", text: opener, at: new Date().toISOString() }];
  if (user) write(chatKey(user.id, mode), history);
  return history;
}
