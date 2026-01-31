import { useEffect, useRef } from "react"

export default function Modal({ open, onClose, children, title, ariaLabelledBy }) {
  const modalRef = useRef(null)
  const previouslyFocusedElement = useRef(null)

  useEffect(() => {
    if (open) {
      previouslyFocusedElement.current = document.activeElement
      // Trap focus in modal
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose()
        }
      }
      document.addEventListener("keydown", handleKeyDown)
      // Focus first focusable element
      modalRef.current?.focus()
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = "unset"
      }
    } else {
      // Restore focus when modal closes
      previouslyFocusedElement.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`
  const titleId = ariaLabelledBy || `${modalId}-title`

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-lg relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {title && (
          <h2 id={titleId} className="text-xl sm:text-2xl font-bold mb-4">
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-inkMuted hover:text-ink hover:bg-paperSoft rounded transition-colors"
          aria-label="Fermer la fenêtre"
        >
          <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </div>
  )
}
