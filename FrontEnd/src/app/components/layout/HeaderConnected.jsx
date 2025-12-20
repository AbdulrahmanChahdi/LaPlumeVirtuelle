import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

export default function HeaderConnected() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch {}
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken")
      localStorage.removeItem("currentUser")
      localStorage.removeItem("registrationComplete")
      localStorage.removeItem("onboardingDone")
    } catch {}
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
            Livres
          </Link>
          <Link to="/library/audiobooks" className="hover:text-accent transition">
            Audio
          </Link>
          <Link to="/library/podcasts" className="hover:text-accent transition">
            Podcasts
          </Link>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-borderSoft transition"
            >
              <span className="text-lg">👤</span>
              <span className="text-xs">{user?.nom || "Utilisateur"}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-borderSoft rounded-md shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-borderSoft text-xs text-inkSoft">
                  {user?.adresseMail}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-paperSoft transition"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
