import { useId, useState } from 'react'
import Modal from '../Modal/Modal'
import Magic8Ball from '../Magic8Ball/Magic8Ball'
import RepairMethodCard from '../RepairMethodCard/RepairMethodCard'
import { eightBallPopup } from '../../content/repairOptions'
import './EightBallPopup.css'

function pickRandomMethod(methods, excludeId) {
  // Each method has its own "Include In Eight Ball" toggle in the admin
  // tool — defaults to true, so a method with no opinion set either way is
  // still eligible rather than silently excluded.
  const pool = methods.filter((method) => method.includeInEightBall !== false)
  // Never repeat the same answer twice in a row on a re-shake — unless it's
  // the only eligible method, in which case there's nothing else to pick.
  const candidates = pool.length > 1 ? pool.filter((method) => method.id !== excludeId) : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function ballMessageFor(method) {
  return method?.title ?? ''
}

function EightBallPopup({ open, onClose, methods }) {
  const [shaking, setShaking] = useState(false)
  const [result, setResult] = useState(null)
  const titleId = useId()

  // Sticky once true — a re-shake only replaces the wiggle/answer, it never
  // collapses the layout back to centered.
  const hasResult = result !== null

  const handleShake = () => {
    if (shaking) return
    setShaking(true)
  }

  const handleShakeEnd = () => {
    setResult((previous) => pickRandomMethod(methods, previous?.id))
    setShaking(false)
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} bare cardClassName="eightball-popup">
      <button type="button" className="eightball-popup__close" onClick={onClose} aria-label="Close">
        x
      </button>

      <div className="eightball-popup__header">
        <p id={titleId} className="eightball-popup__title">
          {hasResult ? eightBallPopup.resultHeading : eightBallPopup.askHeading}
        </p>
        <p className="eightball-popup__subtitle">
          {hasResult ? eightBallPopup.resultSubheading : eightBallPopup.askSubheading}
        </p>
      </div>

      <div className="eightball-popup__row">
        <div className="eightball-popup__ball-col">
          <Magic8Ball
            shaking={shaking}
            revealed={hasResult}
            message={ballMessageFor(result)}
            onShakeEnd={handleShakeEnd}
          />
          <button
            type="button"
            className="eightball-popup__shake-btn"
            onClick={handleShake}
            disabled={shaking}
          >
            {hasResult ? eightBallPopup.shakeAgainLabel : eightBallPopup.shakeLabel}
          </button>
        </div>

        <div className={`eightball-popup__result-slot${hasResult ? ' eightball-popup__result-slot--visible' : ''}`}>
          {result && <RepairMethodCard {...result} badge="8ball" />}
        </div>
      </div>
    </Modal>
  )
}

export default EightBallPopup
