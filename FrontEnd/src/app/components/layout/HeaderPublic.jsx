import { Link } from "react-router-dom"
import UserMenu from "./UserMenu"

export default function HeaderPublic() {
  return (
    <header className="bg-paperSoft border-b border-borderSoft">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-inkSoft hover:text-accent transition"
        >
          La Plume Virtuelle
        </Link>

        {/* Avatar menu */}
        <UserMenu />

      </div>
    </header>
  )
}
