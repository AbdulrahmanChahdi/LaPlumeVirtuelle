const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erreur ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ========== LIVRES ==========
export async function adminGetLivres() {
  const res = await fetch(`${API_BASE}/admin/livres`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminCreateLivre(livre) {
  const res = await fetch(`${API_BASE}/admin/livres`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(livre),
  });
  return handleResponse(res);
}

export async function adminUpdateLivre(id, livre) {
  const res = await fetch(`${API_BASE}/admin/livres/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(livre),
  });
  return handleResponse(res);
}

export async function adminDeleteLivre(id) {
  const res = await fetch(`${API_BASE}/admin/livres/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ========== LIVRES AUDIO ==========
export async function adminGetLivresAudio() {
  const res = await fetch(`${API_BASE}/admin/livres-audio`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminCreateLivreAudio(livreAudio) {
  const res = await fetch(`${API_BASE}/admin/livres-audio`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(livreAudio),
  });
  return handleResponse(res);
}

export async function adminUpdateLivreAudio(id, livreAudio) {
  const res = await fetch(`${API_BASE}/admin/livres-audio/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(livreAudio),
  });
  return handleResponse(res);
}

export async function adminDeleteLivreAudio(id) {
  const res = await fetch(`${API_BASE}/admin/livres-audio/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ========== PODCASTS ==========
export async function adminGetPodcasts() {
  const res = await fetch(`${API_BASE}/admin/podcasts`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminCreatePodcast(podcast) {
  const res = await fetch(`${API_BASE}/admin/podcasts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(podcast),
  });
  return handleResponse(res);
}

export async function adminUpdatePodcast(id, podcast) {
  const res = await fetch(`${API_BASE}/admin/podcasts/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(podcast),
  });
  return handleResponse(res);
}

export async function adminDeletePodcast(id) {
  const res = await fetch(`${API_BASE}/admin/podcasts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function adminGetCategories() {
  const res = await fetch(`${API_BASE}/admin/categories`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminGetAuteurs() {
  const res = await fetch(`${API_BASE}/admin/auteurs`, { headers: authHeaders() });
  return handleResponse(res);
}

// ========== UTILISATEURS ==========
export async function adminGetUtilisateurs() {
  const res = await fetch(`${API_BASE}/admin/utilisateurs`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminCreateUtilisateur(utilisateur) {
  const res = await fetch(`${API_BASE}/admin/utilisateurs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(utilisateur),
  });
  return handleResponse(res);
}

export async function adminUpdateUtilisateur(id, data) {
  const res = await fetch(`${API_BASE}/admin/utilisateurs/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function adminDeleteUtilisateur(id) {
  const res = await fetch(`${API_BASE}/admin/utilisateurs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}
