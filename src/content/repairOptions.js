// Editable copy for the Repair Options screen — one method list per mistake type,
// keyed the same way as mistakeOverview.js. Filter criteria (circumstances/tools/time)
// are shared across every mistake type, since Figma only designs one filter panel.
import repairSwatch from '../assets/repair/darning-needle-catch.jpg'

export const subheading = 'Choose a path to rescue your project.'
export const eightBallLabel = 'Ask the 8Ball'
export const filtersLabel = 'Filters'
export const resetLabel = 'Reset'

export const eightBallPopup = {
  askHeading: 'Ask the Magic 8Ball',
  askSubheading: 'Not sure which repair to choose? The Magic 8Ball can choose for you.',
  resultHeading: 'Magic 8Ball Has Spoken!',
  resultSubheading: 'You can go with what it says, or try again.',
  shakeLabel: 'shake me!',
  shakeAgainLabel: 'shake again',
}

export const filterGroups = {
  circumstances: {
    heading: 'Circumstances',
    items: [
      { id: 'casted-off', label: "I've already casted off" },
      { id: 'end-of-row', label: 'The dropped stitch is on the end of the row' },
      { id: 'multiple', label: 'I dropped 2+ stitches' },
    ],
  },
  tools: {
    heading: 'Tools',
    subheading: 'I have a...',
    // Checked by default — filtering hides methods that need a tool you uncheck.
    items: [
      { id: 'crochet-hook', label: 'Crochet hook' },
      { id: 'scrap-yarn', label: 'Scrap of yarn' },
      { id: 'extra-needles', label: 'Pair of extra needles' },
      { id: 'sewing-needle', label: 'Sewing needle' },
    ],
  },
  time: {
    heading: 'Time',
    items: [
      { id: 'under-30s', label: '30 seconds or less', maxMinutes: 0.5 },
      { id: 'under-2m', label: 'Under 2 minutes', maxMinutes: 2 },
      { id: 'under-5m', label: 'Under 5 minutes', maxMinutes: 5 },
      { id: 'over-5m', label: '5 minutes plus', maxMinutes: Infinity },
    ],
  },
}

// Figma only designs one repair method ("Darning Needle Catch"), repeated —
// reproduced as placeholder content here, 9 entries (3 pages of 3) per mistake
// type, so real distinct methods can replace these later without touching code.
// The 3rd card in every group of 3 is the "Just leave it?" warning card — it has
// no tools/circumstances of its own, so it always passes every filter combination
// (see matchesFilters in RepairOptions.jsx), since "do nothing" is always valid.
const repairMethod = (categoryId, index) => ({
  id: `${categoryId}-method-${index + 1}`,
  title: 'Darning Needle Catch',
  description:
    "Secure the stray loop by stitching it to neighboring columns. Perfect if you've already completed the project and casted off.",
  image: repairSwatch,
  timeLabel: 'Time: 5 - 10 minutes',
  timeMinutes: 7.5,
  neededLabel: 'Needed: Crochet Hook',
  tools: ['crochet-hook'],
  circumstances: ['casted-off'],
  badge: 'recommended',
  href: `/tutorials/${categoryId}/${index + 1}`,
})

const leaveItMethod = (categoryId, index) => ({
  id: `${categoryId}-method-${index + 1}`,
  title: 'Just leave it?',
  warningText:
    "WARNING: If you leave this issue, your knitting will unravel! Not to worry though. If you're short on time, try a temporary fix instead.",
  image: repairSwatch,
  tools: [],
  circumstances: [],
  timeMinutes: 0,
  badge: 'not-recommended',
  ctaLabel: 'See a temporary fix instead',
  href: `/tutorials/${categoryId}/temporary-fix`,
})

const placeholderMethods = (categoryId) =>
  Array.from({ length: 9 }, (_, index) =>
    index % 3 === 2 ? leaveItMethod(categoryId, index) : repairMethod(categoryId, index)
  )

export const repairMethods = {
  'dropped-stitches': placeholderMethods('dropped-stitches'),
  'twisted-stitches': placeholderMethods('twisted-stitches'),
  'split-stitches': placeholderMethods('split-stitches'),
  'accidental-yarn-over': placeholderMethods('accidental-yarn-over'),
}
