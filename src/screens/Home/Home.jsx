import Navbar from '../../components/Navbar/Navbar'
import NeedleDivider from '../../components/NeedleDivider/NeedleDivider'
import PromptCard from '../../components/PromptCard/PromptCard'
import { hero, promptHeading, promptCards } from '../../content/home'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <Navbar />
      <main className="home__content">
        <div className="home__header-text">
          <h1 className="home__title">{hero.title}</h1>
          <p className="home__subtitle">{hero.subtitle}</p>
        </div>

        <NeedleDivider />

        <div className="home__prompt-group">
          <p className="home__prompt-heading">{promptHeading}</p>
          <div className="home__cards-row">
            {promptCards.map((card) => (
              <PromptCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
