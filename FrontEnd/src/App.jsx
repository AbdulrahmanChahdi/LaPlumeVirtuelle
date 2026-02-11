import { useEffect, useState } from "react"
import { AuthProvider } from "./app/context/AuthContext"
import AppRouter from "./app/router/Approuter"

export default function App() {
  const [tokenValidated, setTokenValidated] = useState(false)

  useEffect(() => {
    // Valider le token au démarrage de l'app
    const validateToken = async () => {
      const token = localStorage.getItem("authToken")
      
      // Si pas de token, pas besoin de valider
      if (!token || token === "undefined") {
        setTokenValidated(true)
        return
      }

      try {
        // Vérifier si le token a plus de 30 minutes
        // (temps limite court en dev pour forcer le re-login après redémarrage du backend)
        const tokenTimestamp = localStorage.getItem("authTokenTime")
        if (tokenTimestamp) {
          const createdAt = parseInt(tokenTimestamp)
          const now = Date.now()
          const age = now - createdAt
          const maxAge = 30 * 60 * 1000 // 30 min en ms
          
          if (age > maxAge) {
            console.warn("Token trop ancien, nettoyage du localStorage")
            localStorage.removeItem("authToken")
            localStorage.removeItem("currentUser")
            localStorage.removeItem("authTokenTime")
            setTokenValidated(true)
            return
          }
        } else {
          // Pas de timestamp = token vieux (avant la mise à jour)
          // Nettoyer pour forcer login
          console.warn("Token sans timestamp détecté, nettoyage du localStorage")
          localStorage.removeItem("authToken")
          localStorage.removeItem("currentUser")
          localStorage.removeItem("authTokenTime")
          setTokenValidated(true)
          return
        }

        // Faire un appel simple pour vérifier que le token est valide
        const res = await fetch("http://localhost:8080/api/livres", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        
        // Si le token est invalide (401), le nettoyer
        if (res.status === 401) {
          console.warn("Token invalide ou expiré, nettoyage du localStorage")
          localStorage.removeItem("authToken")
          localStorage.removeItem("currentUser")
          localStorage.removeItem("authTokenTime")
        }
      } catch (err) {
        // Erreur de connexion - ne pas nettoyer, laisser une chance à l'utilisateur
        console.warn("Impossible de valider le token au démarrage:", err)
      }
      
      // Token validé (ou nettoyé si invalide)
      setTokenValidated(true)
    }

    validateToken()
  }, [])

  // Ne pas afficher l'app tant que la validation n'est pas faite
  if (!tokenValidated) {
    return null
  }

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

