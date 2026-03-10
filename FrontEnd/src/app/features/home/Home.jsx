import { Navigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import HeroSection from "./HeroSection"
import MediaSection from "./MediaSection"
import HomeStats from "./HomeStats"
import HomeRecommendations from "./HomeRecommendations"

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />
  }

  return (
    <>
      <HeroSection />
      <MediaSection />
      <HomeStats />
      <HomeRecommendations />
    </>
  )
}
