const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Advanced book search with filters
 * @param {Object} filters - Search filters
 * @param {string} filters.author - Author name
 * @param {string} filters.subject - Genre/category
 * @param {string} filters.keyword - General keyword
 * @param {number} maxResults - Maximum results (default: 20, max: 40)
 * @returns {Promise<Array>} List of books
 */
export async function advancedSearchBooks(filters, maxResults = 20) {
  const params = new URLSearchParams();
  
  if (filters.author) params.append("author", filters.author);
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.keyword) params.append("keyword", filters.keyword);
  params.append("maxResults", maxResults.toString());

  const url = `${API_BASE}/api/books/search/advanced?${params}`;
  console.log("🔍 Recherche avancée:", url, filters);
  
  const res = await fetch(url);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Erreur API recherche avancée:", res.status, errorText);
    throw new Error(`Erreur lors de la recherche avancée: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log("✅ Résultats recherche avancée:", data.length);
  return data;
}
