import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getUserLivres } from "../../api/livresApi"
import { getAudiobooks } from "../../api/audiobooksApi"
import { getPodcasts } from "../../api/podcastsApi"

const TABS = ["Mes favoris", "Historique", "Recommandations"]

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
  const [activeTab, setActiveTab] = useState(0)
  const [stats, setStats] = useState({ booksCount: 0, audiobooksCount: 0, podcastsCount: 0 })

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
              onClick={() => setActiveTab(i)}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_CARDS.map((card, i) => (
            <MediaCard key={i} tag={card.tag} />
          ))}
          <AddCard />
        </div>
    </div>
  )
}
