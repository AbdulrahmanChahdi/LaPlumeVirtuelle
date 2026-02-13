import { getAuthToken } from "./authToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

/**
 * Get all audiobooks (for authenticated users)
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Array>} List of audiobooks
 */
export async function getAudiobooks(token) {
  const authToken = token || await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/livres-audio`, {
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
    throw new Error(`Erreur lors de la récupération des audiobooks: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get a single audiobook by ID
 * @param {number} id - Audiobook ID
 * @returns {Promise<Object>} Audiobook details
 */
export async function getAudiobookById(id) {
  const token = await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/livres-audio/${id}`, {
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
    throw new Error(`Erreur lors de la récupération de l'audiobook: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Search audiobooks
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Filtered audiobooks
 */
export async function searchAudiobooks(searchTerm) {
  const token = await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/livres-audio/search?term=${encodeURIComponent(searchTerm)}`, {
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
 * Get audiobooks by category
 * @param {number} categorieId - Category ID
 * @returns {Promise<Array>} Audiobooks in category
 */
export async function getAudiobooksByCategory(categorieId) {
  const token = localStorage.getItem("authToken");
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté.");
  }
  
  const res = await fetch(`${API_BASE}/api/livres-audio/categorie/${categorieId}`, {
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
