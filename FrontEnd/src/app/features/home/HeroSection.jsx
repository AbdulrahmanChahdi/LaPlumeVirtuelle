import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import UnifiedSearchBar from "../../components/ui/UnifiedSearchBar"
import { searchBooks } from "../../api/booksApi"
import { advancedSearchBooks } from "../../api/advancedBooksApi"
import BookCard from "../../components/BookCard"
import { enrichBookWithCategories } from "../../utils/categoryMapping"

export default function HeroSection() {
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false)
  const [books, setBooks] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState(null)

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken")
      setIsConnected(!!token)
    } catch {}
    loadInitialBooks()
  }, [])

  const loadInitialBooks = async () => {
    try {
      // Charger quelques livres pour la recherche locale
      const queries = ["bestseller", "fiction"]
      const allBooksLoaded = []
      const seenIds = new Set()

      for (const query of queries) {
        const results = await searchBooks(query, 40)
        results.forEach(book => {
          if (!seenIds.has(book.externalId)) {
            seenIds.add(book.externalId)
            allBooksLoaded.push(enrichBookWithCategories(book))
          }
        })
      }

      setAllBooks(allBooksLoaded)
    } catch (error) {
      console.error("Erreur chargement livres:", error)
    }
  }

  const handleUnifiedSearch = async (searchData) => {
    if (!searchData) {
      setSearchQuery("")
      setActiveFilters(null)
      setBooks([])
      return
    }

    if (searchData.type === "simple") {
      await handleSearch(searchData.query)
    } else if (searchData.type === "advanced") {
      await handleAdvancedSearch(searchData.filters)
    }
  }

  const handleSearch = async (query) => {
    if (!query || query.trim() === "") {
      setSearchQuery("")
      setBooks([])
      return
    }
    // Minimum 3 caractères pour lancer la recherche
    if (query.trim().length < 3) {
      return;
    }
    try {
      setSearchQuery(query)
      setActiveFilters(null)

      const queryLower = query.toLowerCase()
      
      // Recherche locale stricte (commence par)
      const localResults = allBooks.filter(book => {
        const title = (book.title || "").toLowerCase()
        const authors = (book.authors || []).join(" ").toLowerCase()
        return title.startsWith(queryLower) || authors.startsWith(queryLower)
      })
      
      if (localResults.length > 0) {
        setBooks(localResults)
        return
      }
      
      // Si pas trouvé localement, appel API
      setLoading(true)
      setIsSearching(true)
      
      const results = await searchBooks(query, 40)
      
      // Filtrer strictement les résultats API (commence par uniquement)
      const filteredResults = results.filter(book => {
        const title = (book.title || "").toLowerCase()
        const authors = (book.authors || []).join(" ").toLowerCase()
        return title.startsWith(queryLower) || authors.startsWith(queryLower)
      })
      
      if (filteredResults.length === 0) {
        setBooks([])
      } else {
        const enrichedResults = filteredResults.map(book => enrichBookWithCategories(book))
        setBooks(enrichedResults)
      }
    } catch (err) {
      console.error("Erreur recherche:", err)
      setBooks([])
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  const handleAdvancedSearch = async (filters) => {
    if (!filters) {
      setSearchQuery("")
      setActiveFilters(null)
      setBooks([])
      return
    }

    try {
      setSearchQuery("")
      setActiveFilters(filters)

      // Recherche locale avec filtres
      const localResults = allBooks.filter(book => {
        let match = true
        
        if (filters.author) {
          const authors = (book.authors || []).join(" ").toLowerCase().trim()
          const authorLower = filters.author.toLowerCase().trim()
          match = match && authors.includes(authorLower)
        }
        
        if (filters.subject) {
          const category = (book.category || "").toLowerCase().trim()
          const normalizedCategories = (book.normalizedCategories || []).join(" ").toLowerCase().trim()
          const subjectLower = filters.subject.toLowerCase().trim()
          match = match && (category.includes(subjectLower) || normalizedCategories.includes(subjectLower))
        }
        
        if (filters.keyword) {
          const title = (book.title || "").toLowerCase().trim()
          const keywordLower = filters.keyword.toLowerCase().trim()
          match = match && title.includes(keywordLower)
        }
        
        return match
      })
      
      if (localResults.length > 0) {
        setBooks(localResults)
        return
      }
      
      // Si pas trouvé localement, appel API
      setLoading(true)
      setIsSearching(true)
      
      const results = await advancedSearchBooks(filters, 40)
      
      if (results.length === 0) {
        setBooks([])
      } else {
        const enrichedResults = results.map(book => enrichBookWithCategories(book))
        setBooks(enrichedResults)
      }
    } catch (err) {
      console.error("Erreur recherche avancée:", err)
      setBooks([])
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {isConnected ? "Bienvenue dans votre Bibliothèque" : "Votre Bibliothèque Multimédia en Ligne"}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-inkSoft mb-6 max-w-2xl mx-auto">
            {isConnected 
              ? "Accédez à votre collection personnelle, découvrez de nouveaux livres et podcasts"
              : "Découvrez, lisez et écoutez une sélection de livres et de podcasts, adaptés à vos envies."
            }
          </p>
        </div>

        {/* Unified Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <UnifiedSearchBar 
            onSearch={handleUnifiedSearch}
            loading={isSearching}
          />
          
          {/* Active search indicator */}
          {(searchQuery || activeFilters) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
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

        {/* Résultats de recherche */}
        {books.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-ink">
                {books.length} livre{books.length > 1 ? "s" : ""} trouvé{books.length > 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {books.map((book) => (
                <BookCard key={book.externalId || book.title} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate(isConnected ? "/library/digital-books" : "/public/livres")}
            ariaLabel={isConnected ? "Accéder à votre bibliothèque" : "Découvrir le catalogue"}
          >
            {isConnected ? "Ma Bibliothèque" : "Découvrir le catalogue complet"}
          </Button>

          {isConnected && (
            <Button 
              onClick={() => navigate("/discover/books")}
              className="bg-accent/10 text-accent hover:bg-accent/20"
              ariaLabel="Découvrir de nouveaux livres"
            >
              Découvrir de nouveaux livres
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
