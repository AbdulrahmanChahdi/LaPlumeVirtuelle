import { Outlet, useLocation } from "react-router-dom"
import HeaderPublic from "./HeaderPublic"
import HeaderConnected from "./HeaderConnected"
import Footer from "./Footer"
import { useAuth } from "../../hooks/useAuth"

const AUTH_PATHS = ["/auth/login", "/auth/register"]

export default function PublicLayout() {
  const { isAuthenticated } = useAuth()
  const onboardingDone = typeof window !== "undefined" && localStorage.getItem("onboardingDone") === "true"
  const location = useLocation()
  const isOnboarding = location.pathname === "/onboarding/preferences"
  const isAuthPage = AUTH_PATHS.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {!isOnboarding && !isAuthPage && (isAuthenticated && onboardingDone ? <HeaderConnected /> : <HeaderPublic />)}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isOnboarding && !isAuthPage && <Footer />}
    </div>
  )
}
