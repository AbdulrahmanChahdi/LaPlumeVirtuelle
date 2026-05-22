import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { saveIntendedDestination } from "../utils/navigation"

export default function RequireAuth({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()
    
    // Attendre que l'auth soit vérifiée
    if (loading) {
        return null
    }
    
    if (!isAuthenticated) {
        const fullPath = location.pathname + location.search
        // Sauvegarder la destination voulue avant redirection vers login
        saveIntendedDestination(fullPath)
        
        // Rediriger vers login avec backup dans l'URL
        return <Navigate to={`/auth/login?redirectTo=${encodeURIComponent(fullPath)}`} replace />
    }
    return children
}
