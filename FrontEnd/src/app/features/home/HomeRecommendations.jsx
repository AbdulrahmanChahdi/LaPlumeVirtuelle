import { useEffect, useState } from "react"
import { searchBooks } from "../../api/booksApi"
import Section from "../../components/layout/Section"
import BookCard from "../../components/BookCard"
import Loader from "../../components/ui/Loader"

export default function HomeRecommendations() {
  const [books, setBooks] = useState([])
  const [audiobooks, setAudiobooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true)
        
        // Charger livres populaires et best-sellers
        const [booksResults, audiobooksResults] = await Promise.all([
          searchBooks("bestseller fiction", 6),
          searchBooks("bestseller nonfiction", 6)
        ])
        
        setBooks(booksResults.slice(0, 3))
        setAudiobooks(audiobooksResults.slice(0, 3))
      } catch (err) {
        console.error("Erreur chargement recommandations:", err)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  if (loading) {
    return (
      <Section
        title="Ce qui pourrait te plaire"
        subtitle="Suggestions basées sur les tendances actuelles"
      >
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      </Section>
    )
  }

  return (
    <Section
      title="Ce qui pourrait te plaire"
      subtitle="Suggestions basées sur les tendances actuelles"
    >
      <div className="space-y-12">

        <div>
          <h3 className="font-semibold mb-4 text-ink">Livres tendances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.externalId} book={book} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-ink">Non-fiction populaire</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiobooks.map((book) => (
              <BookCard key={book.externalId} book={book} />
            ))}
          </div>
        </div>

      </div>
    </Section>
  )
}
