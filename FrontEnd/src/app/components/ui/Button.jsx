import { useState } from "react"

export default function Button({ 
  children, 
  onClick, 
  type = "button", 
  disabled = false, 
  className = "", 
  variant = "primary",
  ariaLabel,
  ariaDescribedBy,
  ...props 
}) {
  const [ripples, setRipples] = useState([])

  const baseClasses = `
    relative px-4 sm:px-6 py-2 sm:py-3 rounded
    text-sm sm:text-base
    transition-[background-color,transform] duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
    overflow-hidden
  `;

  const variantClasses = {
    primary: `
      bg-accent text-white
      hover:bg-accentHover active:scale-95
      focus:ring-accent
    `,
    secondary: `
      bg-gray-200 text-ink
      hover:bg-gray-300 active:scale-95
      focus:ring-gray-400
    `,
    tertiary: `
      bg-transparent text-accent border border-accent
      hover:bg-accent/10 active:scale-95
      focus:ring-accent
    `
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`;

  const handleClick = (e) => {
    if (disabled) return

    // Create ripple effect from click point
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    }

    setRipples([...ripples, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={combinedClasses}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-30 pointer-events-none animate-ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      <span className="relative">{children}</span>
    </button>
  )
}
