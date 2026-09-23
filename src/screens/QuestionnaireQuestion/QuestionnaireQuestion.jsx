import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import QuestionOptionCard from '../../components/QuestionOptionCard/QuestionOptionCard'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { questions } from '../../content/questionnaire'
import './QuestionnaireQuestion.css'

// Checks rules in array order — combo rules are listed before their single-option
// fallbacks in questionnaire.js, so the first rule whose ids are all selected wins.
function resolveNext(question, selectedIds) {
  const rule = question.rules.find((candidate) => candidate.ids.every((id) => selectedIds.includes(id)))
  return rule ? rule.next : null
}

function resolvePath(next) {
  if (!next) return null
  if (typeof next === 'object') return `/questionnaire/results/${next.result}`
  if (next === 'uncertain') return '/questionnaire/uncertain'
  if (next === 'sidequest-1') return '/questionnaire/sidequest-1'
  return `/questionnaire/${next}`
}

function QuestionnaireQuestion() {
  const { questionId } = useParams()
  const question = questions[questionId]
  const navigate = useNavigate()
  const location = useLocation()
  const depth = location.state?.depth ?? 1

  const [selectedIds, setSelectedIds] = useState([])

  if (!question) return <NotBuilt />

  const toggleOption = (id) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((v) => v !== id) : [...current, id]))
  }

  const next = resolveNext(question, selectedIds)
  const nextPath = resolvePath(next)
  const isResult = typeof next === 'object'
  const continueLabel = isResult ? 'Continue to Results' : next ? `Continue to Step ${depth + 1}` : 'Continue'

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
              howToTell={option.howToTell}
              selected={selectedIds.includes(option.id)}
              onToggle={() => toggleOption(option.id)}
            />
          ))}
        </div>

        <div className="questionnaire-question__footer">
          <button
            type="button"
            className="btn btn--gold questionnaire-question__continue"
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
