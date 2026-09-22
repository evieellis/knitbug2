import { icons } from '../../content/icons'
import './ArrowLink.css'

const arrowByTone = {
  sage: icons.arrowRightSage,
  rose: icons.arrowRightRose,
}

function ArrowLink({ href, tone = 'sage', children }) {
  return (
    <a href={href} className={`arrow-link arrow-link--${tone}`}>
      {children}
      <img src={arrowByTone[tone]} className="arrow-link__icon" alt="" />
    </a>
  )
}

export default ArrowLink
