import { useId, useState } from 'react'
import './RadioQuestion.css'

function RadioQuestion({ question, choices, defaultChoiceId }) {
  const [selectedId, setSelectedId] = useState(defaultChoiceId)
  const name = useId()

  return (
    <fieldset className="radio-question">
      <legend className="radio-question__legend">{question}</legend>
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
    </fieldset>
  )
}

export default RadioQuestion
