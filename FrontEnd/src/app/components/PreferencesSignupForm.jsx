import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PreferencesSignupForm() {
  const navigate = useNavigate()
  const [selectedObjectives, setSelectedObjectives] = useState([]) // max 2
  const [selectedThemes, setSelectedThemes] = useState([]) // max 4
  const maxObjectives = 2;
  const maxThemes = 4;

  const objectives = useMemo(
    () => [
      { id: "apprendre", label: "Apprendre / se former" },
      { id: "seDivertir", label: "Se divertir / se détendre" },
      { id: "devPerso", label: "Développement personnel" },
      { id: "sInformer", label: "Rester informé" },
      { id: "langues", label: "Améliorer une langue" },
      { id: "autre", label: "Autre" },
    ],
    []
  );

  const formats = useMemo(
    () => [
      { id: "livre", label: "Livre" },
      { id: "livreAudio", label: "Livre audio" },
      { id: "podcast", label: "Podcast" },
    ],
    []
  );

  const themes = useMemo(
    () => [
      { id: "fiction", label: "Fiction" },
      { id: "nonFiction", label: "Non-fiction" },
      { id: "business", label: "Business / entrepreneuriat" },
      { id: "tech", label: "Technologie" },
      { id: "science", label: "Science" },
      { id: "sante", label: "Santé" },
      { id: "bienEtre", label: "Bien-être" },
      { id: "histoire", label: "Histoire" },
      { id: "arts", label: "Arts & culture" },
      { id: "societe", label: "Société" },
      { id: "actualites", label: "Actualités" },
      { id: "devPerso2", label: "Développement personnel" },
    ],
    []
  );

  const moments = useMemo(
    () => [
      { id: "matin", label: "Matin" },
      { id: "midi", label: "Midi" },
      { id: "soir", label: "Soir" },
      { id: "transport", label: "Transport" },
      { id: "sport", label: "Sport" },
      { id: "pause", label: "Pause / détente" },
      { id: "weekend", label: "Week-end" },
    ],
    []
  )

  const handleLimitedCheckboxChange = (current, setCurrent, value, max) => {
    const exists = current.includes(value)
    if (exists) {
      setCurrent(current.filter((v) => v !== value))
    } else {
      if (current.length >= max) return
      setCurrent([...current, value])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem("onboardingDone", "true")
    } catch {}
    navigate("/dashboard", { replace: true })
  }

  return (
    <form aria-labelledby="preferences-title" className="max-w-2xl mx-auto p-6 space-y-6" onSubmit={handleSubmit}>
      <h1 id="preferences-title" className="text-xl font-semibold">Formulaire de préférences</h1>
      <p className="text-sm text-gray-600">Ces informations servent uniquement à personnaliser vos recommandations de livres, livres audio et podcasts. Vos données ne seront pas partagées avec des tiers.</p>

      <fieldset className="space-y-2">
        <legend className="font-medium">Tranche d’âge</legend>
        <select name="ageRange" required className="w-full border rounded p-2">
          <option value="" disabled defaultValue="">Sélectionner…</option>
          <option value="13-17">13–17 ans</option>
          <option value="18-24">18–24 ans</option>
          <option value="25-34">25–34 ans</option>
          <option value="35-44">35–44 ans</option>
          <option value="45-54">45–54 ans</option>
          <option value="55+">55 ans et plus</option>
        </select>
      </fieldset>

      {/* 2. Objectif principal (choix multiple, max 2) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Objectif principal de consommation (max. 2)</legend>
        <div className="grid grid-cols-2 gap-3">
          {objectives.map((o) => {
            const checked = selectedObjectives.includes(o.id);
            const disabled = !checked && selectedObjectives.length >= maxObjectives;
            return (
              <label key={o.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="objectives"
                  value={o.id}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => handleLimitedCheckboxChange(selectedObjectives, setSelectedObjectives, o.id, maxObjectives)}
                />
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">Sélectionnez au maximum {maxObjectives} objectifs.</p>
      </fieldset>

      {/* 3. Formats préférés (multiple) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Formats préférés</legend>
        <div className="flex flex-wrap gap-4">
          {formats.map((f) => (
            <label key={f.id} className="flex items-center gap-2">
              <input type="checkbox" name="formats" value={f.id} />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 4. Thématiques préférées (choix multiple, max 4) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Thématiques préférées (max. 4)</legend>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => {
            const checked = selectedThemes.includes(t.id);
            const disabled = !checked && selectedThemes.length >= maxThemes;
            return (
              <label key={t.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="themes"
                  value={t.id}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => handleLimitedCheckboxChange(selectedThemes, setSelectedThemes, t.id, maxThemes)}
                />
                <span>{t.label}</span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">Sélectionnez au maximum {maxThemes} thématiques.</p>
      </fieldset>

      {/* 5. Niveau de lecture global (radio) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Niveau de lecture global</legend>
        <div className="flex flex-wrap gap-4">
          {[
            { id: "debutant", label: "Débutant" },
            { id: "intermediaire", label: "Intermédiaire" },
            { id: "avance", label: "Avancé" },
          ].map((lvl) => (
            <label key={lvl.id} className="flex items-center gap-2">
              <input type="radio" name="readingLevel" value={lvl.id} required />
              <span>{lvl.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 6. Temps disponible par session (select) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Temps disponible par session</legend>
        <select name="sessionTime" required className="w-full border rounded p-2">
          <option value="" disabled defaultValue="">Sélectionner…</option>
          <option value="5-10">5–10 minutes</option>
          <option value="10-20">10–20 minutes</option>
          <option value="20-30">20–30 minutes</option>
          <option value="30-60">30–60 minutes</option>
          <option value="60+">60 minutes et plus</option>
        </select>
      </fieldset>

      {/* 7. Moments de consommation (checkbox) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Moments de consommation</legend>
        <div className="grid grid-cols-2 gap-3">
          {moments.map((m) => (
            <label key={m.id} className="flex items-center gap-2">
              <input type="checkbox" name="moments" value={m.id} />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 8. Auteurs / livres / podcasts appréciés (texte libre, optionnel) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Auteurs, livres ou podcasts appréciés (optionnel)</legend>
        <textarea
          name="favorites"
          rows={3}
          placeholder="Ex. : Nom d’auteurs, titres, émissions…"
          className="w-full border rounded p-2"
        />
      </fieldset>

      {/* 9. Description courte des goûts (texte libre, optionnel) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Décrivez brièvement vos goûts (optionnel)</legend>
        <textarea
          name="tasteDescription"
          rows={3}
          placeholder="Ex. : J’aime la science vulgarisée et les romans historiques…"
          className="w-full border rounded p-2"
        />
      </fieldset>

      {/* 10. Préférence découverte vs continuité (radio) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Préférence : découverte vs continuité</legend>
        <div className="flex flex-wrap gap-4">
          {[
            { id: "decouverte", label: "Découvrir de nouveaux contenus" },
            { id: "habitudes", label: "Continuer dans mes habitudes" },
            { id: "mix", label: "Un mix des deux" },
          ].map((p) => (
            <label key={p.id} className="flex items-center gap-2">
              <input type="radio" name="discoveryPreference" value={p.id} required />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* RGPD: consentement explicite (non pré-coché) */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Consentement RGPD</legend>
        <label className="flex items-start gap-2">
          <input type="checkbox" name="consent" required />
          <span className="text-sm">
            J’accepte que mes réponses soient utilisées exclusivement pour personnaliser mes recommandations de livres, livres audio et podcasts.
          </span>
        </label>
      </fieldset>

      {/* Bouton de soumission (aucune logique backend) */}
      <div className="pt-2">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Valider
        </button>
      </div>
    </form>
  );
}
