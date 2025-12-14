export default function Card({ children }) {
  return (
    <div
      className="
        bg-white
        border border-borderSoft
        rounded-lg
        p-6
        shadow-sm
      "
    >
      {children}
    </div>
  )
}
