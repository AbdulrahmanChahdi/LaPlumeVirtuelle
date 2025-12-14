import Card from "../../components/ui/Card"

export default function RecommendationGroup({ title, items, icon, type }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-accent">{icon}</span>
        {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="text-center cursor-pointer">
            <div className="h-40 bg-paperSoft rounded mb-4 overflow-hidden">
              <img
                src={item.couvertureUrl}
                alt={item.titre}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="font-semibold">{item.titre}</p>

            <p className="text-sm text-inkMuted">
              {type === "podcast" ? item.animateur : item.auteur}
            </p>

            <p className="text-xs text-gold mt-2">
              {type === "livre" && `${item.nombreLectures} lectures`}
              {type === "audio" && `${item.nombreEcoutes} écoutes`}
              {type === "podcast" && `${item.nombreTelechargements} téléchargements`}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
