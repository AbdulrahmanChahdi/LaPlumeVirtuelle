import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { isAuthenticated } = useAuth()

  return (
    <footer className="bg-paperSoft border-t border-borderSoft mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10">

          {/* Brand */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              La Plume Virtuelle
            </h3>
            <p className="text-sm text-inkSoft max-w-sm leading-relaxed">
              Une bibliothèque multimédia moderne pour lire, écouter
              et explorer la culture, enrichie par l'analyse intelligente
              des usages.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Explorer">
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Explorer</h4>
            <ul className="space-y-2 text-sm text-inkSoft">
              <li>
                <Link
                  to="/public/livres"
                  className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:rounded px-1 transition"
                >
                  Livres numériques
                </Link>
              </li>
              <li>
                <Link
                  to="/public/audiobooks"
                  className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:rounded px-1 transition"
                >
                  Livres audio
                </Link>
              </li>
              <li>
                <Link
                  to="/public/podcasts"
                  className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:rounded px-1 transition"
                >
                  Podcasts
                </Link>
              </li>
            </ul>
          </nav>

          {/* Account */}
          {!isAuthenticated && (
            <nav aria-label="Compte">
              <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Compte</h4>
              <ul className="space-y-2 text-sm text-inkSoft">
                <li>
                  <Link
                    to="/auth/login"
                    className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:rounded px-1 transition"
                  >
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth/register"
                    className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:rounded px-1 transition"
                  >
                    S'inscrire
                  </Link>
                </li>
              </ul>
            </nav>
          )}

        </div>

        {/* Bottom */}
        <div className="border-t border-borderSoft pt-6 sm:pt-8 text-xs sm:text-sm text-inkMuted text-center">
          © {currentYear} La Plume Virtuelle. Tous droits réservés.
        </div>

      </div>
    </footer>
  )
}
