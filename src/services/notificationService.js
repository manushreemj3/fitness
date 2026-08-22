import { persistUser, getCurrentUser } from "./authService";
import { read, write } from "./storage";

export const DEFAULT_REMINDERS = {
  hydration: true,
  workout: true,
  mood: true,
};

export function getReminderSettings() {
  const user = getCurrentUser();
  return user?.reminders || DEFAULT_REMINDERS;
}

export function saveReminderSettings(reminders) {
  const user = getCurrentUser();
  if (!user) return reminders;
  persistUser({ ...user, reminders });
  return reminders;
}

export function getMood() {
  const user = getCurrentUser();
  if (!user) return null;
  const today = new Date().toISOString().slice(0, 10);
  return read(`mood.${user.id}.${today}`, null);
}

export function saveMood(mood) {
  const user = getCurrentUser();
  if (!user) return mood;
  const today = new Date().toISOString().slice(0, 10);
  write(`mood.${user.id}.${today}`, { mood, at: new Date().toISOString() });
  return mood;
}
