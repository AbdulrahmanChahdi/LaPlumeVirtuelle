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
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Votre Bibliothèque Multimédia en Ligne
        </h1>

        <p className="text-inkSoft mb-6">
          Découvrez, lisez et écoutez une sélection de livres et de podcasts,
          adaptés à vos envies.
        </p>

        <Button onClick={handleClick}>
          Découvrir maintenant
        </Button>
      </div>
    </section>
  )
}
