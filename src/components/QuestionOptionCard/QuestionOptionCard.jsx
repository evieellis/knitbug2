import { icons } from '../../content/icons'
import './QuestionOptionCard.css'

// Visually matches Figma's radio-styled card, but behaves as a toggle (not
// mutually exclusive) — some questions require selecting more than one option
// together, so every question uses the same toggle-capable card.
function QuestionOptionCard({ label, description, image, howToTell, selected, onToggle }) {
  return (
    <button
      type="button"
      className={`question-card${selected ? ' question-card--selected' : ''}`}
      onClick={onToggle}
      aria-pressed={selected}
    >
      <div className="question-card__meta">
        <p className="question-card__title">{label}</p>
        {description && <p className="question-card__description">{description}</p>}
      </div>

      {image ? (
        <img src={image} className="question-card__image" alt="" />
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

      <span className="question-card__selector">
        <span className="question-card__selector-dot">
          {selected && <img src={icons.check} alt="" />}
        </span>
        {selected ? 'Selected' : 'Select'}
      </span>
    </button>
  )
}

export default QuestionOptionCard
