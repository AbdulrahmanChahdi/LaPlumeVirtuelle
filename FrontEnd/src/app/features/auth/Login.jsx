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
        : "/library"

      navigate(target, { replace: true })
    } catch (err) {
      setError(typeof err?.message === "string" ? err.message : "Identifiants invalides.")
    }
  }

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-16">
      <Card className="w-full max-w-lg px-10 py-8">
        <h1 className="text-2xl font-bold text-center mb-2">Se connecter</h1>
        <p className="text-sm text-inkSoft text-center mb-6">Accédez à votre bibliothèque personnalisée.</p>

        {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          <Input type="email" name="adresseMail" placeholder="Adresse email" value={form.adresseMail} onChange={handleChange} />
          <Input type="password" name="motDePasse" placeholder="Mot de passe" value={form.motDePasse} onChange={handleChange} />
          <div className="flex justify-center mt-4">
            <Button type="submit" className="px-10">Se connecter</Button>
          </div>
        </form>

        <p className="text-sm text-center text-inkSoft mt-3">
          Pas de compte ? {" "}
          <Link to="/register" className="text-accent font-medium hover:underline">Créer un compte</Link>
        </p>
      </Card>
    </div>
  )
}
