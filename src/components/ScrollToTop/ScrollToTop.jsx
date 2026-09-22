import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// react-router doesn't reset scroll position on navigation (it's client-side,
// not a real page load), so without this a link near the bottom of one page
// lands you at the same scroll offset on the next page.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
