// Editable copy for the "Find Out What's Wrong" screen — data lives in
// ./data/findOutWhatsWrong.json (edit via the admin tool: npm run admin). The
// questionnaire option's href is computed here since it depends on
// questionnaire.js's startQuestionId, not something the JSON should duplicate.
// Likewise the gallery preview's thumbnails are pulled live from the real
// Gallery of Mistakes swatches (by matching category id) instead of the JSON
// storing its own separate copy of images that would drift out of date.
import data from './data/findOutWhatsWrong.json'
import { startQuestionId } from './questionnaire'
import { categories as galleryCategories } from './galleryOfMistakes'

export const backLink = data.backLink
export const pageHeading = data.pageHeading
export const pageSubheading = data.pageSubheading

const THUMBNAIL_COUNT = 5

export const options = data.options.map((option) => {
  if (option.id === 'questionnaire') {
    return { ...option, href: `/questionnaire/${startQuestionId}` }
  }
  if (option.id === 'gallery') {
    return {
      ...option,
      categories: option.categories.map((category) => {
        const galleryCategory = galleryCategories.find((item) => item.id === category.id)
        return {
          ...category,
          thumbnails: (galleryCategory?.swatches ?? []).slice(0, THUMBNAIL_COUNT).map((swatch) => swatch.image),
        }
      }),
    }
  }
  return option
})
