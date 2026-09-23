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
