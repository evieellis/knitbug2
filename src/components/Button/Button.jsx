import { Link } from 'react-router-dom'
import './Button.css'

function Button({ href, variant = 'solid', icon, iconPosition = 'trailing', stretch, className = '', onClick, children }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`btn btn--${variant}${stretch ? ' btn--stretched' : ''}${className ? ` ${className}` : ''}`}
    >
      {icon && iconPosition === 'leading' && (
        <img src={icon} className="btn__icon" alt="" />
      )}
      <span>{children}</span>
      {icon && iconPosition === 'trailing' && (
        <img src={icon} className="btn__icon" alt="" />
      )}
    </Link>
  )
}

export default Button
