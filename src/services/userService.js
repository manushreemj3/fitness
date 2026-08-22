import { getCurrentUser, persistUser } from "./authService";

const ACCESSORY_STORAGE_KEY = "selectedAccessory";

export function getUser() {
  return getCurrentUser();
}

export function updateProfile(partial) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  const next = {
    ...user,
    profile: { ...user.profile, ...partial },
  };
  return persistUser(next);
}

export function completeOnboarding(profile) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  return persistUser({
    ...user,
    onboardingComplete: true,
    profile: { ...user.profile, ...profile },
  });
}

export function saveGoalAssessment(assessment) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  return persistUser({
    ...user,
    goalAssessment: assessment,
  });
}

export function acceptPlan() {
  const user = getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  return persistUser({
    ...user,
    planAccepted: true,
  });
}

export function applyUITheme(color) {
  if (typeof document !== "undefined" && color) {
    document.documentElement.dataset.theme = color;
  }
}

export function updateCompanion(companion) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  const updatedCompanion = { ...user.companion, ...companion };
  if (updatedCompanion.color) {
    applyUITheme(updatedCompanion.color);
  }
  if (companion.accessory) {
    localStorage.setItem(ACCESSORY_STORAGE_KEY, companion.accessory);
  }
  return persistUser({
    ...user,
    companion: updatedCompanion,
  });
}

export function updateAccount({ name, profile }) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  return persistUser({
    ...user,
    name: name ?? user.name,
    profile: { ...user.profile, ...profile },
  });
}

export function greetingForName(name) {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${hello}, ${name.split(" ")[0]}`;
}
