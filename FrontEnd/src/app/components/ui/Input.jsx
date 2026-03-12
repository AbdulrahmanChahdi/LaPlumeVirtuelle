export default function Input({ 
  className = "", 
  label,
  error,
  helpText,
  id,
  required,
  rightElement,
  ...props 
}) {
  const inputId = id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`
  const helpTextId = `${inputId}-help`
  const errorId = `${inputId}-error`
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-ink mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <div className={rightElement ? "relative" : undefined}>
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helpText ? helpTextId : undefined}
          {...props}
          className={`
            w-full
            bg-gradient-to-br from-white to-accent/2
            border border-borderSoft
            rounded-lg
            px-3 sm:px-4 py-2 sm:py-3
            text-sm sm:text-base
            text-ink
            placeholder-inkMuted
            font-medium
            shadow-sm
            hover:border-accent/50
            focus:outline-none
            focus:border-accent
            focus:ring-2
            focus:ring-accent/20
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-[border-color,box-shadow,background-color] duration-200
            ${error ? 'border-red-500 focus:ring-red-200' : ''}
            ${rightElement ? 'pr-10' : ''}
            ${className}
          `}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <span aria-hidden="true">?</span> {error}
        </p>
      )}
      {helpText && !error && (
        <p id={helpTextId} className="text-inkMuted text-sm mt-1">
          {helpText}
        </p>
      )}
    </div>
  )
}
