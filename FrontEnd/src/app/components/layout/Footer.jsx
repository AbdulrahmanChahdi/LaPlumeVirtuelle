import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-paperSoft border-t border-borderSoft mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              La Plume Virtuelle
            </h3>
            <p className="text-sm text-inkSoft max-w-sm">
              Une bibliothèque multimédia moderne pour lire, écouter
              et explorer la culture, enrichie par l’analyse intelligente
              des usages.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-3">Explorer</h4>
            <ul className="space-y-2 text-sm text-inkSoft">
              <li>
                <Link
                  to="/library/digital-books"
                  className="hover:text-accent transition"
                >
                  Livres numériques
                </Link>
              </li>
              <li>
                <Link
                  to="/library/audiobooks"
                  className="hover:text-accent transition"
                >
                  Livres audio
                </Link>
              </li>
              <li>
                <Link
                  to="/library/podcasts"
                  className="hover:text-accent transition"
                >
                  Podcasts
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-3">Compte</h4>
            <ul className="space-y-2 text-sm text-inkSoft">
              <li>
                <Link
                  to="/login"
                  className="hover:text-accent transition"
                >
                  Se connecter
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-accent transition"
                >
                  S’inscrire
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-borderSoft mt-10 pt-6 text-sm text-inkMuted text-center">
          © {new Date().getFullYear()} La Plume Virtuelle. Tous droits réservés.
        </div>

      </div>
    </footer>
  )
}
