import { read, write, remove } from "./storage";

function simpleHash(value) {
  let hash = 0;
  const text = String(value);
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return `h${hash.toString(16)}`;
}

function users() {
  return read("users", []);
}

function saveUsers(list) {
  write("users", list);
}

export function getSession() {
  return read("session", null);
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return users().find((user) => user.id === session.userId) || null;
}

export function signup({ name, email, password }) {
  const normalized = email.trim().toLowerCase();
  const existing = users();
  if (existing.some((user) => user.email === normalized)) {
    throw new Error("An account with this email already exists.");
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalized,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
    onboardingComplete: false,
    goalAssessment: null,
    planAccepted: false,
    companion: { name: "FitBuddy", model: "flora", color: "lavender", accessory: "none" },
    profile: {},
    reminders: {
      hydration: true,
      workout: true,
      mood: true,
    },
  };

  saveUsers([...existing, user]);
  write("session", { userId: user.id });
  return user;
}

export function login({ email, password }) {
  const normalized = email.trim().toLowerCase();
  const user = users().find((item) => item.email === normalized);
  if (!user || user.passwordHash !== simpleHash(password)) {
    throw new Error("Email or password is incorrect.");
  }
  write("session", { userId: user.id });
  return user;
}

export function logout() {
  remove("session");
}

export function requestPasswordReset(email) {
  const normalized = email.trim().toLowerCase();
  const user = users().find((item) => item.email === normalized);
  return {
    pendingBackend: true,
    found: Boolean(user),
    message:
      "Password reset will be sent from the FitBuddy backend once it is connected.",
  };
}

export function googleSignInPlaceholder() {
  return {
    pendingBackend: true,
    message: "Google sign-in will be available when the backend is connected.",
  };
}

export function persistUser(updated) {
  const list = users().map((user) => (user.id === updated.id ? updated : user));
  saveUsers(list);
  return updated;
}
