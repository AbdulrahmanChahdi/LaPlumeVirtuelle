import { Link } from "react-router-dom"
import UserMenu from "./UserMenu"

export default function HeaderPublic() {
  return (
    <header className="bg-paperSoft border-b border-borderSoft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link 
          to="/" 
          className="text-sm sm:text-base lg:text-lg font-semibold text-ink hover:text-accent transition"
          aria-label="La Plume Virtuelle - Accueil"
        >
          <span className="hidden sm:inline">La Plume Virtuelle</span>
          <span className="sm:hidden">LPV</span>
        </Link>

        {/* Avatar menu */}
        <UserMenu />

      </div>
    </header>
  )
}
