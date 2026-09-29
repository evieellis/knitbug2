import { useId } from 'react'
import './RadioQuestion.css'

// Controlled: the parent owns the selection (null = nothing picked). Clicking the
// already-checked choice clears it — native radios can't be unchecked, and never
// fire change for that click, so onClick handles it.
function RadioQuestion({ question, choices, selectedId, onSelect }) {
  const name = useId()
  const titleId = useId()

  // A plain div instead of <fieldset>/<legend> — browsers give <legend> special
  // positioning that straddles its fieldset's top edge (the native "notched
  // border" look), which here just made the title sit half in / half out of
  // this box. role="radiogroup" + aria-labelledby keeps the same semantics.
  return (
    <div className="radio-question" role="radiogroup" aria-labelledby={titleId}>
      <p id={titleId} className="radio-question__legend">{question}</p>
      <div className="radio-question__choices">
        {choices.map((choice) => (
          <label key={choice.id} className="radio-question__choice">
            <input
              type="radio"
              name={name}
              value={choice.id}
              checked={selectedId === choice.id}
              onChange={() => onSelect(choice.id)}
              onClick={() => {
                if (selectedId === choice.id) onSelect(null)
              }}
              className="radio-question__input"
            />
            <span className="radio-question__label">{choice.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default RadioQuestion
