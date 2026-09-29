import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import QuestionOptionCard from '../../components/QuestionOptionCard/QuestionOptionCard'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { questions, resolveNext, resolvePath } from '../../content/questionnaire'
import './QuestionnaireQuestion.css'

function QuestionnaireQuestion() {
  const { questionId } = useParams()
  const question = questions[questionId]
  const navigate = useNavigate()
  const location = useLocation()
  const depth = location.state?.depth ?? 1

  const [selectedIds, setSelectedIds] = useState([])

  if (!question) return <NotBuilt />

  // "Unsure" options (e.g. "Unsure", "Neither/Unsure.") are exclusive: picking one
  // clears everything else, and picking anything else clears them.
  const unsureIds = question.options.filter((option) => /unsure/i.test(option.label)).map((option) => option.id)

  const toggleOption = (id) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((v) => v !== id)
      if (unsureIds.includes(id)) return [id]
      return [...current.filter((v) => !unsureIds.includes(v)), id]
    })
  }

  const next = resolveNext(question, selectedIds)
  const nextPath = resolvePath(next)
  // `next` is null when nothing is selected, and typeof null is also 'object'.
  const isResult = next !== null && typeof next === 'object'
  const continueLabel = isResult ? 'Continue to Results' : `Continue to Step ${depth + 1}`

  const handleContinue = () => {
    if (!nextPath) return
    navigate(nextPath, { state: { depth: depth + 1 } })
  }

  return (
    <div className="questionnaire-question">
      <Navbar />
      <main className="questionnaire-question__content">
        <div className="questionnaire-question__top-bar">
          <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
            <img src={icons.chevronLeft} className="btn__icon" alt="" />
            <span>Back</span>
          </button>
          <span className="questionnaire-question__step">Step {depth}</span>
        </div>

        <div className="questionnaire-question__header">
          <h1 className="questionnaire-question__title">{question.title}</h1>
          {question.subtitle && <p className="questionnaire-question__subtitle">{question.subtitle}</p>}
        </div>

        <div className="questionnaire-question__cards">
          {question.options.map((option) => (
            <QuestionOptionCard
              key={option.id}
              label={option.label}
              description={option.description}
              image={option.image}
              annotatedImage={option.annotatedImage}
              howToTell={option.howToTell}
              selected={selectedIds.includes(option.id)}
              onToggle={() => toggleOption(option.id)}
            />
          ))}
        </div>

        <div className="questionnaire-question__footer">
          <button
            type="button"
            className={`btn ${isResult ? 'btn--green' : 'btn--gold'} questionnaire-question__continue`}
            onClick={handleContinue}
            disabled={!nextPath}
          >
            <span>{continueLabel}</span>
            <img src={icons.arrowRightBlack} className="btn__icon" alt="" />
          </button>
        </div>
      </main>
    </div>
  )
}

export default QuestionnaireQuestion
