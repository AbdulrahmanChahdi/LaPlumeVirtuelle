import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getRecommendations } from "../../api/profileRecommendationsApi"

const SECTIONS = [
  { key: "books", label: "Livres tendances" },
  { key: "nonfiction", label: "Non-fiction populaire" },
  { key: "podcasts", label: "Podcasts suggeres" },
]

function normalizeType(type) {
  return String(type || "").toLowerCase()
}

function resolveItemType(item) {
  const declared = normalizeType(item?.type)
  if (declared && declared !== "" && declared !== "unknown") return declared

  // If id looks like OpenLibrary work key, treat as book
  const id = item?.id || item?.externalId || ""
  if (typeof id === "string" && id.startsWith("/works/")) return "livre"

  // If ISBN present or authors present, prefer book
  if (item?.isbn || (Array.isArray(item?.authors) && item.authors.length > 0) || item?.author) return "livre"

  // If cover + duration or explicit audiobook tag, prefer audiobooks
  if (declared === "livreaudio" || declared === "audiobook" || /audio/i.test(item?.type || "")) return "livreaudio"

  return declared || "livre"
}

function isPodcast(type) {
  return normalizeType(type) === "podcast"
}

function looksLikeNonFiction(item) {
  const tags = Array.isArray(item?.tags) ? item.tags : []
  const joined = tags.join(" ").toLowerCase()
  return (
    joined.includes("non-fiction") ||
    joined.includes("non fiction") ||
    joined.includes("essai") ||
    joined.includes("documentaire") ||
    joined.includes("histoire")
  )
}

function getDetailLink(item) {
  const safeId = encodeURIComponent(item?.id || "")

  if (isPodcast(item?.type)) {
    return `/catalogue/podcasts/${safeId}`
  }
  if (normalizeType(item?.type) === "livreaudio") {
    return "/library/detail/audiobooks"
  }
  if (normalizeType(item?.type) === "livre" || normalizeType(item?.type) === "book") {
    return `/library/books/${safeId}`
  }

  return "/catalogue"
}

function scoreLabel(score) {
  if (typeof score !== "number") {
    return "Score indisponible"
  }
  return `${Math.round(score * 100)}% pertinence`
}

function readCachedRecommendations() {
  try {
    const cached = localStorage.getItem("latestRecommendations")
    if (!cached) return { recommendations: [], total: 0 }

    const parsed = JSON.parse(cached)
    const recommendations = Array.isArray(parsed?.recommendations) ? parsed.recommendations : []
    const total = Number.isFinite(parsed?.total) ? parsed.total : recommendations.length
    return { recommendations, total }
  } catch {
    return { recommendations: [], total: 0 }
  }
}

function getBestSectionKey(grouped) {
  return SECTIONS.find((section) => Array.isArray(grouped?.[section.key]) && grouped[section.key].length > 0)?.key || "books"
}

function RecommendationSkeletonCard() {
  return (
    <article className="overflow-hidden bg-white border border-borderSoft rounded-xl animate-pulse min-h-[390px]">
      <div className="h-52 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-stone-200 rounded" />
        <div className="h-3 w-1/2 bg-stone-100 rounded" />
        <div className="h-3 w-full bg-stone-100 rounded" />
        <div className="h-3 w-4/5 bg-stone-100 rounded" />
        <div className="h-10 w-full border border-accent/30 rounded" />
      </div>
    </article>
  )
}

