const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Get all podcasts (for authenticated users)
 * @returns {Promise<Array>} List of podcasts
 */
export async function getPodcasts() {
  const token = localStorage.getItem("authToken");
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté pour accéder à vos podcasts.");
  }
  
  const res = await fetch(`${API_BASE}/api/podcasts`, {
    headers: {
      "Authorization": `Bearer ${token}`,
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
  const token = localStorage.getItem("authToken");
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté pour accéder à ce podcast.");
  }
  
  const res = await fetch(`${API_BASE}/api/podcasts/${id}`, {
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
  
  return res.json();
}

/**
 * Search podcasts
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Filtered podcasts
 */
export async function searchPodcasts(searchTerm) {
  const token = localStorage.getItem("authToken");
  
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
