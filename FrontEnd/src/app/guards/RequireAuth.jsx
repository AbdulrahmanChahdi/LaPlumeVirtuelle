import { Navigate, useLocation } from "react-router-dom"
import { saveIntendedDestination } from "../utils/navigation"

export default function RequireAuth({ children }) {
    const authToken = typeof window !== "undefined" && localStorage.getItem("authToken")
    const location = useLocation()
    
    if (!authToken) {
        const fullPath = location.pathname + location.search
        // Sauvegarder la destination voulue avant redirection vers login
        saveIntendedDestination(fullPath)
        
        // Rediriger vers login avec backup dans l'URL
        return <Navigate to={`/login?redirectTo=${encodeURIComponent(fullPath)}`} replace />
    }
    return children
}
