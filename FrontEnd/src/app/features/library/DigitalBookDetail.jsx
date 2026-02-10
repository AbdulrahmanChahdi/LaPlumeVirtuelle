import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDigitalBookById } from "../../api/digitalBooksApi";
import { getUserDownloadStats } from "../../api/downloadApi";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function DigitalBookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadStats, setDownloadStats] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadBookAndStats() {
      try {
        setLoading(true);
        setError(null);

        const [bookData, statsData] = await Promise.all([
          getDigitalBookById(id),
          getUserDownloadStats()
        ]);

        setBook(bookData);
        setDownloadStats(statsData);
      } catch (err) {
        console.error("Erreur chargement détails:", err);
        setError("Impossible de charger les détails du livre.");
      } finally {
        setLoading(false);
      }
    }

    loadBookAndStats();
  }, [id]);

  const handleDownload = async () => {
    if (!downloadStats) return;

    if (!downloadStats.isSubscriber && downloadStats.remainingDownloads <= 0) {
      alert("Vous avez atteint votre limite de téléchargements mensuels. Abonnez-vous pour des téléchargements illimités !");
      return;
    }

    try {
      setDownloading(true);
      alert(`Téléchargement de "${book.titre}" - Fonctionnalité en cours de développement`);
      
      const updatedStats = await getUserDownloadStats();
      setDownloadStats(updatedStats);
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      alert("Erreur lors du téléchargement. Veuillez réessayer.");
    } finally {
      setDownloading(false);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-accent hover:text-accentHover mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à ma bibliothèque
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche - Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="aspect-[2/3] bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden shadow-lg border border-borderSoft">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.titre}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                  <svg className="w-20 h-20 text-accent/30 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <p className="text-sm text-accent/50 text-center font-medium line-clamp-3">{book.titre}</p>
                </div>
              )}
            </div>

            {/* Download section */}
            <div className="mt-6 p-4 bg-gradient-to-br from-accent/5 to-gold/5 rounded-lg border border-accent/20">
              {downloadStats?.isSubscriber ? (
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

              <Button
                onClick={handleDownload}
                disabled={!canDownload || downloading}
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
            </div>
          </div>
        </div>

        {/* Colonne droite - Détails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Titre et auteurs */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
              {book.titre}
            </h1>
            {book.auteur && (
              <p className="text-lg text-accent font-medium">
                Par {book.auteur.nom}
              </p>
            )}
          </div>

          {/* Métadonnées */}
          <div className="flex flex-wrap gap-2">
            {book.categorie && (
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                {book.categorie.nom}
              </span>
            )}
            {book.nombreDePage && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {book.nombreDePage} pages
              </span>
            )}
            {book.langue && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm uppercase">
                {book.langue}
              </span>
            )}
            {book.disponible !== undefined && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                book.disponible 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {book.disponible ? "Disponible" : "Indisponible"}
              </span>
            )}
          </div>

          {/* Description */}
          {book.resume && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-ink mb-3">Description</h2>
              <p className="text-inkSoft leading-relaxed whitespace-pre-line">
                {book.resume}
              </p>
            </div>
          )}

          {/* Informations */}
          <div className="bg-gradient-to-br from-paper to-paperSoft rounded-lg p-6 border border-borderSoft">
            <h2 className="text-xl font-semibold text-ink mb-4">Informations</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.auteur && (
                <div>
                  <dt className="text-sm text-inkMuted mb-1">Auteur</dt>
                  <dd className="font-medium text-ink">{book.auteur.nom}</dd>
                </div>
              )}
              {book.categorie && (
                <div>
                  <dt className="text-sm text-inkMuted mb-1">Catégorie</dt>
                  <dd className="font-medium text-ink">{book.categorie.nom}</dd>
                </div>
              )}
              {book.nombreDePage && (
                <div>
                  <dt className="text-sm text-inkMuted mb-1">Nombre de pages</dt>
                  <dd className="font-medium text-ink">{book.nombreDePage} pages</dd>
                </div>
              )}
              {book.langue && (
                <div>
                  <dt className="text-sm text-inkMuted mb-1">Langue</dt>
                  <dd className="font-medium text-ink capitalize">{book.langue}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
