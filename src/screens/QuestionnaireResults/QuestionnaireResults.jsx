import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { mistakeOverviews } from '../../content/mistakeOverview'
import { categories } from '../../content/galleryOfMistakes'
import { resultsPage } from '../../content/questionnaire'
import './QuestionnaireResults.css'

// Most mistake titles already read naturally as a sentence fragment ("a Twisted
// Stitch"); "Dropped Stitch" is the one exception (it's used bare as a page <h1>
// elsewhere), so this only adds the article where one isn't already there.
function withArticle(title) {
  return /^(a|an)\s/i.test(title) ? title : `a ${title}`
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