function RecommendationShowcaseCard({ item }) {
  const link = getDetailLink(item)
  const tags = Array.isArray(item?.tags) ? item.tags.slice(0, 3) : []
  const hasCover = Boolean(item?.coverUrl)

  return (
    <article className="overflow-hidden bg-white border border-borderSoft rounded-xl h-full min-h-[390px] flex flex-col">
      <div className="h-52 bg-stone-100 flex items-center justify-center overflow-hidden">
        {hasCover ? (
          <img
            src={item.coverUrl}
            alt={item?.title || "Recommandation"}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center px-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-inkMuted">Suggestion</p>
            <p className="mt-2 text-base font-semibold text-ink line-clamp-2">{item?.title || "Selection personnalisee"}</p>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-ink line-clamp-2">{item?.title || "Sans titre"}</h3>
        <p className="text-sm text-inkMuted mt-1 line-clamp-1">{item?.author || "Auteur inconnu"}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span key={`${item?.id}-${tag}`} className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-inkSoft">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-inkSoft">
              Sans tag
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-gold font-semibold">{scoreLabel(item?.score)}</p>

        <Link
          to={link}
          className="mt-auto w-full inline-flex justify-center items-center h-10 border border-accent text-accent text-sm font-semibold rounded hover:bg-accent hover:text-white transition-colors"
        >
          Voir le contenu
        </Link>
      </div>
    </article>
  )
}

export default function RecommendationsLanding() {
  const [activeSection, setActiveSection] = useState("books")
  const [items, setItems] = useState(() => readCachedRecommendations().recommendations)
  const [totalRecommendations, setTotalRecommendations] = useState(() => readCachedRecommendations().total)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadRecommendations = useCallback(async (limit = 12) => {
    setLoading(true)
    setError("")

    try {
      const response = await getRecommendations(limit)
      const recommendations = Array.isArray(response?.recommendations) ? response.recommendations : []
      const total = Number.isFinite(response?.total) ? response.total : recommendations.length
      setItems(recommendations)
      setTotalRecommendations(total)
      if (recommendations.length > 0) {
        const previewGrouped = {
          books: recommendations.filter((item) => ["livre", "book", "digitalbook", "digital-book"].includes(resolveItemType(item))),
          nonfiction: recommendations.filter((item) => looksLikeNonFiction(item)),
          podcasts: recommendations.filter((item) => resolveItemType(item) === "podcast"),
        }
        setActiveSection(getBestSectionKey(previewGrouped))
      }
      localStorage.setItem("latestRecommendations", JSON.stringify(response))
    } catch (err) {
      setError(err?.message || "Impossible de charger les recommandations pour le moment.")
      const fallback = readCachedRecommendations()
      if (fallback.recommendations.length > 0) {
        setItems(fallback.recommendations)
        setTotalRecommendations(fallback.total)
        const previewGrouped = {
          books: fallback.recommendations.filter((item) => ["livre", "book", "digitalbook", "digital-book"].includes(resolveItemType(item))),
          nonfiction: fallback.recommendations.filter((item) => looksLikeNonFiction(item)),
          podcasts: fallback.recommendations.filter((item) => resolveItemType(item) === "podcast"),
        }
        setActiveSection(getBestSectionKey(previewGrouped))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations])

  const grouped = useMemo(() => {
    const books = items.filter((item) => {
      const t = resolveItemType(item)
      return ["livre", "book", "digitalbook", "digital-book"].includes(t)
    })
    const podcasts = items.filter((item) => resolveItemType(item) === "podcast")
    const nonFiction = books.filter((item) => looksLikeNonFiction(item))

    const fallbackBooks = books.length > 0 ? books : items.filter((item) => !isPodcast(item?.type))
    const fallbackNonFiction = nonFiction.length > 0 ? nonFiction : fallbackBooks

    return {
      books: fallbackBooks.slice(0, 6),
      nonfiction: fallbackNonFiction.slice(0, 6),
      podcasts: podcasts.slice(0, 6),
    }
  }, [items])

  const activeItems = grouped[activeSection] || []

  useEffect(() => {
    if (activeItems.length === 0) {
      const bestSection = getBestSectionKey(grouped)
      if (bestSection !== activeSection) {
        setActiveSection(bestSection)
      }
    }
  }, [activeItems.length, activeSection, grouped])

  const activeSectionLabel = SECTIONS.find((section) => section.key === activeSection)?.label || "Recommandations"

  return (
    <div className="px-6 py-8 lg:px-10 min-h-screen bg-paper">
      <div className="w-full max-w-none">
        <header className="mb-7">
          <p className="text-xs uppercase tracking-[0.18em] text-inkMuted">Recommandations personnalisees</p>
          <h1 className="text-3xl lg:text-4xl font-semibold text-ink mt-2">Ce qui pourrait te plaire</h1>
          <p className="text-sm text-inkMuted mt-2">Une selection vivante construite a partir de ton profil de lecture.</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                {totalRecommendations} recommandations disponibles — {activeItems.length} dans cette section
              </span>
              {totalRecommendations > items.length && (
                <button
                  type="button"
                  onClick={() => loadRecommendations(totalRecommendations)}
                  className="px-3 py-1 rounded-full bg-white border border-borderSoft text-inkMuted font-semibold hover:bg-white/90"
                >
                  Afficher tout ({totalRecommendations - items.length} restants)
                </button>
              )}
            <span className="px-3 py-1 rounded-full bg-stone-200 text-inkSoft font-semibold">
              Section active: {activeSectionLabel}
            </span>
          </div>
        </header>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                activeSection === section.key
                  ? "bg-accent text-white"
                  : "bg-white border border-borderSoft text-inkMuted hover:text-ink"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 border-l-4 border-red-500 rounded bg-red-50 text-red-700">
            <p className="font-medium">{error}</p>
            <button
              type="button"
              onClick={loadRecommendations}
              className="mt-2 text-xs px-3 py-1.5 rounded bg-white border border-red-300 text-red-700 hover:bg-red-100 transition"
            >
              Reessayer
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <RecommendationSkeletonCard key={`skeleton-${idx}`} />
            ))}
          </div>
        ) : activeItems.length === 0 ? (
          <div className="p-5 rounded-lg border border-dashed border-borderSoft bg-white text-center">
            <p className="font-semibold text-ink">Aucune recommandation a afficher sur cette section.</p>
            <p className="text-sm text-inkMuted mt-1">
              Completez votre profil ou rechargez la page dans quelques instants.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
            {activeItems.map((item) => (
              <RecommendationShowcaseCard
                key={`${item?.type || "item"}-${item?.id || item?.title}`}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
