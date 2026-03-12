import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { addPodcastToLibrary, getPodcastById, getPodcasts } from "../../api/podcastsApi"
import { useAuth } from "../../hooks/useAuth"
import Loader from "../../components/ui/Loader"
import Button from "../../components/ui/Button"

export default function PodcastDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInLibrary, setIsInLibrary] = useState(false)
  const [addingToLibrary, setAddingToLibrary] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([getPodcastById(id), getPodcasts(token)])
      .then(([data, items]) => {
        if (cancelled) return
        setItem(data)
        setIsInLibrary(Array.isArray(items) && items.some((podcast) => String(podcast.id) === String(id)))
      })
      .catch(() => { if (!cancelled) setError("Impossible de charger ce podcast.") })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id, token])

  const handleAddToLibrary = async () => {
    try {
      setAddingToLibrary(true)
      await addPodcastToLibrary(id, token)
      setIsInLibrary(true)
    } catch (err) {
      alert(err?.message || "Erreur lors de l'ajout à la bibliothèque")
    } finally {
      setAddingToLibrary(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>

  if (error) return (
    <div className="px-6 py-8">
      <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-inkMuted hover:text-ink text-sm mb-6 transition-colors">
        ← Retour
      </button>
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-red-700 text-sm">{error}</div>
    </div>
  )

  if (!item) return null

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-purple-700 to-purple-900 px-6 py-12 lg:px-10">
        {/* Bouton retour */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au catalogue
        </button>

        <div className="flex flex-col sm:flex-row gap-8 items-start max-w-4xl">
          {/* Cover */}
          <div className="shrink-0 w-36 sm:w-44 aspect-[3/4] bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-7xl">🎙️</span>
          </div>

          {/* Titre + meta */}
          <div className="flex-1 pt-1">
            <span className="inline-block text-[11px] uppercase tracking-widest text-purple-200 font-semibold mb-3">Podcast</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">{item.nom || item.titre || "Sans titre"}</h1>

            <div className="flex flex-wrap gap-2 mt-5">
              {(item.theme || item.thematique) && (
                <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">
                  {item.theme || item.thematique}
                </span>
              )}
              {item.duree && (
                <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">
                  🎵 {item.duree} sec
                </span>
              )}
              {item.langue && (
                <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur">
                  {item.langue}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="px-6 py-8 lg:px-10 max-w-4xl space-y-5">
        <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
          {isInLibrary ? (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
              <span>✓</span> Déjà dans votre bibliothèque
            </div>
          ) : (
            <Button onClick={handleAddToLibrary} disabled={addingToLibrary}>
              {addingToLibrary ? "Ajout..." : "Ajouter à ma bibliothèque"}
            </Button>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-3">À propos</h2>
            <p className="text-ink text-sm leading-relaxed">{item.description}</p>
          </div>
        )}

        {/* Fiche technique */}
        <div className="bg-white rounded-2xl border border-borderSoft p-6 shadow-sm">
          <h2 className="text-xs uppercase tracking-widest text-inkMuted font-semibold mb-5">Informations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {item.duree && (
              <div>
                <p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Durée</p>
                <p className="text-ink font-semibold text-sm">{item.duree} sec</p>
              </div>
            )}
            {(item.theme || item.thematique) && (
              <div>
                <p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Thématique</p>
                <p className="text-ink font-semibold text-sm">{item.theme || item.thematique}</p>
              </div>
            )}
            {item.id && (
              <div>
                <p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Référence</p>
                <p className="text-ink font-semibold text-sm"># {item.id}</p>
              </div>
            )}
            {item.langue && (
              <div>
                <p className="text-inkMuted text-xs uppercase tracking-wide mb-1">Langue</p>
                <p className="text-ink font-semibold text-sm">{item.langue}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
