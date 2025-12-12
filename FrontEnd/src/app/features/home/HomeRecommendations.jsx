import RecommendationGroup from "./RecommendationGroup"

import Livre from "../../models/livre"
import LivreAudio from "../../models/livreAudio"
import Podcast from "../../models/podcast"

export default function HomeRecommendations() {
  // Mock aligné BACKEND (remplacé plus tard par API / IA)
  const livres = [
    new Livre({
      id: 1,
      titre: "1984",
      auteur: "George Orwell",
      couvertureUrl: "/images/books/1984.jpg",
      nombreLectures: 12430,
    }),
    new Livre({
      id: 2,
      titre: "Le Comte de Monte-Cristo",
      auteur: "Alexandre Dumas",
      couvertureUrl: "/images/books/monte-cristo.jpg",
      nombreLectures: 10320,
    }),
    new Livre({
      id: 3,
      titre: "Candide",
      auteur: "Voltaire",
      couvertureUrl: "/images/books/candide.jpg",
      nombreLectures: 8920,
    }),
  ]

  const livresAudio = [
    new LivreAudio({
      id: 4,
      titre: "L’Étranger",
      auteur: "Albert Camus",
      couvertureUrl: "/images/audiobooks/letranger.jpg",
      nombreEcoutes: 8210,
    }),
    new LivreAudio({
      id: 5,
      titre: "Germinal",
      auteur: "Émile Zola",
      couvertureUrl: "/images/audiobooks/germinal.jpg",
      nombreEcoutes: 7540,
    }),
    new LivreAudio({
      id: 6,
      titre: "Notre-Dame de Paris",
      auteur: "Victor Hugo",
      couvertureUrl: "/images/audiobooks/notre-dame.jpg",
      nombreEcoutes: 6980,
    }),
  ]

  const podcasts = [
    new Podcast({
      id: 7,
      titre: "Le Cours de l’Histoire",
      animateur: "France Culture",
      couvertureUrl: "/images/podcasts/cours-histoire.jpg",
      nombreTelechargements: 5980,
    }),
    new Podcast({
      id: 8,
      titre: "Affaires sensibles",
      animateur: "France Inter",
      couvertureUrl: "/images/podcasts/affaires-sensibles.jpg",
      nombreTelechargements: 5620,
    }),
    new Podcast({
      id: 9,
      titre: "Concordance des temps",
      animateur: "Jean-Noël Jeanneney",
      couvertureUrl: "/images/podcasts/concordance.jpg",
      nombreTelechargements: 5310,
    }),
  ]

  return (
    <section className="bg-paperSoft py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-2xl font-bold text-center mb-12">
          Ce qui pourrait te plaire !
        </h2>

        <div className="space-y-16">

          <RecommendationGroup
            title="Livres numériques"
            icon="📘"
            items={livres}
            type="livre"
          />

          <RecommendationGroup
            title="Livres audio"
            icon="🎧"
            items={livresAudio}
            type="audio"
          />

          <RecommendationGroup
            title="Podcasts"
            icon="🎙️"
            items={podcasts}
            type="podcast"
          />

        </div>

      </div>
    </section>
  )
}
