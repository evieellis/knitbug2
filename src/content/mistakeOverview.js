// Editable copy for the Mistake Overview screen — data lives in
// ./data/mistakeOverview.json (edit via the admin tool: npm run admin). A page
// only renders once both this entry AND a matching galleryOfMistakes.js
// `categories` entry exist — missing/partial entries fall back to NotBuilt.
import data from './data/mistakeOverview.json'

export const backLink = data.backLink
export const examplesLabel = data.examplesLabel
export const mistakeOverviews = data.mistakeOverviews
