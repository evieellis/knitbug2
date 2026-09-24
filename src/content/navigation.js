// Editable navbar text and links.
import { startQuestionId } from './questionnaire'

export const siteName = 'knitBug'

export const navLinks = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'browse-mistakes', label: 'Browse Mistakes', href: '/browse-mistakes' },
]

export const navCta = {
  label: 'repair now',
  href: `/questionnaire/${startQuestionId}`,
}
