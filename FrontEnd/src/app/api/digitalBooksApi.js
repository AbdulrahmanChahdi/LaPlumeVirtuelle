import { getAuthToken } from "./authToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

/**
 * Get all digital books (for authenticated users)
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Array>} List of digital books
 */
export async function getDigitalBooks(token) {
  // Use provided token or get from localStorage with retry
  const authToken = token || await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/library/books`, {
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
    throw new Error(`Erreur lors de la récupération des livres: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get a single digital book by ID
 * @param {number} id - Book ID
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Object>} Book details
 */
export async function getDigitalBookById(id, token) {
  const authToken = token || await getAuthToken()
  
  const res = await fetch(`${API_BASE}/api/library/books`, {
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
    throw new Error(`Erreur lors de la récupération du livre: ${res.statusText}`);
  }
  
  const items = await res.json();
  const fromLibrary = (items || []).find((book) => String(book.id) === String(id)) || null;
  if (fromLibrary) return fromLibrary;

  // If the book is not in personal library yet, fallback to global catalogue.
  const fallback = await fetch(`${API_BASE}/api/livres/${id}`, {
    headers: {
      "Authorization": `Bearer ${authToken}`,
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

/**
 * Add a book from Open Library to user's personal library
 * @param {string} externalId - Open Library work key (e.g., /works/OL46125W)
 * @param {string} token - Optional auth token, if not provided will retry from localStorage
 * @returns {Promise<Object>} Added book
 */
export async function addBookToLibrary(externalId, token) {
  const authToken = token || await getAuthToken()

  if (!authToken || authToken === "undefined") {
    throw new Error("Vous devez être connecté pour ajouter un livre à votre bibliothèque.");
  }

  const encodedExternalId = encodeURIComponent(externalId ?? "");

  const res = await fetch(`${API_BASE}/api/livres/add-from-external?externalId=${encodedExternalId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  });

  if (!res.ok) {
    let message = `Erreur lors de l'ajout du livre: ${res.statusText || res.status}`;
    try {
      const errorBody = await res.json();
      if (errorBody?.error) {
        message = errorBody.error;
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

export async function addInternalBookToLibrary(bookId, token) {
  const authToken = token || await getAuthToken()

  if (!authToken || authToken === "undefined") {
    throw new Error("Vous devez être connecté pour ajouter un livre à votre bibliothèque.");
  }

  const res = await fetch(`${API_BASE}/api/library/books/${bookId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error(`Erreur lors de l'ajout du livre: ${res.statusText || res.status}`)
  }

  return true
}
