import { useState, useMemo } from "react"

export default function CategoryFilter({
  items,
  onFilterChange,
  filterKey = "thematique",
  categoryField,
  selectedCategory: externalSelectedCategory,
  onCategoryChange,
  totalCount,
  filteredCount
}) {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState("")

  // Support pour usage contrôlé ou non contrôlé
  const selectedCategory = externalSelectedCategory !== undefined
    ? externalSelectedCategory
    : internalSelectedCategory

  const handleChange = externalSelectedCategory !== undefined
    ? onCategoryChange
    : (value) => {
      setInternalSelectedCategory(value)
      onFilterChange?.(value)
    }

  // Détecter le champ à utiliser
  const field = categoryField || filterKey

  // Extraire les catégories uniques (supporte les champs simples et tableaux)
  const categories = useMemo(() => {
    const uniqueCategories = new Set()

    items.forEach((item) => {
      const value = item[field]

      // Si c'est un tableau (normalizedCategories)
      if (Array.isArray(value)) {
        value.forEach(cat => {
          if (cat && cat.trim() !== "") {
            uniqueCategories.add(cat)
          }
        })
      }
      // Si c'est une chaîne simple (thematique, categorie)
      else if (value && value.trim() !== "") {
        uniqueCategories.add(value)
      }
    })

    return Array.from(uniqueCategories).sort()
  }, [items, field])

  const displayTotalCount = totalCount !== undefined ? totalCount : items.length
  const displayFilteredCount = filteredCount !== undefined ? filteredCount : items.length

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <label htmlFor="category-filter" className="text-sm font-semibold text-ink">
        Filtrer par catégorie :
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => handleChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-ink bg-white hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
      >
        <option value="">
          Toutes les catégories ({displayTotalCount})
        </option>
        {categories.map((category) => {
          // Compter les items contenant cette catégorie
          const count = items.filter((item) => {
            const value = item[field]
            if (Array.isArray(value)) {
              return value.includes(category)
            }
            return value === category
          }).length

          return (
            <option key={category} value={category}>
              {category} ({count})
            </option>
          )
        })}
      </select>

      {selectedCategory && filteredCount !== undefined && (
        <span className="text-sm text-gray-600">
          {displayFilteredCount} résultat{displayFilteredCount > 1 ? "s" : ""}
        </span>
      )}
    </div>
  )
}

