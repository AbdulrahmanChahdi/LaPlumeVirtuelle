import { Navigate } from "react-router-dom"

export default function RequireRegistration({ children }) {
  const completed = typeof window !== "undefined" && localStorage.getItem("registrationComplete") === "true"
  if (!completed) {
    return <Navigate to="/register" replace />
  }
  return children
}
