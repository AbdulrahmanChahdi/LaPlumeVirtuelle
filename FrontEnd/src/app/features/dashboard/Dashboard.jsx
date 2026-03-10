import { useEffect, useState } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getUserLivres } from "../../api/livresApi"
import { getAudiobooks } from "../../api/audiobooksApi"
import { getPodcasts } from "../../api/podcastsApi"

export default function Dashboard() {
  const { user, token } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const location = useLocation()
  const [stats, setStats] = useState({
    booksCount: 0,
    audiobooksCount: 0,
    podcastsCount: 0
  })
  const [loading, setLoading] = useState(true)

  // Charger les stats des collections
  useEffect(() => {
    const loadStats = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const [books, audiobooks, podcasts] = await Promise.allSettled([
          getUserLivres(token),
          getAudiobooks(token),
          getPodcasts(token)
        ])

        setStats({
          booksCount: books.status === "fulfilled" ? (Array.isArray(books.value) ? books.value.length : 0) : 0,
          audiobooksCount: audiobooks.status === "fulfilled" ? (Array.isArray(audiobooks.value) ? audiobooks.value.length : 0) : 0,
          podcastsCount: podcasts.status === "fulfilled" ? (Array.isArray(podcasts.value) ? podcasts.value.length : 0) : 0
        })
      } catch (err) {
        console.error("Erreur chargement stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [token, location.key])

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 to-transparent">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Bienvenue{user?.nom ? `, ${user.nom}` : ""} 👋</h1>
          <p className="text-sm sm:text-lg text-inkSoft">Découvrez vos recommandations personnalisées</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10"
          role="region"
          aria-label="Statistiques de lecture"
        >
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="text-2xl sm:text-3xl font-bold text-accent">{stats.booksCount}</div>
            <p className="text-xs sm:text-base text-inkMuted mt-2">Livre{stats.booksCount !== 1 ? "s" : ""} en collection</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-cyan-500">
            <div className="text-2xl sm:text-3xl font-bold text-accent">{stats.audiobooksCount}</div>
            <p className="text-xs sm:text-base text-inkMuted mt-2">Audiobook{stats.audiobooksCount !== 1 ? "s" : ""}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-500">
            <div className="text-2xl sm:text-3xl font-bold text-accent">{stats.podcastsCount}</div>
            <p className="text-xs sm:text-base text-inkMuted mt-2">Podcast{stats.podcastsCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* CTA Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <Link
            to="/library/digital-books"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 sm:p-6 block"
          >
            <h3 className="text-base sm:text-xl font-bold mb-2">📚 Livres</h3>
            <p className="text-xs sm:text-base text-inkSoft">Explorez notre sélection de livres numériques</p>
          </Link>
          <Link
            to="/library/audiobooks"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 sm:p-6 block"
          >
            <h3 className="text-base sm:text-xl font-bold mb-2">🎧 Livres Audio</h3>
            <p className="text-xs sm:text-base text-inkSoft">Écoutez vos histoires préférées</p>
          </Link>
          <Link
            to="/library/podcasts"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 sm:p-6 block"
          >
            <h3 className="text-base sm:text-xl font-bold mb-2">🎙️ Podcasts</h3>
            <p className="text-xs sm:text-base text-inkSoft">Découvrez des contenus audio passionnants</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
