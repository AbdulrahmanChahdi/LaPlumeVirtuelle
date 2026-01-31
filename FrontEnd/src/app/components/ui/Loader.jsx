export default function Loader({ label = "Chargement..." }) {
  return (
    <div className="flex justify-center items-center py-8 sm:py-10">
      <div className="flex flex-col items-center gap-4">
        <div 
          className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label={label}
        />
        <span className="text-sm text-inkMuted sr-only">{label}</span>
      </div>
    </div>
  )
}
