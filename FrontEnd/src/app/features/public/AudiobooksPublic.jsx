import { useEffect, useState, useMemo } from "react"
import CategoryFilter from "../../components/ui/CategoryFilter"

export default function AudiobooksPublic() {
  const [audiobooks, setAudiobooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    fetch("http://localhost:8080/api/livres-audio")
      .then((res) => res.json())
      .then((data) => {
        setAudiobooks(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setAudiobooks([])
        setLoading(false)
      })
  }, [])

  // Filtrer par thématique si disponible
  const filteredAudiobooks = useMemo(() => {
    if (!selectedCategory) {
      return audiobooks;
    }
    return audiobooks.filter((audio) =>
      audio.livre?.thematique === selectedCategory
    );
  }, [audiobooks, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">Livres Audio</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-8">Connectez-vous pour accéder à notre sélection complète de livres audio.</p>

      {/* Filter */}
      {!loading && audiobooks.length > 0 && (
        <CategoryFilter
          items={audiobooks.map(a => a.livre).filter(Boolean)}
          onFilterChange={setSelectedCategory}
          filterKey="thematique"
        />
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : audiobooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-dashed border-blue-200">
          <div className="text-6xl mb-4">🎧</div>
          <h3 className="text-xl font-bold text-ink mb-2">Aucun audiobook disponible</h3>
          <p className="text-inkSoft text-center max-w-md">Notre collection d'audiobooks arrive bientôt. Revenez pour découvrir une sélection curatée!</p>
        </div>
      ) : filteredAudiobooks.length === 0 ? (
        <p className="text-inkSoft">Aucun livre audio trouvé pour cette catégorie.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredAudiobooks.map((audio) => (
            <div key={audio.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">{audio.livre?.titre}</h3>
              <p className="text-sm text-inkSoft mb-2">{audio.livre?.auteur?.nom}</p>
              <p className="text-xs text-gray-500 mb-2">Thématique: {audio.livre?.thematique}</p>
              <p className="text-xs text-gray-500">Durée: {audio.duree} min</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
