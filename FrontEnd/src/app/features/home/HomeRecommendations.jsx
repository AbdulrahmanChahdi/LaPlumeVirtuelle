import Section from "../../components/layout/Section"
import ProductCard from "../../components/ui/ProductCard"

export default function HomeRecommendations() {
  return (
    <Section
      title="Ce qui pourrait te plaire"
      subtitle="Suggestions basées sur les tendances actuelles"
    >
      <div className="space-y-12">

        <div>
          <h3 className="font-semibold mb-4">Livres numériques</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProductCard title="1984" subtitle="George Orwell" />
            <ProductCard title="Le Comte de Monte-Cristo" subtitle="Alexandre Dumas" />
            <ProductCard title="Candide" subtitle="Voltaire" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Livres audio</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProductCard title="Le Petit Prince" subtitle="Antoine de Saint-Exupéry" />
            <ProductCard title="Germinal" subtitle="Émile Zola" />
            <ProductCard title="Les Misérables" subtitle="Victor Hugo" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Podcasts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProductCard title="Histoire de France" />
            <ProductCard title="Sciences & Société" />
            <ProductCard title="Philosophie aujourd’hui" />
          </div>
        </div>

      </div>
    </Section>
  )
}
