import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import CategoryRow from '../../components/CategoryRow/CategoryRow'
import { icons } from '../../content/icons'
import { backLink, pageHeading, pageSubheading, searchPlaceholder, categories } from '../../content/galleryOfMistakes'
import './GalleryOfMistakes.css'

function GalleryOfMistakes() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return categories
    return categories.filter(
      (category) =>
        category.label.toLowerCase().includes(normalized) ||
        category.description.toLowerCase().includes(normalized)
    )
  }, [query])

  return (
    <div className="gallery">
      <Navbar />
      <main className="gallery__content">
        <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
          <img src={icons.chevronLeft} className="btn__icon" alt="" />
          <span>{backLink.label}</span>
        </button>

        <div className="gallery__titles">
          <h1 className="gallery__title">{pageHeading}</h1>
          <p className="gallery__subtitle">{pageSubheading}</p>
        </div>

        <div className="gallery__search">
          <img src={icons.magnifyingGlass} className="gallery__search-icon" alt="" />
          <input
            type="search"
            className="gallery__search-input"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="gallery__sections">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => <CategoryRow key={category.id} {...category} />)
          ) : (
            <p className="gallery__empty">No mistakes match your search.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default GalleryOfMistakes
