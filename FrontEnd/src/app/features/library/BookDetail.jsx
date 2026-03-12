import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getBookByExternalId, searchBooks } from "../../api/booksApi";
import { getUserDownloadStats, downloadBook } from "../../api/downloadApi";
import { addBookToLibrary, addInternalBookToLibrary, getDigitalBookById, getDigitalBooks } from "../../api/digitalBooksApi";
import { useAuth } from "../../hooks/useAuth";
import { saveIntendedDestination } from "../../utils/navigation";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function BookDetail() {
  const { externalId } = useParams();
  const decodedExternalId = externalId ? decodeURIComponent(externalId) : externalId;
  const isExternalRef = decodedExternalId?.startsWith("/works/");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadStats, setDownloadStats] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [addingToLibrary, setAddingToLibrary] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

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

        const bookData = isExternalRef
          ? await getBookByExternalId(decodedExternalId)
          : await getDigitalBookById(decodedExternalId, token);
        setBook(bookData);

        // Charger les stats uniquement si l'utilisateur est connecté
        if (isAuthenticated) {
          try {
            const statsData = await getUserDownloadStats(token);
            setDownloadStats(statsData);
          } catch (err) {
            console.error("Erreur chargement stats:", err);
            // Continuer sans stats si erreur
          }

          try {
            const libraryBooks = await getDigitalBooks(token);
            const alreadyInLibrary = Array.isArray(libraryBooks) && (
              isExternalRef
                ? libraryBooks.some((b) => b.externalId && b.externalId === decodedExternalId)
                : libraryBooks.some((b) => String(b.id) === String(decodedExternalId))
            );
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
  }, [decodedExternalId, isAuthenticated, token, isExternalRef]);

  useEffect(() => {
    if (!book) return;
    async function loadSimilar() {
      setLoadingSimilar(true);
      try {
        const query = book.category || book.authors?.[0] || book.title;
        const results = await searchBooks(query, 10);
        setSimilar(results.filter((b) => b.externalId !== decodedExternalId).slice(0, 6));
      } catch {
        // silently ignore
      } finally {
        setLoadingSimilar(false);
      }
    }
    loadSimilar();
  }, [book, decodedExternalId]);

  const handleDownload = () => {
    if (!downloadStats) return;

    // Vérifier les droits de téléchargement
    if (!downloadStats.isSubscriber && downloadStats.remainingDownloads <= 0) {
      alert("Vous avez atteint votre limite de téléchargements mensuels. Abonnez-vous pour des téléchargements illimités !");
      return;
    }

    // Ouvrir la modale de confirmation
    setShowDownloadConfirm(true);
  };

  const confirmDownload = async () => {
    try {
      setDownloading(true);

      // Simuler un téléchargement (créer un fichier de démo)
      const blob = new Blob(
        [`Démo - "${bookTitle}"\n\nCeci est une démo de téléchargement.\n\nDans une version production, le fichier ebook serait téléchargé ici.\n\nAuteur(s): ${bookAuthors.join(', ') || 'N/A'}\nÉditeur: ${book.publisher || 'N/A'}\nISBN: ${book.isbn || 'N/A'}`],
        { type: 'text/plain' }
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookTitle.replace(/[^a-z0-9]/gi, '_')}_demo.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Enregistrer le téléchargement dans le backend (après le déclenchement)
      await downloadBook(decodedExternalId, token);

      // Recharger les stats après le téléchargement
      const updatedStats = await getUserDownloadStats(token);
      setDownloadStats(updatedStats);

      // Show success notification
      setNotification({
        type: 'success',
        message: `"${bookTitle}" a été téléchargé avec succès !`
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
      if (isExternalRef) {
        await addBookToLibrary(decodedExternalId, token);
      } else {
        await addInternalBookToLibrary(decodedExternalId, token);
      }
      setNotification({
        type: 'success',
        message: `"${book.title || book.titre}" a été ajouté à votre bibliothèque !`
      });
      setIsInLibrary(true);
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

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>

  if (error || !book) return (
    <div className="px-6 py-8">
      <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-inkMuted hover:text-ink text-sm mb-6 transition-colors">
        ← Retour
      </button>
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">{error || "Livre introuvable"}</div>
    </div>
  )

  const canDownload = downloadStats?.isSubscriber || (downloadStats?.remainingDownloads > 0)
  const bookTitle = book.title || book.titre || "Livre"
  const bookCover = book.coverUrl || book.imageUrl
  const bookAuthors = book.authors?.length ? book.authors : (book.auteur?.nom ? [book.auteur.nom] : [])
  const bookCategory = book.category || book.categorie?.nom
  const bookPages = book.pageCount || book.nombreDePage
  const bookLanguage = book.language || book.langue

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div role="alert" aria-live="polite"
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium ${
            notification.type === 'success' ? 'bg-accent' : 'bg-red-600'
          }`}
        >
          <span>{notification.message}</span>
          <button type="button" onClick={() => setNotification(null)} className="hover:opacity-75">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="min-h-screen">
        {/* Hero banner */}
        <div className="bg-gradient-to-br from-[#1a3d35] to-accent px-6 py-12 lg:px-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>

          <div className="flex flex-col sm:flex-row gap-8 items-start max-w-4xl">
            {/* Cover */}
            <div className="shrink-0 w-32 sm:w-44 aspect-[2/3] bg-white/10 backdrop-blur rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
              {bookCover ? (
                <img src={bookCover} alt={bookTitle} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">📖</span>
              )}
            </div>

            {/* Titre + meta */}
            <div className="flex-1 pt-1">
              <span className="inline-block text-[11px] uppercase tracking-widest text-emerald-200 font-semibold mb-3">Livre</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">{bookTitle}</h1>
              {bookAuthors.length > 0 && (
                <p className="text-emerald-100 text-base mb-5">{bookAuthors.join(", ")}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {bookCategory && <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">{bookCategory}</span>}
                {book.publishedDate && <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">{new Date(book.publishedDate).getFullYear()}</span>}
                {bookPages && <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">📄 {bookPages} pages</span>}
                {bookLanguage && <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur uppercase">{bookLanguage}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="px-6 py-8 lg:px-10 max-w-7xl">
          <div className="flex gap-8 items-start">

          {/* Colonne principale */}
          <div className="flex-1 min-w-0 space-y-5">

          {/* Actions (connecté) */}
          {isAuthenticated && (
            <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
              <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-5">Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bouton bibliothèque */}
                {isInLibrary ? (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-accent">Dans votre bibliothèque</p>
                      <p className="text-xs text-emerald-600">Déjà ajouté</p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToLibrary}
                    disabled={addingToLibrary}
                    className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="w-9 h-9 rounded-full border-2 border-accent group-hover:border-white flex items-center justify-center shrink-0 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{addingToLibrary ? "Ajout en cours..." : "Ajouter à ma bibliothèque"}</p>
                      <p className="text-xs opacity-70">Sauvegarder pour plus tard</p>
                    </div>
                  </button>
                )}

                {/* Bouton téléchargement */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!downloadStats || !canDownload || downloading}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl bg-accent text-white hover:bg-accentHover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    {downloading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">
                      {downloading ? "Téléchargement..." : canDownload ? "Télécharger" : "Limite atteinte"}
                    </p>
                    <p className="text-xs opacity-70">Format ebook</p>
                  </div>
                </button>
              </div>

              {/* Quota */}
              {downloadStats && (
                <div className="mt-5 pt-5 border-t border-borderSoft">
                  {downloadStats.isSubscriber ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gold text-sm">★</span>
                      <p className="text-xs font-semibold text-gold">Compte Premium — téléchargements illimités</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-inkMuted mb-1">
                        <span>Téléchargements ce mois</span>
                        <span className="font-semibold text-ink">{downloadStats.remainingDownloads} / 5 restants</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${((downloadStats.remainingDownloads || 0) / 5) * 100}%`,
                            background: downloadStats.remainingDownloads > 1 ? '#2F5D50' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CTA non connecté */}
          {!isAuthenticated && (
            <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm text-center">
              <p className="text-inkSoft text-sm mb-4">Connectez-vous pour télécharger ce livre et l'ajouter à votre bibliothèque.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => { saveIntendedDestination(location.pathname); navigate("/auth/login") }}>Se connecter</Button>
                <Button variant="secondary" onClick={() => { saveIntendedDestination(location.pathname); navigate("/auth/register") }}>Créer un compte</Button>
              </div>
            </div>
          )}

          {/* Description */}
          {(book.description || book.resume) && (
            <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
              <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-3">Description</h2>
              {book.description ? (
                <div className="text-ink text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: book.description }} />
              ) : (
                <p className="text-ink text-sm leading-relaxed whitespace-pre-line">{book.resume}</p>
              )}
            </div>
          )}

          {/* Fiche */}
          <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-5">Informations éditoriales</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {book.publisher && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Éditeur</p><p className="text-ink font-semibold text-sm">{book.publisher}</p></div>}
              {book.publishedDate && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Publication</p><p className="text-ink font-semibold text-sm">{new Date(book.publishedDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p></div>}
              {book.isbn && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">ISBN</p><p className="text-ink font-semibold text-sm font-mono">{book.isbn}</p></div>}
              {book.pageCount && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Pages</p><p className="text-ink font-semibold text-sm">{book.pageCount}</p></div>}
            </div>
          </div>

          </div>{/* fin colonne principale */}

          {/* Sidebar droite — Suggestions */}
          {(loadingSimilar || similar.length > 0) && (
            <aside className="hidden lg:block w-64 shrink-0 sticky top-6 self-start">
              <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-4">Vous aimerez aussi</h2>
              <div className="space-y-4">
                {loadingSimilar
                  ? [...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-12 h-16 bg-gray-200 rounded-lg shrink-0" />
                        <div className="flex-1 pt-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-full" />
                          <div className="h-3 bg-gray-100 rounded w-3/4" />
                        </div>
                      </div>
                    ))
                  : similar.map((s) => (
                      <Link
                        key={s.externalId}
                        to={`/library/books/${encodeURIComponent(s.externalId)}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shrink-0 shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center">
                          {s.coverUrl
                            ? <img src={s.coverUrl} alt={s.title} className="w-full h-full object-cover" />
                            : <span className="text-xl">📖</span>}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-ink text-xs font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors">{s.title}</p>
                          {s.authors?.length > 0 && (
                            <p className="text-inkMuted text-[11px] mt-1 truncate">{s.authors[0]}</p>
                          )}
                        </div>
                      </Link>
                    ))
                }
              </div>
            </aside>
          )}

          </div>{/* fin flex 2 colonnes */}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDownloadConfirm}
        onClose={() => setShowDownloadConfirm(false)}
        onConfirm={confirmDownload}
        title="Télécharger ce livre"
        message={`${book.title}\n\n${downloadStats?.isSubscriber ? "✨ Téléchargement illimité (compte Premium)" : `📥 Il vous reste ${downloadStats?.remainingDownloads} téléchargement(s) ce mois-ci`}`}
        confirmText="Télécharger"
        cancelText="Annuler"
        type="default"
      />
    </>
  )
}
