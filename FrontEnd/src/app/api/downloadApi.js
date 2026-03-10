import { getAuthToken } from "./authToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Get user download statistics
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Object>} Download stats { isSubscriber, remainingDownloads, totalDownloadsThisMonth }
 */
export async function getUserDownloadStats(token) {
  const authToken = token || await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/downloads/stats`, {
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    throw new Error(`Erreur lors de la récupération des statistiques: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Download a book
 * @param {string} externalId - Open Library work key (e.g., /works/OL46125W)
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Blob>} Book file
 */
export async function downloadBook(externalId, token) {
  const authToken = token || await getAuthToken()
  const encodedExternalId = externalId ? encodeURIComponent(externalId) : "";
  
  const res = await fetch(`${API_BASE}/api/downloads/book?externalId=${encodedExternalId}`, {
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
    }
    const error = await res.text();
    throw new Error(error || "Erreur lors du téléchargement");
  }
  
  return res.blob();
}
