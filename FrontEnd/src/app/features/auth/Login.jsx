import { useState, useCallback } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { login as apiLogin } from "../../api/authApi"
import { getRedirectDestination } from "../../utils/navigation"
import { useAuth } from "../../hooks/useAuth"

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [form, setForm] = useState({ adresseMail: "", motDePasse: "" })
  const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = useCallback(() => setShowPassword(v => !v), [])

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

      // Vérifier que le backend retourne bien un token
      if (!data || !data.token) {
        setError("Erreur serveur: token manquant. Veuillez réessayer.")
        return
      }

      // Utiliser la fonction login du contexte au lieu de manipuler localStorage
      login(data.token, data.user || null)

      // Petite pause pour s'assurer que localStorage est enregistré avant la redirection
      await new Promise(resolve => setTimeout(resolve, 100))

      // Déterminer la destination après connexion avec fallbacks intelligents
      // Priorise l'onboarding si pas encore fait
      const redirectFromQuery = searchParams.get("redirectTo")
      const defaultDestination = (data?.user?.role || "").toUpperCase() === "ADMIN" ? "/admin" : "/dashboard"
      const target = getRedirectDestination(redirectFromQuery, defaultDestination, data?.user)

      navigate(target, { replace: true })
    } catch (err) {
      setError(typeof err?.message === "string" ? err.message : "Identifiants invalides.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper to-paperSoft flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center space-y-1 sm:space-y-2 mb-6 sm:mb-8 pb-6 border-b border-borderSoft">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Se connecter</h1>
          <p className="text-sm sm:text-base text-inkSoft">Accédez à votre bibliothèque personnalisée.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">
            <p className="font-medium flex items-center gap-2" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
          />

          <Input
            id="password"
              type={showPassword ? "text" : "password"}
            name="motDePasse"
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={form.motDePasse}
            onChange={handleChange}
            required
            autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={togglePassword}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="text-inkMuted hover:text-ink transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
          />

          <div className="pt-2">
            <Button type="submit" className="w-full py-2 sm:py-3 text-base sm:text-lg font-semibold">
              Se connecter
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-borderSoft text-center">
          <p className="text-sm text-inkSoft">
            Pas de compte ?{" "}
            <Link to="/auth/register" className="text-accent font-semibold hover:text-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:rounded px-1 transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
