import RadioQuestion from '../RadioQuestion/RadioQuestion'
import GalleryPreview from '../GalleryPreview/GalleryPreview'
import Button from '../Button/Button'
import { icons } from '../../content/icons'
import './OptionCard.css'

function OptionCard(option) {
  const { type, heading, subheading, ctaLabel, href } = option
  const isQuestionnaire = type === 'questionnaire'

  return (
    <div className="option-card">
      <div className="option-card__heading-group">
        <p className="option-card__heading">{heading}</p>
        <p className="option-card__subheading">{subheading}</p>
      </div>

      {isQuestionnaire ? (
        <RadioQuestion
          question={option.question}
          choices={option.choices}
          defaultChoiceId={option.defaultChoiceId}
        />
      ) : (
        <GalleryPreview
          searchPlaceholder={option.searchPlaceholder}
          categories={option.categories}
        />
      )}

      <Button
        href={href}
        variant={isQuestionnaire ? 'solid' : 'outline'}
        icon={isQuestionnaire ? icons.arrowRightWhite : icons.arrowRightDark}
        stretch
      >
        {ctaLabel}
      </Button>
    </div>
  )
}

export default OptionCard
