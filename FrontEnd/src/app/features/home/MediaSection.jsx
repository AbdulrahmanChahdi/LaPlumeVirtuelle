import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Card from "../../components/ui/Card"
import Section from "../../components/layout/Section"

export default function MediaSection() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken")
      setIsConnected(!!token)
    } catch {}
  }, [])

  const booksLink = isConnected ? "/library/digital-books" : "/public/livres"
  const audiobooksLink = isConnected ? "/library/audiobooks" : "/public/audiobooks"
  const podcastsLink = isConnected ? "/library/podcasts" : "/public/podcasts"

  return (
    <Section
      title="Explorer la bibliothèque"
      subtitle="Choisissez votre format préféré"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link to={booksLink} className="group">
          <Card className="text-center hover:shadow-lg transition h-full cursor-pointer">
            <div className="h-24 sm:h-32 bg-paperSoft rounded mb-4 group-hover:bg-paperSoft/80 transition" aria-hidden="true" />
            <h3 className="font-semibold text-base sm:text-lg">Livres numériques</h3>
            <p className="text-sm text-inkSoft mt-2">
              Accédez à notre collection de livres numériques.
            </p>
          </Card>
        </Link>

        <Link to={audiobooksLink} className="group">
          <Card className="text-center hover:shadow-lg transition h-full cursor-pointer">
            <div className="h-24 sm:h-32 bg-paperSoft rounded mb-4 group-hover:bg-paperSoft/80 transition" aria-hidden="true" />
            <h3 className="font-semibold text-base sm:text-lg">Livres audio</h3>
            <p className="text-sm text-inkSoft mt-2">
              Écoutez vos livres préférés partout.
            </p>
          </Card>
        </Link>

        <Link to={podcastsLink} className="group">
          <Card className="text-center hover:shadow-lg transition h-full cursor-pointer">
            <div className="h-24 sm:h-32 bg-paperSoft rounded mb-4 group-hover:bg-paperSoft/80 transition" aria-hidden="true" />
            <h3 className="font-semibold text-base sm:text-lg">Podcasts</h3>
            <p className="text-sm text-inkSoft mt-2">
              Découvrez nos podcasts culturels.
            </p>
          </Card>
        </Link>
      </div>
    </Section>
  )
}
