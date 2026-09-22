import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../Modal/Modal'
import { icons } from '../../content/icons'
import './SwatchCard.css'

function SwatchCard({ image, caption, href, description }) {
  const [zoomed, setZoomed] = useState(false)
  const titleId = useId()

  return (
    <div className="swatch-card">
      <div className="swatch-card__media">
        <img src={image} className="swatch-card__image" alt="" />
        <button
          type="button"
          className="swatch-card__zoom-btn"
          onClick={() => setZoomed(true)}
          aria-label={`Enlarge ${caption}`}
        >
          <img src={icons.magnifyingGlass} className="swatch-card__zoom-icon" alt="" />
        </button>
      </div>

      <Link to={href} className="swatch-card__caption">
        {caption}
      </Link>

      <Modal open={zoomed} onClose={() => setZoomed(false)} labelledBy={titleId}>
        <div className="swatch-card__modal-details">
          <p id={titleId} className="swatch-card__modal-title">{caption}</p>
          {description && <p className="swatch-card__modal-description">{description}</p>}
        </div>
        <div className="swatch-card__modal-image-wrap">
          <img src={image} className="swatch-card__modal-image" alt="" />
        </div>
        <Link to={href} className="swatch-card__modal-learn-more">
          Learn More
          <img src={icons.arrowRightRoseSm} className="swatch-card__modal-learn-more-icon" alt="" />
        </Link>
      </Modal>
    </div>
  )
}

export default SwatchCard
