import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown'
import RepairMethodCard from '../../components/RepairMethodCard/RepairMethodCard'
import Pagination from '../../components/Pagination/Pagination'
import EightBallPopup from '../../components/EightBallPopup/EightBallPopup'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { useRememberHistoryEntry } from '../../hooks/useHistoryReturn'
import { mistakeOverviews } from '../../content/mistakeOverview'
import { subheading, eightBallLabel, filterGroups, repairMethods } from '../../content/repairOptions'
import './RepairOptions.css'

const PAGE_SIZE = 3

// Front-to-back card order. "Temporary Fix" and no-badge aren't named
// explicitly, so they're slotted in the middle as a reasonable default —
// easy to move if that's wrong, just by editing this ladder.
const BADGE_ORDER = {
  recommended: 0,
  'good-choice': 1,
  'temporary-fix': 2,
  'time-consuming': 3,
  'not-recommended': 4,
}
const DEFAULT_BADGE_RANK = 2

const defaultFilters = {
  stage: [],
  tools: filterGroups.tools.items.map((item) => item.id),
  time: [],
}

function matchesFilters(method, filters) {
  // A method that hasn't been marked as on-the-needles or in-the-work yet
  // isn't hidden by the stage filter.
  const methodStages = method.stages || []
  const stageOk =
    filters.stage.length === 0 ||
    methodStages.length === 0 ||
    filters.stage.some((id) => methodStages.includes(id))

  const toolsOk = method.tools.every((toolId) => filters.tools.includes(toolId))

  const timeOk =
    filters.time.length === 0 ||
    filters.time.some((id) => {
      const bucket = filterGroups.time.items.find((item) => item.id === id)
      if (!bucket) return false
      // `exclusive` buckets ("Under 5 minutes") leave out methods that take
      // exactly maxMinutes; the rest ("30 seconds or less") include them.
      return bucket.exclusive ? method.timeMinutes < bucket.maxMinutes : method.timeMinutes <= bucket.maxMinutes
    })

  return stageOk && toolsOk && timeOk
}

function RepairOptions() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const overview = mistakeOverviews[categoryId]
  useRememberHistoryEntry(`repair-options/${categoryId}`)

  // A method can list more than one mistake category (see its `categories`
  // field) and show up under all of them — the tutorial link is built here,
  // per page, rather than stored on the method itself, since the same method
  // needs a different link depending on which category page it's showing on.
  // Ordered by badge: Our Recommendation, Good Choice, Temporary Fix, Time
  // Consuming, Not Recommended last — ties keep their existing relative
  // order (Array.sort is stable), including after filtering.
  const methods = useMemo(
    () =>
      repairMethods
        .filter((method) => method.categories.includes(categoryId))
        .map((method) => ({ ...method, href: `/tutorials/${categoryId}/${method.id}` }))
        .sort(
          (a, b) =>
            (BADGE_ORDER[a.badge] ?? DEFAULT_BADGE_RANK) - (BADGE_ORDER[b.badge] ?? DEFAULT_BADGE_RANK)
        ),
    [categoryId]
  )

  const [filters, setFilters] = useState(defaultFilters)
  const [pageIndex, setPageIndex] = useState(0)
  const [eightBallOpen, setEightBallOpen] = useState(false)

  const filteredMethods = useMemo(
    () => methods.filter((method) => matchesFilters(method, filters)),
    [methods, filters]
  )
  const pageCount = Math.max(1, Math.ceil(filteredMethods.length / PAGE_SIZE))

  if (!overview || methods.length === 0) return <NotBuilt />

  // Clamps in case the filtered list shrank; resetFilters() below also jumps
  // straight to page 0 on every filter change, which is the expected UX.
  const safePageIndex = Math.min(pageIndex, pageCount - 1)
  const visibleMethods = filteredMethods.slice(
    safePageIndex * PAGE_SIZE,
    safePageIndex * PAGE_SIZE + PAGE_SIZE
  )

  const toggleFilter = (group, id) => {
    setFilters((current) => {
      const values = current[group]
      const next = values.includes(id) ? values.filter((v) => v !== id) : [...values, id]
      return { ...current, [group]: next }
    })
    setPageIndex(0)
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    setPageIndex(0)
  }

  return (
    <div className="repair-options">
      <Navbar />
      <main className="repair-options__content">
        <div className="repair-options__top-bar">
          <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
            <img src={icons.chevronLeft} className="btn__icon" alt="" />
            <span>Back</span>
          </button>
        </div>

        <div className="repair-options__header">
          <div className="repair-options__header-text">
            <h1 className="repair-options__title">{overview.title} Repair Options</h1>
            <p className="repair-options__subtitle">{subheading}</p>
          </div>
          <div className="repair-options__quick-actions">
            <FilterDropdown selected={filters} onToggle={toggleFilter} onReset={resetFilters} />
            <button type="button" className="repair-options__eightball-btn" onClick={() => setEightBallOpen(true)}>
              {eightBallLabel}
              <span className="repair-options__eightball-icon" aria-hidden="true">
                8
              </span>
            </button>
          </div>
        </div>

        {/* Keyed on open/closed so each opening starts from a fresh, unshaken ball. */}
        <EightBallPopup
          key={eightBallOpen ? 'open' : 'closed'}
          open={eightBallOpen}
          onClose={() => setEightBallOpen(false)}
          methods={methods}
        />

        {visibleMethods.length > 0 ? (
          <div className="repair-options__cards-row">
            {visibleMethods.map((method) => (
              <RepairMethodCard key={method.id} {...method} />
            ))}
          </div>
        ) : (
          <p className="repair-options__empty">No repair methods match your filters.</p>
        )}

        <Pagination
          page={safePageIndex}
          pageCount={pageCount}
          onPrev={() => setPageIndex((index) => Math.max(0, index - 1))}
          onNext={() => setPageIndex((index) => Math.min(pageCount - 1, index + 1))}
        />
      </main>
    </div>
  )
}

export default RepairOptions
