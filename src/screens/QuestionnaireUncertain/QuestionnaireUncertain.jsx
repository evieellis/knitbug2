import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import { uncertainResult, startQuestionId } from '../../content/questionnaire'
import './QuestionnaireUncertain.css'

function QuestionnaireUncertain() {
  const navigate = useNavigate()

  return (
    <div className="questionnaire-uncertain">
      <Navbar />
      <main className="questionnaire-uncertain__content">
        <div className="questionnaire-uncertain__card">
          <h1 className="questionnaire-uncertain__title">{uncertainResult.title}</h1>
          <p className="questionnaire-uncertain__subtitle">{uncertainResult.subtitle}</p>

          <div className="questionnaire-uncertain__actions">
            <Button href="/browse-mistakes" variant="outline">
              Browse the Gallery of Mistakes
            </Button>
            <button type="button" className="btn btn--chip questionnaire-uncertain__back" onClick={() => navigate(-1)}>
              Go back one question
            </button>
            <Button href={`/questionnaire/${startQuestionId}`} variant="ghost">
              Start again
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuestionnaireUncertain
