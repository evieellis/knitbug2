// Editable copy for the Mistake Overview screen — one entry per mistake type,
// keyed by the same category id used in galleryOfMistakes.js's `categories`.
// A page only renders once both this entry AND a matching `categories` entry
// exist (the Examples section pulls its swatches from there) — missing/partial
// entries fall back to the NotBuilt screen instead of crashing.
//
// Only "Dropped Stitch" has real (if unfinished) copy from Figma right now — the
// other three are structurally complete but content-empty on purpose, so they're
// easy to fill in later without touching any code.

export const backLink = { label: 'Back', href: '/browse-mistakes' }
export const examplesLabel = 'Examples'

const emptyEntry = (categoryId, title) => ({
  title,
  media: { type: 'youtube', youtubeId: '', startSeconds: 0 },
  whatIsIt: { heading: 'What Is It?', body: '' },
  signs: {
    heading: `Signs You Have ${title}`,
    items: [
      { id: 'sign-1', label: '', detail: '' },
      { id: 'sign-2', label: '', detail: '' },
      { id: 'sign-3', label: '', detail: '' },
      { id: 'sign-4', label: '', detail: '' },
    ],
  },
  cta: { label: 'Go to Repair Options', href: `/repair/${categoryId}` },
})

export const mistakeOverviews = {
  'dropped-stitches': {
    title: 'Dropped Stitch',
    media: { type: 'youtube', youtubeId: '', startSeconds: 0 },
    whatIsIt: {
      heading: 'What Is It?',
      body: 'A dropped stitch is a loop that has escaped off your knitting needle. If left unattended, it can actively unravel vertically down your work, forming a "run" or ladder of straight bars.',
    },
    signs: {
      heading: 'Signs You Have a Dropped Stitch',
      items: [
        { id: 'sign-1', label: 'Loose stitch loops', detail: '' },
        { id: 'sign-2', label: '', detail: '' },
        { id: 'sign-3', label: '', detail: '' },
        { id: 'sign-4', label: '', detail: '' },
      ],
    },
    cta: { label: 'Go to Repair Options', href: '/repair/dropped-stitches' },
  },
  'twisted-stitches': emptyEntry('twisted-stitches', 'a Twisted Stitch'),
  'split-stitches': emptyEntry('split-stitches', 'a Split Stitch'),
  'accidental-yarn-over': emptyEntry('accidental-yarn-over', 'an Accidental Yarn Over'),
}
