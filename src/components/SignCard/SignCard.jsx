import { useId, useState } from 'react'
import Modal from '../Modal/Modal'
import './SignCard.css'

function SignCard({ label, detail }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()

  return (
    <div className="sign-card">
      <p className="sign-card__label">{label}</p>
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
        <p className="sign-card__modal-detail">{detail || 'More detail coming soon.'}</p>
      </Modal>
    </div>
  )
}

export default SignCard
