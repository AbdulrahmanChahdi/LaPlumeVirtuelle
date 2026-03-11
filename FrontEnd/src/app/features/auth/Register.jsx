import { useState, useEffect, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const togglePassword = useCallback(() => setShowPassword(v => !v), [])
    const toggleConfirm = useCallback(() => setShowConfirm(v => !v), [])
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
        navigate("/auth/login", { replace: true })
      })
      .catch((err) => {
        setError(typeof err?.message === "string" ? err.message : "Erreur lors de l'inscription.")
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper to-paperSoft flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <Card className="w-full max-w-md shadow-lg">
        {/* Progress Indicator */}
        <div className="mb-4 sm:mb-6 pb-4 border-b border-borderSoft">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-accent">Progression de l'inscription</p>
            <span className="text-xs font-medium text-inkMuted" aria-label={`${progress} pourcent complété`}>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-borderSoft rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div
              className="h-full bg-gradient-to-r from-accent to-gold transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-inkMuted mt-2">Étapes obligatoires : {filledFields}/{totalFields}</p>
        </div>

        <div className="text-center space-y-1 sm:space-y-2 mb-4 sm:mb-6 pb-4 border-b border-borderSoft">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Créer un compte</h1>
          <p className="text-sm text-inkSoft">
            Rejoignez La Plume Virtuelle et découvrez une nouvelle façon d'explorer la culture.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-medium text-sm flex items-center gap-2" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <Input 
            id="nom"
            name="nom" 
            label="Nom"
            placeholder="Votre nom" 
            value={form.nom} 
            onChange={handleChange} 
            required
            autoComplete="name"
          />
          <Input 
            id="email"
            type="email" 
            name="adresseMail" 
            label="Email"
            placeholder="votre.email@exemple.com" 
            value={form.adresseMail} 
            onChange={handleChange} 
            required
            autoComplete="email"
            helpText="Utilisé pour la connexion"
          />
          <Input 
            id="password"
              type={showPassword ? "text" : "password"}
            name="motDePasse" 
            label="Mot de passe"
            placeholder="Minimum 8 caractères" 
            value={form.motDePasse} 
            onChange={handleChange} 
            required
            autoComplete="new-password"
            helpText="Au moins 8 caractères"
              rightElement={
                <button type="button" onClick={togglePassword} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="text-inkMuted hover:text-ink transition-colors focus:outline-none">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              }
          />
          <Input 
            id="confirmPassword"
              type={showConfirm ? "text" : "password"}
            name="confirmMotDePasse" 
            label="Confirmer le mot de passe"
            placeholder="Retapez votre mot de passe" 
            value={form.confirmMotDePasse} 
            onChange={handleChange} 
            required
            autoComplete="new-password"
              rightElement={
                <button type="button" onClick={toggleConfirm} aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="text-inkMuted hover:text-ink transition-colors focus:outline-none">
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              }
          />
          <Input 
            id="address"
            name="adressePostal" 
            label="Adresse postale"
            placeholder="Adresse postale (optionnel)" 
            value={form.adressePostal} 
            onChange={handleChange} 
            autoComplete="street-address"
          />
          <Input 
            id="phone"
            type="tel"
            name="tel" 
            label="Téléphone"
            placeholder="Téléphone (optionnel)" 
            value={form.tel} 
            onChange={handleChange} 
            autoComplete="tel"
          />

          <div className="flex justify-center mt-6">
            <Button type="submit" className="w-full sm:w-auto px-8 sm:px-10">
              S'inscrire
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-inkMuted mt-4">
          Inscription gratuite. Aucune carte bancaire requise.
        </p>

        <div className="mt-6 pt-6 border-t border-borderSoft text-center">
          <p className="text-sm text-inkSoft">
            Déjà un compte ?{" "}
            <Link to="/auth/login" className="text-accent font-semibold hover:text-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:rounded px-1 transition-colors">
              Se connecter
            </Link>
          </p>
        </div>

      </Card>
    </div>
  )
}
