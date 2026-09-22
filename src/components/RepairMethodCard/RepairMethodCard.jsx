import ArrowLink from '../ArrowLink/ArrowLink'
import { icons } from '../../content/icons'
import './RepairMethodCard.css'

const badges = {
  recommended: { label: '★ Our Recommendation', className: 'repair-card__badge--recommended' },
  'not-recommended': { label: 'Not Recommended', className: 'repair-card__badge--not-recommended' },
  '8ball': { label: "🎱 Ball's Choice", className: 'repair-card__badge--8ball' },
}

function RepairMethodCard({
  title,
  description,
  image,
  timeLabel,
  neededLabel,
  warningText,
  ctaLabel = 'View Tutorial',
  badge,
  href,
}) {
  const badgeInfo = badge && badges[badge]
  const isWarning = badge === 'not-recommended'

  return (
    <div className={`repair-card${badge ? ` repair-card--${badge}` : ''}`}>
      <div className="repair-card__body">
        <div className="repair-card__header">
          {badgeInfo && <span className={`repair-card__badge ${badgeInfo.className}`}>{badgeInfo.label}</span>}
        </div>
        <p className="repair-card__title">{title}</p>
        <img src={image} className="repair-card__image" alt="" />

        {isWarning ? (
          <p className="repair-card__warning">
            <img src={icons.alertTriangle} className="repair-card__warning-icon" alt="" />
            {warningText}
          </p>
        ) : (
          <>
            <p className="repair-card__description">{description}</p>
            <div className="repair-card__metadata">
              <span className="repair-card__meta-row">
                <img src={icons.clock} className="repair-card__meta-icon" alt="" />
                {timeLabel}
              </span>
              <span className="repair-card__meta-row">
                <img src={icons.shoppingBag} className="repair-card__meta-icon" alt="" />
                {neededLabel}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="repair-card__footer">
        <ArrowLink href={href} tone="rose" stretch>
          {ctaLabel}
        </ArrowLink>
      </div>
    </div>
  )
}

export default RepairMethodCard
