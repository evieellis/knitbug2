import { useEffect, useRef, useState } from 'react'
import { icons } from '../../content/icons'
import { filterGroups, filtersLabel, resetLabel } from '../../content/repairOptions'
import './FilterDropdown.css'

function Checkbox({ checked, label, onChange }) {
  return (
    <label className="filter-dropdown__checkbox-row">
      <input type="checkbox" checked={checked} onChange={onChange} className="filter-dropdown__checkbox-input" />
      <span className={`filter-dropdown__checkbox${checked ? ' filter-dropdown__checkbox--checked' : ''}`}>
        {checked && <img src={icons.check} alt="" />}
      </span>
      <span className="filter-dropdown__checkbox-label">{label}</span>
    </label>
  )
}

function FilterDropdown({ selected, onToggle, onReset }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="filter-dropdown" ref={containerRef}>
      <button
        type="button"
        className={`filter-dropdown__trigger${open ? ' filter-dropdown__trigger--open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {filtersLabel}
        <img
          src={icons.chevronDown}
          className={`filter-dropdown__chevron${open ? '' : ' filter-dropdown__chevron--closed'}`}
          alt=""
        />
      </button>

      {open && (
        <div className="filter-dropdown__panel">
          <div className="filter-dropdown__columns">
            <div className="filter-dropdown__column">
              <p className="filter-dropdown__heading">{filterGroups.circumstances.heading}</p>
              {filterGroups.circumstances.items.map((item) => (
                <Checkbox
                  key={item.id}
                  label={item.label}
                  checked={selected.circumstances.includes(item.id)}
                  onChange={() => onToggle('circumstances', item.id)}
                />
              ))}
            </div>

            <div className="filter-dropdown__column">
              <div className="filter-dropdown__heading-group">
                <p className="filter-dropdown__heading">{filterGroups.tools.heading}</p>
                <p className="filter-dropdown__subheading">{filterGroups.tools.subheading}</p>
              </div>
              {filterGroups.tools.items.map((item) => (
                <Checkbox
                  key={item.id}
                  label={item.label}
                  checked={selected.tools.includes(item.id)}
                  onChange={() => onToggle('tools', item.id)}
                />
              ))}
            </div>

            <div className="filter-dropdown__column">
              <p className="filter-dropdown__heading">{filterGroups.time.heading}</p>
              {filterGroups.time.items.map((item) => (
                <Checkbox
                  key={item.id}
                  label={item.label}
                  checked={selected.time.includes(item.id)}
                  onChange={() => onToggle('time', item.id)}
                />
              ))}
            </div>
          </div>

          <div className="filter-dropdown__divider" role="presentation" />

          <button type="button" className="filter-dropdown__reset" onClick={onReset}>
            <img src={icons.xReset} alt="" />
            {resetLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
