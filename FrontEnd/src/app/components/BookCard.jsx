import { Link } from "react-router-dom";

export default function BookCard({ book, progress }) {
  // Support both Google Books (externalId) and internal DB books (id)
  const bookId = book.externalId || book.id;
  const isInternalBook = !!book.id && !book.externalId;
  const encodedBookId = bookId ? encodeURIComponent(bookId) : "";
  const detailLink = isInternalBook
    ? `/library/digital-books/${encodedBookId}`
    : `/library/books/${encodedBookId}`;

  // Handle different field names for internal vs external books
  const title = book.title || book.titre;
  const imageUrl = book.coverUrl || book.imageUrl;
  const description = book.description || book.resume;

  // Format authors - can be array or single author object
  let authors = "Auteur inconnu";
  if (book.authors) {
    authors = Array.isArray(book.authors)
      ? book.authors.join(", ")
      : "Auteur inconnu";
  } else if (book.auteur) {
    authors = book.auteur.nom || "Auteur inconnu";
  }

  // Calculate progress percentage if available
  const progressPercentage = progress && progress.totalPages
    ? Math.round((progress.currentPage / progress.totalPages) * 100)
    : 0;

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Link
      to={detailLink}
      className="bg-paper border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-50 to-white overflow-hidden flex items-center justify-center p-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Couverture de ${title}`}
            className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 rounded">
            <svg
              className="w-20 h-20 text-accent/30 mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <p className="text-xs text-center text-accent/50 font-medium line-clamp-3 px-2">
              {title}
            </p>
          </div>
        )}

        {/* Progress Badge - Only for internal books with reading progress */}
        {progress && (
          <div className="absolute top-2 right-2">
            {progress.isFinished ? (
              <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="bg-accent text-white rounded-lg px-2 py-1 shadow-lg text-xs font-bold">
                {progressPercentage}%
              </div>
            )}
          </div>
        )}

        {/* Progress bar at the bottom of cover */}
        {progress && !progress.isFinished && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-accent to-gold transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow border-t border-gray-100">
        {/* Title */}
        <h3 className="font-bold text-lg sm:text-xl text-ink mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Author */}
        <p className="text-sm sm:text-base text-gray-600 mb-3">
          {authors}
        </p>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-3">
            {truncateText(description, 150)}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {book.publishedDate && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {new Date(book.publishedDate).getFullYear()}
            </span>
          )}
          {(book.category || book.categorie?.nom) && (
            <span className="bg-accent/10 text-accent px-2 py-1 rounded">
              {book.category || book.categorie?.nom}
            </span>
          )}
          {(book.pageCount || book.nombreDePage) && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {book.pageCount || book.nombreDePage} pages
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
