import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageZoomModal from '../ImageZoomModal/ImageZoomModal'
import { icons } from '../../content/icons'
import './SwatchCard.css'

function SwatchCard({ image, annotatedImage, caption, href, description }) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <div className="swatch-card">
      <div className="swatch-card__media">
        <img src={image} className="swatch-card__image" alt="" />
        {/* Sits above the caption's whole-card stretched link below, so
            zooming never triggers card navigation. */}
        <button
          type="button"
          className="image-zoom-btn"
          onClick={() => setZoomed(true)}
          aria-label={`Enlarge ${caption}`}
        >
          <img src={icons.magnifyingGlass} className="image-zoom-btn__icon" alt="" />
        </button>
      </div>

      <Link to={href} className="swatch-card__caption">
        {caption}
      </Link>

      <ImageZoomModal
        open={zoomed}
        onClose={() => setZoomed(false)}
        title={caption}
        description={description}
        image={image}
        annotatedImage={annotatedImage}
      >
        <Link to={href} className="swatch-card__modal-learn-more">
          Learn More
          <img src={icons.arrowRightRoseSm} className="swatch-card__modal-learn-more-icon" alt="" />
        </Link>
      </ImageZoomModal>
    </div>
  )
}

export default SwatchCard
