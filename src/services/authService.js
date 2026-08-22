const API = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("fitbuddy.token");
}
export async function requestPasswordReset(email) {
  const res = await fetch(`${API}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json(); // { pendingBackend, found, message }
}

export function googleSignInPlaceholder() {
  return {
    pendingBackend: true,
    message: "Google sign-in will be available when the backend is connected.",
  };
}
// Cache the user object at login/signup time so other services
// can still call getCurrentUser() synchronously.
export function getCurrentUser() {
  const raw = localStorage.getItem("fitbuddy.user");
  return raw ? JSON.parse(raw) : null;
}

function cacheUser(user) {
  localStorage.setItem("fitbuddy.user", JSON.stringify(user));
}

export async function signup({ name, email, password }) {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const { token, user } = await res.json();
  localStorage.setItem("fitbuddy.token", token);
  cacheUser(user);
  return user;
}

export async function login({ email, password }) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const { token, user } = await res.json();
  localStorage.setItem("fitbuddy.token", token);
  cacheUser(user);
  return user;
}

export function logout() {
  localStorage.removeItem("fitbuddy.token");
  localStorage.removeItem("fitbuddy.user");
}

export async function persistUser(updated) {
  const res = await fetch(`${API}/api/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updated),
  });
  const user = await res.json();
  cacheUser(user);
  return user;
}

export function getSession() {
  const token = getToken();
  return token ? { token } : null;
}
