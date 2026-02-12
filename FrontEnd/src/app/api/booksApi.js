const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Search books using external API (Open Library)
 * @param {string} query - Search query (title, author, keyword)
 * @param {number} maxResults - Maximum results (default: 20, max: 100)
 * @returns {Promise<Array>} List of books
 */
export async function searchBooks(query, maxResults = 20) {
  const params = new URLSearchParams({
    query: query,
    maxResults: maxResults.toString()
  });

  const url = `${API_BASE}/api/books/search?${params}`;
  console.log("📡 URL APPELÉE:", url);
  
  const res = await fetch(url);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ ERREUR HTTP:", res.status, errorText);
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log("✅ DONNÉES REÇUES:", data.length, "livres");
  return data;
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
