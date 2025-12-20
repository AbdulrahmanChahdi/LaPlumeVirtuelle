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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to={booksLink}>
          <Card className="text-center hover:shadow-md transition">
            <div className="h-24 bg-paperSoft rounded mb-4" />
            <h3 className="font-semibold">Livres numériques</h3>
            <p className="text-sm text-inkSoft mt-2">
              Accédez à notre collection de livres numériques.
            </p>
          </Card>
        </Link>

        <Link to={audiobooksLink}>
          <Card className="text-center hover:shadow-md transition">
            <div className="h-24 bg-paperSoft rounded mb-4" />
            <h3 className="font-semibold">Livres audio</h3>
            <p className="text-sm text-inkSoft mt-2">
              Écoutez vos livres préférés partout.
            </p>
          </Card>
        </Link>

        <Link to={podcastsLink}>
          <Card className="text-center hover:shadow-md transition">
            <div className="h-24 bg-paperSoft rounded mb-4" />
            <h3 className="font-semibold">Podcasts</h3>
            <p className="text-sm text-inkSoft mt-2">
              Découvrez nos podcasts culturels.
            </p>
          </Card>
        </Link>
      </div>
    </Section>
  )
}
