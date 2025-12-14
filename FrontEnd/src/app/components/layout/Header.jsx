import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/library/digital-books">Livres</Link>
        <Link to="/library/audiobooks">Livres Audio</Link>
        <Link to="/library/podcasts">Podcasts</Link>
        <Link to="/dashboard">Mon Espace</Link>
        <Link to="/auth/login">Connexion</Link>
      </nav>
    </header>
  )
}
