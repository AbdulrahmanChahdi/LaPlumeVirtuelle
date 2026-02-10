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
          {isConnected ? "Bienvenue dans votre Bibliothèque" : "Votre Bibliothèque Multimédia en Ligne"}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-inkSoft mb-6 sm:mb-8 max-w-2xl mx-auto">
          {isConnected 
            ? "Accédez à votre collection personnelle, découvrez de nouveaux livres et podcasts"
            : "Découvrez, lisez et écoutez une sélection de livres et de podcasts, adaptés à vos envies."
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate(isConnected ? "/library/digital-books" : "/discover/books")}
            ariaLabel={isConnected ? "Accéder à votre bibliothèque" : "Découvrir le catalogue"}
          >
            {isConnected ? "Ma Bibliothèque" : "Découvrir maintenant"}
          </Button>

          {isConnected && (
            <Button 
              onClick={() => navigate("/discover/books")}
              className="bg-accent/10 text-accent hover:bg-accent/20"
              ariaLabel="Découvrir de nouveaux livres"
            >
              Découvrir de nouveaux livres
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
