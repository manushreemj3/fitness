const API = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("fitbuddy.token");
}

async function parseResponse(response) {
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = {}; }

  if (!response.ok) {
    const error = new Error(body?.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(`${API}${path}`, { ...options, headers });
    return await parseResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to reach the FitBuddy server. Check VITE_API_URL and the backend deployment.");
    }
    throw error;
  }
}

export { API };
