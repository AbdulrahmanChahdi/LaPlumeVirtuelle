import { Link } from "react-router-dom"
import UserMenu from "./UserMenu"

export default function HeaderPublic() {
  return (
    <header className="bg-paper border-b border-borderSoft">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-inkSoft hover:text-accent transition"
        >
          La Plume Virtuelle
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/library/digital-books" className="hover:text-gray-600">
            Livres
          </Link>

          <Link to="/library/audiobooks" className="hover:text-gray-600">
            Audio
          </Link>

          <Link to="/library/podcasts" className="hover:text-gray-600">
            Podcasts
          </Link>

          {/* Avatar menu */}
          <UserMenu />
        </nav>

      </div>
    </header>
  )
}
