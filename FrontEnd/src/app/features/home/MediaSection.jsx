import { Link } from "react-router-dom"
import Card from "../../components/ui/Card"
import Section from "../../components/layout/Section"

export default function MediaSection() {
  return (
    <Section
      title="Explorer la bibliothèque"
      subtitle="Choisissez votre format préféré"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/library/digital-books">
          <Card className="text-center hover:shadow-md transition">
            <div className="h-24 bg-paperSoft rounded mb-4" />
            <h3 className="font-semibold">Livres numériques</h3>
            <p className="text-sm text-inkSoft mt-2">
              Accédez à notre collection de livres numériques.
            </p>
          </Card>
        </Link>

        <Link to="/library/audiobooks">
          <Card className="text-center hover:shadow-md transition">
            <div className="h-24 bg-paperSoft rounded mb-4" />
            <h3 className="font-semibold">Livres audio</h3>
            <p className="text-sm text-inkSoft mt-2">
              Écoutez vos livres préférés partout.
            </p>
          </Card>
        </Link>

        <Link to="/library/podcasts">
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
