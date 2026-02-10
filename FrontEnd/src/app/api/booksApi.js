const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Search books using external API (Google Books)
 * @param {string} query - Search query (title, author, keyword)
 * @param {number} maxResults - Maximum results (default: 20, max: 40)
 * @returns {Promise<Array>} List of books
 */
export async function searchBooks(query, maxResults = 20) {
  const params = new URLSearchParams({
    query: query,
    maxResults: maxResults.toString()
  });

  const res = await fetch(`${API_BASE}/api/books/search?${params}`);
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la recherche: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get book details by external ID
 * @param {string} externalId - Google Books volume ID
 * @returns {Promise<Object>} Book details
 */
export async function getBookByExternalId(externalId) {
  const res = await fetch(`${API_BASE}/api/books/external/${externalId}`);
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération du livre: ${res.statusText}`);
  }
  
  return res.json();
}
