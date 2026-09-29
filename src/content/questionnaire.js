// The diagnostic questionnaire — data lives in ./data/questionnaire.json (edit via
// the admin tool: npm run admin). `resultsPage.heading` is rebuilt into a function
// here since JSON can't hold one (the JSON stores it as `headingTemplate`, a string
// with a `{{mistakeTitle}}` placeholder).
import data from './data/questionnaire.json'

export const startQuestionId = data.startQuestionId
export const questions = data.questions
export const sidequestSteps = data.sidequestSteps
export const resultCategoryById = data.resultCategoryById
export const uncertainResult = data.uncertainResult

export const resultsPage = {
  ...data.resultsPage,
  heading: (mistakeTitle) => data.resultsPage.headingTemplate.replace('{{mistakeTitle}}', mistakeTitle),
}

// Checks rules in array order — combo rules are listed before their single-option
// fallbacks in questionnaire.js, so the first rule whose ids are all selected wins.
export function resolveNext(question, selectedIds) {
  const rule = question.rules.find((candidate) => candidate.ids.every((id) => selectedIds.includes(id)))
  return rule ? rule.next : null
}

export function resolvePath(next) {
  if (!next) return null
  if (typeof next === 'object') return `/questionnaire/results/${next.result}`
  if (next === 'uncertain') return '/questionnaire/uncertain'
  if (next === 'sidequest-1') return '/questionnaire/sidequest-1'
  return `/questionnaire/${next}`
}
