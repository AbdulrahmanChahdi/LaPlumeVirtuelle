import { useState } from "react"
import { Link } from "react-router-dom"
import UserMenu from "./UserMenu"
import { useAuth } from "../../hooks/useAuth"

export default function HeaderConnected() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"

  return (
    <header className="bg-paperSoft border-b border-borderSoft">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/dashboard" className="text-inkSoft hover:text-accent transition font-semibold">
          La Plume Virtuelle
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-accent transition">
            Tableau de bord
          </Link>
          <Link to="/library/digital-books" className="hover:text-accent transition">
            Ma Bibliothèque
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-accent transition">
              Admin
            </Link>
          )}

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
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded bg-accent/10 text-accent hover:bg-accent/20 transition"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* User menu (avatar + actions) */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-borderSoft bg-paper">
          <nav className="px-6 py-4 flex flex-col gap-3 text-sm font-medium">
            <Link to="/dashboard" className="hover:text-accent transition" onClick={() => setMobileOpen(false)}>
              Tableau de bord
            </Link>
            <Link to="/library/digital-books" className="hover:text-accent transition" onClick={() => setMobileOpen(false)}>
              Ma Bibliothèque
            </Link>
            {isAdmin && (
              <Link to="/admin" className="hover:text-accent transition" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            )}
            <div className="pt-3 border-t border-borderSoft flex flex-col gap-2">
              <span className="text-inkMuted text-xs uppercase tracking-wide">Découvrir</span>
              <Link to="/discover/books" className="hover:text-accent transition" onClick={() => setMobileOpen(false)}>
                Livres
              </Link>
              <Link to="/discover/audiobooks" className="hover:text-accent transition" onClick={() => setMobileOpen(false)}>
                Audiobooks
              </Link>
              <Link to="/discover/podcasts" className="hover:text-accent transition" onClick={() => setMobileOpen(false)}>
                Podcasts
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
