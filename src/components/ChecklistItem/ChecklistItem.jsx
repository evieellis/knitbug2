import { useId, useState } from 'react'
import Modal from '../Modal/Modal'
import { icons } from '../../content/icons'
import './ChecklistItem.css'

function ChecklistItem({ status, text, detail, image }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const isWarning = status === 'warning'
  // A picture alone is reason enough to offer the popup — it doesn't need
  // detail text to go with it.
  const hasPopup = Boolean(detail || image)

  return (
    <div className="checklist-item">
      <span className={`checklist-item__badge checklist-item__badge--${status}`}>
        <img src={isWarning ? icons.alertTriangleGold : icons.checkSage} alt="" />
      </span>
      <p className="checklist-item__text">{text}</p>
      {hasPopup && (
        <>
          <button
            type="button"
            className="checklist-item__help"
            onClick={() => setOpen(true)}
            aria-label={`More detail about "${text}"`}
          >
            ?
          </button>
          <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
            <p id={titleId} className="checklist-item__modal-title">{text}</p>
            {image && <img src={image} className="checklist-item__modal-image" alt="" />}
            {detail && <p className="checklist-item__modal-detail">{detail}</p>}
          </Modal>
        </>
      )}
    </div>
  )
}

export default ChecklistItem
