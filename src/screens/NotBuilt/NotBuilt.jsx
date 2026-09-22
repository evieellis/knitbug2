import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import { icons } from '../../content/icons'
import './NotBuilt.css'

function NotBuilt() {
  return (
    <div className="not-built">
      <Navbar />
      <main className="not-built__content">
        <p className="not-built__message">This screen hasn't been built yet.</p>
        <Button href="/" variant="chip" icon={icons.chevronLeft} iconPosition="leading">
          Back to Home
        </Button>
      </main>
    </div>
  )
}

export default NotBuilt
