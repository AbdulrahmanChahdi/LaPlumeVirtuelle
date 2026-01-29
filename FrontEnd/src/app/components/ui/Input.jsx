export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`
        w-full
        bg-gradient-to-br from-white to-accent/2
        border border-borderSoft
        rounded-lg
        px-4 py-3
        text-ink
        placeholder-inkMuted
        font-medium
        shadow-sm
        hover:border-accent/50
        focus:outline-none
        focus:border-accent
        focus:ring-2
        focus:ring-accent/20
        transition-[border-color,box-shadow,background-color] duration-200
        ${className}
      `}
    />
  )
}
