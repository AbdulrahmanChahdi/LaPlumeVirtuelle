import { Outlet, useLocation } from "react-router-dom"
import HeaderPublic from "./HeaderPublic"
import HeaderConnected from "./HeaderConnected"
import Footer from "./Footer"
import { useAuth } from "../../hooks/useAuth"

export default function PublicLayout() {
  const { isAuthenticated } = useAuth()
  const onboardingDone = typeof window !== "undefined" && localStorage.getItem("onboardingDone") === "true"
  const location = useLocation()
  const isOnboarding = location.pathname === "/onboarding/preferences"

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {!isOnboarding && (isAuthenticated && onboardingDone ? <HeaderConnected /> : <HeaderPublic />)}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isOnboarding && <Footer />}
    </div>
  )
}
