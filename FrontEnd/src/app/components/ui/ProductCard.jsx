import Card from "./Card"

export default function ProductCard({
  title,
  subtitle,
  imageUrl,
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition">
      
      <div className="h-40 bg-paperSoft rounded mb-4 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-inkMuted text-sm">
            Image à venir
          </div>
        )}
      </div>

      <h4 className="font-semibold text-sm">{title}</h4>

      {subtitle && (
        <p className="text-xs text-inkMuted mt-1">
          {subtitle}
        </p>
      )}
    </Card>
  )
}
