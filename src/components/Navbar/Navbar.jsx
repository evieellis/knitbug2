import { icons } from '../../content/icons'
import { siteName, navLinks, navCta } from '../../content/navigation'
import NavLink from '../NavLink/NavLink'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__logo">
        <span className="navbar__logo-badge">
          <img src={icons.bug} className="navbar__logo-icon" alt="" />
        </span>
        <p className="navbar__logo-text">{siteName}</p>
      </div>
      <nav className="navbar__controls" aria-label="Primary">
        {navLinks.map((link) => (
          <NavLink key={link.id} href={link.href} current={link.current}>
            {link.label}
          </NavLink>
        ))}
        <NavLink href={navCta.href} variant="pill">
          {navCta.label}
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
