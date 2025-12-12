export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        bg-accent text-white
        px-6 py-2 rounded
        hover:bg-accentHover
        transition
      "
    >
      {children}
    </button>
  )
}
