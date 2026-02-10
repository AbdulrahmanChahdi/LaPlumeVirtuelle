const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Get reading progress for a book
 * @param {number} bookId - Book ID
 * @returns {Promise<Object>} Reading progress
 */
export async function getReadingProgress(bookId) {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/reading-progress/book/${bookId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération de la progression: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Update reading progress for a book
 * @param {number} bookId - Book ID
 * @param {number} currentPage - Current page number
 * @returns {Promise<Object>} Updated progress
 */
export async function updateReadingProgress(bookId, currentPage) {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/reading-progress/book/${bookId}?currentPage=${currentPage}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour de la progression: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Mark a book as finished
 * @param {number} bookId - Book ID
 * @returns {Promise<Object>} Updated progress
 */
export async function finishBook(bookId) {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/reading-progress/book/${bookId}/finish`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la finalisation: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get all reading progress
 * @returns {Promise<Array>} All reading progress
 */
export async function getAllReadingProgress() {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/reading-progress/all`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération des progressions: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get unfinished books
 * @returns {Promise<Array>} Unfinished books
 */
export async function getUnfinishedBooks() {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/reading-progress/unfinished`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération des livres en cours: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get finished books
 * @returns {Promise<Array>} Finished books
 */
export async function getFinishedBooks() {
  const token = localStorage.getItem("authToken");
  
  const res = await fetch(`${API_BASE}/api/reading-progress/finished`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération des livres terminés: ${res.statusText}`);
  }
  
  return res.json();
}
