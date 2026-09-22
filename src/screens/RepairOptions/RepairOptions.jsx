import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown'
import RepairMethodCard from '../../components/RepairMethodCard/RepairMethodCard'
import Pagination from '../../components/Pagination/Pagination'
import EightBallPopup from '../../components/EightBallPopup/EightBallPopup'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { mistakeOverviews } from '../../content/mistakeOverview'
import { subheading, eightBallLabel, filterGroups, repairMethods } from '../../content/repairOptions'
import './RepairOptions.css'

const PAGE_SIZE = 3

const defaultFilters = {
  circumstances: [],
  tools: filterGroups.tools.items.map((item) => item.id),
  time: [],
}

function matchesFilters(method, filters) {
  // A method with no circumstances of its own (e.g. the "Just leave it?" card)
  // applies universally rather than being gated by this filter.
  const circumstancesOk =
    filters.circumstances.length === 0 ||
    method.circumstances.length === 0 ||
    filters.circumstances.some((id) => method.circumstances.includes(id))

  const toolsOk = method.tools.every((toolId) => filters.tools.includes(toolId))

  const timeOk =
    filters.time.length === 0 ||
    filters.time.some((id) => {
      const bucket = filterGroups.time.items.find((item) => item.id === id)
      return bucket && method.timeMinutes <= bucket.maxMinutes
    })

  return circumstancesOk && toolsOk && timeOk
}

function RepairOptions() {
  const { categoryId } = useParams()
  const overview = mistakeOverviews[categoryId]
  const methods = repairMethods[categoryId]

  const [filters, setFilters] = useState(defaultFilters)
  const [pageIndex, setPageIndex] = useState(0)
  const [eightBallOpen, setEightBallOpen] = useState(false)

  const filteredMethods = useMemo(
    () => (methods ? methods.filter((method) => matchesFilters(method, filters)) : []),
    [methods, filters]
  )
  const pageCount = Math.max(1, Math.ceil(filteredMethods.length / PAGE_SIZE))

  if (!overview || !methods) return <NotBuilt />

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
          <Button href={`/mistakes/${categoryId}`} variant="chip" icon={icons.chevronLeft} iconPosition="leading">
            Back
          </Button>
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
