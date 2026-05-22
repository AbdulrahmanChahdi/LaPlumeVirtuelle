import { Fragment } from "react"
import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect } from "react"

const NAV_LINKS = [
  { label: "Tableau de bord", to: "/dashboard" },
  { label: "Recommandations", to: "/recommendations" },
  { label: "Ma bibliothèque", to: "/library" },
  { label: "Découvrir", to: "/catalogue", group: "catalogue" },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const onboardingDone = typeof window !== "undefined" && localStorage.getItem("onboardingDone") === "true"

  useEffect(() => {
    if (!onboardingDone) return

    const forcedDestination = localStorage.getItem("postOnboardingDestination")
    if (!forcedDestination) return

    if (location.pathname !== forcedDestination) {
      localStorage.removeItem("postOnboardingDestination")
      navigate(forcedDestination, { replace: true })
      return
    }

    localStorage.removeItem("postOnboardingDestination")
  }, [location.pathname, navigate, onboardingDone])

  if (!onboardingDone && location.pathname !== "/onboarding/preferences") {
    return <Navigate to="/onboarding/preferences" replace />
  }

  const initials = user?.nom
    ? user.nom.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ── */}
      {onboardingDone && (
        <aside
          className="hidden lg:flex flex-col w-60 shrink-0 py-8 px-5 gap-8 fixed top-0 left-0 h-full z-30"
          style={{ backgroundColor: "#2F5D50" }}
        >
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-white transition shrink-0"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.25rem" }}
          >
            La Plume Virtuelle
          </Link>

          <div className="w-full h-px bg-white/10" />

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold leading-tight truncate">{user?.nom || "Utilisateur"}</p>
              <p className="text-white/50 text-xs truncate">{user?.adresseMail || ""}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => {
              const prevLink = NAV_LINKS[i - 1]
              const needsSeparator = link.group && (!prevLink || !prevLink.group)
              return (
                <Fragment key={link.to}>
                  {needsSeparator && (
                    <div className="mt-3 mb-1">
                      <p className="text-white/30 text-[10px] uppercase tracking-widest px-3">Découvrir</p>
                    </div>
                  )}
                  <Link
                    to={link.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                      location.pathname === link.to || location.pathname.startsWith(link.to + "/")
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60" />
                    {link.label}
                  </Link>
                </Fragment>
              )
            })}
          </nav>

          {/* Déconnexion */}
          <div className="mt-auto">
            <button
              onClick={() => { logout(); navigate("/") }}
              className="text-xs text-white/40 hover:text-white/70 transition flex items-center gap-2"
            >
              <span>←</span> Déconnexion
            </button>
          </div>
        </aside>
      )}

      {/* ── Main content ── */}
      <main className={`flex-1 bg-paper ${onboardingDone ? "lg:ml-60" : ""}`}>
        <Outlet />
      </main>
    </div>
  )
}
