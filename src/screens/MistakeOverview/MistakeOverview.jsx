import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import SignCard from '../../components/SignCard/SignCard'
import CategoryRow from '../../components/CategoryRow/CategoryRow'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { backLink, examplesLabel, mistakeOverviews } from '../../content/mistakeOverview'
import { categories } from '../../content/galleryOfMistakes'
import './MistakeOverview.css'

function MistakeOverview() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const overview = mistakeOverviews[categoryId]
  const category = categories.find((item) => item.id === categoryId)

  if (!overview || !category) return <NotBuilt />

  return (
    <div className="mistake-overview">
      <Navbar />
      <main className="mistake-overview__content">
        <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
          <img src={icons.chevronLeft} className="btn__icon" alt="" />
          <span>{backLink.label}</span>
        </button>

        <h1 className="mistake-overview__title">{overview.title}</h1>

        <div className="mistake-overview__split">
          <div className="mistake-overview__left-col">
            <p className="mistake-overview__media-caption">How It Happens</p>
            <div className="mistake-overview__media">
              {overview.image ? (
                <img src={overview.image} alt="" className="mistake-overview__media-img" />
              ) : (
                <div className="mistake-overview__media-placeholder">
                  <p>Photo coming soon</p>
                </div>
              )}
            </div>
          </div>

          <div className="mistake-overview__right-col">
            <section className="mistake-overview__section">
              <p className="mistake-overview__section-heading">{overview.whatIsIt.heading}</p>
              <div className="mistake-overview__divider" role="presentation" />
              <p className="mistake-overview__body">{overview.whatIsIt.body || 'More detail coming soon.'}</p>
            </section>

            <section className="mistake-overview__section">
              <p className="mistake-overview__section-heading mistake-overview__section-heading--small">
                {overview.signs.heading}
              </p>
              <div className="mistake-overview__signs">
                {overview.signs.items.map((sign) => (
                  <SignCard key={sign.id} label={sign.label || 'More signs coming soon'} detail={sign.detail} />
                ))}
              </div>
            </section>

            <Button href={overview.cta.href} variant="gold" icon={icons.arrowRightBlack}>
              {overview.cta.label}
            </Button>
          </div>
        </div>

        <CategoryRow label={examplesLabel} swatches={category.swatches} showSeeMore={false} />
      </main>
    </div>
  )
}

export default MistakeOverview
