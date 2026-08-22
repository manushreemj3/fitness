const API = import.meta.env.VITE_API_URL;

export async function signup({ name, email, password }) {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const { token, user } = await res.json();
  localStorage.setItem("fitbuddy.token", token); // just the token now, not user data
  return user;
}
