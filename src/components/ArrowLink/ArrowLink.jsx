import { Link } from 'react-router-dom'
import { icons } from '../../content/icons'
import './ArrowLink.css'

const arrowByTone = {
  sage: icons.arrowRightSage,
  rose: icons.arrowRightRose,
}

function ArrowLink({ href, tone = 'sage', children }) {
  return (
    <Link to={href} className={`arrow-link arrow-link--${tone}`}>
      {children}
      <img src={arrowByTone[tone]} className="arrow-link__icon" alt="" />
    </Link>
  )
}

export default ArrowLink
