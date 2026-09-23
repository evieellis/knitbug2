import { Link, NavLink } from 'react-router-dom'
import { icons } from '../../content/icons'
import { siteName, navLinks, navCta } from '../../content/navigation'
import Button from '../Button/Button'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo">
        <span className="navbar__logo-badge">
          <img src={icons.bug} className="navbar__logo-icon" alt="" />
        </span>
        <p className="navbar__logo-text">{siteName}</p>
      </Link>
      <nav className="navbar__controls" aria-label="Primary">
        {navLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.href}
            end={link.href === '/'}
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <Button href={navCta.href} variant="pill">
          {navCta.label}
        </Button>
      </nav>
    </header>
  )
}

export default Navbar
