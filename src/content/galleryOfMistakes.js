// Editable copy for the Gallery of Mistakes screen.
import { gallerySwatches } from './gallerySwatches'

export const backLink = { label: 'Back', href: '/diagnose' }

export const pageHeading = 'Gallery of Mistakes'
export const pageSubheading = "Find which one looks most like your knitting. Once you do, we'll help you fix it!"
export const searchPlaceholder = 'Search for a mistake...'

// Figma currently repeats the same subtitle + 5 placeholder swatches under every
// category title below — reproduced as-is here so it's easy to fill in per category later.
// A second, shorter page (4 photos, same set reshuffled) is included purely to demo
// the next/prev paging — swap these for real additional photos when you have them.
// An uneven last page is fine: it just leaves a little empty space instead of
// clipping a photo, which is intentional (see CategoryRow's fade-viewport CSS).
//
// Every swatch links to the same one mistake-overview page for its category (there's
// no per-photo detail page in the design) — same target as the row's own "Learn More".
const placeholderSwatches = (categoryId) => {
  const href = `/mistakes/${categoryId}`
  return [
    { id: 1, image: gallerySwatches.swatch1, caption: 'Dropped Stitches Var 1', href },
    { id: 2, image: gallerySwatches.swatch2, caption: 'Dropped Stitches Var 2', href },
    { id: 3, image: gallerySwatches.swatch3, caption: 'Dropped Stitches Var 3', href },
    { id: 4, image: gallerySwatches.swatch4, caption: 'Dropped Stitches Var 4', href },
    { id: 5, image: gallerySwatches.swatch5, caption: 'Dropped Stitches Var 5', href },
    // Var 5 repeats as page 2's first item, since page 1's copy sits under the fade.
    { id: '5-repeat', image: gallerySwatches.swatch5, caption: 'Dropped Stitches Var 5', href },
    { id: 6, image: gallerySwatches.swatch3, caption: 'Dropped Stitches Var 6', href },
    { id: 7, image: gallerySwatches.swatch5, caption: 'Dropped Stitches Var 7', href },
    { id: 8, image: gallerySwatches.swatch1, caption: 'Dropped Stitches Var 8', href },
  ]
}

export const categories = [
  {
    id: 'dropped-stitches',
    label: 'Dropped Stitches',
    description: 'Loops that have slipped off the needle and are unraveling.',
    seeMoreHref: '/mistakes/dropped-stitches',
    swatches: placeholderSwatches('dropped-stitches'),
  },
  {
    id: 'twisted-stitches',
    label: 'Twisted Stitches',
    description: 'Loops that have slipped off the needle and are unraveling.',
    seeMoreHref: '/mistakes/twisted-stitches',
    swatches: placeholderSwatches('twisted-stitches'),
  },
  {
    id: 'split-stitches',
    label: 'Split Stitches',
    description: 'Loops that have slipped off the needle and are unraveling.',
    seeMoreHref: '/mistakes/split-stitches',
    swatches: placeholderSwatches('split-stitches'),
  },
  {
    id: 'accidental-yarn-over',
    label: 'Accidental Yarn Over',
    description: 'Loops that have slipped off the needle and are unraveling.',
    seeMoreHref: '/mistakes/accidental-yarn-over',
    swatches: placeholderSwatches('accidental-yarn-over'),
  },
]
