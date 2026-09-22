import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { icons } from '../../content/icons'
import './Modal.css'

function Modal({ open, onClose, labelledBy, children, bare = false, cardClassName = '' }) {
  const closeButtonRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    if (bare) cardRef.current?.focus()
    else closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
    }
  }, [open, onClose, bare])

  if (!open) return null

  // Rendered into document.body so it's never a descendant of an ancestor
  // that would clip or trap it (e.g. an overflow:hidden or mask-image
  // container like the gallery's category rows).
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={cardRef}
        className={`modal-card${cardClassName ? ` ${cardClassName}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={bare ? -1 : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {!bare && (
          <div className="modal-card__header">
            <button
              type="button"
              ref={closeButtonRef}
              className="modal-card__close"
              onClick={onClose}
              aria-label="Close"
            >
              <img src={icons.xClose} className="modal-card__close-icon" alt="" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
