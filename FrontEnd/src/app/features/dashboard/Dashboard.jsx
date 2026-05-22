import { useCallback, useEffect, useState } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getUserLivres } from "../../api/livresApi"
import { getAudiobooks } from "../../api/audiobooksApi"
import { getPodcasts } from "../../api/podcastsApi"
import { getRecommendations } from "../../api/profileRecommendationsApi"
import RecommendationCard from "../../components/RecommendationCard"

const TABS = ["Mes favoris", "Historique", "Recommandations"]
const TAB_KEYS = ["favorites", "history", "recommendations"]

function resolveTabIndex(tab) {
  const index = TAB_KEYS.indexOf(tab)
  return index >= 0 ? index : 0
}

function readCachedRecommendations() {
  try {
    const cached = localStorage.getItem("latestRecommendations")
    if (!cached) return []

    const parsed = JSON.parse(cached)
    return Array.isArray(parsed?.recommendations) ? parsed.recommendations : []
  } catch {
    return []
  }
}

function MediaCard({ tag }) {
  const tagColors = {
    ROMAN: "bg-stone-100 text-stone-600",
    PODCAST: "bg-emerald-50 text-emerald-700",
    AUDIO: "bg-blue-50 text-blue-700",
    HISTOIRE: "bg-amber-50 text-amber-700",
  }
  return (
    <div className="bg-white rounded-lg border border-borderSoft overflow-hidden">
      <div className="h-36 bg-stone-200" />
      <div className="p-3">
        <div className="h-3 bg-stone-200 rounded w-3/4 mb-1.5" />
        <div className="h-2.5 bg-stone-100 rounded w-1/2 mb-3" />
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColors[tag] || "bg-stone-100 text-stone-600"}`}>
            {tag}
          </span>
          <button
            className="text-xs text-white px-3 py-1 rounded transition"
            style={{ backgroundColor: "#2F5D50" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#244A40"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2F5D50"}
          >
            Voir
          </button>
        </div>
      </div>
    </div>
  )
}

function AddCard() {
  return (
    <div className="bg-paper rounded-lg border border-dashed border-borderSoft flex flex-col items-center justify-center gap-2 min-h-[180px] cursor-pointer hover:border-accent transition group">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition"
        style={{ backgroundColor: "#2F5D50" }}
      >
        +
      </div>
      <span className="text-xs text-inkMuted group-hover:text-inkSoft transition">Ajouter un favori</span>
    </div>
  )
}

export default function Dashboard() {
  const { user, token } = useAuth()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromQuery = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(() => resolveTabIndex(tabFromQuery))
  const [stats, setStats] = useState({ booksCount: 0, audiobooksCount: 0, podcastsCount: 0 })
  const [recommendations, setRecommendations] = useState(() => readCachedRecommendations())
  const [recommendationsLoading, setRecommendationsLoading] = useState(false)
  const [recommendationsError, setRecommendationsError] = useState("")
  const [favoriteIds, setFavoriteIds] = useState([])

  useEffect(() => {
    setActiveTab(resolveTabIndex(tabFromQuery))
  }, [tabFromQuery])

  useEffect(() => {
    if (!token) return
    Promise.allSettled([getUserLivres(token), getAudiobooks(token), getPodcasts(token)])
      .then(([books, audiobooks, podcasts]) => {
        setStats({
          booksCount: books.status === "fulfilled" && Array.isArray(books.value) ? books.value.length : 0,
          audiobooksCount: audiobooks.status === "fulfilled" && Array.isArray(audiobooks.value) ? audiobooks.value.length : 0,
          podcastsCount: podcasts.status === "fulfilled" && Array.isArray(podcasts.value) ? podcasts.value.length : 0,
        })
      })
  }, [token, location.key])

  const loadRecommendations = useCallback(async () => {
    if (!token) return

    setRecommendationsLoading(true)
    setRecommendationsError("")

    try {
      const response = await getRecommendations(12)
      const items = Array.isArray(response?.recommendations) ? response.recommendations : []

      setRecommendations(items)
      localStorage.setItem("latestRecommendations", JSON.stringify(response))
    } catch (err) {
      console.error("Erreur chargement recommandations:", err)
      setRecommendationsError(err?.message || "Impossible de charger les recommandations pour le moment.")

      try {
        const cached = localStorage.getItem("latestRecommendations")
        if (cached) {
          const parsed = JSON.parse(cached)
          const items = Array.isArray(parsed?.recommendations) ? parsed.recommendations : []
          if (items.length > 0) {
            setRecommendations(items)
          }
        }
      } catch {
        // Ignore local cache parsing errors and keep API error state.
      }
    } finally {
      setRecommendationsLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations, location.key])

  const toggleFavorite = useCallback((item) => {
    if (!item?.id) return

    setFavoriteIds((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id)
      }
      return [...prev, item.id]
    })
  }, [])

  const recommendationItems = recommendations.map((item) => ({
    ...item,
    favorite: favoriteIds.includes(item.id),
  }))

  const handleTabChange = useCallback((index) => {
    setActiveTab(index)

    const tabKey = TAB_KEYS[index]
    if (!tabKey || tabKey === "favorites") {
      setSearchParams({}, { replace: true })
      return
    }

    setSearchParams({ tab: tabKey }, { replace: true })
  }, [setSearchParams])

  const DEMO_CARDS = [
    { tag: "ROMAN" }, { tag: "PODCAST" }, { tag: "AUDIO" },
    { tag: "ROMAN" }, { tag: "HISTOIRE" },
  ]

  return (
    <div className="px-6 py-8 lg:px-10">

        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink">
              Bienvenue{user?.nom ? `, ${user.nom.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-inkSoft mt-0.5">Votre espace personnel</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-inkMuted">{stats.booksCount + stats.audiobooksCount + stats.podcastsCount} éléments</span>
            <button className="text-sm border border-borderSoft rounded px-3 py-1.5 text-inkSoft hover:border-accent hover:text-ink transition">
              Filtrer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-borderSoft mb-6 gap-8">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => handleTabChange(i)}
              className={`pb-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeTab === i
                  ? "text-ink border-b-2 border-ink -mb-px"
                  : "text-inkMuted hover:text-inkSoft"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 2 ? (
          <div className="space-y-4">
            {recommendationsLoading && (
              <div className="p-4 border rounded-lg bg-stone-50 border-borderSoft text-inkSoft text-sm">
                Chargement des recommandations en cours...
              </div>
            )}

            {recommendationsError && (
              <div className="p-4 border-l-4 rounded bg-red-50 border-red-500 text-red-700">
                <p className="font-medium">{recommendationsError}</p>
                <button
                  type="button"
                  onClick={loadRecommendations}
                  className="mt-2 text-xs px-3 py-1.5 rounded bg-white border border-red-300 text-red-700 hover:bg-red-100 transition"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!recommendationsLoading && recommendationItems.length === 0 && (
              <div className="p-5 rounded-lg border border-dashed border-borderSoft bg-paper text-center">
                <p className="font-semibold text-ink">Aucune recommandation disponible pour le moment.</p>
                <p className="text-sm text-inkMuted mt-1">
                  Complétez votre onboarding ou réessayez dans quelques instants.
                </p>
              </div>
            )}

            {recommendationItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {recommendationItems.map((item) => (
                  <RecommendationCard
                    key={`${item.type || "item"}-${item.id || item.title}`}
                    item={item}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_CARDS.map((card, i) => (
              <MediaCard key={i} tag={card.tag} />
            ))}
            <AddCard />
          </div>
        )}
    </div>
  )
}
