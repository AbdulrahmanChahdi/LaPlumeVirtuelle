import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Loader from "../../components/ui/Loader"
import BookCard from "../../components/BookCard"
import { searchBooks } from "../../api/booksApi"
import { getAllLivres } from "../../api/livresApi"
import { enrichBookWithCategories } from "../../utils/categoryMapping"

const TABS = [
  { label: "Livres", key: "books" },
  { label: "Audiobooks", key: "audiobooks" },
  { label: "Podcasts", key: "podcasts" },
]

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

function buildAuthHeaders() {
  const token = localStorage.getItem("authToken")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/* ── Cards ── */
function AudioCard({ item }) {
  const cover = item.livre?.imageUrl || item.imageUrl
  return (
    <Link to={`/catalogue/audiobooks/${item.id}`} className="block group">
      <div className="bg-white rounded-lg border border-borderSoft group-hover:shadow-md transition-shadow p-4 flex flex-col gap-2">
        <div className="w-full aspect-[3/4] bg-paper rounded flex items-center justify-center mb-2">
          {cover ? (
            <img src={cover} alt={item.livre?.titre || item.titre || "Audiobook"} className="w-full h-full object-cover rounded" />
          ) : (
            <span className="text-3xl">🎧</span>
          )}
        </div>
        <p className="text-sm font-semibold text-ink leading-tight line-clamp-2">
          {item.livre?.titre || item.titre || "Sans titre"}
        </p>
        <p className="text-xs text-inkMuted">{item.livre?.auteur?.nom || ""}</p>
        {item.duree && <p className="text-xs text-inkMuted">{item.duree} min</p>}
        {(item.livre?.thematique || item.thematique) && (
          <span className="self-start text-[10px] uppercase tracking-wide bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
            {item.livre?.thematique || item.thematique}
          </span>
        )}
      </div>
    </Link>
  )
}

function PodcastCard({ item }) {
  return (
    <Link to={`/catalogue/podcasts/${item.id}`} className="block group">
      <div className="bg-white rounded-lg border border-borderSoft group-hover:shadow-md transition-shadow p-4 flex flex-col gap-2">
        <div className="w-full aspect-[3/4] bg-paper rounded flex items-center justify-center mb-2">
          <span className="text-3xl">🎙️</span>
        </div>
        <p className="text-sm font-semibold text-ink leading-tight line-clamp-2">
          {item.nom || item.titre || "Sans titre"}
        </p>
        <p className="text-xs text-inkMuted line-clamp-2">{item.animateur || item.description || ""}</p>
        {item.nombreEpisodes && <p className="text-xs text-inkMuted">{item.nombreEpisodes} épisodes</p>}
        {(item.theme || item.thematique) && (
          <span className="self-start text-[10px] uppercase tracking-wide bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
            {item.theme || item.thematique}
          </span>
        )}
      </div>
    </Link>
  )
}

/* ── Filtres catégorie ── */
function CategoryPills({ items, getKey, activeCategory, onSelect }) {
  const categories = [...new Set(items.map(getKey).filter(Boolean))]
  if (categories.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button type="button" onClick={() => onSelect("")}
        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
          !activeCategory ? "bg-accent text-white border-accent" : "border-borderSoft text-inkSoft hover:border-accent hover:text-ink"
        }`}
      >Tous</button>
      {categories.map(cat => (
        <button type="button" key={cat} onClick={() => onSelect(cat)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            activeCategory === cat ? "bg-accent text-white border-accent" : "border-borderSoft text-inkSoft hover:border-accent hover:text-ink"
          }`}
        >{cat}</button>
      ))}
    </div>
  )
}

