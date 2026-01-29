export default function Button({ children, onClick, type = "button", disabled = false, className = "", ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-accent text-white
        px-6 py-2 rounded
        hover:bg-accentHover
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
