import { useState } from "react"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Link, useNavigate } from "react-router-dom"
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
        } catch {}
        navigate("/onboarding/preferences", { replace: true })
      })
      .catch((err) => {
        setError(typeof err?.message === "string" ? err.message : "Erreur lors de l'inscription.")
      })
  }

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-16">

      <Card className="w-full max-w-lg px-10 py-8">

        <h1 className="text-2xl font-bold text-center mb-2">
          Créer un compte
        </h1>

        <p className="text-sm text-inkSoft text-center mb-6">
          Rejoignez La Plume Virtuelle et découvrez une nouvelle façon
          d’explorer la culture.
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-sm mx-auto"
        >
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

        <p className="text-xs text-center text-inkMuted mt-2">
          Inscription gratuite. Aucune carte bancaire requise.
        </p>

        <p className="text-sm text-center text-inkSoft mt-3">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Se connecter
          </Link>
        </p>

      </Card>
    </div>
  )
}
