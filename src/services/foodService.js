import { read, write } from "./storage";
import { getCurrentUser } from "./authService";

function localDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function foodKey(userId) {
  return `food.${userId}.${localDayKey()}`;
}

function hydrationKey(userId) {
  return `hydration.${userId}.${localDayKey()}`;
}

export async function analyzeFood(image) {
  if (!image || !image.type?.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (image.size > 10 * 1024 * 1024) {
    throw new Error("Please choose an image smaller than 10 MB.");
  }

  await new Promise((resolve) => setTimeout(resolve, 700));
  const name = image.name || "meal";
  const hash = name.length + image.size;
  const calories = 320 + (hash % 180);
  const protein = 18 + (hash % 12);
  const carbohydrates = 28 + (hash % 20);
  const fat = 9 + (hash % 8);

  return {
    pendingBackend: true,
    disclaimer: "Estimated nutrition — values may not be exact. Photo analysis is a placeholder until a food-recognition model is connected.",
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
  const current = read(hydrationKey(user.id), null);
  return current && Number.isFinite(Number(current.glasses)) && Number.isFinite(Number(current.goal))
    ? { glasses: Math.max(0, Number(current.glasses)), goal: Math.max(1, Number(current.goal)) }
    : { glasses: 0, goal: 8 };
}

export function addWater() {
  const user = getCurrentUser();
  if (!user) return { glasses: 0, goal: 8 };
  const current = getHydration();
  const next = {
    ...current,
    glasses: Math.min(current.goal, current.glasses + 1),
  };
  write(hydrationKey(user.id), next);
  return next;
}

export function totalCalories(logs = []) {
  return logs.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
}
