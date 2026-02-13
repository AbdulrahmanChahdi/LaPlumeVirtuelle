/**
 * Helper function to get auth token from localStorage with retry logic
 * Handles race conditions where token might not be immediately available after login
 * @returns {Promise<string>} The authentication token
 * @throws {Error} If token is not available after retries
 */
export async function getAuthToken() {
  // First attempt - immediate
  let token = localStorage.getItem("authToken")
  
  if (token && token !== "undefined") {
    return token
  }
  
  // Retry logic - token might not be immediately written to localStorage after login
  // Wait up to 500ms for token to appear
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 100))
    token = localStorage.getItem("authToken")
    
    if (token && token !== "undefined") {
      console.log("✅ Token found after retry attempt", i + 1)
      return token
    }
  }
  
  // If still no token after retries
  throw new Error("Vous devez être connecté pour accéder à cette ressource.")
}
