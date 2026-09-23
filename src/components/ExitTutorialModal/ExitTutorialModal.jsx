import { useId } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../Modal/Modal'
import { icons } from '../../content/icons'
import './ExitTutorialModal.css'

function ExitTutorialModal({ open, onCancel, exitHref }) {
  const titleId = useId()

  return (
    <Modal open={open} onClose={onCancel} labelledBy={titleId} bare cardClassName="exit-tutorial-modal">
      <div className="exit-tutorial-modal__header">
        <span className="exit-tutorial-modal__badge" aria-hidden="true">
          <img src={icons.alertTriangle} alt="" />
        </span>
        <p id={titleId} className="exit-tutorial-modal__title">
          Are you sure you want to exit?
        </p>
      </div>

      <p className="exit-tutorial-modal__body">Tutorial progress will not be saved.</p>

      <div className="exit-tutorial-modal__actions">
        <button type="button" className="exit-tutorial-modal__go-back" onClick={onCancel}>
          <img src={icons.chevronLeft} className="exit-tutorial-modal__go-back-icon" alt="" />
          <span>Go Back</span>
        </button>
        <Link to={exitHref} className="exit-tutorial-modal__confirm">
          <img src={icons.xClose} alt="" />
          <span>Exit Tutorial</span>
        </Link>
      </div>
    </Modal>
  )
}

export default ExitTutorialModal
