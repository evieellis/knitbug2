import ArrowLink from '../ArrowLink/ArrowLink'
import './PromptCard.css'

function PromptCard({ tone, badgeLabel, title, description, ctaLabel, href, emphasized }) {
  return (
    <div className={`prompt-card prompt-card--${tone}${emphasized ? ' prompt-card--emphasized' : ''}`}>
      <span className={`prompt-card__badge prompt-card__badge--${tone}`}>{badgeLabel}</span>
      <p className="prompt-card__title">{title}</p>
      <p className="prompt-card__description">{description}</p>
      <ArrowLink href={href} tone={tone}>
        {ctaLabel}
      </ArrowLink>
    </div>
  )
}

export default PromptCard
