import { Link } from "react-router-dom"

function getDetailLink(item) {
  const safeId = encodeURIComponent(item?.id || "")

  switch (item?.type) {
    case "livre":
      return `/library/detail/digital-books/${safeId}`
    case "livreAudio":
      return "/library/detail/audiobooks"
    case "podcast":
      return `/catalogue/podcasts/${safeId}`
    default:
      return "/catalogue"
  }
}

function getTypeLabel(type) {
  switch (type) {
    case "livre":
      return "Livre"
    case "livreAudio":
      return "Livre audio"
    case "podcast":
      return "Podcast"
    default:
      return "Contenu"
  }
}

export default function RecommendationCard({ item, onToggleFavorite }) {
  const detailLink = getDetailLink(item)
  const typeLabel = getTypeLabel(item?.type)
  const score = typeof item?.score === "number" ? Math.round(item.score * 100) : null
  const isFavorite = !!item?.favorite

  return (
    <article className="bg-white rounded-lg border border-borderSoft overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-44 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
        {item?.coverUrl ? (
          <img src={item.coverUrl} alt={item?.title || "Recommandation"} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="text-center px-4">
            <p className="text-xs uppercase tracking-wider text-inkMuted mb-2">{typeLabel}</p>
            <p className="text-sm font-semibold text-ink line-clamp-2">{item?.title || "Contenu recommandé"}</p>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink line-clamp-2">{item?.title || "Sans titre"}</h3>
            <p className="text-sm text-inkMuted">{item?.author || "Auteur inconnu"}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">
            {typeLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.isArray(item?.tags) && item.tags.length > 0 ? (
            item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-stone-100 text-inkSoft">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs px-2 py-1 rounded bg-stone-100 text-inkSoft">Sans tag</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs font-semibold text-gold">
            {score !== null ? `${score}% pertinence` : "Score indisponible"}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite?.(item)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                isFavorite
                  ? "bg-gold/20 border-gold text-amber-800"
                  : "bg-white border-borderSoft text-inkSoft hover:border-gold hover:text-amber-700"
              }`}
            >
              {isFavorite ? "Favori" : "Ajouter"}
            </button>
            <Link
              to={detailLink}
              className="text-xs px-3 py-1.5 rounded text-white bg-accent hover:bg-accentHover transition-colors"
            >
              Voir
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
