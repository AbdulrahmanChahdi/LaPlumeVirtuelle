export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white
        border border-borderSoft
        rounded-lg
        p-6
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  )
}
