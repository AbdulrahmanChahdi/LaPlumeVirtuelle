import { useEffect, useState, useMemo } from "react";
import { getDigitalBooks } from "../../api/digitalBooksApi";
import BookCard from "../../components/BookCard";
import CategoryFilter from "../../components/ui/CategoryFilter";
import Loader from "../../components/ui/Loader";

export default function DigitalBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);

        const booksData = await getDigitalBooks();
        setBooks(booksData || []);
      } catch (err) {
        console.error("Erreur chargement livres numériques:", err);
        setError("Impossible de charger votre bibliothèque. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  // Filtrer les livres par catégorie
  const filteredBooks = useMemo(() => {
    if (!selectedCategory) {
      return books;
    }
    return books.filter((book) => book.thematique === selectedCategory);
  }, [books, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          Ma Bibliothèque Numérique
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Vos livres numériques et votre collection personnelle
        </p>
      </div>

      {/* Filter */}
      {!loading && !error && books.length > 0 && (
        <CategoryFilter
          items={books}
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
      {!loading && !error && books.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg text-center">
          <p className="text-blue-700 font-medium mb-2">Votre bibliothèque est vide</p>
          <p className="text-blue-600 text-sm">
            Explorez nos livres publics pour en ajouter à votre collection
          </p>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && books.length > 0 && filteredBooks.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg text-center">
          <p className="text-yellow-700 font-medium">Aucun livre trouvé pour cette catégorie</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={{
                ...book,
                authors: book.auteur ? [book.auteur.nom] : []
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
