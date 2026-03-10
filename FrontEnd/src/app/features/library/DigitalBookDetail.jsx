import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDigitalBookById } from "../../api/digitalBooksApi";
import { getUserDownloadStats, downloadBook } from "../../api/downloadApi";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function DigitalBookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadStats, setDownloadStats] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  useEffect(() => {
    async function loadBookAndStats() {
      try {
        setLoading(true);
        setError(null);

        const [bookData, statsData] = await Promise.all([
          getDigitalBookById(id, token),
          getUserDownloadStats(token)
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
  }, [id, token]);

  const handleDownload = () => {
    if (!downloadStats) return;

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
      
      // Créer un fichier de démo
      const blob = new Blob(
        [`Démo - "${book.titre}"

Ceci est une démo de téléchargement.

Dans une version production, le fichier ebook serait téléchargé ici.

Auteur: ${book.auteur || 'N/A'}
ISBN: ${book.isbn || 'N/A'}
Catégorie: ${book.categorie?.nom || 'N/A'}`],
        { type: 'text/plain' }
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.titre.replace(/[^a-z0-9]/gi, '_')}_demo.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Enregistrer le téléchargement (utiliser externalBookId si disponible)
      const externalId = book.externalBookId || `internal-${book.id}`;
      await downloadBook(externalId, token);
      
      const updatedStats = await getUserDownloadStats(token);
      setDownloadStats(updatedStats);
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      alert("Erreur lors du téléchargement. Veuillez réessayer.");
    } finally {
      setDownloading(false);
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

  return (
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
          Retour à ma bibliothèque
        </button>

        <div className="flex flex-col sm:flex-row gap-8 items-start max-w-4xl">
          {/* Cover */}
          <div className="shrink-0 w-32 sm:w-44 aspect-[2/3] bg-white/10 backdrop-blur rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.titre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">📖</span>
            )}
          </div>

          {/* Titre + meta */}
          <div className="flex-1 pt-1">
            <span className="inline-block text-[11px] uppercase tracking-widest text-emerald-200 font-semibold mb-3">Livre numérique</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">{book.titre}</h1>
            {book.auteur && <p className="text-emerald-100 text-base mb-5">{book.auteur.nom}</p>}
            <div className="flex flex-wrap gap-2">
              {book.categorie && <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">{book.categorie.nom}</span>}
              {book.nombreDePage && <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">📄 {book.nombreDePage} pages</span>}
              {book.langue && <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur uppercase">{book.langue}</span>}
              {book.disponible !== undefined && (
                <span className={`text-xs px-3 py-1 rounded-full backdrop-blur ${book.disponible ? "bg-green-400/30 text-green-100" : "bg-red-400/30 text-red-100"}`}>
                  {book.disponible ? "Disponible" : "Indisponible"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="px-6 py-8 lg:px-10 max-w-4xl space-y-5">

        {/* Actions + quota */}
        <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
          <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-4">Téléchargement</h2>
          <Button onClick={handleDownload} disabled={!canDownload || downloading}>
            {downloading ? "Téléchargement..." : canDownload ? "⬇ Télécharger" : "Limite atteinte"}
          </Button>
          <div className="mt-4 pt-4 border-t border-borderSoft">
            {downloadStats?.isSubscriber ? (
              <p className="text-xs text-gold font-medium">★ Premium — téléchargements illimités</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-accent h-1.5 rounded-full" style={{ width: `${((downloadStats?.remainingDownloads || 0) / 5) * 100}%` }} />
                </div>
                <span className="text-xs text-inkMuted shrink-0">{downloadStats?.remainingDownloads || 0} / 5 restants</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {book.resume && (
          <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-3">Description</h2>
            <p className="text-ink text-sm leading-relaxed whitespace-pre-line">{book.resume}</p>
          </div>
        )}

        {/* Fiche */}
        <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
          <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-5">Informations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {book.auteur && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Auteur</p><p className="text-ink font-semibold text-sm">{book.auteur.nom}</p></div>}
            {book.categorie && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Catégorie</p><p className="text-ink font-semibold text-sm">{book.categorie.nom}</p></div>}
            {book.nombreDePage && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Pages</p><p className="text-ink font-semibold text-sm">{book.nombreDePage}</p></div>}
            {book.langue && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Langue</p><p className="text-ink font-semibold text-sm capitalize">{book.langue}</p></div>}
            {book.isbn && <div><p className="text-inkMuted text-xs uppercase tracking-wide mb-1">ISBN</p><p className="text-ink font-semibold text-sm font-mono">{book.isbn}</p></div>}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDownloadConfirm}
        onClose={() => setShowDownloadConfirm(false)}
        onConfirm={confirmDownload}
        title="Télécharger ce livre"
        message={`${book.titre}\n\n${downloadStats?.isSubscriber ? "✨ Téléchargement illimité (compte Premium)" : `📥 Il vous reste ${downloadStats?.remainingDownloads} téléchargement(s) ce mois-ci`}`}
        confirmText="Télécharger"
        cancelText="Annuler"
        type="default"
      />
    </div>
  )
}
