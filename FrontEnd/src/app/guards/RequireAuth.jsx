import { Navigate } from "react-router-dom"

export default function RequireAuth({ children }) {
  const authToken = typeof window !== "undefined" && localStorage.getItem("authToken")
  if (!authToken) {
    return <Navigate to="/login" replace />
  }
  return children
}
