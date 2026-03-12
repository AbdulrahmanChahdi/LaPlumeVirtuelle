import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  adminGetLivres, adminCreateLivre, adminUpdateLivre, adminDeleteLivre,
  adminGetLivresAudio, adminCreateLivreAudio, adminUpdateLivreAudio, adminDeleteLivreAudio,
  adminGetPodcasts, adminCreatePodcast, adminUpdatePodcast, adminDeletePodcast,
  adminGetCategories, adminGetAuteurs,
  adminGetUtilisateurs, adminCreateUtilisateur, adminUpdateUtilisateur, adminDeleteUtilisateur,
} from "../../api/adminApi"

// ─── Icônes ────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.071-6.071a2 2 0 012.828 2.828L11.828 13.828A2 2 0 0110 14H8v-2a2 2 0 01.586-1.414z" />
  </svg>
)
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
  </svg>
)
const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  const colors = type === "success"
    ? "bg-green-50 border-green-400 text-green-800"
    : "bg-red-50 border-red-400 text-red-800"
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md ${colors} max-w-sm`}>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose}><XIcon /></button>
    </div>
  )
}

// ─── Modal générique ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-ink transition-colors"><XIcon /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Boutons ─────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", className = "", type = "button" }) {
  const base = "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1"
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 focus:ring-accent",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

// ─── Field helper ────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", required = false, as }) {
  const cls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
  if (as === "textarea") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <textarea name={name} value={value || ""} onChange={onChange} rows={3} required={required} className={cls} />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input type={type} name={name} value={value || ""} onChange={onChange} required={required} className={cls} />
    </div>
  )
}

// ─── Confirm delete ──────────────────────────────────────────────────────────
function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <Modal title="Confirmer la suppression" onClose={onCancel}>
      <p className="text-gray-600 text-sm mb-6">
        Voulez-vous vraiment supprimer <strong className="text-ink">{name}</strong> ? Cette action est irréversible.
      </p>
      <div className="flex justify-end gap-3">
        <Btn variant="ghost" onClick={onCancel}>Annuler</Btn>
        <Btn variant="danger" onClick={onConfirm}><TrashIcon /> Supprimer</Btn>
      </div>
    </Modal>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION LIVRES
// ═══════════════════════════════════════════════════════════════════════════════
const LIVRE_EMPTY = {
  titre: "",
  anneeEdition: "",
  langue: "Français",
  resume: "",
  disponible: true,
  nombreDePage: 0,
  imageUrl: "",
  categorieId: "",
  auteurNom: "",
}

function LivresPanel({ notify }) {
  const [livres, setLivres] = useState([])
  const [categories, setCategories] = useState([])
  const [auteurs, setAuteurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(LIVRE_EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { setLivres(await adminGetLivres()) } catch { notify("Erreur lors du chargement des livres", "error") }
    finally { setLoading(false) }
  }, [notify])

  const loadMetadata = useCallback(async () => {
    try {
      const [cats, auths] = await Promise.all([adminGetCategories(), adminGetAuteurs()])
      setCategories(cats || [])
      setAuteurs(auths || [])
    } catch {
      notify("Erreur lors du chargement des catégories/auteurs", "error")
    }
  }, [notify])

  useEffect(() => {
    load()
    loadMetadata()
  }, [load, loadMetadata])

  const openCreate = () => { setForm(LIVRE_EMPTY); setModal({ type: "create" }) }
  const openEdit = (livre) => {
    setForm({
      ...livre,
      categorieId: livre?.categorie?.id || "",
      auteurNom: livre?.auteur?.nom || "",
    })
    setModal({ type: "edit", item: livre })
  }
  const openDelete = (livre) => setModal({ type: "delete", item: livre })
  const closeModal = () => setModal(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        nombreDePage: Number(form.nombreDePage) || 0,
        categorieId: form.categorieId ? Number(form.categorieId) : null,
        auteurNom: (form.auteurNom || "").trim() || null,
      }
      if (modal.type === "create") {
        await adminCreateLivre(payload)
        notify("Livre créé avec succès", "success")
      } else {
        await adminUpdateLivre(modal.item.id, payload)
        notify("Livre modifié avec succès", "success")
      }
      closeModal(); load()
    } catch (err) {
      notify(err.message || "Erreur", "error")
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await adminDeleteLivre(modal.item.id)
      notify("Livre supprimé", "success")
      closeModal(); load()
    } catch (err) { notify(err.message || "Erreur", "error") }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-ink">Livres <span className="ml-2 text-sm font-normal text-gray-400">({livres.length})</span></h2>
        <Btn onClick={openCreate}><PlusIcon /> Nouveau livre</Btn>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : livres.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun livre</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Année</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Langue</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Auteur</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Catégorie</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Pages</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Dispo</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {livres.map(l => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{l.id}</td>
                  <td className="px-4 py-3 font-medium text-ink max-w-xs truncate">{l.titre}</td>
                  <td className="px-4 py-3 text-gray-500">{l.anneeEdition}</td>
                  <td className="px-4 py-3 text-gray-500">{l.langue}</td>
                  <td className="px-4 py-3 text-gray-500">{l.auteur?.nom || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{l.categorie?.nom || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{l.nombreDePage}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {l.disponible ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Btn variant="ghost" onClick={() => openEdit(l)}><EditIcon /></Btn>
                      <Btn variant="danger" onClick={() => openDelete(l)}><TrashIcon /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.type === "delete" && (
        <ConfirmDelete name={modal.item.titre} onConfirm={handleDelete} onCancel={closeModal} />
      )}

      {(modal?.type === "create" || modal?.type === "edit") && (
        <Modal title={modal.type === "create" ? "Nouveau livre" : "Modifier le livre"} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Titre *" name="titre" value={form.titre} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Année d'édition" name="anneeEdition" value={form.anneeEdition} onChange={handleChange} />
              <Field label="Langue" name="langue" value={form.langue} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Catégorie</label>
                <select
                  name="categorieId"
                  value={form.categorieId || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Auteur</label>
                <input
                  name="auteurNom"
                  value={form.auteurNom || ""}
                  onChange={handleChange}
                  list="auteurs-list"
                  placeholder="Nom de l'auteur"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
                <datalist id="auteurs-list">
                  {auteurs.map(a => <option key={a.id} value={a.nom} />)}
                </datalist>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre de pages" name="nombreDePage" type="number" value={form.nombreDePage} onChange={handleChange} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Disponible</label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} className="w-4 h-4 accent-accent" />
                  <span className="text-sm text-gray-700">Oui</span>
                </label>
              </div>
            </div>
            <Field label="URL de l'image" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
            <Field label="Résumé" name="resume" value={form.resume} onChange={handleChange} as="textarea" />
            <div className="flex justify-end gap-3 pt-2">
              <Btn variant="ghost" onClick={closeModal}>Annuler</Btn>
              <Btn type="submit" variant="primary" className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Enregistrement..." : modal.type === "create" ? "Créer" : "Enregistrer"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION LIVRES AUDIO
// ═══════════════════════════════════════════════════════════════════════════════
const AUDIO_EMPTY = { titre: "", duree: "", narrateur: "", audioUrl: "", livreId: "" }

function LivresAudioPanel({ notify }) {
  const [items, setItems] = useState([])
  const [livres, setLivres] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(AUDIO_EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { setItems(await adminGetLivresAudio()) } catch { notify("Erreur lors du chargement des livres audio", "error") }
    finally { setLoading(false) }
  }, [notify])

  const loadLivres = useCallback(async () => {
    try {
      setLivres(await adminGetLivres())
    } catch {
      notify("Erreur lors du chargement des livres", "error")
    }
  }, [notify])

  useEffect(() => {
    load()
    loadLivres()
  }, [load, loadLivres])

  const openCreate = () => { setForm(AUDIO_EMPTY); setModal({ type: "create" }) }
  const openEdit = (item) => { setForm({ ...item, livreId: item?.livre?.id || "" }); setModal({ type: "edit", item }) }
  const openDelete = (item) => setModal({ type: "delete", item })
  const closeModal = () => setModal(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, livreId: form.livreId ? Number(form.livreId) : null }
      if (modal.type === "create") {
        await adminCreateLivreAudio(payload)
        notify("Livre audio créé avec succès", "success")
      } else {
        await adminUpdateLivreAudio(modal.item.id, payload)
        notify("Livre audio modifié avec succès", "success")
      }
      closeModal(); load()
    } catch (err) {
      notify(err.message || "Erreur", "error")
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await adminDeleteLivreAudio(modal.item.id)
      notify("Livre audio supprimé", "success")
      closeModal(); load()
    } catch (err) { notify(err.message || "Erreur", "error") }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-ink">Livres audio <span className="ml-2 text-sm font-normal text-gray-400">({items.length})</span></h2>
        <Btn onClick={openCreate}><PlusIcon /> Nouveau livre audio</Btn>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun livre audio</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Durée</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Narrateur</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Livre lié</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {items.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{a.id}</td>
                  <td className="px-4 py-3 font-medium text-ink max-w-xs truncate">{a.titre}</td>
                  <td className="px-4 py-3 text-gray-500">{a.duree}</td>
                  <td className="px-4 py-3 text-gray-500">{a.narrateur}</td>
                  <td className="px-4 py-3 text-gray-500">{a.livre?.titre || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Btn variant="ghost" onClick={() => openEdit(a)}><EditIcon /></Btn>
                      <Btn variant="danger" onClick={() => openDelete(a)}><TrashIcon /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.type === "delete" && (
        <ConfirmDelete name={modal.item.titre} onConfirm={handleDelete} onCancel={closeModal} />
      )}

      {(modal?.type === "create" || modal?.type === "edit") && (
        <Modal title={modal.type === "create" ? "Nouveau livre audio" : "Modifier le livre audio"} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Titre *" name="titre" value={form.titre} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durée (ex: 12h30)" name="duree" value={form.duree} onChange={handleChange} />
              <Field label="Narrateur" name="narrateur" value={form.narrateur} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Livre lié</label>
              <select
                name="livreId"
                value={form.livreId || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="">Sélectionner un livre</option>
                {livres.map(l => <option key={l.id} value={l.id}>{l.titre}</option>)}
              </select>
            </div>
            <Field label="URL du fichier audio" name="audioUrl" value={form.audioUrl} onChange={handleChange} />
            <div className="flex justify-end gap-3 pt-2">
              <Btn variant="ghost" onClick={closeModal}>Annuler</Btn>
              <Btn type="submit" variant="primary" className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Enregistrement..." : modal.type === "create" ? "Créer" : "Enregistrer"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION PODCASTS
// ═══════════════════════════════════════════════════════════════════════════════
const PODCAST_EMPTY = { nom: "", duree: 0, theme: "", animateur: "", imageUrl: "" }

function PodcastsPanel({ notify }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(PODCAST_EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { setItems(await adminGetPodcasts()) } catch { notify("Erreur lors du chargement des podcasts", "error") }
    finally { setLoading(false) }
  }, [notify])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(PODCAST_EMPTY); setModal({ type: "create" }) }
  const openEdit = (item) => { setForm({ ...item }); setModal({ type: "edit", item }) }
  const openDelete = (item) => setModal({ type: "delete", item })
  const closeModal = () => setModal(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, duree: Number(form.duree) || 0 }
      if (modal.type === "create") {
        await adminCreatePodcast(payload)
        notify("Podcast créé avec succès", "success")
      } else {
        await adminUpdatePodcast(modal.item.id, payload)
        notify("Podcast modifié avec succès", "success")
      }
      closeModal(); load()
    } catch (err) {
      notify(err.message || "Erreur", "error")
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await adminDeletePodcast(modal.item.id)
      notify("Podcast supprimé", "success")
      closeModal(); load()
    } catch (err) { notify(err.message || "Erreur", "error") }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-ink">Podcasts <span className="ml-2 text-sm font-normal text-gray-400">({items.length})</span></h2>
        <Btn onClick={openCreate}><PlusIcon /> Nouveau podcast</Btn>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun podcast</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nom</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Animateur</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Thème</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Durée (s)</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {items.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-ink max-w-xs truncate">{p.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{p.animateur}</td>
                  <td className="px-4 py-3 text-gray-500">{p.theme}</td>
                  <td className="px-4 py-3 text-gray-500">{p.duree}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Btn variant="ghost" onClick={() => openEdit(p)}><EditIcon /></Btn>
                      <Btn variant="danger" onClick={() => openDelete(p)}><TrashIcon /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.type === "delete" && (
        <ConfirmDelete name={modal.item.nom} onConfirm={handleDelete} onCancel={closeModal} />
      )}

      {(modal?.type === "create" || modal?.type === "edit") && (
        <Modal title={modal.type === "create" ? "Nouveau podcast" : "Modifier le podcast"} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nom *" name="nom" value={form.nom} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Animateur" name="animateur" value={form.animateur} onChange={handleChange} />
              <Field label="Thème" name="theme" value={form.theme} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durée en secondes" name="duree" type="number" value={form.duree} onChange={handleChange} />
              <Field label="URL de l'image" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Btn variant="ghost" onClick={closeModal}>Annuler</Btn>
              <Btn type="submit" variant="primary" className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Enregistrement..." : modal.type === "create" ? "Créer" : "Enregistrer"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SECTION UTILISATEURS
// ═══════════════════════════════════════════════════════════════════════════════
const USER_EMPTY = { nom: "", adresseMail: "", motDePasse: "", adressePostal: "", tel: "", role: "USER" }

function UtilisateursPanel({ notify }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(USER_EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { setUsers(await adminGetUtilisateurs()) } catch { notify("Erreur lors du chargement des utilisateurs", "error") }
    finally { setLoading(false) }
  }, [notify])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(USER_EMPTY); setModal({ type: "create" }) }
  const openEdit = (u) => { setForm({ ...u, motDePasse: "" }); setModal({ type: "edit", item: u }) }
  const openDelete = (u) => setModal({ type: "delete", item: u })
  const closeModal = () => setModal(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal.type === "create") {
        await adminCreateUtilisateur(form)
        notify("Utilisateur créé avec succès", "success")
      } else {
        const { motDePasse, ...rest } = form
        const payload = motDePasse ? { ...rest, motDePasse } : rest
        await adminUpdateUtilisateur(modal.item.id, payload)
        notify("Utilisateur modifié avec succès", "success")
      }
      closeModal(); load()
    } catch (err) {
      notify(err.message || "Erreur", "error")
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await adminDeleteUtilisateur(modal.item.id)
      notify("Utilisateur supprimé", "success")
      closeModal(); load()
    } catch (err) { notify(err.message || "Erreur", "error") }
  }

  const roleBadge = (role) =>
    role === "ADMIN" ? "bg-accent/10 text-accent font-semibold" : "bg-gray-100 text-gray-600"

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-ink">Utilisateurs <span className="ml-2 text-sm font-normal text-gray-400">({users.length})</span></h2>
        <Btn onClick={openCreate}><PlusIcon /> Nouvel utilisateur</Btn>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun utilisateur</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nom</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Rôle</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Inscription</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{u.id}</td>
                  <td className="px-4 py-3 font-medium text-ink">{u.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{u.adresseMail}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {u.dateInscription ? new Date(u.dateInscription).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Btn variant="ghost" onClick={() => openEdit(u)}><EditIcon /></Btn>
                      <Btn variant="danger" onClick={() => openDelete(u)}><TrashIcon /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.type === "delete" && (
        <ConfirmDelete name={modal.item.nom} onConfirm={handleDelete} onCancel={closeModal} />
      )}

      {(modal?.type === "create" || modal?.type === "edit") && (
        <Modal title={modal.type === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur"} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nom *" name="nom" value={form.nom} onChange={handleChange} required />
              <Field label="Email *" name="adresseMail" type="email" value={form.adresseMail} onChange={handleChange} required />
            </div>
            <Field
              label={modal.type === "create" ? "Mot de passe *" : "Nouveau mot de passe (laisser vide pour ne pas changer)"}
              name="motDePasse"
              type="password"
              value={form.motDePasse}
              onChange={handleChange}
              required={modal.type === "create"}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone" name="tel" value={form.tel} onChange={handleChange} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Rôle</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <Field label="Adresse postale" name="adressePostal" value={form.adressePostal} onChange={handleChange} />
            <div className="flex justify-end gap-3 pt-2">
              <Btn variant="ghost" onClick={closeModal}>Annuler</Btn>
              <Btn type="submit" variant="primary" className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Enregistrement..." : modal.type === "create" ? "Créer" : "Enregistrer"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "livres", label: "📚 Livres" },
  { id: "audio", label: "🎧 Livres audio" },
  { id: "podcasts", label: "🎙 Podcasts" },
  { id: "users", label: "👤 Utilisateurs" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("livres")
  const [toast, setToast] = useState(null)

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type })
  }, [])

  return (
    <div className="min-h-screen bg-paper">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon />
              Tableau de bord
            </Link>

            <div>
            <h1 className="text-2xl font-bold text-ink">Administration</h1>
            <p className="text-sm text-gray-500 mt-0.5">La Plume Virtuelle — panneau de gestion</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide uppercase">Admin</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white shadow text-ink"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activeTab === "livres" && <LivresPanel notify={notify} />}
          {activeTab === "audio" && <LivresAudioPanel notify={notify} />}
          {activeTab === "podcasts" && <PodcastsPanel notify={notify} />}
          {activeTab === "users" && <UtilisateursPanel notify={notify} />}
        </div>
      </div>
    </div>
  )
}
