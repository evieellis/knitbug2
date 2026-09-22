// Editable tutorial content — one entry per repair method, keyed by that method's own
// `id` from repairOptions.js (`${categoryId}-method-${n}`), so a method and its
// tutorial never drift apart. `steps` can be any length; screens render off
// `.length` rather than assuming a count, so adding a tutorial with 3 steps or 8
// steps is purely a content change here, no code changes.
//
// Only "Darning Needle Catch" (dropped-stitches' first method) has real content —
// Figma only designs one full tutorial. Every other method's /tutorials/... link
// correctly falls through to the NotBuilt screen until a real tutorial is written
// for it; add one by giving that method's id its own entry in this object.

export const tutorials = {
  'dropped-stitches-method-1': {
    overviewTitle: 'Tutorial: Using a Crochet Hook to Pick Up Dropped Stitch',
    title: 'Fixing a Dropped Stitch',
    // timeLabel/neededLabel are intentionally not duplicated here — the Overview
    // screen pulls them straight from this method's own repairOptions.js entry.
    media: { type: 'youtube', youtubeId: '', startSeconds: 0 },
    overviewSteps: [
      'Insert crochet hook through the dropped loop from front to back.',
      'Catch the first horizontal bar of yarn directly above the loop.',
      'Pull the bar through the loop to create a new stitch.',
      'Repeat this process for each horizontal bar until you reach the needles.',
      'Carefully place the final loop back onto your left-hand needle.',
    ],
    steps: [
      {
        heading: 'Insert your crochet hook into the dropped stitch.',
        startSeconds: 0,
        checklist: [
          { id: 'c1', status: 'warning', text: "You don't accidentally twist the stitch", detail: '' },
          { id: 'c2', status: 'good', text: 'The right side of the work is facing you', detail: '' },
          { id: 'c3', status: 'good', text: 'All loose bars are behind the dropped stitch', detail: '' },
        ],
      },
      {
        heading: 'Hook the lowest loose bar of yarn with your crochet hook.',
        startSeconds: 12,
        checklist: [
          { id: 'c1', status: 'warning', text: 'The bar is hooked from front to back', detail: '' },
          { id: 'c2', status: 'good', text: "You're working with the correct strand", detail: '' },
        ],
      },
      {
        heading: 'Pull the bar through the loop to create a new stitch.',
        startSeconds: 24,
        checklist: [
          { id: 'c1', status: 'good', text: 'The new stitch sits snugly, not too tight or loose', detail: '' },
        ],
      },
      {
        heading: 'Repeat this process for each horizontal bar until you reach the needles.',
        startSeconds: 36,
        checklist: [
          { id: 'c1', status: 'warning', text: "You're not skipping any bars as you go", detail: '' },
          { id: 'c2', status: 'good', text: 'The column of stitches stays aligned', detail: '' },
        ],
      },
      {
        heading: 'Transfer the last stitch from your crochet hook back onto your knitting needle.',
        startSeconds: 48,
        checklist: [
          { id: 'c1', status: 'warning', text: 'The stitch is oriented correctly on the needle', detail: '' },
          { id: 'c2', status: 'good', text: "The stitch isn't too tight or too loose", detail: '' },
        ],
      },
    ],
  },
}
