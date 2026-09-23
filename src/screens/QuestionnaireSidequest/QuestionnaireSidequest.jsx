import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { sidequestSteps } from '../../content/questionnaire'
import './QuestionnaireSidequest.css'

// Two-step number-entry side path off Q7 ("Can't tell" whether the work got wider or
// narrower) — carries sidequest-1's cast-on count forward via router state, since a
// typed number can't be baked into a static link the way question options are.
function QuestionnaireSidequest({ step }) {
  const navigate = useNavigate()
  const location = useLocation()
  const depth = location.state?.depth ?? 1
  const castOn = location.state?.castOn

  const [value, setValue] = useState('')
  const [revealed, setRevealed] = useState(false)

  const stepData = sidequestSteps[`sidequest-${step}`]
  if (!stepData) return <NotBuilt />
  // sidequest-2 requires sidequest-1's answer — a direct/stale visit has nothing to compare against.
  if (step === '2' && (castOn === undefined || castOn === null)) return <NotBuilt />

  const numericValue = Number(value)
  const isValid = value !== '' && Number.isFinite(numericValue) && numericValue >= 0

  let message = ''
  let destination = null
  if (step === '2' && revealed) {
    if (numericValue > castOn) {
      message = 'Looks like your work got wider!'
      destination = '/questionnaire/q8'
    } else if (castOn > numericValue) {
      message = 'Looks like your work got narrower!'
      destination = '/questionnaire/results/accidental-decrease'
    } else {
      message = "Neither happened — let's go back and check your answers."
      destination = '/questionnaire/uncertain'
    }
  }

  const handlePrimary = () => {
    if (!isValid) return
    if (step === '1') {
      navigate('/questionnaire/sidequest-2', { state: { depth: depth + 1, castOn: numericValue } })
      return
    }
    if (!revealed) {
      setRevealed(true)
      return
    }
    navigate(destination, { state: { depth: depth + 1 } })
  }

  return (
    <div className="questionnaire-sidequest">
      <Navbar />
      <main className="questionnaire-sidequest__content">
        <div className="questionnaire-sidequest__top-bar">
          <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
            <img src={icons.chevronLeft} className="btn__icon" alt="" />
            <span>Back</span>
          </button>
          <span className="questionnaire-sidequest__step">Step {depth}</span>
        </div>

        <div className="questionnaire-sidequest__card">
          <div className="questionnaire-sidequest__header">
            <h1 className="questionnaire-sidequest__title">{stepData.title}</h1>
            {stepData.subtitle && <p className="questionnaire-sidequest__subtitle">{stepData.subtitle}</p>}
          </div>

          <label className="questionnaire-sidequest__field">
            <span className="questionnaire-sidequest__field-label">{stepData.inputLabel}</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              className="questionnaire-sidequest__input"
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                setRevealed(false)
              }}
            />
          </label>

          {message && <p className="questionnaire-sidequest__message">{message}</p>}

          <button
            type="button"
            className="btn btn--gold questionnaire-sidequest__continue"
            onClick={handlePrimary}
            disabled={!isValid}
          >
            <span>{step === '2' && revealed ? 'Continue' : 'Submit'}</span>
            <img src={icons.arrowRightBlack} className="btn__icon" alt="" />
          </button>
        </div>
      </main>
    </div>
  )
}

export default QuestionnaireSidequest
