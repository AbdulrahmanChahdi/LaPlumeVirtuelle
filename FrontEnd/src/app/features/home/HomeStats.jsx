import Section from "../../components/layout/Section"
import StatCard from "./StatCard"

export default function HomeStats() {
  const stats = [
    {
      title: "Livre le plus lu",
      value: "📖 L’Odyssée",
      subtitle: "12 430 lectures",
    },
    {
      title: "Livre audio le plus écouté",
      value: "🎧 Les Misérables",
      subtitle: "8 210 écoutes",
    },
    {
      title: "Podcast le plus populaire",
      value: "🎙️ Histoire & Civilisations",
      subtitle: "5 980 téléchargements",
    },
  ]

  return (
    <Section title="Tendances actuelles">
      <div className="bg-paperSoft/60 border border-borderSoft rounded-2xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="region" aria-label="Tendances actuelles">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </Section>
  )
}
