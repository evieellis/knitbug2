import './Magic8Ball.css'

// `shaking` toggles the wiggle animation; `revealed` picks which face shows
// (digit vs. answer). They're independent so a re-shake can replay the wiggle
// in place without the face reverting to "8" or the layout resetting.
function Magic8Ball({ shaking, revealed, message, onShakeEnd }) {
  return (
    <div
      className={`magic-8ball${shaking ? ' magic-8ball--shaking' : ''}`}
      onAnimationEnd={shaking ? onShakeEnd : undefined}
    >
      <div className="magic-8ball__glare" aria-hidden="true" />
      <div className="magic-8ball__window">
        <div className={`magic-8ball__face magic-8ball__face--digit${revealed ? '' : ' magic-8ball__face--visible'}`}>
          <p className="magic-8ball__digit">8</p>
        </div>
        <div className={`magic-8ball__face magic-8ball__face--message${revealed ? ' magic-8ball__face--visible' : ''}`}>
          <p className="magic-8ball__message">{message}</p>
        </div>
        <div className="magic-8ball__glass-shine" aria-hidden="true" />
      </div>
    </div>
  )
}

export default Magic8Ball
