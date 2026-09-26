import { filterGroups } from '../../content/repairOptions'
import './RepairStageBadge.css'

// Where the mistake is when this repair works. The ids and labels are the
// Repair Options "Where's the mistake?" filter's own items, so a badge always
// matches the filter choice that finds it.
const STAGES = Object.fromEntries(filterGroups.stage.items.map((item) => [item.id, item.label]))

function RepairStageBadges({ stages }) {
  const known = (stages || []).filter((id) => STAGES[id])
  if (known.length === 0) return null
  return known.map((id) => (
    <span key={id} className="repair-stage-badge">
      {STAGES[id]}
    </span>
  ))
}

export default RepairStageBadges
