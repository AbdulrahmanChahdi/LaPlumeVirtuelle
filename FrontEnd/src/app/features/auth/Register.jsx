import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Link } from "react-router-dom"
import { register as apiRegister } from "../../api/authApi"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nom: "",
    adresseMail: "",
    motDePasse: "",
    confirmMotDePasse: "",
    adressePostal: "",
    tel: "",
  })

  const [error, setError] = useState("")
  const [filledFields, setFilledFields] = useState(0)
  const totalFields = 4 // nom, email, password, confirm
  const progress = Math.round((filledFields / totalFields) * 100)

  // Calculate filled fields whenever form changes
  useEffect(() => {
    const filled = [
      form.nom?.trim(),
      form.adresseMail?.trim(),
      form.motDePasse?.trim(),
      form.confirmMotDePasse?.trim(),
    ].filter(Boolean).length
    setFilledFields(filled)
  }, [form])

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function isValidPhone(phone) {
    if (!phone) return true
    return /^[0-9+\s().-]{6,20}$/.test(phone)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!form.nom || !form.adresseMail || !form.motDePasse || !form.confirmMotDePasse) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    if (!isValidEmail(form.adresseMail)) {
      setError("Adresse email invalide.")
      return
    }

    if (form.motDePasse.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    if (form.motDePasse !== form.confirmMotDePasse) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    if (!isValidPhone(form.tel)) {
      setError("Numéro de téléphone invalide.")
      return
    }

    const payload = {
      nom: form.nom.trim(),
      adresseMail: form.adresseMail.trim().toLowerCase(),
      motDePasse: form.motDePasse,
      adressePostal: form.adressePostal?.trim() || null,
      tel: form.tel?.trim() || null,
    }

    // Appel API d'inscription
    apiRegister(payload)
      .then(() => {
        try {
          localStorage.setItem("registrationComplete", "true")
          localStorage.removeItem("onboardingDone")
        } catch {}
        navigate("/login", { replace: true })
      })
      .catch((err) => {
        setError(typeof err?.message === "string" ? err.message : "Erreur lors de l'inscription.")
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper to-paperSoft flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        {/* Progress Indicator */}
        <div className="mb-6 pb-4 border-b border-borderSoft">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-accent">Progression de l'inscription</p>
            <span className="text-xs font-medium text-inkMuted">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-borderSoft rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-gold transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-inkMuted mt-2">Étapes obligatoires : {filledFields}/{totalFields}</p>
        </div>

        <div className="text-center space-y-2 mb-6 pb-4 border-b border-borderSoft">
          <h1 className="text-3xl font-bold text-ink">Créer un compte</h1>
          <p className="text-sm text-inkSoft">
            Rejoignez La Plume Virtuelle et découvrez une nouvelle façon d'explorer la culture.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} />
          <Input type="email" name="adresseMail" placeholder="Adresse email" value={form.adresseMail} onChange={handleChange} />
          <Input type="password" name="motDePasse" placeholder="Mot de passe" value={form.motDePasse} onChange={handleChange} />
          <Input type="password" name="confirmMotDePasse" placeholder="Confirmer le mot de passe" value={form.confirmMotDePasse} onChange={handleChange} />
          <Input name="adressePostal" placeholder="Adresse postale (optionnel)" value={form.adressePostal} onChange={handleChange} />
          <Input name="tel" placeholder="Téléphone (optionnel)" value={form.tel} onChange={handleChange} />

          <div className="flex justify-center mt-4">
            <Button type="submit" className="px-10">
              S’inscrire
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-inkMuted mt-4">
          Inscription gratuite. Aucune carte bancaire requise.
        </p>

        <div className="mt-6 pt-6 border-t border-borderSoft text-center">
          <p className="text-sm text-inkSoft">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-accent font-semibold hover:text-accentHover transition-colors">
              Se connecter
            </Link>
          </p>
        </div>

      </Card>
    </div>
  )
}
