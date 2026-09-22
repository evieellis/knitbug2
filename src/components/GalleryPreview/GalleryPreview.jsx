import { icons } from '../../content/icons'
import './GalleryPreview.css'

function GalleryPreview({ searchPlaceholder, categories }) {
  return (
    <div className="gallery-preview">
      <div className="gallery-preview__search">
        <img src={icons.magnifyingGlass} className="gallery-preview__search-icon" alt="" />
        <input
          type="search"
          className="gallery-preview__search-input"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>
      <div className="gallery-preview__categories">
        {categories.map((category) => (
          <div key={category.id} className="gallery-preview__category">
            <p className="gallery-preview__category-label">{category.label}</p>
            <div className="gallery-preview__thumbnails">
              {category.thumbnails.map((thumbnail, index) => (
                <img
                  key={index}
                  src={thumbnail}
                  className="gallery-preview__thumbnail"
                  alt={`${category.label} example swatch`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GalleryPreview
