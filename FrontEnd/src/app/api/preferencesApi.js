const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function savePreferences(preferences) {
  console.log("Envoi des préférences:", preferences);
  const res = await fetch(`${API_BASE}/preferences/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(preferences),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Erreur du serveur:", res.status, text);
    throw new Error(`Erreur HTTP ${res.status}: ${text}`);
  }

  return res.json();
}
