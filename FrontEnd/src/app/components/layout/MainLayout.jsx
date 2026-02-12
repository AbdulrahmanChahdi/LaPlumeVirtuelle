import { Navigate, Outlet, useLocation } from "react-router-dom"
import HeaderConnected from "./HeaderConnected"
import Footer from "./Footer"

export default function MainLayout() {
  const location = useLocation()
  const onboardingDone = typeof window !== "undefined" && localStorage.getItem("onboardingDone") === "true"

  if (!onboardingDone && location.pathname !== "/onboarding/preferences") {
    return <Navigate to="/onboarding/preferences" replace />
  }

  return (
    <div className="main-layout">
      {onboardingDone && <HeaderConnected />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
