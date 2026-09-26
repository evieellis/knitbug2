import ArrowLink from '../ArrowLink/ArrowLink'
import RepairBadge from '../RepairBadge/RepairBadge'
import RepairStageBadges from '../RepairStageBadge/RepairStageBadge'
import { icons } from '../../content/icons'
import useFillLineClamp from '../../hooks/useFillLineClamp'
import './RepairMethodCard.css'

function RepairMethodCard({ title, description, image, timeLabel, neededLabel, warningText, badge, stages, href }) {
  // Every card has a plain description; warningText is an optional extra line
  // under it — red with a warning icon on a "Not Recommended" card, otherwise
  // a reassuring green check (e.g. "Won't unravel!").
  const isNegativeMessage = badge === 'not-recommended'
  // The button's own wording is a fixed rule off the badge, not a per-method
  // field — every card says "View Tutorial" except a "Not Recommended" one,
  // which points at a temporary fix instead.
  const ctaLabel = isNegativeMessage ? 'View a Temporary Fix Instead' : 'View Tutorial'
  // The description fills whatever space is left above time/needed,
  // clamped to as many lines as fit there.
  const textRef = useFillLineClamp()

  return (
    <div className={`repair-card${badge ? ` repair-card--${badge}` : ''}`}>
      <div className="repair-card__body">
        <div className="repair-card__header">
          <RepairBadge badge={badge} />
          <RepairStageBadges stages={stages} />
        </div>
        <p className="repair-card__title">{title}</p>
        <img src={image} className="repair-card__image" alt="" />

        <div ref={textRef} className="repair-card__description-wrap">
          <p className="repair-card__description">{description}</p>
        </div>

        {warningText && (
          <p className={`repair-card__warning${isNegativeMessage ? '' : ' repair-card__warning--positive'}`}>
            <img
              src={isNegativeMessage ? icons.alertTriangle : icons.checkSage}
              className="repair-card__warning-icon"
              alt=""
            />
            <span className="repair-card__warning-text">{warningText}</span>
          </p>
        )}
      </div>

      {/* Its own group with the footer, not part of the body above — keeps
          time/needed anchored near the button at the bottom of the card
          instead of crowding right under the description. */}
      <div className="repair-card__bottom">
        {(timeLabel || neededLabel) && (
          <div className="repair-card__metadata">
            {timeLabel && (
              <span className="repair-card__meta-row">
                <img src={icons.clock} className="repair-card__meta-icon" alt="" />
                {timeLabel}
              </span>
            )}
            {neededLabel && (
              <span className="repair-card__meta-row">
                <img src={icons.shoppingBag} className="repair-card__meta-icon" alt="" />
                {neededLabel}
              </span>
            )}
          </div>
        )}
        <div className="repair-card__footer">
          <ArrowLink href={href} tone="rose" stretch>
            {ctaLabel}
          </ArrowLink>
        </div>
      </div>
    </div>
  )
}

export default RepairMethodCard
