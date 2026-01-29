import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { savePreferences } from "../api/preferencesApi"
import Card from "./ui/Card"
import Button from "./ui/Button"
import SelectDropdown from "./ui/SelectDropdown"

export default function PreferencesSignupForm() {
  const navigate = useNavigate()
  const [selectedObjectives, setSelectedObjectives] = useState([]) // max 2
  const [selectedThemes, setSelectedThemes] = useState([]) // max 4
  const [selectedFormats, setSelectedFormats] = useState([])
  const [selectedMoments, setSelectedMoments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ageRange, setAgeRange] = useState("")
  const [readingLevel, setReadingLevel] = useState("")
  const [sessionTime, setSessionTime] = useState("")
  const [discoveryPreference, setDiscoveryPreference] = useState("")
  const [consent, setConsent] = useState(false)
  const [favorites, setFavorites] = useState("")
  const [tasteDescription, setTasteDescription] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [stepError, setStepError] = useState("")

  const maxObjectives = 2;
  const maxThemes = 4;
  const totalSteps = 12;

  // Calcul de la progression basée sur les étapes
  const progress = useMemo(() => {
    return Math.round((currentStep / totalSteps) * 100)
  }, [currentStep])

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

  const handlePreviousStep = () => {
    setStepError("")
    setCurrentStep(Math.max(1, currentStep - 1))
  }

  const handleNextStep = () => {
    setStepError("")
    
    // Validation pour chaque étape
    switch(currentStep) {
      case 1:
        if (!ageRange) {
          setStepError("Veuillez sélectionner votre tranche d'âge")
          return
        }
        break
      case 2:
        if (selectedObjectives.length === 0) {
          setStepError("Veuillez sélectionner au moins un objectif")
          return
        }
        break
      case 3:
        if (selectedFormats.length === 0) {
          setStepError("Veuillez sélectionner au moins un format")
          return
        }
        break
      case 4:
        if (selectedThemes.length === 0) {
          setStepError("Veuillez sélectionner au moins une thématique")
          return
        }
        break
      case 5:
        if (!readingLevel) {
          setStepError("Veuillez sélectionner votre niveau de lecture")
          return
        }
        break
      case 6:
        if (!sessionTime) {
          setStepError("Veuillez sélectionner votre temps disponible")
          return
        }
        break
      case 7:
        if (selectedMoments.length === 0) {
          setStepError("Veuillez sélectionner au moins un moment")
          return
        }
        break
      case 10:
        if (!discoveryPreference) {
          setStepError("Veuillez sélectionner une préférence")
          return
        }
        break
      case 11:
        if (!consent) {
          setStepError("Veuillez accepter le consentement RGPD")
          return
        }
        break
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const getStepLabel = () => {
    const labels = [
      "Tranche d'âge",
      "Objectifs",
      "Formats",
      "Thématiques",
      "Niveau de lecture",
      "Temps disponible",
      "Moments",
      "Auteurs appréciés",
      "Vos goûts",
      "Découverte",
      "Consentement",
      "Résumé"
    ]
    return labels[currentStep - 1] || ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const preferences = {
        id_preference: null,
        tranche_age: ageRange,
        objectif: selectedObjectives.join(","),
        format: selectedFormats.join(","),
        thematique: selectedThemes.join(","),
        niveau_lecture: readingLevel,
        frequence_lecture: sessionTime,
        moment_consomation: selectedMoments.join(","),
        auteur_prefere: favorites || "",
        description: tasteDescription || "",
        continue_nouveau: discoveryPreference,
        RGPD: consent,
      }

      console.log("Données à envoyer:", preferences)
      await savePreferences(preferences)

      localStorage.setItem("onboardingDone", "true")
      navigate("/dashboard", { replace: true })
    } catch (err) {
      console.error("Erreur lors de l'envoi des préférences:", err)
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper to-paperSoft flex items-start justify-center py-12 px-4">
      <Card className="w-full max-w-4xl shadow-lg">
        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-ink">Progression</span>
            <span className="text-sm font-semibold text-accent">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent to-gold h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <form aria-labelledby="preferences-title" className="space-y-6" onSubmit={handleSubmit}>
          {/* Header avec step indicator */}
          <div className="text-center space-y-3 pb-6 border-b border-borderSoft">
            <div className="text-sm font-medium text-accent">
              Étape {currentStep} sur {totalSteps}
            </div>
            <h1 id="preferences-title" className="text-3xl font-bold text-ink">
              {getStepLabel()}
            </h1>
            <p className="text-base text-inkSoft max-w-2xl mx-auto">
              Aidez-nous à vous recommander les meilleurs contenus selon vos goûts et vos besoins.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {stepError && (
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 rounded">
              <p className="font-medium">{stepError}</p>
            </div>
          )}

          {/* STEP 1: Tranche d'âge */}
          {currentStep === 1 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-accent rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Tranche d'âge <span className="text-red-500">*</span>
              </legend>
              <SelectDropdown
                value={ageRange}
                onChange={setAgeRange}
                options={[
                  { value: "13-17", label: "13–17 ans" },
                  { value: "18-24", label: "18–24 ans" },
                  { value: "25-34", label: "25–34 ans" },
                  { value: "35-44", label: "35–44 ans" },
                  { value: "45-54", label: "45–54 ans" },
                  { value: "55+", label: "55 ans et plus" },
                ]}
                placeholder="Sélectionner votre tranche d'âge..."
                required
              />
            </fieldset>
          )}

          {/* STEP 2: Objectifs */}
          {currentStep === 2 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-gold rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <legend className="text-lg font-semibold text-ink">
                  Objectif principal <span className="text-red-500">*</span>
                </legend>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
                  selectedObjectives.length === maxObjectives 
                    ? 'bg-accent text-white' 
                    : selectedObjectives.length > 0
                    ? 'bg-gold/20 text-gold'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {selectedObjectives.length}/{maxObjectives}
                </span>
              </div>
              <p className="text-sm text-inkMuted">Sélectionnez jusqu'à {maxObjectives} objectifs</p>
              <div className="grid grid-cols-1 gap-2">
                {objectives.map((o) => {
                  const checked = selectedObjectives.includes(o.id);
                  const disabled = !checked && selectedObjectives.length >= maxObjectives;
                  return (
                    <label 
                      key={o.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checked 
                          ? 'bg-accent/5 border-accent font-medium' 
                          : disabled 
                          ? 'bg-gray-50 border-gray-200 opacity-40 cursor-not-allowed'
                          : 'bg-white border-borderSoft hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="objectives"
                        value={o.id}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => {
                          const exists = selectedObjectives.includes(o.id)
                          if (exists) {
                            setSelectedObjectives(selectedObjectives.filter(v => v !== o.id))
                          } else {
                            if (selectedObjectives.length < maxObjectives) {
                              setSelectedObjectives([...selectedObjectives, o.id])
                            }
                          }
                        }}
                        className="w-5 h-5 text-accent accent-accent focus:ring-2 focus:ring-accent rounded"
                      />
                      <span className="text-sm text-ink">{o.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* STEP 3: Formats */}
          {currentStep === 3 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-accent rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Format préféré <span className="text-red-500">*</span>
              </legend>
              <div className="grid grid-cols-1 gap-2">
                {formats.map((f) => {
                  const checked = selectedFormats.includes(f.id);
                  return (
                    <label 
                      key={f.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checked 
                          ? 'bg-accent/5 border-accent font-medium' 
                          : 'bg-white border-borderSoft hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="formats"
                        value={f.id}
                        checked={checked}
                        onChange={() => {
                          const exists = selectedFormats.includes(f.id)
                          if (exists) {
                            setSelectedFormats(selectedFormats.filter(v => v !== f.id))
                          } else {
                            setSelectedFormats([...selectedFormats, f.id])
                          }
                        }}
                        className="w-5 h-5 text-accent accent-accent focus:ring-2 focus:ring-accent rounded"
                      />
                      <span className="text-sm text-ink">{f.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* STEP 4: Thématiques */}
          {currentStep === 4 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-gold rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <legend className="text-lg font-semibold text-ink">
                  Thématiques <span className="text-red-500">*</span>
                </legend>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
                  selectedThemes.length === maxThemes 
                    ? 'bg-accent text-white' 
                    : selectedThemes.length > 0
                    ? 'bg-gold/20 text-gold'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {selectedThemes.length}/{maxThemes}
                </span>
              </div>
              <p className="text-sm text-inkMuted">Sélectionnez jusqu'à {maxThemes} thématiques</p>
              <div className="grid grid-cols-1 gap-2">
                {themes.map((t) => {
                  const checked = selectedThemes.includes(t.id);
                  const disabled = !checked && selectedThemes.length >= maxThemes;
                  return (
                    <label 
                      key={t.id} 
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                        checked 
                          ? 'bg-accent/5 border-accent font-medium' 
                          : disabled 
                          ? 'bg-gray-50 border-gray-200 opacity-40 cursor-not-allowed'
                          : 'bg-white border-borderSoft hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="themes"
                        value={t.id}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => {
                          const exists = selectedThemes.includes(t.id)
                          if (exists) {
                            setSelectedThemes(selectedThemes.filter(v => v !== t.id))
                          } else {
                            if (selectedThemes.length < maxThemes) {
                              setSelectedThemes([...selectedThemes, t.id])
                            }
                          }
                        }}
                        className="w-4 h-4 text-accent accent-accent focus:ring-2 focus:ring-accent rounded flex-shrink-0"
                      />
                      <span className="text-ink">{t.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* STEP 5: Niveau de lecture */}
          {currentStep === 5 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-accent rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Niveau de lecture <span className="text-red-500">*</span>
              </legend>
              <div className="space-y-2">
                {[
                  { id: "debutant", label: "Débutant" },
                  { id: "intermediaire", label: "Intermédiaire" },
                  { id: "avance", label: "Avancé" },
                ].map((lvl) => {
                  const checked = readingLevel === lvl.id;
                  return (
                    <label 
                      key={lvl.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checked 
                          ? 'bg-accent/5 border-accent font-medium' 
                          : 'bg-white border-borderSoft hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="readingLevel" 
                        value={lvl.id} 
                        required
                        checked={checked}
                        onChange={(e) => setReadingLevel(e.target.value)}
                        className="w-5 h-5 text-accent accent-accent focus:ring-2 focus:ring-accent"
                      />
                      <span className="text-sm font-medium text-ink">{lvl.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* STEP 6: Temps disponible */}
          {currentStep === 6 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-accent rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Temps disponible <span className="text-red-500">*</span>
              </legend>
              <SelectDropdown
                value={sessionTime}
                onChange={setSessionTime}
                options={[
                  { value: "5-10", label: "5–10 minutes" },
                  { value: "10-20", label: "10–20 minutes" },
                  { value: "20-30", label: "20–30 minutes" },
                  { value: "30-60", label: "30–60 minutes" },
                  { value: "60+", label: "60 minutes et plus" },
                ]}
                placeholder="Sélectionner votre temps par session..."
                required
              />
            </fieldset>
          )}

          {/* STEP 7: Moments de consommation */}
          {currentStep === 7 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-gold rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Moments de consommation
              </legend>
              <div className="grid grid-cols-1 gap-2">
                {moments.map((m) => {
                  const checked = selectedMoments.includes(m.id);
                  return (
                    <label 
                      key={m.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checked 
                          ? 'bg-accent/5 border-accent font-medium' 
                          : 'bg-white border-borderSoft hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        name="moments" 
                        value={m.id}
                        checked={checked}
                        onChange={() => {
                          const exists = selectedMoments.includes(m.id)
                          if (exists) {
                            setSelectedMoments(selectedMoments.filter(v => v !== m.id))
                          } else {
                            setSelectedMoments([...selectedMoments, m.id])
                          }
                        }}
                        className="w-5 h-5 text-accent accent-accent focus:ring-2 focus:ring-accent rounded"
                      />
                      <span className="text-sm text-ink">{m.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* STEP 8: Auteurs appréciés */}
          {currentStep === 8 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-gold rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Auteurs, livres ou podcasts appréciés <span className="text-xs text-inkMuted font-normal">(optionnel)</span>
              </legend>
              <textarea
                name="favorites"
                value={favorites}
                onChange={(e) => setFavorites(e.target.value)}
                rows={4}
                placeholder="Ex. : Nom d'auteurs, titres, émissions…"
                className="w-full bg-gradient-to-br from-white to-accent/2 border border-borderSoft rounded-lg px-4 py-3 text-ink placeholder-inkMuted shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none transition-all"
              />
            </fieldset>
          )}

          {/* STEP 9: Description des goûts */}
          {currentStep === 9 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-gold rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Décrivez brièvement vos goûts <span className="text-xs text-inkMuted font-normal">(optionnel)</span>
              </legend>
              <textarea
                name="tasteDescription"
                value={tasteDescription}
                onChange={(e) => setTasteDescription(e.target.value)}
                rows={4}
                placeholder="Ex. : J'aime la science vulgarisée et les romans historiques…"
                className="w-full bg-gradient-to-br from-white to-accent/2 border border-borderSoft rounded-lg px-4 py-3 text-ink placeholder-inkMuted shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none transition-all"
              />
            </fieldset>
          )}

          {/* STEP 10: Découverte vs continuité */}
          {currentStep === 10 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-accent rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Préférence : découverte vs continuité <span className="text-red-500">*</span>
              </legend>
              <div className="space-y-2">
                {[
                  { id: "decouverte", label: "Découvrir de nouveaux contenus" },
                  { id: "habitudes", label: "Continuer dans mes habitudes" },
                  { id: "mix", label: "Un mix des deux" },
                ].map((p) => {
                  const checked = discoveryPreference === p.id;
                  return (
                    <label 
                      key={p.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checked 
                          ? 'bg-accent/5 border-accent font-medium' 
                          : 'bg-white border-borderSoft hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="discoveryPreference" 
                        value={p.id} 
                        required
                        checked={checked}
                        onChange={(e) => setDiscoveryPreference(e.target.value)}
                        className="w-5 h-5 text-accent accent-accent focus:ring-2 focus:ring-accent"
                      />
                      <span className="text-sm text-ink">{p.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* STEP 11: Consentement RGPD */}
          {currentStep === 11 && (
            <fieldset className="space-y-4 p-5 bg-white border-l-4 border-accent rounded-lg shadow-sm">
              <legend className="text-lg font-semibold text-ink">
                Consentement RGPD <span className="text-red-500">*</span>
              </legend>
              <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-borderSoft bg-white hover:border-accent hover:bg-accent/5 cursor-pointer transition-all">
                <input 
                  type="checkbox" 
                  name="consent" 
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-accent accent-accent focus:ring-2 focus:ring-accent rounded"
                />
                <span className="text-sm text-ink">
                  J'accepte que mes réponses soient utilisées exclusivement pour personnaliser mes recommandations de livres, livres audio et podcasts.
                </span>
              </label>
            </fieldset>
          )}

          {/* STEP 12: Résumé */}
          {currentStep === 12 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-accent/10 to-gold/10 border border-accent/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-ink mb-6">Vérifiez votre résumé</h2>
                
                <div className="space-y-4">
                  {/* Groupe 1: Informations personnelles */}
                  <div className="bg-white rounded-lg p-4 border border-borderSoft">
                    <h3 className="font-semibold text-ink mb-3">Informations personnelles</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-inkMuted mb-1">Tranche d'âge</p>
                        <p className="font-medium text-ink">{
                          ageRange ? 
                          { "13-17": "13–17 ans", "18-24": "18–24 ans", "25-34": "25–34 ans", "35-44": "35–44 ans", "45-54": "45–54 ans", "55+": "55 ans et plus" }[ageRange]
                          : "Non renseigné"
                        }</p>
                      </div>
                      <div>
                        <p className="text-inkMuted mb-1">Niveau de lecture</p>
                        <p className="font-medium text-ink">{
                          readingLevel ?
                          { "debutant": "Débutant", "intermediaire": "Intermédiaire", "avance": "Avancé" }[readingLevel]
                          : "Non renseigné"
                        }</p>
                      </div>
                    </div>
                  </div>

                  {/* Groupe 2: Préférences de contenu */}
                  <div className="bg-white rounded-lg p-4 border border-borderSoft">
                    <h3 className="font-semibold text-ink mb-3">Préférences de contenu</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-inkMuted mb-1">Objectifs ({selectedObjectives.length}/{maxObjectives})</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedObjectives.length > 0 ? (
                            selectedObjectives.map(obj => (
                              <span key={obj} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                                {objectives.find(o => o.id === obj)?.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-inkMuted">Non renseigné</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-inkMuted mb-1">Formats</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedFormats.length > 0 ? (
                            selectedFormats.map(fmt => (
                              <span key={fmt} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                                {formats.find(f => f.id === fmt)?.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-inkMuted">Non renseigné</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-inkMuted mb-1">Thématiques ({selectedThemes.length}/{maxThemes})</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedThemes.length > 0 ? (
                            selectedThemes.map(theme => (
                              <span key={theme} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                                {themes.find(t => t.id === theme)?.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-inkMuted">Non renseigné</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Groupe 3: Habitudes de consommation */}
                  <div className="bg-white rounded-lg p-4 border border-borderSoft">
                    <h3 className="font-semibold text-ink mb-3">Habitudes de consommation</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-inkMuted mb-1">Temps par session</p>
                        <p className="font-medium text-ink">{
                          sessionTime ?
                          { "5-10": "5–10 min", "10-20": "10–20 min", "20-30": "20–30 min", "30-60": "30–60 min", "60+": "60+ min" }[sessionTime]
                          : "Non renseigné"
                        }</p>
                      </div>
                      <div>
                        <p className="text-inkMuted mb-1">Moments ({selectedMoments.length})</p>
                        <p className="font-medium text-ink text-xs">
                          {selectedMoments.length > 0 ? selectedMoments.map(m => moments.find(mo => mo.id === m)?.label).join(", ") : "Non renseigné"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Groupe 4: Préférences additionnelles */}
                  <div className="bg-white rounded-lg p-4 border border-borderSoft">
                    <h3 className="font-semibold text-ink mb-3">Préférences additionnelles</h3>
                    <div className="space-y-3 text-sm">
                      {favorites && (
                        <div>
                          <p className="text-inkMuted mb-1">Auteurs/livres appréciés</p>
                          <p className="font-medium text-ink">{favorites}</p>
                        </div>
                      )}
                      {tasteDescription && (
                        <div>
                          <p className="text-inkMuted mb-1">Vos goûts</p>
                          <p className="font-medium text-ink">{tasteDescription}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-inkMuted mb-1">Découverte vs continuité</p>
                        <p className="font-medium text-ink">{
                          discoveryPreference ?
                          { "decouverte": "Découvrir de nouveaux contenus", "habitudes": "Continuer dans mes habitudes", "mix": "Un mix des deux" }[discoveryPreference]
                          : "Non renseigné"
                        }</p>
                      </div>
                    </div>
                  </div>

                  {/* Groupe 5: Consentement */}
                  <div className={`rounded-lg p-4 border ${consent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${consent ? 'bg-green-500' : 'bg-red-500'}`}>
                        <span className="text-white text-sm font-bold">{consent ? '✓' : '✗'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {consent ? 'RGPD accepté' : 'RGPD non accepté'}
                        </p>
                        <p className="text-xs text-inkMuted mt-1">Vos données seront utilisées pour personnaliser vos recommandations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ℹ️ Vérifiez que toutes les informations sont correctes avant de soumettre.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="pt-6 flex justify-between gap-4 border-t border-borderSoft">
            <button
              type="button"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-ink hover:bg-gray-200'
              }`}
            >
              Précédent
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accentHover transition-all"
              >
                Suivant
              </button>
            ) : (
              <Button type="submit" disabled={loading} className="px-12 py-3 text-lg font-semibold">
                {loading ? "Envoi en cours..." : "Valider et continuer"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
