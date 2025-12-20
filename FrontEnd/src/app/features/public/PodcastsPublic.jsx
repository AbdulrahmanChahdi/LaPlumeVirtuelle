import { useEffect, useState } from "react"

export default function PodcastsPublic() {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8080/api/podcasts")
      .then((res) => res.json())
      .then((data) => {
        setPodcasts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setPodcasts([])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Podcasts</h1>
      <p className="text-inkSoft mb-8">Connectez-vous pour accéder à notre sélection complète de podcasts.</p>

      {loading ? (
        <p>Chargement...</p>
      ) : podcasts.length === 0 ? (
        <p className="text-inkSoft">Aucun podcast disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <div key={podcast.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">{podcast.titre}</h3>
              <p className="text-sm text-inkSoft mb-4">{podcast.description}</p>
              <p className="text-xs text-gray-500">{podcast.nombreEpisodes} épisodes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
