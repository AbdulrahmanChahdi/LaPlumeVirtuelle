import { useEffect, useState } from "react";
import { searchBooks } from "../../api/booksApi";
import BookCard from "../../components/BookCard";
import Loader from "../../components/ui/Loader";

export default function BooksPublic() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);
        
        // Charger plusieurs catégories pour avoir plus de diversité dès le départ
        const queries = ["bestseller", "fiction", "science", "technology"];
        const allBooks = [];
        const seenIds = new Set();
        
        for (const query of queries) {
          const results = await searchBooks(query, 40);
          
          // Filtrer les doublons
          results.forEach(book => {
            if (!seenIds.has(book.externalId)) {
              seenIds.add(book.externalId);
              allBooks.push(book);
            }
          });
        }
        
        setBooks(allBooks);
        setHasMore(true);
      } catch (err) {
        console.error("Erreur chargement livres:", err);
        setError("Impossible de charger les livres. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  const loadMoreBooks = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      
      // Charger une autre catégorie pour avoir plus de diversité
      const queries = ["fiction", "science", "history", "technology", "art", "business"];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      
      const moreResults = await searchBooks(randomQuery, 40);
      
      // Filtrer les doublons par externalId
      const existingIds = new Set(books.map(b => b.externalId));
      const newBooks = moreResults.filter(b => !existingIds.has(b.externalId));
      
      setBooks([...books, ...newBooks]);
      setHasMore(newBooks.length > 0);
    } catch (err) {
      console.error("Erreur chargement plus de livres:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          Livres Numériques
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Découvrez notre sélection de bestsellers. Connectez-vous pour accéder aux détails complets.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700" role="alert">
            {error}
          </p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && (
        <>
          {books.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Aucun livre disponible pour le moment.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500">
                {books.length} livre{books.length > 1 ? "s" : ""} trouvé{books.length > 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {books.map((book) => (
                  <BookCard key={book.externalId || book.title} book={book} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Load More Button */}
      {!loading && !error && hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMoreBooks}
            disabled={loadingMore}
            className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Chargement...
              </span>
            ) : (
              "Charger plus de livres"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
