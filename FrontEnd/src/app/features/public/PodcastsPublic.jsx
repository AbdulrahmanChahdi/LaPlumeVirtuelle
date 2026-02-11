import { useEffect, useState, useMemo } from "react"
import CategoryFilter from "../../components/ui/CategoryFilter"

export default function PodcastsPublic() {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")

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

  // Filtrer par thématique si disponible
  const filteredPodcasts = useMemo(() => {
    if (!selectedCategory) {
      return podcasts;
    }
    return podcasts.filter((podcast) =>
      podcast.thematique === selectedCategory
    );
  }, [podcasts, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">Podcasts</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-8">Connectez-vous pour accéder à notre sélection complète de podcasts.</p>

      {/* Filter */}
      {!loading && podcasts.length > 0 && (
        <CategoryFilter
          items={podcasts}
          onFilterChange={setSelectedCategory}
          filterKey="thematique"
        />
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : podcasts.length === 0 ? (
        <p className="text-inkSoft">Aucun podcast disponible pour le moment.</p>
      ) : filteredPodcasts.length === 0 ? (
        <p className="text-inkSoft">Aucun podcast trouvé pour cette catégorie.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPodcasts.map((podcast) => (
            <div key={podcast.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">{podcast.titre}</h3>
              <p className="text-sm text-inkSoft mb-2">{podcast.description}</p>
              <p className="text-xs text-gray-500 mb-2">Thématique: {podcast.thematique}</p>
              <p className="text-xs text-gray-500">{podcast.nombreEpisodes} épisodes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
