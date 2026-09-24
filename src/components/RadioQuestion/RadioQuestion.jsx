import { useId, useState } from 'react'
import './RadioQuestion.css'

function RadioQuestion({ question, choices, defaultChoiceId }) {
  const [selectedId, setSelectedId] = useState(defaultChoiceId)
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
              onChange={() => setSelectedId(choice.id)}
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
