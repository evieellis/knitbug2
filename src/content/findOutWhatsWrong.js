// Editable copy for the "Find Out What's Wrong" screen — data lives in
// ./data/findOutWhatsWrong.json (edit via the admin tool: npm run admin). The
// questionnaire option's href is computed here since it depends on
// questionnaire.js's startQuestionId, not something the JSON should duplicate.
import data from './data/findOutWhatsWrong.json'
import { startQuestionId } from './questionnaire'

export const backLink = data.backLink
export const pageHeading = data.pageHeading
export const pageSubheading = data.pageSubheading

export const options = data.options.map((option) =>
  option.id === 'questionnaire' ? { ...option, href: `/questionnaire/${startQuestionId}` } : option
)
