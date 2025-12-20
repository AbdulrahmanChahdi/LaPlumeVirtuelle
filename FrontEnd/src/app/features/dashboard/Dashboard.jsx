import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 to-transparent">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Bienvenue{user?.nom ? `, ${user.nom}` : ""} 👋</h1>
          <p className="text-lg text-inkSoft">Découvrez vos recommandations personnalisées</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-accent">0</div>
            <p className="text-inkMuted mt-2">Livres lus</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-accent">0</div>
            <p className="text-inkMuted mt-2">Livres audio écoutés</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-accent">0</div>
            <p className="text-inkMuted mt-2">Podcasts suivis</p>
          </div>
        </div>

        {/* CTA Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/library/digital-books"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 block"
          >
            <h3 className="text-xl font-bold mb-2">📚 Livres</h3>
            <p className="text-inkSoft">Explorez notre sélection de livres numériques</p>
          </Link>
          <Link
            to="/library/audiobooks"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 block"
          >
            <h3 className="text-xl font-bold mb-2">🎧 Livres Audio</h3>
            <p className="text-inkSoft">Écoutez vos histoires préférées</p>
          </Link>
          <Link
            to="/library/podcasts"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 block"
          >
            <h3 className="text-xl font-bold mb-2">🎙️ Podcasts</h3>
            <p className="text-inkSoft">Découvrez des contenus audio passionnants</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
