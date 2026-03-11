import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout() // Utiliser la fonction logout du contexte
    setOpen(false)
    navigate("/", { replace: true })
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20 transition-colors"
        aria-label={isAuthenticated ? "Menu utilisateur" : "Connexion"}
      >
        {isAuthenticated && user ? (
          <span className="font-semibold text-sm">
            {user.nom?.charAt(0).toUpperCase() || user.prenom?.charAt(0).toUpperCase() || "U"}
          </span>
        ) : (
          <span>👤</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-borderSoft rounded-md shadow-lg py-2 z-50">
          {isAuthenticated ? (
            <>
              {user && (
                <div className="px-4 py-2 border-b border-borderSoft">
                  <p className="text-sm font-medium text-ink truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-inkMuted truncate">{user.adresseMail}</p>
                </div>
              )}

              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm text-ink hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Tableau de bord
              </Link>

              <Link
                to="/library"
                className="block px-4 py-2 text-sm text-ink hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Ma Bibliothèque
              </Link>

              <hr className="my-1 border-borderSoft" />

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="block px-4 py-2 text-sm text-ink hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Se connecter
              </Link>

              <Link
                to="/auth/register"
                className="block px-4 py-2 text-sm text-ink hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
