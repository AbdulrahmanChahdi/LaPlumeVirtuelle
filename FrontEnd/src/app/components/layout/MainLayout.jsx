import { Navigate, Outlet, useLocation } from "react-router-dom"
import HeaderConnected from "./HeaderConnected"
import Footer from "./Footer"
import { useAuth } from "../../hooks/useAuth"

export default function MainLayout() {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const location = useLocation()
  const onboardingDone = typeof window !== "undefined" && localStorage.getItem("onboardingDone") === "true"

  if (!isAdmin && !onboardingDone && location.pathname !== "/onboarding/preferences") {
    return <Navigate to="/onboarding/preferences" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {onboardingDone && <HeaderConnected />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
