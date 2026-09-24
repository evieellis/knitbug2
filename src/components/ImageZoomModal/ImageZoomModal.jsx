import { useId, useState } from 'react'
import Modal from '../Modal/Modal'
import './ImageZoomModal.css'

// Enlarged view of a photo, shared by the gallery swatches and the
// questionnaire's option cards. When an annotated copy exists, a toggle
// switches between it and the plain photo. `children` renders below the image
// (e.g. a "Learn More" link).
function ImageZoomModal({ open, onClose, ...contentProps }) {
  const titleId = useId()

  // The content only mounts while open, so the photo toggle starts fresh on
  // the original photo every time the popup is reopened.
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <ImageZoomContent titleId={titleId} {...contentProps} />
    </Modal>
  )
}

function ImageZoomContent({ titleId, title, description, image, annotatedImage, children }) {
  const [showAnnotated, setShowAnnotated] = useState(false)
  const hasAnnotation = Boolean(annotatedImage)
  const modalImage = hasAnnotation && showAnnotated ? annotatedImage : image

  return (
    <>
      <div className="image-zoom__details">
        <p id={titleId} className="image-zoom__title">{title}</p>
        {description && <p className="image-zoom__description">{description}</p>}
      </div>

      {hasAnnotation && (
        <div className="image-zoom__toggle" role="group" aria-label="Photo version">
          <button
            type="button"
            className={`image-zoom__toggle-btn${!showAnnotated ? ' image-zoom__toggle-btn--active' : ''}`}
            onClick={() => setShowAnnotated(false)}
          >
            Original
          </button>
          <button
            type="button"
            className={`image-zoom__toggle-btn${showAnnotated ? ' image-zoom__toggle-btn--active' : ''}`}
            onClick={() => setShowAnnotated(true)}
          >
            Annotated
          </button>
        </div>
      )}

      <div className="image-zoom__image-wrap">
        <img src={modalImage} className="image-zoom__image" alt="" />
      </div>
      {children}
    </>
  )
}

export default ImageZoomModal
