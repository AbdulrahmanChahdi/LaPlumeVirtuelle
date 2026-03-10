import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import {
  deleteAdminAudiobook,
  deleteAdminDigitalBook,
  deleteAdminPodcast,
  deleteAdminUser,
  getAdminAudiobooks,
  getAdminAuthors,
  getAdminCategories,
  getAdminDigitalBooks,
  getAdminPodcasts,
  getAdminUsers,
  saveAdminAudiobook,
  saveAdminDigitalBook,
  saveAdminUser,
  saveAdminPodcast
} from "../../api/adminApi"

const emptyUser = {
  id: null,
  nom: "",
  adresseMail: "",
  motDePasse: "",
  adressePostal: "",
  tel: "",
  role: "USER"
}

const emptyBook = {
  id: null,
  disponible: true,
  nombreDePage: 0,
  auteurId: "",
  categorieId: "",
  titre: "",
  imageUrl: "",
  resume: "",
  anneeEdition: "",
  langue: ""
}

const emptyAudiobook = {
  id: null,
  titre: "",
  duree: "",
  narrateur: "",
  audioUrl: "",
  livreId: ""
}

const emptyPodcast = {
  id: null,
  nom: "",
  duree: 0,
  theme: "",
  animateur: "",
  imageUrl: ""
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const isAdmin = user?.role === "ADMIN"

  const [tab, setTab] = useState("users")
  const [error, setError] = useState("")
  const [isBusy, setIsBusy] = useState(false)

  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [audiobooks, setAudiobooks] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])

  const [bookForm, setBookForm] = useState(emptyBook)
  const [audiobookForm, setAudiobookForm] = useState(emptyAudiobook)
  const [podcastForm, setPodcastForm] = useState(emptyPodcast)
  const [userForm, setUserForm] = useState(emptyUser)

  const editingBook = useMemo(() => Boolean(bookForm.id), [bookForm.id])
  const editingAudiobook = useMemo(() => Boolean(audiobookForm.id), [audiobookForm.id])
  const editingPodcast = useMemo(() => Boolean(podcastForm.id), [podcastForm.id])
  const editingUser = useMemo(() => Boolean(userForm.id), [userForm.id])

  useEffect(() => {
    if (!loading && isAdmin) {
      loadAll()
    }
  }, [loading, isAdmin])

  function toArray(value) {
    if (Array.isArray(value)) return value

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) return parsed
      } catch {
        return []
      }
    }

    if (value && typeof value === "object") {
      if (Array.isArray(value.content)) return value.content
      if (Array.isArray(value.data)) return value.data
      if (Array.isArray(value.items)) return value.items
    }

    return []
  }

  async function loadAll() {
    setIsBusy(true)
    setError("")
    try {
      const [usersData, booksData, audiobooksData, podcastsData, categoriesData, authorsData] = await Promise.allSettled([
        getAdminUsers(),
        getAdminDigitalBooks(),
        getAdminAudiobooks(),
        getAdminPodcasts(),
        getAdminCategories(),
        getAdminAuthors()
      ])

      setUsers(usersData.status === "fulfilled" ? toArray(usersData.value) : [])
      setBooks(booksData.status === "fulfilled" ? toArray(booksData.value) : [])
      setAudiobooks(audiobooksData.status === "fulfilled" ? toArray(audiobooksData.value) : [])
      setPodcasts(podcastsData.status === "fulfilled" ? toArray(podcastsData.value) : [])
      setCategories(categoriesData.status === "fulfilled" ? toArray(categoriesData.value) : [])
      setAuthors(authorsData.status === "fulfilled" ? toArray(authorsData.value) : [])

      const endpointNames = ["utilisateurs", "livres", "livres-audio", "podcasts", "categories", "auteurs"]
      const failures = [usersData, booksData, audiobooksData, podcastsData, categoriesData, authorsData]
        .map((result, index) => ({ result, endpoint: endpointNames[index] }))
        .filter(({ result }) => result.status === "rejected")

      if (failures.length > 0) {
        const failedEndpoints = failures.map((f) => f.endpoint).join(", ")
        setError(`Certaines données admin n'ont pas pu être chargées (${failedEndpoints}). Vérifiez le backend et vos droits ADMIN.`)
      }
    } catch (err) {
      setError(err?.message || "Erreur de chargement des données admin")
    } finally {
      setIsBusy(false)
    }
  }

  function resetForms() {
    setBookForm(emptyBook)
    setAudiobookForm(emptyAudiobook)
    setPodcastForm(emptyPodcast)
    setUserForm(emptyUser)
  }

  async function handleSaveUser(e) {
    e.preventDefault()
    setIsBusy(true)
    setError("")
    try {
      const payload = { ...userForm }

      if (editingUser && !payload.motDePasse) {
        delete payload.motDePasse
      }

      await saveAdminUser(payload)
      await loadAll()
      setUserForm(emptyUser)
    } catch (err) {
      setError(err?.message || "Impossible d'enregistrer l'utilisateur")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Supprimer cet utilisateur ?")) return
    if (user?.id === id) {
      setError("Vous ne pouvez pas supprimer votre propre compte administrateur.")
      return
    }

    setIsBusy(true)
    setError("")
    try {
      await deleteAdminUser(id)
      await loadAll()
    } catch (err) {
      setError(err?.message || "Impossible de supprimer l'utilisateur")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleSaveBook(e) {
    e.preventDefault()
    setIsBusy(true)
    setError("")
    try {
      const categorieId = Number(bookForm.categorieId)
      const auteurId = Number(bookForm.auteurId)

      if (!auteurId || !categorieId) {
        throw new Error("AUTEUR_ID et CATEGORIE_ID sont obligatoires.")
      }

      await saveAdminDigitalBook({
        id: bookForm.id,
        disponible: Boolean(bookForm.disponible),
        nombreDePage: Number(bookForm.nombreDePage) || 0,
        auteur: { id: auteurId },
        categorie: { id: categorieId },
        titre: bookForm.titre,
        imageUrl: bookForm.imageUrl,
        resume: bookForm.resume,
        anneeEdition: bookForm.anneeEdition,
        langue: bookForm.langue
      })
      await loadAll()
      setBookForm(emptyBook)
    } catch (err) {
      setError(err?.message || "Impossible d'enregistrer le livre")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleDeleteBook(id) {
    if (!window.confirm("Supprimer ce livre ?")) return
    setIsBusy(true)
    setError("")
    try {
      await deleteAdminDigitalBook(id)
      await loadAll()
    } catch (err) {
      setError(err?.message || "Impossible de supprimer le livre")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleSaveAudiobook(e) {
    e.preventDefault()
    setIsBusy(true)
    setError("")
    try {
      const livreId = Number(audiobookForm.livreId)

      if (!livreId) {
        throw new Error("Vous devez choisir le livre associé.")
      }

      await saveAdminAudiobook({
        id: audiobookForm.id,
        titre: audiobookForm.titre,
        duree: audiobookForm.duree,
        narrateur: audiobookForm.narrateur,
        audioUrl: audiobookForm.audioUrl,
        livre: { id: livreId }
      })
      await loadAll()
      setAudiobookForm(emptyAudiobook)
    } catch (err) {
      setError(err?.message || "Impossible d'enregistrer le livre audio")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleDeleteAudiobook(id) {
    if (!window.confirm("Supprimer ce livre audio ?")) return
    setIsBusy(true)
    setError("")
    try {
      await deleteAdminAudiobook(id)
      await loadAll()
    } catch (err) {
      setError(err?.message || "Impossible de supprimer le livre audio")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleSavePodcast(e) {
    e.preventDefault()
    setIsBusy(true)
    setError("")
    try {
      await saveAdminPodcast({
        ...podcastForm,
        duree: Number(podcastForm.duree) || 0
      })
      await loadAll()
      setPodcastForm(emptyPodcast)
    } catch (err) {
      setError(err?.message || "Impossible d'enregistrer le podcast")
    } finally {
      setIsBusy(false)
    }
  }

  async function handleDeletePodcast(id) {
    if (!window.confirm("Supprimer ce podcast ?")) return
    setIsBusy(true)
    setError("")
    try {
      await deleteAdminPodcast(id)
      await loadAll()
    } catch (err) {
      setError(err?.message || "Impossible de supprimer le podcast")
    } finally {
      setIsBusy(false)
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ink">Administration</h1>
            <p className="text-inkSoft">Gestion des utilisateurs et du catalogue</p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForms()
              loadAll()
            }}
            className="px-4 py-2 rounded bg-accent text-white hover:opacity-90"
          >
            Rafraîchir
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button type="button" onClick={() => setTab("users")} className={`px-3 py-2 rounded ${tab === "users" ? "bg-accent text-white" : "bg-white"}`}>Utilisateurs</button>
          <button type="button" onClick={() => setTab("books")} className={`px-3 py-2 rounded ${tab === "books" ? "bg-accent text-white" : "bg-white"}`}>Livres numériques</button>
          <button type="button" onClick={() => setTab("audiobooks")} className={`px-3 py-2 rounded ${tab === "audiobooks" ? "bg-accent text-white" : "bg-white"}`}>Livres audio</button>
          <button type="button" onClick={() => setTab("podcasts")} className={`px-3 py-2 rounded ${tab === "podcasts" ? "bg-accent text-white" : "bg-white"}`}>Podcasts</button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {tab === "users" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleSaveUser} className="bg-white rounded-lg border border-borderSoft p-4 space-y-3">
              <h2 className="font-semibold">{editingUser ? "Modifier" : "Ajouter"} un utilisateur</h2>
              <input className="w-full border rounded p-2" placeholder="Nom" value={userForm.nom} onChange={(e) => setUserForm((p) => ({ ...p, nom: e.target.value }))} required />
              <input className="w-full border rounded p-2" type="email" placeholder="Adresse mail" value={userForm.adresseMail} onChange={(e) => setUserForm((p) => ({ ...p, adresseMail: e.target.value }))} required />
              <input className="w-full border rounded p-2" type="password" placeholder={editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"} value={userForm.motDePasse} onChange={(e) => setUserForm((p) => ({ ...p, motDePasse: e.target.value }))} required={!editingUser} />
              <input className="w-full border rounded p-2" placeholder="Adresse postale" value={userForm.adressePostal} onChange={(e) => setUserForm((p) => ({ ...p, adressePostal: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="Téléphone" value={userForm.tel} onChange={(e) => setUserForm((p) => ({ ...p, tel: e.target.value }))} />
              <select className="w-full border rounded p-2" value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" disabled={isBusy} className="px-4 py-2 rounded bg-accent text-white">{editingUser ? "Enregistrer" : "Ajouter"}</button>
                {editingUser && <button type="button" onClick={() => setUserForm(emptyUser)} className="px-4 py-2 rounded bg-gray-100">Annuler</button>}
              </div>
            </form>

            <div className="bg-white rounded-lg border border-borderSoft overflow-hidden">
              <div className="px-4 py-3 border-b border-borderSoft font-semibold">Utilisateurs inscrits ({users.length})</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-paperSoft text-left">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Nom</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Rôle</th>
                      <th className="p-3">Téléphone</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-borderSoft">
                        <td className="p-3">{u.id}</td>
                        <td className="p-3">{u.nom || "-"}</td>
                        <td className="p-3">{u.adresseMail || "-"}</td>
                        <td className="p-3">{u.role || "USER"}</td>
                        <td className="p-3">{u.tel || "-"}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setUserForm({ ...emptyUser, ...u, motDePasse: "" })}
                              className="px-3 py-1 text-sm rounded bg-gray-100"
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1 text-sm rounded bg-red-100 text-red-700"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "books" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleSaveBook} className="bg-white rounded-lg border border-borderSoft p-4 space-y-3">
              <h2 className="font-semibold">{editingBook ? "Modifier" : "Ajouter"} un livre numérique</h2>
              <input className="w-full border rounded p-2 bg-gray-50" value={bookForm.id || "Auto"} readOnly aria-label="ID" />
              <input className="w-full border rounded p-2" placeholder="TITRE" value={bookForm.titre} onChange={(e) => setBookForm((p) => ({ ...p, titre: e.target.value }))} required />
              <input className="w-full border rounded p-2" placeholder="ANNEE_EDITION" value={bookForm.anneeEdition} onChange={(e) => setBookForm((p) => ({ ...p, anneeEdition: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="LANGUE" value={bookForm.langue} onChange={(e) => setBookForm((p) => ({ ...p, langue: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="IMAGE_URL" value={bookForm.imageUrl} onChange={(e) => setBookForm((p) => ({ ...p, imageUrl: e.target.value }))} />
              <textarea className="w-full border rounded p-2" rows="4" placeholder="RESUME" value={bookForm.resume} onChange={(e) => setBookForm((p) => ({ ...p, resume: e.target.value }))} />
              <select className="w-full border rounded p-2" value={bookForm.auteurId} onChange={(e) => setBookForm((p) => ({ ...p, auteurId: e.target.value }))} required>
                <option value="">Choisir un auteur</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.id} - {a.nom}</option>
                ))}
              </select>
              <select className="w-full border rounded p-2" value={bookForm.categorieId} onChange={(e) => setBookForm((p) => ({ ...p, categorieId: e.target.value }))} required>
                <option value="">Choisir une catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.id} - {c.nom}</option>
                ))}
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bookForm.disponible} onChange={(e) => setBookForm((p) => ({ ...p, disponible: e.target.checked }))} />
                DISPONIBLE
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={isBusy} className="px-4 py-2 rounded bg-accent text-white">{editingBook ? "Enregistrer" : "Ajouter"}</button>
                {editingBook && <button type="button" onClick={() => setBookForm(emptyBook)} className="px-4 py-2 rounded bg-gray-100">Annuler</button>}
              </div>
            </form>

            <div className="bg-white rounded-lg border border-borderSoft overflow-hidden">
              <div className="px-4 py-3 border-b border-borderSoft font-semibold">Liste des livres ({books.length})</div>
              <div className="max-h-[420px] overflow-auto">
                {books.map((b) => (
                  <div key={b.id} className="p-3 border-b border-borderSoft flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{b.titre}</p>
                      <p className="text-xs text-inkMuted">ID: {b.id} | {b.anneeEdition || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBookForm({
                          ...emptyBook,
                          ...b,
                          auteurId: b?.auteur?.id || "",
                          categorieId: b?.categorie?.id || ""
                        })}
                        className="px-3 py-1 text-sm rounded bg-gray-100"
                      >
                        Modifier
                      </button>
                      <button type="button" onClick={() => handleDeleteBook(b.id)} className="px-3 py-1 text-sm rounded bg-red-100 text-red-700">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "audiobooks" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleSaveAudiobook} className="bg-white rounded-lg border border-borderSoft p-4 space-y-3">
              <h2 className="font-semibold">{editingAudiobook ? "Modifier" : "Ajouter"} un livre audio</h2>
              <input className="w-full border rounded p-2 bg-gray-50" value={audiobookForm.id || "Auto"} readOnly aria-label="ID" />
              <select className="w-full border rounded p-2" value={audiobookForm.livreId} onChange={(e) => setAudiobookForm((p) => ({ ...p, livreId: e.target.value }))} required aria-label="LIVRE_ID">
                <option value="">LIVRE_ID - Choisir le livre associé</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>{b.id} - {b.titre}</option>
                ))}
              </select>
              <input className="w-full border rounded p-2" placeholder="AUDIO_URL" value={audiobookForm.audioUrl} onChange={(e) => setAudiobookForm((p) => ({ ...p, audioUrl: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="DUREE" value={audiobookForm.duree} onChange={(e) => setAudiobookForm((p) => ({ ...p, duree: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="NARRATEUR" value={audiobookForm.narrateur} onChange={(e) => setAudiobookForm((p) => ({ ...p, narrateur: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="TITRE" value={audiobookForm.titre} onChange={(e) => setAudiobookForm((p) => ({ ...p, titre: e.target.value }))} required />
              <div className="flex gap-2">
                <button type="submit" disabled={isBusy} className="px-4 py-2 rounded bg-accent text-white">{editingAudiobook ? "Enregistrer" : "Ajouter"}</button>
                {editingAudiobook && <button type="button" onClick={() => setAudiobookForm(emptyAudiobook)} className="px-4 py-2 rounded bg-gray-100">Annuler</button>}
              </div>
            </form>

            <div className="bg-white rounded-lg border border-borderSoft overflow-hidden">
              <div className="px-4 py-3 border-b border-borderSoft font-semibold">Liste des livres audio ({audiobooks.length})</div>
              <div className="max-h-[420px] overflow-auto">
                {audiobooks.map((a) => (
                  <div key={a.id} className="p-3 border-b border-borderSoft flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{a.titre}</p>
                      <p className="text-xs text-inkMuted">ID: {a.id} | Durée: {a.duree || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAudiobookForm({ ...emptyAudiobook, ...a, livreId: a?.livre?.id || "" })} className="px-3 py-1 text-sm rounded bg-gray-100">Modifier</button>
                      <button type="button" onClick={() => handleDeleteAudiobook(a.id)} className="px-3 py-1 text-sm rounded bg-red-100 text-red-700">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "podcasts" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleSavePodcast} className="bg-white rounded-lg border border-borderSoft p-4 space-y-3">
              <h2 className="font-semibold">{editingPodcast ? "Modifier" : "Ajouter"} un podcast</h2>
              <input className="w-full border rounded p-2" placeholder="Nom" value={podcastForm.nom} onChange={(e) => setPodcastForm((p) => ({ ...p, nom: e.target.value }))} required />
              <input className="w-full border rounded p-2" type="number" min="0" placeholder="Durée (secondes)" value={podcastForm.duree} onChange={(e) => setPodcastForm((p) => ({ ...p, duree: e.target.value }))} />
              <select className="w-full border rounded p-2" value={podcastForm.theme} onChange={(e) => setPodcastForm((p) => ({ ...p, theme: e.target.value }))}>
                <option value="">Choisir un thème (catégorie)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.nom}>{c.nom}</option>
                ))}
              </select>
              <input className="w-full border rounded p-2" placeholder="Animateur" value={podcastForm.animateur} onChange={(e) => setPodcastForm((p) => ({ ...p, animateur: e.target.value }))} />
              <input className="w-full border rounded p-2" placeholder="Image URL" value={podcastForm.imageUrl} onChange={(e) => setPodcastForm((p) => ({ ...p, imageUrl: e.target.value }))} />
              <div className="flex gap-2">
                <button type="submit" disabled={isBusy} className="px-4 py-2 rounded bg-accent text-white">{editingPodcast ? "Enregistrer" : "Ajouter"}</button>
                {editingPodcast && <button type="button" onClick={() => setPodcastForm(emptyPodcast)} className="px-4 py-2 rounded bg-gray-100">Annuler</button>}
              </div>
            </form>

            <div className="bg-white rounded-lg border border-borderSoft overflow-hidden">
              <div className="px-4 py-3 border-b border-borderSoft font-semibold">Liste des podcasts ({podcasts.length})</div>
              <div className="max-h-[420px] overflow-auto">
                {podcasts.map((p) => (
                  <div key={p.id} className="p-3 border-b border-borderSoft flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{p.nom}</p>
                      <p className="text-xs text-inkMuted">ID: {p.id} | Thème: {p.theme || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setPodcastForm({ ...emptyPodcast, ...p })} className="px-3 py-1 text-sm rounded bg-gray-100">Modifier</button>
                      <button type="button" onClick={() => handleDeletePodcast(p.id)} className="px-3 py-1 text-sm rounded bg-red-100 text-red-700">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
