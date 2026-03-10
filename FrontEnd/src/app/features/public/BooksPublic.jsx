import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { searchBooks } from "../../api/booksApi";
import { advancedSearchBooks } from "../../api/advancedBooksApi";
import BookCard from "../../components/BookCard";
import CategoryFilter from "../../components/ui/CategoryFilter";
import Loader from "../../components/ui/Loader";
import UnifiedSearchBar from "../../components/ui/UnifiedSearchBar";
import { enrichBookWithCategories } from "../../utils/categoryMapping";
import { useAuth } from "../../hooks/useAuth";

export default function BooksPublic() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]); // Tous les livres chargés (pour chercher dedans)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [searchType, setSearchType] = useState(null); // "simple" ou "advanced"

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gérer la recherche depuis les paramètres URL (depuis page d'accueil)
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl && allBooks.length > 0) {
      // Déclencher recherche automatiquement
      handleSearch(searchFromUrl);
      // Nettoyer le paramètre URL après utilisation
      setSearchParams({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allBooks.length]);

  const loadMoreBooks = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      // Charger une autre catégorie pour avoir plus de diversité
      const queries = ["fiction", "science", "history", "technology", "art", "business"];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];

      const moreResults = await searchBooks(randomQuery, 40);

      // Filtrer les doublons par externalId et enrichir avec catégories
      const existingIds = new Set(allBooks.map(b => b.externalId));
      const newBooks = moreResults
        .filter(b => !existingIds.has(b.externalId))
        .map(b => enrichBookWithCategories(b));

      const updatedAllBooks = [...allBooks, ...newBooks];
      setAllBooks(updatedAllBooks); // Mettre à jour tous les livres
      setBooks(updatedAllBooks);     // Afficher tous les livres
      setHasMore(newBooks.length > 0);
    } catch (err) {
      console.error("Erreur chargement plus de livres:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Fonction de recherche unifiée
  const handleUnifiedSearch = async (searchData) => {
    if (!searchData) {
      // Reset
      setSearchQuery("");
      setSelectedCategory("");
      setActiveFilters(null);
      setSearchType(null);
      setBooks(allBooks);
      return;
    }

    if (searchData.type === "simple") {
      // Recherche simple
      await handleSearch(searchData.query);
    } else if (searchData.type === "advanced") {
      // Recherche avancée
      await handleAdvancedSearch(searchData.filters);
    }
  };

  // Fonction de recherche personnalisée - Chercher d'abord dans les livres chargés
  const handleSearch = async (query) => {
    if (!query || query.trim() === "") {
      setSearchQuery("");
      setSelectedCategory("");
      setActiveFilters(null);
      setSearchType(null);
      setBooks(allBooks); // Afficher tous les livres
      return;
    }

    // Minimum 3 caractères pour lancer la recherche
    if (query.trim().length < 3) {
      return;
    }

    try {
      setSearchQuery(query);
      setActiveFilters(null);
      setSearchType("simple");

      console.log("🔍 RECHERCHE TITRE:", query);
      
      const queryLower = query.toLowerCase();
      
      // 1. CHERCHER D'ABORD dans les livres déjà chargés (recherche live - COMMENCE par uniquement)
      const localResults = allBooks.filter(book => {
        const title = (book.title || "").toLowerCase();
        const authors = (book.authors || []).join(" ").toLowerCase();
        // STRICTEMENT commence par la recherche (pas au milieu)
        return title.startsWith(queryLower) || authors.startsWith(queryLower);
      });
      
      console.log("📋 TROUVÉS LOCALEMENT:", localResults.length);
      
      if (localResults.length > 0) {
        // Trouvé dans les livres déjà chargés !
        console.log("✅ AFFICHAGE RÉSULTATS LOCAUX:", localResults.map(b => b.title));
        setBooks(localResults);
        setError(null);
        return;
      }
      
      // 2. Si pas trouvé localement, chercher via API
      console.log("🌍 PAS TROUVÉ LOCALEMENT - APPEL API");
      setLoading(true);
      setIsSearching(true);
      
      const results = await searchBooks(query, 40);
      
      console.log("✅ RÉSULTATS API:", results.length);
      
      // Filtrer strictement les résultats API (commence par uniquement)
      const filteredResults = results.filter(book => {
        const title = (book.title || "").toLowerCase();
        const authors = (book.authors || []).join(" ").toLowerCase();
        return title.startsWith(queryLower) || authors.startsWith(queryLower);
      });
      
      console.log("✅ RÉSULTATS FILTRÉS:", filteredResults.length);
      
      if (filteredResults.length === 0) {
        setBooks([]);
        setError(`Aucun livre trouvé pour "${query}".`);
      } else {
        const enrichedResults = filteredResults.map(book => enrichBookWithCategories(book));
        setBooks(enrichedResults);
        setError(null);
      }
      setHasMore(false);
    } catch (err) {
      console.error("❌ ERREUR:", err);
      setError(`Erreur: ${err.message}`);
      setBooks([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Fonction de recherche avancée - Chercher avec filtres
  const handleAdvancedSearch = async (filters) => {
    if (!filters) {
      setSearchQuery("");
      setSelectedCategory("");
      setActiveFilters(null);
      setSearchType(null);
      setBooks(allBooks);
      return;
    }

    try {
      setSearchQuery("");
      setActiveFilters(filters);
      setSearchType("advanced");

      console.log("🎯 RECHERCHE AVEC FILTRES:", filters);
      console.log("📚 LIVRES DISPONIBLES:", allBooks.length);
      
      // 1. CHERCHER D'ABORD localement avec filtres
      const localResults = allBooks.filter(book => {
        let match = true;
        
        if (filters.author) {
          const authors = (book.authors || []).join(" ").toLowerCase().trim();
          const authorLower = filters.author.toLowerCase().trim();
          const authorMatch = authors.includes(authorLower);
          console.log(`  Auteur "${book.title}": authors="${authors}" cherché="${authorLower}" match=${authorMatch}`);
          match = match && authorMatch;
        }
        
        if (filters.subject) {
          const category = (book.category || "").toLowerCase().trim();
          const normalizedCategories = (book.normalizedCategories || []).join(" ").toLowerCase().trim();
          const subjectLower = filters.subject.toLowerCase().trim();
          const subjectMatch = category.includes(subjectLower) || normalizedCategories.includes(subjectLower);
          console.log(`  Genre "${book.title}": category="${category}" normalized="${normalizedCategories}" cherché="${subjectLower}" match=${subjectMatch}`);
          match = match && subjectMatch;
        }
        
        if (filters.keyword) {
          const title = (book.title || "").toLowerCase().trim();
          const keywordLower = filters.keyword.toLowerCase().trim();
          // Chercher SEULEMENT dans le titre (pas dans description)
          const titleMatch = title.includes(keywordLower);
          console.log(`  Titre "${book.title}": title="${title}" cherché="${keywordLower}" match=${titleMatch}`);
          match = match && titleMatch;
        }
        
        return match;
      });
      
      console.log("📋 TROUVÉS LOCALEMENT:", localResults.length);
      if (localResults.length > 0) {
        console.log("✅ LIVRES TROUVÉS:", localResults.map(b => `"${b.title}" par ${b.authors?.join(", ")}`));
      }
      
      if (localResults.length > 0) {
        console.log("✅ AFFICHAGE RÉSULTATS LOCAUX");
        setBooks(localResults);
        setError(null);
        return;
      }
      
      // 2. Si pas trouvé localement, chercher via API
      console.log("🌍 PAS TROUVÉ LOCALEMENT - APPEL API");
      setLoading(true);
      setIsSearching(true);
      
      const results = await advancedSearchBooks(filters, 40);
      
      console.log("✅ RÉSULTATS API:", results.length);
      
      if (results.length === 0) {
        setBooks([]);
        setError(`Aucun livre trouvé avec ces critères.`);
      } else {
        const enrichedResults = results.map(book => enrichBookWithCategories(book));
        setBooks(enrichedResults);
        setError(null);
      }
      setHasMore(false);
    } catch (err) {
      console.error("❌ ERREUR RECHERCHE AVANCÉE:", err);
      setError(`Erreur: ${err.message}`);
      setBooks([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Fonction de chargement par défaut
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger plusieurs catégories pour avoir plus de diversité dès le départ
      const queries = ["bestseller", "fiction", "science", "technology"];
      const allBooksLoaded = [];
      const seenIds = new Set();

      for (const query of queries) {
        const results = await searchBooks(query, 40);

        // Filtrer les doublons et enrichir avec catégories normalisées
        results.forEach(book => {
          if (!seenIds.has(book.externalId)) {
            seenIds.add(book.externalId);
            allBooksLoaded.push(enrichBookWithCategories(book));
          }
        });
      }

      console.log("📚 TOTAL LIVRES CHARGÉS:", allBooksLoaded.length);
      setAllBooks(allBooksLoaded); // Sauvegarder TOUS les livres
      setBooks(allBooksLoaded);     // Afficher tous les livres
      setHasMore(true);
    } catch (err) {
      console.error("Erreur chargement livres:", err);
      setError("Impossible de charger les livres. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des livres par catégorie
  const filteredBooks = useMemo(() => {
    if (!selectedCategory) return books;

    return books.filter(book =>
      book.normalizedCategories &&
      book.normalizedCategories.includes(selectedCategory)
    );
  }, [books, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          Livres Numériques
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {isAuthenticated
            ? "Découvrez notre sélection de bestsellers et accédez aux détails complets."
            : "Découvrez notre sélection de bestsellers. Connectez-vous pour accéder aux détails complets."
          }
        </p>
      </div>

      {/* Unified Search Bar */}
      <div className="mb-5">
        <UnifiedSearchBar 
          onSearch={handleUnifiedSearch}
          loading={isSearching}
        />
        
        {/* Active search indicator */}
        {(searchQuery || activeFilters) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm">
            {searchQuery && (
              <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-lg">
                <span className="text-gray-700">Recherche:</span>
                <span className="font-semibold text-accent">"{searchQuery}"</span>
              </div>
            )}
            {activeFilters && (
              <>
                <span className="text-gray-700">Filtres:</span>
                {activeFilters.author && (
                  <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">
                    Auteur: {activeFilters.author}
                  </span>
                )}
                {activeFilters.subject && (
                  <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">
                    Genre: {activeFilters.subject}
                  </span>
                )}
                {activeFilters.keyword && (
                  <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">
                    Titre: {activeFilters.keyword}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Filter - Catégories normalisées depuis Google Books */}
      {!loading && !error && books.length > 0 && (
        <div className="mb-5">
          <CategoryFilter
            items={books}
            categoryField="normalizedCategories"
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            totalCount={books.length}
            filteredCount={filteredBooks.length}
          />
        </div>
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
          <p className="text-red-700" role="alert">
            {error}
          </p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && (
        <>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {selectedCategory
                  ? `Aucun livre trouvé dans la catégorie "${selectedCategory}".`
                  : "Aucun livre disponible pour le moment."
                }
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-accent/5 p-4 rounded-lg">
                <div className="text-sm text-ink font-medium">
                  <span className="text-accent font-bold">{filteredBooks.length}</span> livre{filteredBooks.length !== 1 ? "s" : ""} affiché{filteredBooks.length !== 1 ? "s" : ""}
                  {selectedCategory && ` dans "${selectedCategory}"`}
                  {books.length > 0 && filteredBooks.length < books.length && ` (sur ${books.length})`}
                </div>
                {searchQuery && (
                  <div className="text-xs text-gray-500 italic">
                    Résultats pour: <span className="font-semibold text-accent">  "{searchQuery}"</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredBooks.map((book) => (
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
