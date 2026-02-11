import { useEffect, useState, useMemo } from "react";
import { getAudiobooks } from "../../api/audiobooksApi";
import BookCard from "../../components/BookCard";
import CategoryFilter from "../../components/ui/CategoryFilter";
import Loader from "../../components/ui/Loader";

export default function Audiobooks() {
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadAudiobooks() {
      try {
        setLoading(true);
        setError(null);

        const audiobooksData = await getAudiobooks();
        setAudiobooks(audiobooksData || []);
      } catch (err) {
        console.error("Erreur chargement audiobooks:", err);
        setError("Impossible de charger vos audiobooks. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }

    loadAudiobooks();
  }, []);

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
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg text-center">
          <p className="text-blue-700 font-medium mb-2">Vous n'avez pas d'audiobooks</p>
          <p className="text-blue-600 text-sm">
            Explorez nos audiobooks publics pour en ajouter à votre collection
          </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredAudiobooks.map((audiobook) => (
            <BookCard
              key={audiobook.id}
              book={{
                ...audiobook,
                authors: audiobook.auteur ? [audiobook.auteur.nom] : []
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
