import { icons } from '../../content/icons'
import './NeedleDivider.css'

function NeedleDivider() {
  return (
    <div className="needle-divider" role="presentation">
      <img src={icons.needleDot} className="needle-divider__dot" alt="" />
      <img src={icons.needleLine} className="needle-divider__line" alt="" />
      <img src={icons.needleTip} className="needle-divider__tip" alt="" />
    </div>
  )
}

export default NeedleDivider
