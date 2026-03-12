import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function RequireAdmin({ children }) {
  const { isAuthenticated, user, loading } = useAuth()
  const role = (user?.role || "").toUpperCase()

  if (loading) return null

  if (!isAuthenticated || role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
