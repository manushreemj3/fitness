import { read, write } from "./storage";
import { getCurrentUser } from "./authService";

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function foodKey(userId) {
  return `food.${userId}.${dayKey()}`;
}

function hydrationKey(userId) {
  return `hydration.${userId}.${dayKey()}`;
}

export async function analyzeFood(image) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const name = image?.name || "meal";
  const hash = name.length + (image?.size || 1200);
  const calories = 320 + (hash % 180);
  const protein = 18 + (hash % 12);
  const carbohydrates = 28 + (hash % 20);
  const fat = 9 + (hash % 8);

  return {
    pendingBackend: true,
    disclaimer: "Estimated nutrition — values may not be exact.",
    calories,
    protein,
    carbohydrates,
    fat,
    suggestion:
      "Pair this meal with water and a protein-rich option later if you still feel hungry. This is a general wellbeing suggestion, not medical advice.",
  };
}

export function saveFoodLog(entry) {
  const user = getCurrentUser();
  if (!user) return [];
  const logs = read(foodKey(user.id), []);
  const next = [{ id: crypto.randomUUID(), at: new Date().toISOString(), ...entry }, ...logs];
  write(foodKey(user.id), next);
  return next;
}

export function getFoodLogs() {
  const user = getCurrentUser();
  if (!user) return [];
  return read(foodKey(user.id), []);
}

export function getHydration() {
  const user = getCurrentUser();
  if (!user) return { glasses: 0, goal: 8 };
  return read(hydrationKey(user.id), { glasses: 0, goal: 8 });
}

export function addWater() {
  const user = getCurrentUser();
  const current = getHydration();
  const next = {
    ...current,
    glasses: Math.min(current.goal, current.glasses + 1),
  };
  write(hydrationKey(user.id), next);
  return next;
}

export function totalCalories(logs) {
  return logs.reduce((sum, item) => sum + (item.calories || 0), 0);
}
