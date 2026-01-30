import { useState, useRef, useEffect } from "react"

export default function SelectDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder = "Sélectionner...",
  required = false,
  disabled = false,
  className = "",
  label,
  error,
  id,
  ariaDescribedBy
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${selectId}-error`
  const helpTextId = `${selectId}-help`

  // Fermer le dropdown en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Gestion clavier (Escape, Arrow keys)
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const selectedOption = options.find(opt => opt.value === value)
  const selectedLabel = selectedOption?.label || placeholder

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-ink mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div ref={containerRef} className="relative w-full">
        {/* Bouton Select */}
        <button
          ref={buttonRef}
          id={selectId}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : ariaDescribedBy}
          className={`w-full appearance-none bg-gradient-to-br from-white to-accent/2 border border-borderSoft rounded-xl px-4 sm:px-5 py-2 sm:py-3 pr-12 text-left text-sm sm:text-base text-ink font-medium shadow-md hover:shadow-lg hover:border-accent/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isOpen ? "border-accent ring-2 ring-accent/20" : ""
          } ${error ? "border-red-500 focus:ring-red-200" : ""} ${className}`}
        >
          <span className={selectedOption ? "text-ink" : "text-gray-500"}>
            {selectedLabel}
          </span>
        </button>

        {/* Chevron */}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-borderSoft rounded-xl shadow-lg z-50 overflow-hidden"
            role="listbox"
            aria-labelledby={selectId}
          >
            {/* Placeholder option */}
            {!value && (
              <button
                type="button"
                className="w-full text-left px-4 sm:px-5 py-2 sm:py-3 text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-borderSoft text-sm sm:text-base"
                onClick={() => setIsOpen(false)}
              >
                {placeholder}
              </button>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base transition-colors border-b border-borderSoft last:border-b-0 focus:outline-none focus:bg-accent/10 ${
                    value === option.value
                      ? "bg-accent/10 text-accent font-semibold hover:bg-accent/15"
                      : "text-ink hover:bg-accent/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hidden input pour les validations HTML */}
        {required && <input type="hidden" required value={value} />}
      </div>

      {/* Error message */}
      {error && (
        <p id={errorId} className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  )
}
