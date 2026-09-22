import './NavLink.css'

function NavLink({ href, current, variant = 'text', children }) {
  return (
    <a
      href={href}
      className={`nav-link nav-link--${variant}`}
      aria-current={current ? 'page' : undefined}
    >
      {children}
    </a>
  )
}

export default NavLink
