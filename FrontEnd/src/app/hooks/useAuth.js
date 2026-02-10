/**
 * Hook pour vérifier l'état d'authentification
 * @returns {Object} { isAuthenticated: boolean, user: Object|null }
 */
export function useAuth() {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("currentUser");
  
  return {
    isAuthenticated: !!token && token !== "undefined",
    token: token || null,
    user: user ? JSON.parse(user) : null
  };
}
