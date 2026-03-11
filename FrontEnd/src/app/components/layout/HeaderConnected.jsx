import { Link } from "react-router-dom"
import UserMenu from "./UserMenu"

export default function HeaderConnected() {
  return (
    <header className="bg-paperSoft border-b border-borderSoft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-ink hover:text-accent transition shrink-0"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.2rem" }}
          aria-label="La Plume Virtuelle"
        >
          La Plume Virtuelle
        </Link>

        {/* Navigation centrale */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/library/digital-books" className="text-sm text-inkSoft hover:text-ink transition">
            Livres
          </Link>
          <Link to="/library/audiobooks" className="text-sm text-inkSoft hover:text-ink transition">
            Audiobooks
          </Link>
          <Link to="/library/podcasts" className="text-sm text-inkSoft hover:text-ink transition">
            Podcasts
          </Link>
        </nav>

        {/* Avatar */}
        <UserMenu />

      </div>
    </header>
  )
}
