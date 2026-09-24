// Editable copy for the Gallery of Mistakes screen — data lives in
// ./data/galleryOfMistakes.json (edit via the admin tool: npm run admin).
import data from './data/galleryOfMistakes.json'

export const backLink = data.backLink
export const pageHeading = data.pageHeading
export const pageSubheading = data.pageSubheading
export const searchPlaceholder = data.searchPlaceholder

// Matches CategoryRow's own PAGE_SIZE — kept in sync here, not imported,
// since that component intentionally has no dependency on content files.
const PAGE_SIZE = 5

// CategoryRow pages swatches 5-at-a-time and fades the edge of whichever
// swatch lands on a page boundary; the last item of page 1 repeats as the
// first item of page 2 so you get one clear (unfaded) look at it once you
// page forward. That repeat used to be its own manually-duplicated JSON
// entry, which drifted out of sync the moment the "real" 5th item's photo
// was updated but its separate copy wasn't. Deriving it here instead means
// there's only ever one real entry to edit, and the repeat can't go stale.
function withPeekDuplicate(swatches) {
  if (swatches.length <= PAGE_SIZE) return swatches
  const peekItem = swatches[PAGE_SIZE - 1]
  const duplicate = { ...peekItem, id: `${peekItem.id}-repeat` }
  return [...swatches.slice(0, PAGE_SIZE), duplicate, ...swatches.slice(PAGE_SIZE)]
}

export const categories = data.categories.map((category) => ({
  ...category,
  swatches: withPeekDuplicate(category.swatches),
}))
