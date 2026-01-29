import { useState } from "react"

export default function Button({ children, onClick, type = "button", disabled = false, className = "", ...props }) {
  const [ripples, setRipples] = useState([])

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
      className={`
        relative bg-accent text-white
        px-6 py-2 rounded
        hover:bg-accentHover active:scale-95
        transition-[background-color,transform] duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        ${className}
      `}
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
