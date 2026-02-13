import { getAuthToken } from "./authToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Get all books from the local database
 * @returns {Promise<Array>} List of all books
 */
export async function getAllLivres() {
  const res = await fetch(`${API_BASE}/api/livres`);
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération des livres: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Search books in the local database by keyword
 * Searches in: title, author name, year
 * @param {string} keyword - Search keyword
 * @returns {Promise<Array>} List of matching books
 */
export async function searchLivres(keyword) {
  if (!keyword || keyword.trim() === "") {
    return getAllLivres();
  }

  const params = new URLSearchParams({ keyword: keyword.trim() });
  const res = await fetch(`${API_BASE}/api/livres/search?${params}`);
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la recherche: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get a book by ID
 * @param {number} id - Book ID
 * @returns {Promise<Object>} Book details
 */
export async function getLivreById(id) {
  const res = await fetch(`${API_BASE}/api/livres/${id}`);
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération du livre: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get user's reading collection (books with reading progress)
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Array>} List of books in user's collection
 */
export async function getUserLivres(token) {
  const authToken = token || await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/reading-progress/all`, {
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
    throw new Error(`Erreur lors de la récupération de votre collection: ${res.statusText}`);
  }
  
  return res.json();
}
