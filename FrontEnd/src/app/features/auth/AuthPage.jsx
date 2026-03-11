import { useState, useEffect, useMemo } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { login as apiLogin, register as apiRegister } from "../../api/authApi"
import { useAuth } from "../../hooks/useAuth"
import { getRedirectDestination } from "../../utils/navigation"

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const isLoginTab = location.pathname === "/auth/login"

  /* ── Login state ── */
  const [loginForm, setLoginForm] = useState({ adresseMail: "", motDePasse: "" })
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  /* ── Register state ── */
  const [regForm, setRegForm] = useState({
    nomComplet: "",
    adresseMail: "",
    motDePasse: "",
    confirmMotDePasse: "",
  })
  const [regError, setRegError] = useState("")
  const [regLoading, setRegLoading] = useState(false)

  /* ── Register progress ── */
  const fillCount = useMemo(() => {
    return [regForm.nomComplet, regForm.adresseMail, regForm.motDePasse, regForm.confirmMotDePasse]
      .filter((v) => v.trim().length > 0).length
  }, [regForm])
  const progress = Math.round((fillCount / 4) * 100)

  /* Clear errors when switching tabs */
  useEffect(() => {
    setLoginError("")
    setRegError("")
  }, [location.pathname])

  function handleLoginChange(e) {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleRegChange(e) {
    setRegForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setLoginError("")
    if (!loginForm.adresseMail || !loginForm.motDePasse) {
      setLoginError("Veuillez saisir votre email et mot de passe.")
      return
    }
    setLoginLoading(true)
    try {
      const data = await apiLogin({
        adresseMail: loginForm.adresseMail.trim().toLowerCase(),
        motDePasse: loginForm.motDePasse,
      })
      if (!data || !data.token) {
        setLoginError("Erreur serveur : token manquant. Veuillez réessayer.")
        return
      }
      login(data.token, data.user || null)
      await new Promise((r) => setTimeout(r, 100))
      const redirectFromQuery = searchParams.get("redirectTo")
      const target = getRedirectDestination(redirectFromQuery, "/dashboard", data?.user)
      navigate(target, { replace: true })
    } catch (err) {
      setLoginError(typeof err?.message === "string" ? err.message : "Identifiants invalides.")
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()
    setRegError("")

    if (!regForm.nomComplet || !regForm.adresseMail || !regForm.motDePasse || !regForm.confirmMotDePasse) {
      setRegError("Veuillez remplir tous les champs.")
      return
    }
    if (!isValidEmail(regForm.adresseMail)) {
      setRegError("Adresse e-mail invalide.")
      return
    }
    if (regForm.motDePasse.length < 8) {
      setRegError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    if (regForm.motDePasse !== regForm.confirmMotDePasse) {
      setRegError("Les mots de passe ne correspondent pas.")
      return
    }

    setRegLoading(true)
    try {
      await apiRegister({
        nom: regForm.nomComplet.trim(),
        adresseMail: regForm.adresseMail.trim().toLowerCase(),
        motDePasse: regForm.motDePasse,
      })
      try {
        localStorage.setItem("registrationComplete", "true")
        localStorage.removeItem("onboardingDone")
      } catch (storageErr) { void storageErr }
      navigate("/auth/login", { replace: true })
    } catch (err) {
      setRegError(typeof err?.message === "string" ? err.message : "Erreur lors de l'inscription.")
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel – Branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] min-h-screen p-12 xl:p-16"
        style={{ backgroundColor: "#2F5D50" }}
      >
        <div className="flex flex-col flex-1 items-center justify-center text-center gap-5 px-8">
          <h1
            className="text-5xl xl:text-6xl italic text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            La Plume Virtuelle
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-xs">
            Lisez, écoutez, explorez — à votre rythme.
          </p>
        </div>
      </div>

      {/* ── Right panel – Form ── */}
      <div
        className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24"
        style={{ backgroundColor: "#F8F6F2", minHeight: "100vh" }}
      >
        {/* Bouton retour */}
        <div className="mb-6 max-w-lg">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-inkSoft hover:text-ink transition-colors"
          >
            <span>&#8592;</span>
            <span>Retour</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-borderSoft mb-8 max-w-lg">
          <button
            type="button"
            onClick={() => navigate("/auth/register")}
            className={`pb-3 mr-8 text-sm font-semibold uppercase tracking-wider transition-colors ${
              !isLoginTab
                ? "text-ink border-b-2 border-ink -mb-px"
                : "text-inkMuted hover:text-inkSoft"
            }`}
          >
            Inscription
          </button>
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
              isLoginTab
                ? "text-ink border-b-2 border-ink -mb-px"
                : "text-inkMuted hover:text-inkSoft"
            }`}
          >
            Connexion
          </button>
        </div>

        {/* ── INSCRIPTION form ── */}
        {!isLoginTab && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5 max-w-lg" noValidate>
            {regError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded" role="alert">
                {regError}
              </div>
            )}

            {/* Nom complet */}
            <div className="flex flex-col gap-1">
              <label htmlFor="nomComplet" className="text-xs text-inkSoft">
                Nom complet
              </label>
              <input
                id="nomComplet"
                type="text"
                name="nomComplet"
                value={regForm.nomComplet}
                onChange={handleRegChange}
                autoComplete="name"
                required
                className="w-full border border-borderSoft rounded px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-email" className="text-xs text-inkSoft">
                Adresse e-mail
              </label>
              <input
                id="reg-email"
                type="email"
                name="adresseMail"
                value={regForm.adresseMail}
                onChange={handleRegChange}
                autoComplete="email"
                required
                className="w-full border border-borderSoft rounded px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-password" className="text-xs text-inkSoft">
                Mot de passe
              </label>
              <input
                id="reg-password"
                type="password"
                name="motDePasse"
                value={regForm.motDePasse}
                onChange={handleRegChange}
                autoComplete="new-password"
                required
                className="w-full border border-borderSoft rounded px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reg-confirm" className="text-xs text-inkSoft">
                Confirmer le mot de passe
              </label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmMotDePasse"
                value={regForm.confirmMotDePasse}
                onChange={handleRegChange}
                autoComplete="new-password"
                required
                className="w-full border border-borderSoft rounded px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-3 text-sm font-semibold text-white rounded transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#2F5D50" }}
              onMouseEnter={(e) => { if (!regLoading) e.currentTarget.style.backgroundColor = "#244A40" }}
              onMouseLeave={(e) => { if (!regLoading) e.currentTarget.style.backgroundColor = "#2F5D50" }}
            >
              {regLoading ? "Inscription…" : "S'inscrire"}
            </button>

            {/* Progress bar */}
            <div
              className="w-full h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: "#E5E1DA" }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "#2F5D50" }}
              />
            </div>


          </form>
        )}

        {/* ── CONNEXION form ── */}
        {isLoginTab && (
          <form onSubmit={handleLoginSubmit} className="space-y-5 max-w-lg" noValidate>
            {loginError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded" role="alert">
                {loginError}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="login-email" className="text-xs text-inkSoft">
                Adresse e-mail
              </label>
              <input
                id="login-email"
                type="email"
                name="adresseMail"
                value={loginForm.adresseMail}
                onChange={handleLoginChange}
                autoComplete="email"
                required
                className="w-full border border-borderSoft rounded px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="login-password" className="text-xs text-inkSoft">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                name="motDePasse"
                value={loginForm.motDePasse}
                onChange={handleLoginChange}
                autoComplete="current-password"
                required
                className="w-full border border-borderSoft rounded px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 text-sm font-semibold text-white rounded transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#2F5D50" }}
              onMouseEnter={(e) => { if (!loginLoading) e.currentTarget.style.backgroundColor = "#244A40" }}
              onMouseLeave={(e) => { if (!loginLoading) e.currentTarget.style.backgroundColor = "#2F5D50" }}
            >
              {loginLoading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
