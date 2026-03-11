import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { getDigitalBooks } from "../../api/digitalBooksApi"
import { getAudiobooks } from "../../api/audiobooksApi"
import { getPodcasts } from "../../api/podcastsApi"
import BookCard from "../../components/BookCard"
import Loader from "../../components/ui/Loader"

const TABS = [
  { label: "Livres", key: "books" },
  { label: "Audiobooks", key: "audiobooks" },
  { label: "Podcasts", key: "podcasts" },
]

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
        <span className="text-accent text-xl">✦</span>
      </div>
      <p className="text-ink font-medium mb-1">Votre collection est vide</p>
      <p className="text-inkMuted text-sm">
        Parcourez le catalogue pour ajouter des {label} à votre bibliothèque.
      </p>
    </div>
  )
}

export default function MyLibrary() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState("books")
  const [data, setData] = useState({ books: [], audiobooks: [], podcasts: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    async function load() {
      const [books, audiobooks, podcasts] = await Promise.allSettled([
        getDigitalBooks(token),
        getAudiobooks(token),
        getPodcasts(token),
      ])
      if (cancelled) return
      if ([books, audiobooks, podcasts].every(r => r.status === "rejected")) {
        setError("Impossible de charger votre bibliothèque.")
      } else {
        setData({
          books: books.status === "fulfilled" ? (books.value || []) : [],
          audiobooks: audiobooks.status === "fulfilled" ? (audiobooks.value || []) : [],
          podcasts: podcasts.status === "fulfilled" ? (podcasts.value || []) : [],
        })
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [token])

  const currentItems = data[activeTab]
  const currentLabel = TABS.find(t => t.key === activeTab)?.label.toLowerCase() ?? ""

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Ma bibliothèque</h1>
        <p className="text-sm text-inkSoft mt-0.5">Toute votre collection en un endroit</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-borderSoft mb-8 gap-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab.key
                ? "text-ink border-b-2 border-ink -mb-px"
                : "text-inkMuted hover:text-inkSoft"
            }`}
          >
            {tab.label}
            {data[tab.key].length > 0 && (
              <span className="ml-2 text-xs font-normal text-inkMuted">
                ({data[tab.key].length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && currentItems.length === 0 && (
        <EmptyState label={currentLabel} />
      )}

      {!loading && !error && currentItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentItems.map((item) => (
            <BookCard
              key={item.id}
              book={{
                ...item,
                authors: item.auteur ? [item.auteur.nom] : [],
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
