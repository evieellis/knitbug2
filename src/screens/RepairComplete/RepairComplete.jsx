import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { mistakeOverviews } from '../../content/mistakeOverview'
import { heading, subtitle, returnHomeLabel, backToRepairOptionsLabel } from '../../content/repairComplete'
import './RepairComplete.css'

function RepairComplete() {
  const { categoryId } = useParams()
  const overview = mistakeOverviews[categoryId]

  if (!overview) return <NotBuilt />

  return (
    <div className="repair-complete">
      <Navbar />
      <main className="repair-complete__content">
        <div className="repair-complete__text">
          <h1 className="repair-complete__heading">{heading}</h1>
          <p className="repair-complete__subtitle">{subtitle(overview.title.toLowerCase())}</p>
        </div>

        <div className="repair-complete__artwork">
          <img src={icons.celebrationGraphic} className="repair-complete__artwork-image" alt="" />
        </div>

        <div className="repair-complete__cta-group">
          <Button href="/" variant="ghost" className="repair-complete__return-home">
            {returnHomeLabel}
          </Button>
          <Button
            href={`/repair/${categoryId}`}
            variant="rose"
            icon={icons.arrowRightWhite}
            className="repair-complete__repair-options-btn"
          >
            {backToRepairOptionsLabel}
          </Button>
        </div>
      </main>
    </div>
  )
}

export default RepairComplete
