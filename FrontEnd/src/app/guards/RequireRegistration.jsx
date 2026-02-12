import { Navigate } from "react-router-dom"

export default function RequireRegistration({ children }) {
  const hasAccount = typeof window !== "undefined" && localStorage.getItem("registrationComplete") === "true"
  if (!hasAccount) {
    return <Navigate to="/auth/register" replace />
  }

  return children
}
