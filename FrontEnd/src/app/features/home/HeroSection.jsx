import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"

export default function HeroSection() {
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken")
      setIsConnected(!!token)
    } catch {}
  }, [])

  const handleClick = () => {
    if (isConnected) {
      navigate("/library/digital-books")
    } else {
      navigate("/public/livres")
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          Votre Bibliothèque Multimédia en Ligne
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-inkSoft mb-6 sm:mb-8 max-w-2xl mx-auto">
          Découvrez, lisez et écoutez une sélection de livres et de podcasts,
          adaptés à vos envies.
        </p>

        <Button onClick={handleClick} ariaLabel={isConnected ? "Accéder à votre bibliothèque" : "Découvrir le catalogue public"}>
          Découvrir maintenant
        </Button>
      </div>
    </section>
  )
}
