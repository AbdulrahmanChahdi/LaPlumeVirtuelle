import { useEffect, useState } from "react"

export default function AudiobooksPublic() {
  const [audiobooks, setAudiobooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8080/api/livres-audio")
      .then((res) => res.json())
      .then((data) => {
        setAudiobooks(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setAudiobooks([])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Livres Audio</h1>
      <p className="text-inkSoft mb-8">Connectez-vous pour accéder à notre sélection complète de livres audio.</p>

      {loading ? (
        <p>Chargement...</p>
      ) : audiobooks.length === 0 ? (
        <p className="text-inkSoft">Aucun livre audio disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiobooks.map((audio) => (
            <div key={audio.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">{audio.livre?.titre}</h3>
              <p className="text-sm text-inkSoft mb-4">{audio.livre?.auteur?.nom}</p>
              <p className="text-xs text-gray-500">Durée: {audio.duree} min</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
