// Editable copy for the "Find Out What's Wrong" screen.
import { thumbnails } from './thumbnails'

export const backLink = { label: 'Back', href: '/' }

export const pageHeading = "Let's Figure Out What's Wrong."
export const pageSubheading = 'How would you like to start?'

// Add another entry to grow the row; `type` selects which preview renders.
export const options = [
  {
    id: 'questionnaire',
    type: 'questionnaire',
    heading: 'Guide Me with Questions',
    subheading: 'Answer questions about what you can see.',
    question: 'Where does it look different?',
    choices: [
      { id: 'on-needles', label: 'On my needles' },
      { id: 'in-fabric', label: 'In the fabric' },
      { id: 'unsure', label: 'Unsure' },
    ],
    defaultChoiceId: 'on-needles',
    ctaLabel: 'Start Questionnaire',
    href: '/questionnaire',
  },
  {
    id: 'gallery',
    type: 'gallery',
    heading: 'Compare to Similar Examples',
    subheading: 'Browse from the gallery of mistakes, or search manually for a mistake.',
    searchPlaceholder: 'Search for a mistake...',
    categories: [
      {
        id: 'dropped-stitches',
        label: 'Dropped Stitches',
        thumbnails: [thumbnails.swatchA, thumbnails.swatchB, thumbnails.swatchB, thumbnails.swatchC, thumbnails.swatchD],
      },
      {
        id: 'split-stitches',
        label: 'Split Stitches',
        thumbnails: [thumbnails.swatchE, thumbnails.swatchB, thumbnails.swatchB, thumbnails.swatchB, thumbnails.swatchF],
      },
    ],
    ctaLabel: 'Explore Gallery of Mistakes',
    href: '/browse-mistakes',
  },
]
