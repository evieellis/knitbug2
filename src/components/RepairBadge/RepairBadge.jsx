import './RepairBadge.css'

// Shared with RepairMethodCard, so a method's badge reads identically
// wherever it shows up (the repair card grid, the tutorial overview, ...).
const BADGES = {
  recommended: { label: '★ Our Recommendation', className: 'repair-badge--recommended' },
  'good-choice': { label: 'Good Choice', className: 'repair-badge--good-choice' },
  'temporary-fix': { label: 'Temporary Fix', className: 'repair-badge--temporary-fix' },
  'time-consuming': { label: 'Time Consuming', className: 'repair-badge--time-consuming' },
  'not-recommended': { label: 'Not Recommended', className: 'repair-badge--not-recommended' },
  '8ball': { label: "🎱 Ball's Choice", className: 'repair-badge--8ball' },
}

function RepairBadge({ badge }) {
  const info = badge && BADGES[badge]
  if (!info) return null
  return <span className={`repair-badge ${info.className}`}>{info.label}</span>
}

export default RepairBadge
