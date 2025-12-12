import HeroSection from "./HeroSection"
import MediaSection from "./MediaSection"
import HomeStats from "./HomeStats"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <HeroSection />
      <MediaSection />
      <HomeStats />
    </div>
  )
}
