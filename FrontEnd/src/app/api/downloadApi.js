const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Get user download statistics
 * @returns {Promise<Object>} Download stats { isSubscriber, remainingDownloads, totalDownloadsThisMonth }
 */
export async function getUserDownloadStats() {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/downloads/stats`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération des statistiques: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Download a book
 * @param {string} externalId - Google Books volume ID
 * @returns {Promise<Blob>} Book file
 */
export async function downloadBook(externalId) {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/downloads/book/${externalId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Erreur lors du téléchargement");
  }
  
  return res.blob();
}
