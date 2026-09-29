import { useState } from 'react'
import ImageZoomModal from '../ImageZoomModal/ImageZoomModal'
import Button from '../Button/Button'
import { icons } from '../../content/icons'
import './SwatchCard.css'

// The whole card (photo + caption) is one button that opens the zoom popup;
// the magnifying glass is just a visual hint. It sits above CategoryRow's
// whole-box "Learn More" link, so clicking a swatch zooms instead of navigating.
function SwatchCard({ image, annotatedImage, caption, href, description }) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <div className="swatch-card">
      <button
        type="button"
        className="swatch-card__trigger"
        onClick={() => setZoomed(true)}
        aria-label={`Enlarge ${caption}`}
      >
        <span className="swatch-card__media">
          <img src={image} className="swatch-card__image" alt="" />
          <span className="image-zoom-btn" aria-hidden="true">
            <img src={icons.zoomInWhite} className="image-zoom-btn__icon" alt="" />
          </span>
        </span>
        <span className="swatch-card__caption">{caption}</span>
      </button>

      <ImageZoomModal
        open={zoomed}
        onClose={() => setZoomed(false)}
        title={caption}
        description={description}
        image={image}
        annotatedImage={annotatedImage}
      >
        <Button href={href} variant="gold" icon={icons.arrowRightBlack}>
          Learn More
        </Button>
      </ImageZoomModal>
    </div>
  )
}

export default SwatchCard
