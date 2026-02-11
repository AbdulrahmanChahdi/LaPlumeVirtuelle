import { useState, useEffect } from "react";

/**
 * Unified search bar with expandable advanced filters
 * Style inspiré d'Infogreffe - Un seul bloc de recherche
 */
export default function UnifiedSearchBar({ onSearch, loading = false }) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchType, setSearchType] = useState("simple"); // "simple" ou "advanced"
  
  // Simple search
  const [simpleQuery, setSimpleQuery] = useState("");
  
  // Advanced filters
  const [filters, setFilters] = useState({
    author: "",
    subject: "",
    keyword: ""
  });

  // Live search - déclenche recherche automatiquement après 300ms d'inactivité
  useEffect(() => {
    if (!isAdvancedOpen) {
      const timer = setTimeout(() => {
        if (simpleQuery.trim() === "") {
          // Vide = réinitialiser
          onSearch && onSearch(null);
        } else {
          // Recherche live
          onSearch && onSearch({ type: "simple", query: simpleQuery.trim() });
        }
      }, 300); // Attendre 300ms après la dernière frappe

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleQuery, isAdvancedOpen]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchType === "simple") {
      // Recherche simple
      if (simpleQuery.trim() && onSearch) {
        onSearch({ type: "simple", query: simpleQuery.trim() });
      }
    } else {
      // Recherche avancée
      const hasFilters = Object.values(filters).some(val => val.trim() !== "");
      if (hasFilters && onSearch) {
        onSearch({ type: "advanced", filters });
      }
    }
  };

  const handleClear = () => {
    setSimpleQuery("");
    setFilters({ author: "", subject: "", keyword: "" });
    setIsAdvancedOpen(false);
    setSearchType("simple");
    if (onSearch) {
      onSearch(null); // Reset
    }
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
    setSearchType(isAdvancedOpen ? "simple" : "advanced");
  };

  const hasActiveSearch = simpleQuery.trim() !== "" || 
    Object.values(filters).some(val => val.trim() !== "");

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit}>
        {/* Barre de recherche principale */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Icône de recherche */}
          <div className="text-gray-400 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Champ de recherche */}
          <input
            type="text"
            value={simpleQuery}
            onChange={(e) => setSimpleQuery(e.target.value)}
            placeholder="Rechercher un livre par titre, auteur..."
            disabled={loading || isAdvancedOpen}
            className="flex-1 outline-none text-ink placeholder-gray-400
                     disabled:bg-gray-50 disabled:text-gray-500"
          />

          {/* Bouton Recherche avancée */}
          <button
            type="button"
            onClick={toggleAdvanced}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-accent 
                     hover:bg-accent/5 rounded-md transition-colors flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            {isAdvancedOpen ? "Recherche simple" : "Recherche avancée"}
          </button>

          {/* Bouton Effacer */}
          {hasActiveSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              title="Effacer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Bouton Rechercher */}
          <button
            type="submit"
            disabled={!hasActiveSearch || loading}
            className="px-5 py-2 bg-accent text-white rounded-md
                     hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors font-medium flex-shrink-0 text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Recherche...</span>
              </span>
            ) : (
              "Rechercher"
            )}
          </button>
        </div>

        {/* Filtres avancés dépliables */}
        {isAdvancedOpen && (
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Auteur */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Auteur
                </label>
                <input
                  type="text"
                  id="author"
                  value={filters.author}
                  onChange={(e) => handleFilterChange("author", e.target.value)}
                  placeholder="Ex: J.K. Rowling"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-2 focus:ring-accent focus:border-accent
                           disabled:bg-gray-100 disabled:cursor-not-allowed
                           text-ink placeholder-gray-400"
                />
              </div>

              {/* Genre */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Genre / Catégorie
                </label>
                <input
                  type="text"
                  id="subject"
                  value={filters.subject}
                  onChange={(e) => handleFilterChange("subject", e.target.value)}
                  placeholder="Ex: Fiction, Science"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-2 focus:ring-accent focus:border-accent
                           disabled:bg-gray-100 disabled:cursor-not-allowed
                           text-ink placeholder-gray-400"
                />
              </div>

              {/* Titre */}
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Titre
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange("keyword", e.target.value)}
                  placeholder="Ex: Harry Potter, 1984"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-2 focus:ring-accent focus:border-accent
                           disabled:bg-gray-100 disabled:cursor-not-allowed
                           text-ink placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
