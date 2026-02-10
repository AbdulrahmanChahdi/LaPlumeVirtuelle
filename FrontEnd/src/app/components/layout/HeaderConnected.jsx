import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function HeaderConnected() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch { }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken")
      localStorage.removeItem("currentUser")
      // Ne pas supprimer registrationComplete et onboardingDone
      // car ce sont des états permanents du compte utilisateur
    } catch { }
    navigate("/", { replace: true })
  }

  return (
    <header className="bg-paperSoft border-b border-borderSoft">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-inkSoft hover:text-accent transition font-semibold">
          La Plume Virtuelle
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-accent transition">
            Tableau de bord
          </Link>
          <Link to="/library/digital-books" className="hover:text-accent transition">
            Ma Bibliothèque
          </Link>
          
          {/* Découvrir */}
          <div className="border-l border-borderSoft pl-6 flex items-center gap-4">
            <span className="text-inkMuted">Découvrir</span>
            <Link to="/discover/books" className="hover:text-accent transition">
              Livres
            </Link>
            <Link to="/discover/audiobooks" className="hover:text-accent transition">
              Audiobooks
            </Link>
            <Link to="/discover/podcasts" className="hover:text-accent transition">
              Podcasts
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="text-accent hover:text-accent/80 transition font-medium ml-auto"
          >
            Se déconnecter
          </button>
        </nav>
      </div>
    </header>
  )
}
