import Button from '../Button/Button'
import { icons } from '../../content/icons'
import { siteName } from '../../content/navigation'
import './TutorialHeader.css'

// Minimal focus-mode header used while actively following a tutorial's steps
// (the Overview page keeps the standard Navbar). "Exit" leaves the whole
// guided flow, unlike "Back to Overview"/"Previous Step" which stay inside it.
function TutorialHeader({ exitHref }) {
  return (
    <header className="tutorial-header">
      <Button href={exitHref} variant="chip" className="tutorial-header__exit" icon={icons.xClose} iconPosition="leading">
        Exit Tutorial
      </Button>
      <div className="tutorial-header__logo">
        <span className="tutorial-header__logo-badge">
          <img src={icons.bug} className="tutorial-header__logo-icon" alt="" />
        </span>
        <p className="tutorial-header__logo-text">{siteName}</p>
      </div>
    </header>
  )
}

export default TutorialHeader
