import { useLayoutEffect, useRef } from 'react'

// Line-clamps text to however many whole lines fit in the height its wrapper
// has been given (e.g. a flex: 1 wrapper filling leftover space), instead of a
// fixed count — so text uses all the room it has and still ends in a clean "…".
// Attach the ref to the sized wrapper; its first child is what gets clamped.
// Two elements, not one: a line-clamped box taller than its clamp still paints
// the lines after the "…", so the clamped text must be free to size to itself.
function useFillLineClamp() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const wrapper = ref.current
    const text = wrapper?.firstElementChild
    if (!text) return undefined

    const update = () => {
      const style = getComputedStyle(text)
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5
      text.style.webkitLineClamp = String(Math.max(1, Math.floor(wrapper.clientHeight / lineHeight)))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  return ref
}

export default useFillLineClamp
