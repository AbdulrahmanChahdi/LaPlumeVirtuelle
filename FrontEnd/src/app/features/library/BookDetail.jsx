import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBookByExternalId } from "../../api/booksApi";
import { getUserDownloadStats, downloadBook } from "../../api/downloadApi";
import { addBookToLibrary, getDigitalBooks } from "../../api/digitalBooksApi";
import { useAuth } from "../../hooks/useAuth";
import { saveIntendedDestination } from "../../utils/navigation";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function BookDetail() {
  const { externalId } = useParams();
  const decodedExternalId = externalId ? decodeURIComponent(externalId) : externalId;
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadStats, setDownloadStats] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [addingToLibrary, setAddingToLibrary] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [notification, setNotification] = useState(null);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    async function loadBookAndStats() {
      try {
        setLoading(true);
        setError(null);

        const bookData = await getBookByExternalId(decodedExternalId);
        setBook(bookData);

        // Charger les stats uniquement si l'utilisateur est connecté
        if (isAuthenticated) {
          try {
            const statsData = await getUserDownloadStats();
            setDownloadStats(statsData);
          } catch (err) {
            console.error("Erreur chargement stats:", err);
            // Continuer sans stats si erreur
          }

          try {
            const libraryBooks = await getDigitalBooks();
            const alreadyInLibrary = Array.isArray(libraryBooks)
              && libraryBooks.some((b) => b.externalId && b.externalId === decodedExternalId);
            setIsInLibrary(alreadyInLibrary);
          } catch (err) {
            console.error("Erreur chargement bibliothèque:", err);
          }
        }
      } catch (err) {
        console.error("Erreur chargement détails:", err);
        setError("Impossible de charger les détails du livre.");
      } finally {
        setLoading(false);
      }
    }

    loadBookAndStats();
  }, [decodedExternalId, isAuthenticated]);

  const handleDownload = async () => {
    if (!downloadStats) return;

    // Vérifier les droits de téléchargement
    if (!downloadStats.isSubscriber && downloadStats.remainingDownloads <= 0) {
      alert("Vous avez atteint votre limite de téléchargements mensuels. Abonnez-vous pour des téléchargements illimités !");
      return;
    }

    try {
      setDownloading(true);

      // Appel API pour enregistrer le téléchargement
      await downloadBook(decodedExternalId);

      // Simuler un téléchargement (créer un lien de téléchargement factice)
      const blob = new Blob(
        [`Démo - "${book.title}"\n\nCeci est une démo de téléchargement.\n\nDans une version production, le fichier ebook serait téléchargé ici.\n\nAuteur(s): ${book.authors?.join(', ') || 'N/A'}\nÉditeur: ${book.publisher || 'N/A'}\nISBN: ${book.isbn || 'N/A'}`],
        { type: 'text/plain' }
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title.replace(/[^a-z0-9]/gi, '_')}_demo.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Recharger les stats après le téléchargement
      const updatedStats = await getUserDownloadStats();
      setDownloadStats(updatedStats);

      // Show success notification
      setNotification({
        type: 'success',
        message: `"${book.title}" a été téléchargé avec succès !`
      });
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      alert(err.message || "Erreur lors du téléchargement. Veuillez réessayer.");
    } finally {
      setDownloading(false);
    }
  };

  const handleAddToLibrary = async () => {
    try {
      setAddingToLibrary(true);
      await addBookToLibrary(decodedExternalId);
      setNotification({
        type: 'success',
        message: `"${book.title}" a été ajouté à votre bibliothèque !`
      });
      // Optionnel: rediriger vers la bibliothèque
      // navigate("/library/digital-books");
    } catch (err) {
      console.error("Erreur ajout bibliothèque:", err);
      setNotification({
        type: 'error',
        message: err.message || "Erreur lors de l'ajout à la bibliothèque."
      });
    } finally {
      setAddingToLibrary(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{error || "Livre introuvable"}</p>
        </div>
        <Button onClick={() => navigate(-1)} className="mt-6">
          Retour
        </Button>
      </div>
    );
  }

  const canDownload = downloadStats?.isSubscriber || (downloadStats?.remainingDownloads > 0);

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${notification.type === 'success' ? 'bg-accent' : 'bg-red-600'
          } text-white animate-slide-in`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p className="font-medium text-sm sm:text-base">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-75 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-accent hover:text-accentHover mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux livres
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="aspect-[2/3] bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden shadow-lg border border-borderSoft">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                    <svg className="w-20 h-20 text-accent/30 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <p className="text-sm text-accent/50 text-center font-medium line-clamp-3">{book.title}</p>
                  </div>
                )}
              </div>

              {/* Download section */}
              <div className="mt-6 p-4 bg-gradient-to-br from-accent/5 to-gold/5 rounded-lg border border-accent/20">
                {!isAuthenticated ? (
                  // CTA pour les non-connectés
                  <div className="space-y-4">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-accent/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <h3 className="font-semibold text-ink mb-2">Accès aux téléchargements</h3>
                      <p className="text-sm text-inkSoft">Connectez-vous pour télécharger ce livre et accéder à votre bibliothèque.</p>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          saveIntendedDestination(location.pathname);
                          navigate("/auth/login");
                        }}
                        className="w-full"
                      >
                        Se connecter
                      </Button>
                      <Button
                        onClick={() => {
                          saveIntendedDestination(location.pathname);
                          navigate("/auth/register");
                        }}
                        variant="secondary"
                        className="w-full"
                      >
                        Créer un compte
                      </Button>
                    </div>
                  </div>
                ) : downloadStats?.isSubscriber ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gold">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">Abonné Premium</span>
                    </div>
                    <p className="text-sm text-inkSoft">Téléchargements illimités</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">Téléchargements restants</span>
                      <span className="text-lg font-bold text-accent">{downloadStats?.remainingDownloads || 0} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${((downloadStats?.remainingDownloads || 0) / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-inkMuted">Réinitialisation mensuelle</p>
                  </div>
                )}

                {isAuthenticated && (
                  <>
                    {!isInLibrary && (
                      <Button
                        onClick={handleAddToLibrary}
                        disabled={addingToLibrary}
                        variant="tertiary"
                        className="w-full"
                      >
                        {addingToLibrary ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Ajout...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ajouter à ma bibliothèque
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      onClick={handleDownload}
                      disabled={!downloadStats || !canDownload || downloading}
                      className="w-full mt-4"
                    >
                      {downloading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Téléchargement...
                        </>
                      ) : canDownload ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Télécharger
                        </>
                      ) : (
                        "Limite atteinte"
                      )}
                    </Button>

                    {!downloadStats?.isSubscriber && (
                      <p className="text-xs text-center text-inkMuted mt-3">
                        <a href="/subscription" className="text-accent hover:underline font-medium">
                          Passez Premium
                        </a>
                        {" "}pour des téléchargements illimités
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite - Détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre et auteurs */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
                {book.title}
              </h1>
              {book.authors && book.authors.length > 0 && (
                <p className="text-lg text-accent font-medium">
                  Par {book.authors.join(", ")}
                </p>
              )}
            </div>

            {/* Métadonnées */}
            <div className="flex flex-wrap gap-2">
              {book.category && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  {book.category}
                </span>
              )}
              {book.publishedDate && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {new Date(book.publishedDate).getFullYear()}
                </span>
              )}
              {book.pageCount && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {book.pageCount} pages
                </span>
              )}
              {book.language && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm uppercase">
                  {book.language}
                </span>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-ink mb-3">Description</h2>
                <div
                  className="text-inkSoft leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </div>
            )}

            {/* Informations éditoriales */}
            <div className="bg-gradient-to-br from-paper to-paperSoft rounded-lg p-6 border border-borderSoft">
              <h2 className="text-xl font-semibold text-ink mb-4">Informations éditoriales</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {book.publisher && (
                  <div>
                    <dt className="text-sm text-inkMuted mb-1">Éditeur</dt>
                    <dd className="font-medium text-ink">{book.publisher}</dd>
                  </div>
                )}
                {book.publishedDate && (
                  <div>
                    <dt className="text-sm text-inkMuted mb-1">Date de publication</dt>
                    <dd className="font-medium text-ink">
                      {new Date(book.publishedDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                )}
                {book.isbn && (
                  <div>
                    <dt className="text-sm text-inkMuted mb-1">ISBN</dt>
                    <dd className="font-medium text-ink font-mono text-sm">{book.isbn}</dd>
                  </div>
                )}
                {book.pageCount && (
                  <div>
                    <dt className="text-sm text-inkMuted mb-1">Nombre de pages</dt>
                    <dd className="font-medium text-ink">{book.pageCount} pages</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
