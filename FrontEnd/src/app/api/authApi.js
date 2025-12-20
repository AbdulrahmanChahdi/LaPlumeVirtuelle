const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function register(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erreur d'inscription");
  }
  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Identifiants invalides");
  }
  return res.json();
}
