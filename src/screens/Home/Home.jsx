import Navbar from '../../components/Navbar/Navbar'
import PromptCard from '../../components/PromptCard/PromptCard'
import { hero, promptHeading, promptCards } from '../../content/home'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <Navbar />
      <main className="home__content">
        {/* The yarn art (tangle → needle with cast-on stitches → neat ball) is
            one photo; the title/subtitle stay live text laid over its empty
            middle. See Home.css for how the two scale together. */}
        <div className="home__hero">
          {hero.image && <img src={hero.image} className="home__hero-image" alt="" />}
          <div className="home__header-text">
            <h1 className="home__title">{hero.title}</h1>
            <p className="home__subtitle">{hero.subtitle}</p>
          </div>
        </div>

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
