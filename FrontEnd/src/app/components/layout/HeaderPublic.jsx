import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import UserMenu from "./UserMenu"

export default function HeaderPublic() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-paperSoft border-b border-borderSoft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-base font-semibold text-ink hover:text-accent transition shrink-0"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.2rem" }}
          aria-label="La Plume Virtuelle - Accueil"
        >
          La Plume Virtuelle
        </Link>

        {/* Navigation centrale */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/public/livres" className="text-sm text-inkSoft hover:text-ink transition">
            Livres
          </Link>
          <Link to="/public/audiobooks" className="text-sm text-inkSoft hover:text-ink transition">
            Audiobooks
          </Link>
          <Link to="/public/podcasts" className="text-sm text-inkSoft hover:text-ink transition">
            Podcasts
          </Link>
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <button
                onClick={() => navigate("/auth/login")}
                className="hidden sm:block text-sm px-4 py-1.5 rounded border border-borderSoft text-ink hover:border-accent hover:text-accent transition"
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="text-sm px-4 py-1.5 rounded text-white transition"
                style={{ backgroundColor: "#2F5D50" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#244A40"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2F5D50"}
              >
                S'inscrire
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  )
}
