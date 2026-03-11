import { getAuthToken } from "./authToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

/**
 * Get all podcasts (for authenticated users)
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Array>} List of podcasts
 */
export async function getPodcasts(token) {
  const authToken = token || await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/library/podcasts`, {
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    throw new Error(`Erreur lors de la récupération des podcasts: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get a single podcast by ID
 * @param {number} id - Podcast ID
 * @returns {Promise<Object>} Podcast details
 */
export async function getPodcastById(id) {
  const token = await getAuthToken()
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté pour accéder à ce podcast.");
  }
  
  const res = await fetch(`${API_BASE}/api/library/podcasts`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    throw new Error(`Erreur lors de la récupération du podcast: ${res.statusText}`);
  }
  
  const items = await res.json();
  const fromLibrary = (items || []).find((podcast) => String(podcast.id) === String(id)) || null;
  if (fromLibrary) return fromLibrary;

  const fallback = await fetch(`${API_BASE}/api/podcasts/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!fallback.ok) {
    if (fallback.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    return null;
  }

  return fallback.json();
}

export async function addPodcastToLibrary(id, token) {
  const authToken = token || await getAuthToken()
  const res = await fetch(`${API_BASE}/api/library/podcasts/${id}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error(`Erreur lors de l'ajout du podcast: ${res.statusText || res.status}`)
  }

  return true
}

/**
 * Search podcasts
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Filtered podcasts
 */
export async function searchPodcasts(searchTerm) {
  const token = await getAuthToken()
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté pour effectuer une recherche.");
  }
  
  const res = await fetch(`${API_BASE}/api/podcasts/search?term=${encodeURIComponent(searchTerm)}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    throw new Error(`Erreur lors de la recherche: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get podcasts by theme
 * @param {string} theme - Theme name
 * @returns {Promise<Array>} Podcasts by theme
 */
export async function getPodcastsByTheme(theme) {
  const token = localStorage.getItem("authToken");
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté.");
  }
  
  const res = await fetch(`${API_BASE}/api/podcasts/theme/${encodeURIComponent(theme)}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    throw new Error(`Erreur lors de la récupération: ${res.statusText}`);
  }
  
  return res.json();
}
