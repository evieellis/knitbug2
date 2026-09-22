import { useId, useState } from 'react'
import Modal from '../Modal/Modal'
import { icons } from '../../content/icons'
import './ChecklistItem.css'

function ChecklistItem({ status, text, detail }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const isWarning = status === 'warning'

  return (
    <div className="checklist-item">
      <span className={`checklist-item__badge checklist-item__badge--${status}`}>
        <img src={isWarning ? icons.alertTriangleGold : icons.checkSage} alt="" />
      </span>
      <p className="checklist-item__text">{text}</p>
      {detail && (
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
            <p className="checklist-item__modal-detail">{detail}</p>
          </Modal>
        </>
      )}
    </div>
  )
}

export default ChecklistItem
