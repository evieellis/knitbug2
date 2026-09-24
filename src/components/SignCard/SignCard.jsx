import { useId, useState } from 'react'
import Modal from '../Modal/Modal'
import './SignCard.css'

function SignCard({ label, detail, image }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  // Same rule as ChecklistItem: only offer the "?" when there's something to
  // show — a picture alone is enough, it doesn't need detail text with it.
  const hasPopup = Boolean(detail || image)

  return (
    <div className="sign-card">
      <p className="sign-card__label">{label}</p>
      {hasPopup && (
        <>
          <button
            type="button"
            className="sign-card__badge"
            onClick={() => setOpen(true)}
            aria-label={`More detail about "${label}"`}
          >
            ?
          </button>

          <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
            <p id={titleId} className="sign-card__modal-title">{label}</p>
            {image && <img src={image} className="sign-card__modal-image" alt="" />}
            {detail && <p className="sign-card__modal-detail">{detail}</p>}
          </Modal>
        </>
      )}
    </div>
  )
}

export default SignCard
