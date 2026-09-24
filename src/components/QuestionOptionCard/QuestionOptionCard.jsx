import { useState } from 'react'
import ImageZoomModal from '../ImageZoomModal/ImageZoomModal'
import { icons } from '../../content/icons'
import './QuestionOptionCard.css'

// Visually matches Figma's radio-styled card, but behaves as a toggle (not
// mutually exclusive) — some questions require selecting more than one option
// together, so every question uses the same toggle-capable card.
//
// The card itself isn't a <button> because it holds a second control (the
// zoom button), and buttons can't nest. Instead the "Select" pill is the real,
// keyboard-reachable toggle, and clicking anywhere else on the card is a
// mouse shortcut for it.
function QuestionOptionCard({ label, description, image, annotatedImage, howToTell, selected, onToggle }) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      <div className={`question-card${selected ? ' question-card--selected' : ''}`} onClick={onToggle}>
        <div className="question-card__meta">
          <p className="question-card__title">{label}</p>
          {description && <p className="question-card__description">{description}</p>}
        </div>

        {image ? (
          <div className="question-card__media">
            <img src={image} className="question-card__image" alt="" />
            <button
              type="button"
              className="image-zoom-btn"
              onClick={(event) => {
                event.stopPropagation()
                setZoomed(true)
              }}
              aria-label={`Enlarge ${label}`}
            >
              <img src={icons.magnifyingGlass} className="image-zoom-btn__icon" alt="" />
            </button>
          </div>
        ) : (
          <div className="question-card__image question-card__image--placeholder" aria-hidden="true" />
        )}

        {howToTell && howToTell.length > 0 && (
          <>
            <p className="question-card__how-to-tell-heading">How to tell:</p>
            <ol className="question-card__how-to-tell-list">
              {howToTell.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ol>
          </>
        )}

        <button
          type="button"
          className="question-card__selector"
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
          aria-pressed={selected}
          aria-label={`Select ${label}`}
        >
          <span className="question-card__selector-dot">
            {selected && <img src={icons.check} alt="" />}
          </span>
          {selected ? 'Selected' : 'Select'}
        </button>
      </div>

      {/* Kept outside the card: React events bubble through portals, so a
          click inside the modal would otherwise also toggle the card. */}
      {image && (
        <ImageZoomModal
          open={zoomed}
          onClose={() => setZoomed(false)}
          title={label}
          description={description}
          image={image}
          annotatedImage={annotatedImage}
        />
      )}
    </>
  )
}

export default QuestionOptionCard
