import Card from "../../components/ui/Card"
import { Link } from "react-router-dom"

export default function MediaSection() {
  const items = [
    {
      title: "Livres numériques",
      description: "Accédez à notre collection de livres numériques.",
      icon: "📘",
      link: "/library/digital-books",
    },
    {
      title: "Livres audio",
      description: "Écoutez vos livres préférés partout.",
      icon: "🎧",
      link: "/library/audiobooks",
    },
    {
      title: "Podcasts",
      description: "Découvrez nos podcasts culturels.",
      icon: "🎙️",
      link: "/library/podcasts",
    },
  ]

  return (
    <section className="bg-paperSoft py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {items.map((item) => (
            <Link key={item.title} to={item.link}>
              <Card className="group cursor-pointer text-center">
                
                {/* Placeholder visuel */}
                <div className="h-28 bg-paperSoft rounded mb-6 flex items-center justify-center">
                  <span className="text-4xl opacity-60 group-hover:text-accent transition">
                    {item.icon}
                  </span>
                </div>

                {/* Titre */}
                <h2 className="font-semibold text-lg mb-2 group-hover:text-accent transition">
                  {item.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-inkSoft">
                  {item.description}
                </p>

              </Card>
            </Link>
          ))}

        </div>
      </div>
    </section>
  )
}
