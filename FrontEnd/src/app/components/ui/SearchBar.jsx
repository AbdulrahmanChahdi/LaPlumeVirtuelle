import { useState } from "react";

/**
 * SearchBar component with responsive design
 * @param {Function} onSearch - Callback function when search is submitted
 * @param {string} placeholder - Placeholder text
 * @param {boolean} loading - Loading state
 */
export default function SearchBar({ onSearch, placeholder = "Rechercher...", loading = false }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery && onSearch) {
      onSearch(trimmedQuery);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch(""); // Reset search
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 text-gray-400">
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

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-accent focus:border-accent 
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   text-ink placeholder-gray-400
                   transition duration-200"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 text-gray-400 hover:text-gray-600 
                     transition duration-200"
            aria-label="Effacer"
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

        {/* Search Button */}
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="absolute right-2 px-4 py-1.5 bg-accent text-white rounded-md
                   hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition duration-200 font-medium text-sm"
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
            </span>
          ) : (
            "Rechercher"
          )}
        </button>
      </div>
    </form>
  );
}
