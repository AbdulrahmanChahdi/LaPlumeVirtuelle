import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { login as apiLogin } from "../../api/authApi"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ adresseMail: "", motDePasse: "" })
  const [error, setError] = useState("")

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!form.adresseMail || !form.motDePasse) {
      setError("Veuillez saisir votre email et mot de passe.")
      return
    }
    try {
      const data = await apiLogin({ adresseMail: form.adresseMail.trim().toLowerCase(), motDePasse: form.motDePasse })
      try {
        localStorage.setItem("authToken", data?.token || "")
        localStorage.setItem("currentUser", JSON.stringify(data?.user || null))
      } catch {}

      const registrationComplete = (() => {
        try {
          return localStorage.getItem("registrationComplete") === "true"
        } catch {
          return false
        }
      })()

      const onboardingDone = (() => {
        try {
          return localStorage.getItem("onboardingDone") === "true"
        } catch {
          return false
        }
      })()

      const target = !onboardingDone
        ? "/onboarding/preferences"
        : "/dashboard"

      navigate(target, { replace: true })
    } catch (err) {
      setError(typeof err?.message === "string" ? err.message : "Identifiants invalides.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper to-paperSoft flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center space-y-2 mb-8 pb-6 border-b border-borderSoft">
          <h1 className="text-3xl font-bold text-ink">Se connecter</h1>
          <p className="text-base text-inkSoft">Accédez à votre bibliothèque personnalisée.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">Email</label>
            <Input 
              type="email" 
              name="adresseMail" 
              placeholder="votre.email@exemple.com" 
              value={form.adresseMail} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">Mot de passe</label>
            <Input 
              type="password" 
              name="motDePasse" 
              placeholder="Votre mot de passe" 
              value={form.motDePasse} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-3 text-lg font-semibold">
              Se connecter
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-borderSoft text-center">
          <p className="text-sm text-inkSoft">
            Pas de compte ?{" "}
            <Link to="/register" className="text-accent font-semibold hover:text-accentHover transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
