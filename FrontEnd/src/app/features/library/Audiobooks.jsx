import { useEffect, useState, useMemo } from "react"
import { getAudiobooks } from "../../api/audiobooksApi"
import { useAuth } from "../../hooks/useAuth"
import BookCard from "../../components/BookCard"
import CategoryFilter from "../../components/ui/CategoryFilter"
import Loader from "../../components/ui/Loader"

export default function Audiobooks() {
  const { token } = useAuth()
  const [audiobooks, setAudiobooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    const loadAudiobooks = async () => {
      try {
        setLoading(true)
        setError(null)
        const audiobooksData = await getAudiobooks(token)
        setAudiobooks(audiobooksData || [])
      } catch (err) {
        console.error("Erreur chargement audiobooks:", err)
        setError("Impossible de charger vos audiobooks. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }
    loadAudiobooks()
  }, [token])

  // Filtrer les audiobooks par catégorie
  const filteredAudiobooks = useMemo(() => {
    if (!selectedCategory) {
      return audiobooks;
    }
    return audiobooks.filter((audiobook) => audiobook.thematique === selectedCategory);
  }, [audiobooks, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          Mes Audiobooks
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Vos audiobooks et votre collection personnelle
        </p>
      </div>

      {/* Filter */}
      {!loading && !error && audiobooks.length > 0 && (
        <CategoryFilter
          items={audiobooks}
          onFilterChange={setSelectedCategory}
          filterKey="thematique"
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && audiobooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-dashed border-blue-200">
          <div className="text-6xl mb-4">🎧</div>
          <h3 className="text-xl font-bold text-ink mb-2">Vous n'avez pas d'audiobooks</h3>
          <p className="text-inkSoft text-center max-w-md mb-4">Explorez notre collection pour en ajouter à votre bibliothèque personnelle</p>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && audiobooks.length > 0 && filteredAudiobooks.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg text-center">
          <p className="text-yellow-700 font-medium">Aucun audiobook trouvé pour cette catégorie</p>
        </div>
      )}

      {/* Audiobooks Grid */}
      {!loading && !error && filteredAudiobooks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredAudiobooks.map((audiobook) => (
            <BookCard
              key={audiobook.id}
              book={{
                ...audiobook,
                titre: audiobook.livre?.titre || audiobook.titre,
                imageUrl: audiobook.livre?.imageUrl || audiobook.imageUrl,
                categorie: audiobook.livre?.categorie || audiobook.categorie,
                authors: audiobook.auteur ? [audiobook.auteur.nom] : []
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
