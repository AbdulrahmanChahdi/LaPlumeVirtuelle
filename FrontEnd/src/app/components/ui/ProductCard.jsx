import Card from "./Card"

export default function ProductCard({
  title,
  subtitle,
  imageUrl,
  onClick,
  role = "article",
  ariaLabel,
}) {
  return (
    <Card 
      as={onClick ? "button" : "article"}
      role={onClick ? undefined : role}
      onClick={onClick}
      className={onClick ? "cursor-pointer hover:shadow-lg transition text-left w-full" : ""}
      aria-label={ariaLabel || title}
    >
      
      <div className="h-40 sm:h-48 bg-paperSoft rounded mb-4 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Couverture de ${title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-inkMuted text-sm">
            Image à venir
          </div>
        )}
      </div>

      <h4 className="font-semibold text-sm sm:text-base">{title}</h4>

      {subtitle && (
        <p className="text-xs sm:text-sm text-inkMuted mt-1">
          {subtitle}
        </p>
      )}
    </Card>
  )
}