/* ── Composant principal ── */
export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams()
  const validTabs = ["books", "audiobooks", "podcasts"]
  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get("tab")
    return validTabs.includes(t) ? t : "books"
  })
  const [books, setBooks] = useState([])
  const [audiobooks, setAudiobooks] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState({ books: true, audiobooks: true, podcasts: true })
  const [error, setError] = useState({ books: null, audiobooks: null, podcasts: null })
  const [category, setCategory] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [externalResult, localResult] = await Promise.allSettled([
          searchBooks("roman fiction"),
          getAllLivres(),
        ])

        if (cancelled) return

        const externalBooks = externalResult.status === "fulfilled" ? (externalResult.value || []) : []
        const localBooks = localResult.status === "fulfilled" ? (localResult.value || []) : []

        const enrichedExternal = externalBooks.map(b => enrichBookWithCategories(b))
        const normalizedLocal = localBooks.map((b) => ({
          ...b,
          title: b.titre,
          categories: b.categorie?.nom ? [b.categorie.nom] : [],
          author_name: b.auteur?.nom ? [b.auteur.nom] : [],
        }))

        const merged = [...enrichedExternal, ...normalizedLocal]
        const unique = merged.filter((item, idx, arr) => {
          const key = item.externalId || `local-${item.id}`
          return arr.findIndex((other) => (other.externalId || `local-${other.id}`) === key) === idx
        })

        setBooks(unique)

        if (externalResult.status === "rejected") {
          setError(p => ({ ...p, books: "Impossible de charger les livres." }))
        } else {
          setError(p => ({ ...p, books: null }))
        }
      } finally {
        if (!cancelled) setLoading(p => ({ ...p, books: false }))
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const r = await fetch(`${API_BASE}/api/livres-audio`, {
          headers: buildAuthHeaders(),
        })
        if (!r.ok) throw new Error("audiobooks fetch failed")
        const data = await r.json()
        if (!cancelled) setAudiobooks(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setError(p => ({ ...p, audiobooks: "Impossible de charger les audiobooks." }))
      } finally {
        if (!cancelled) setLoading(p => ({ ...p, audiobooks: false }))
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const r = await fetch(`${API_BASE}/api/podcasts`, {
          headers: buildAuthHeaders(),
        })
        if (!r.ok) throw new Error("podcasts fetch failed")
        const data = await r.json()
        if (!cancelled) setPodcasts(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setError(p => ({ ...p, podcasts: "Impossible de charger les podcasts." }))
      } finally {
        if (!cancelled) setLoading(p => ({ ...p, podcasts: false }))
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  function handleTabChange(key) {
    setActiveTab(key)
    setCategory("")
    setQuery("")
    setSearchParams({ tab: key }, { replace: true })
  }

  const currentItems = { books, audiobooks, podcasts }[activeTab] || []

  const filtered = (() => {
    let items = currentItems
    if (category) {
      if (activeTab === "books")
        items = items.filter(b => b.categories?.includes(category) || b.thematique === category || b.categorie?.nom === category)
      else if (activeTab === "audiobooks")
        items = items.filter(a => (a.livre?.thematique || a.thematique) === category)
      else
        items = items.filter(p => (p.theme || p.thematique) === category)
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      if (activeTab === "books")
        items = items.filter(b =>
          (b.title || b.titre || "").toLowerCase().includes(q) ||
          (b.author_name?.[0] || b.auteur?.nom || "").toLowerCase().includes(q)
        )
      else if (activeTab === "audiobooks")
        items = items.filter(a =>
          (a.livre?.titre || a.titre || "").toLowerCase().includes(q) ||
          (a.livre?.auteur?.nom || "").toLowerCase().includes(q)
        )
      else
        items = items.filter(p =>
          (p.nom || p.titre || "").toLowerCase().includes(q) ||
          (p.animateur || p.description || "").toLowerCase().includes(q)
        )
    }
    return items
  })()

  const getKey =
    activeTab === "books" ? b => b.categories?.[0] || b.thematique || b.categorie?.nom :
    activeTab === "audiobooks" ? a => a.livre?.thematique || a.thematique :
    p => p.theme || p.thematique

  const isLoading = loading[activeTab]
  const currentError = error[activeTab]

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Découvrir</h1>
        <p className="text-sm text-inkSoft mt-0.5">Explorez notre catalogue complet</p>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-borderSoft mb-8 gap-8">
        {TABS.map(tab => (
          <button
            type="button"
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`pb-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab.key
                ? "text-ink border-b-2 border-ink -mb-px"
                : "text-inkMuted hover:text-inkSoft"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-3 flex items-center text-inkMuted pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Rechercher un ${ activeTab === "books" ? "livre" : activeTab === "audiobooks" ? "audiobook" : "podcast" }...`}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-borderSoft bg-white text-sm text-ink placeholder-inkMuted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")}
            className="absolute inset-y-0 right-3 flex items-center text-inkMuted hover:text-ink transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filtres catégorie */}
      {!isLoading && !currentError && (
        <CategoryPills items={currentItems} getKey={getKey} activeCategory={category} onSelect={setCategory} />
      )}

      {/* États */}
      {isLoading && <div className="flex justify-center py-20"><Loader /></div>}

      {!isLoading && currentError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-red-700 text-sm">{currentError}</div>
      )}

      {!isLoading && !currentError && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <span className="text-accent text-xl">✦</span>
          </div>
          <p className="text-ink font-medium mb-1">Aucun contenu disponible pour l'instant</p>
          <p className="text-inkMuted text-sm">La collection s'enrichit régulièrement.</p>
        </div>
      )}

      {/* Grille */}
      {!isLoading && !currentError && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {activeTab === "books" && filtered.map(book => (
            <BookCard key={book.externalId || book.id} book={book} />
          ))}
          {activeTab === "audiobooks" && filtered.map(item => (
            <AudioCard key={item.id} item={item} />
          ))}
          {activeTab === "podcasts" && filtered.map(item => (
            <PodcastCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
