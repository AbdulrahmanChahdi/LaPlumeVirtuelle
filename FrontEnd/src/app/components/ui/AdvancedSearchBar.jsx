import { useState } from "react";

/**
 * Advanced search component with filters for title, author, and genre
 */
export default function AdvancedSearchBar({ onSearch, loading = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    author: "",
    subject: "",
    keyword: ""
  });

  const handleChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier qu'au moins un champ est rempli
    const hasFilters = Object.values(filters).some(val => val.trim() !== "");
    
    if (hasFilters && onSearch) {
      onSearch(filters);
    }
  };

  const handleClear = () => {
    const emptyFilters = {
      author: "",
      subject: "",
      keyword: ""
    };
    setFilters(emptyFilters);
    if (onSearch) {
      onSearch(null); // Reset search
    }
  };

  const hasActiveFilters = Object.values(filters).some(val => val.trim() !== "");

  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow-sm">
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-accent"
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
          <span className="font-medium text-ink">Recherche avancée</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-accent text-white text-xs rounded-full">
              Filtres actifs
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded filters form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Auteur
              </label>
              <input
                type="text"
                id="author"
                value={filters.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Ex: J.K. Rowling"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-accent focus:border-accent 
                         disabled:bg-gray-100 disabled:cursor-not-allowed
                         text-ink placeholder-gray-400"
              />
            </div>

            {/* Genre/Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Genre / Catégorie
              </label>
              <input
                type="text"
                id="subject"
                value={filters.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Ex: Fiction, Science, History"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-accent focus:border-accent 
                         disabled:bg-gray-100 disabled:cursor-not-allowed
                         text-ink placeholder-gray-400"
              />
            </div>

            {/* Keyword */}
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                Mot-clé général
              </label>
              <input
                type="text"
                id="keyword"
                value={filters.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
                placeholder="Ex: magic, adventure"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-accent focus:border-accent 
                         disabled:bg-gray-100 disabled:cursor-not-allowed
                         text-ink placeholder-gray-400"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasActiveFilters || loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg
                       hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                       transition duration-200"
            >
              Effacer
            </button>
            <button
              type="submit"
              disabled={!hasActiveFilters || loading}
              className="px-6 py-2 bg-accent text-white rounded-lg
                       hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition duration-200 font-medium"
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
                  Recherche...
                </span>
              ) : (
                "Rechercher"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
