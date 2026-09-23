// Editable copy for the tutorial-complete screen — data lives in
// ./data/repairComplete.json (edit via the admin tool: npm run admin).
import data from './data/repairComplete.json'

export const heading = data.heading
export const returnHomeLabel = data.returnHomeLabel
export const backToRepairOptionsLabel = data.backToRepairOptionsLabel
export const subtitle = (mistakeTitle) => data.subtitleTemplate.replace('{{mistakeTitle}}', mistakeTitle)
