import { useEffect, useState, useMemo } from "react";
import { getPodcasts } from "../../api/podcastsApi";
import BookCard from "../../components/BookCard";
import CategoryFilter from "../../components/ui/CategoryFilter";
import Loader from "../../components/ui/Loader";

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadPodcasts() {
      try {
        setLoading(true);
        setError(null);

        const podcastsData = await getPodcasts();
        setPodcasts(podcastsData || []);
      } catch (err) {
        console.error("Erreur chargement podcasts:", err);
        setError("Impossible de charger vos podcasts. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }

    loadPodcasts();
  }, []);

  // Filtrer les podcasts par catégorie
  const filteredPodcasts = useMemo(() => {
    if (!selectedCategory) {
      return podcasts;
    }
    return podcasts.filter((podcast) => podcast.thematique === selectedCategory);
  }, [podcasts, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          Mes Podcasts
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Vos podcasts et votre collection personnelle
        </p>
      </div>

      {/* Filter */}
      {!loading && !error && podcasts.length > 0 && (
        <CategoryFilter
          items={podcasts}
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
      {!loading && !error && podcasts.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg text-center">
          <p className="text-blue-700 font-medium mb-2">Vous n'avez pas de podcasts</p>
          <p className="text-blue-600 text-sm">
            Explorez nos podcasts publics pour en ajouter à votre collection
          </p>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && podcasts.length > 0 && filteredPodcasts.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg text-center">
          <p className="text-yellow-700 font-medium">Aucun podcast trouvé pour cette catégorie</p>
        </div>
      )}

      {/* Podcasts Grid */}
      {!loading && !error && filteredPodcasts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPodcasts.map((podcast) => (
            <BookCard
              key={podcast.id}
              book={{
                ...podcast,
                authors: podcast.auteur ? [podcast.auteur.nom] : []
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
