import { useEffect, useState } from "react"

export default function BooksPublic() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8080/api/livres")
      .then((res) => res.json())
      .then((data) => {
        setBooks(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setBooks([])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Livres Numériques</h1>
      <p className="text-inkSoft mb-8">Connectez-vous pour accéder à notre sélection complète de livres.</p>

      {loading ? (
        <p>Chargement...</p>
      ) : books.length === 0 ? (
        <p className="text-inkSoft">Aucun livre disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">{book.titre}</h3>
              <p className="text-sm text-inkSoft mb-4">{book.auteur?.nom}</p>
              <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
