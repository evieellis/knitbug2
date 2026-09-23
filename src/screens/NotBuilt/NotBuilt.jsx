import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { icons } from '../../content/icons'
import './NotBuilt.css'

function NotBuilt() {
  const navigate = useNavigate()

  return (
    <div className="not-built">
      <Navbar />
      <main className="not-built__content">
        <p className="not-built__message">This screen hasn't been built yet.</p>
        <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
          <img src={icons.chevronLeft} className="btn__icon" alt="" />
          <span>Back</span>
        </button>
      </main>
    </div>
  )
}

export default NotBuilt
