import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { mistakeOverviews } from '../../content/mistakeOverview'
import { categories } from '../../content/galleryOfMistakes'
import { resultsPage } from '../../content/questionnaire'
import './QuestionnaireResults.css'

// Titles are stored bare ("Dropped Stitch", "Accidental Decrease") since
// they're also used as-is elsewhere (page <h1>s, "{title} Repair Options") —
// this is the one spot that needs "a"/"an" in front, picked by whether the
// title starts with a vowel sound rather than hard-coding it into the data.
function withArticle(title) {
  if (/^(a|an)\s/i.test(title)) return title
  return /^[aeiou]/i.test(title) ? `an ${title}` : `a ${title}`
}

function QuestionnaireResults() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const overview = mistakeOverviews[categoryId]
  const category = categories.find((item) => item.id === categoryId)

  if (!overview || !category) return <NotBuilt />

  const image = category.swatches[0]?.image

  return (
    <div className="questionnaire-results">
      <Navbar />
      <main className="questionnaire-results__content">
        <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
          <img src={icons.chevronLeft} className="btn__icon" alt="" />
          <span>Back</span>
        </button>

        <div className="questionnaire-results__header">
          <h1 className="questionnaire-results__title">Your Results</h1>
          <p className="questionnaire-results__subtitle">Our diagnostic wizard has evaluated your input.</p>
        </div>

        <div className="questionnaire-results__card-wrap">
          <div className="questionnaire-results__card">
            <span className="questionnaire-results__badge">✔ {resultsPage.badgeLabel}</span>

            <div className="questionnaire-results__message">
              <p className="questionnaire-results__heading">{resultsPage.heading(withArticle(overview.title))}</p>
              {overview.whatIsIt.body && <p className="questionnaire-results__body">{overview.whatIsIt.body}</p>}
            </div>

            {image && <img src={image} className="questionnaire-results__image" alt="" />}

            <div className="questionnaire-results__buttons">
              <Button href={`/mistakes/${categoryId}`} variant="outline" className="questionnaire-results__learn-more">
                {resultsPage.learnMoreLabel}
              </Button>
              <Button href={`/repair/${categoryId}`} variant="gold" icon={icons.arrowRightBlack} className="questionnaire-results__repair">
                {resultsPage.repairOptionsLabel}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuestionnaireResults
