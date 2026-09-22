import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import OptionCard from '../../components/OptionCard/OptionCard'
import { icons } from '../../content/icons'
import { backLink, pageHeading, pageSubheading, options } from '../../content/findOutWhatsWrong'
import './FindOutWhatsWrong.css'

function FindOutWhatsWrong() {
  return (
    <div className="find-out">
      <Navbar />
      <main className="find-out__content">
        <Button href={backLink.href} variant="chip" icon={icons.chevronLeft} iconPosition="leading">
          {backLink.label}
        </Button>

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
