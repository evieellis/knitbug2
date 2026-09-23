import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import OptionCard from '../../components/OptionCard/OptionCard'
import { icons } from '../../content/icons'
import { backLink, pageHeading, pageSubheading, options } from '../../content/findOutWhatsWrong'
import './FindOutWhatsWrong.css'

function FindOutWhatsWrong() {
  const navigate = useNavigate()

  return (
    <div className="find-out">
      <Navbar />
      <main className="find-out__content">
        <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
          <img src={icons.chevronLeft} className="btn__icon" alt="" />
          <span>{backLink.label}</span>
        </button>

        <div className="find-out__titles">
          <h1 className="find-out__title">{pageHeading}</h1>
          <p className="find-out__subtitle">{pageSubheading}</p>
        </div>

        <div className="find-out__options">
          {options.map((option) => (
            <OptionCard key={option.id} {...option} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default FindOutWhatsWrong
