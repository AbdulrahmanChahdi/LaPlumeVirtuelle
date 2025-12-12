export default function Input(props) {
  return (
    <input
      {...props}
      className="
        w-full
        bg-white
        border border-borderSoft
        rounded
        px-3 py-2
        text-ink
        placeholder-inkMuted
        focus:outline-none
        focus:ring-2 focus:ring-accent
      "
    />
  )
}
