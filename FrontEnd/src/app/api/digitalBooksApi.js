const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Get all digital books (for authenticated users)
 * @returns {Promise<Array>} List of digital books
 */
export async function getDigitalBooks() {
  const token = localStorage.getItem("authToken");
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté pour accéder à votre bibliothèque.");
  }
  
  const res = await fetch(`${API_BASE}/api/livres`, {
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
    throw new Error(`Erreur lors de la récupération des livres: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Get a single digital book by ID
 * @param {number} id - Book ID
 * @returns {Promise<Object>} Book details
 */
export async function getDigitalBookById(id) {
  const token = localStorage.getItem("authToken");
  
  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté pour accéder à ce livre.");
  }
  
  const res = await fetch(`${API_BASE}/api/livres/${id}`, {
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
    throw new Error(`Erreur lors de la récupération du livre: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Add a book from Open Library to user's personal library
 * @param {string} externalId - Open Library work key (e.g., /works/OL46125W)
 * @returns {Promise<Object>} Added book
 */
export async function addBookToLibrary(externalId) {
  const token = localStorage.getItem("authToken");

  if (!token || token === "undefined") {
    throw new Error("Vous devez être connecté pour ajouter un livre à votre bibliothèque.");
  }

  const encodedExternalId = encodeURIComponent(externalId ?? "");

  const res = await fetch(`${API_BASE}/api/livres/add-from-external?externalId=${encodedExternalId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
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
