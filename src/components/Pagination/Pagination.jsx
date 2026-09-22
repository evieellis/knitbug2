import { icons } from '../../content/icons'
import './Pagination.css'

function Pagination({ page, pageCount, onPrev, onNext }) {
  if (pageCount <= 1) return null

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__btn"
        onClick={onPrev}
        disabled={page === 0}
        aria-label="Previous page"
      >
        <img src={icons.chevronLeftGray} alt="" />
      </button>

      <div className="pagination__dots">
        {Array.from({ length: pageCount }, (_, index) => (
          <img
            key={index}
            src={index === page ? icons.dotOn : icons.dotOff}
            className="pagination__dot"
            alt=""
          />
        ))}
      </div>

      <p className="pagination__label">
        Page {page + 1} of {pageCount}
      </p>

      <button
        type="button"
        className="pagination__btn"
        onClick={onNext}
        disabled={page === pageCount - 1}
        aria-label="Next page"
      >
        <img src={icons.chevronRightGray} alt="" />
      </button>
    </div>
  )
}

export default Pagination
