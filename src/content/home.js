// Editable copy for the Home screen. Add more cards to promptCards to grow the row.
export const hero = {
  title: 'Welcome to Knit Bug!',
  subtitle:
    'A comprehensive guidance tool to help knitters learn to repair their work.',
}

export const promptHeading = 'To get started… which of these sounds like you?'

export const promptCards = [
  {
    id: 'learn',
    tone: 'sage',
    badgeLabel: 'Practice Mode',
    title: 'I Just Want to Learn.',
    description: 'Try out our practice tools to sharpen your eye for repair.',
    ctaLabel: 'Start exploring',
    href: '/practice',
  },
  {
    id: 'fix',
    tone: 'rose',
    badgeLabel: 'Active Rescue',
    title: 'I Need to Fix Something Now!',
    description: 'Start your immediate repair journey here.',
    ctaLabel: 'Diagnose a mistake',
    href: '/diagnose',
    emphasized: true,
  },
]
