import { useId, useState } from 'react'
import Modal from '../Modal/Modal'
import Magic8Ball from '../Magic8Ball/Magic8Ball'
import RepairMethodCard from '../RepairMethodCard/RepairMethodCard'
import { eightBallPopup } from '../../content/repairOptions'
import './EightBallPopup.css'

function pickRandomMethod(methods) {
  // The ball only ever recommends an actual fix, never "just leave it".
  const pool = methods.filter((method) => method.badge !== 'not-recommended')
  return pool[Math.floor(Math.random() * pool.length)]
}

function ballMessageFor(method) {
  if (!method?.neededLabel) return ''
  const tool = method.neededLabel.replace(/^Needed:\s*/i, '')
  return `Use a ${tool}.`
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
    setResult(pickRandomMethod(methods))
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
