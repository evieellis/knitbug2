import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SwatchCard from '../SwatchCard/SwatchCard'
import { icons } from '../../content/icons'
import './CategoryRow.css'

const PAGE_SIZE = 5

function chunk(items, size) {
  const pages = []
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size))
  }
  return pages
}

function CategoryRow({ label, description, seeMoreHref, swatches, showSeeMore = true }) {
  const pages = useMemo(() => chunk(swatches, PAGE_SIZE), [swatches])
  const [pageIndex, setPageIndex] = useState(0)
  const [direction, setDirection] = useState('next')

  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex === pages.length - 1
  const canGoPrev = !isFirstPage
  const canGoNext = !isLastPage

  const goPrev = () => {
    if (isFirstPage) return
    setDirection('prev')
    setPageIndex((index) => index - 1)
  }

  const goNext = () => {
    if (isLastPage) return
    setDirection('next')
    setPageIndex((index) => index + 1)
  }

  const fadeClass = canGoPrev && canGoNext
    ? 'category-row__viewport--fade-both'
    : canGoPrev
      ? 'category-row__viewport--fade-left'
      : canGoNext
        ? 'category-row__viewport--fade-right'
        : ''

  return (
    <div className="category-row">
      <div className="category-row__header">
        <div className="category-row__heading-group">
          <p className="category-row__label">{label}</p>
          {description && <p className="category-row__description">{description}</p>}
        </div>
        {showSeeMore && (
          <Link to={seeMoreHref} className="category-row__see-more">
            Learn More
            <img src={icons.arrowRightRoseSm} className="category-row__see-more-icon" alt="" />
          </Link>
        )}
      </div>

      <div className="category-row__gallery">
        <div className={`category-row__viewport ${fadeClass}`}>
          <div key={pageIndex} className={`category-row__swatches category-row__swatches--${direction}`}>
            {pages[pageIndex].map((swatch) => (
              <SwatchCard key={swatch.id} {...swatch} description={description} />
            ))}
          </div>
        </div>

        {canGoPrev && (
          <button
            type="button"
            className="category-row__pager-btn category-row__pager-btn--prev"
            onClick={goPrev}
            aria-label={`Previous ${label} examples`}
          >
            <img src={icons.arrowRightRoseSm} className="category-row__pager-icon category-row__pager-icon--prev" alt="" />
          </button>
        )}
        {canGoNext && (
          <button
            type="button"
            className="category-row__pager-btn category-row__pager-btn--next"
            onClick={goNext}
            aria-label={`More ${label} examples`}
          >
            <img src={icons.arrowRightRoseSm} className="category-row__pager-icon" alt="" />
          </button>
        )}
      </div>
    </div>
  )
}

export default CategoryRow
