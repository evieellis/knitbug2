import { useLayoutEffect, useRef } from 'react'

// Shrinks a text element's font size just enough for it to fit inside its
// parent's content box — and leaves it at its CSS size when it already fits.
// Attach the ref to the text element; `content` re-runs the fit when it changes.
function useShrinkToFit(content, { minFontSize = 10, step = 0.5 } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const text = ref.current
    const box = text?.parentElement
    if (!text || !box) return undefined

    const update = () => {
      text.style.fontSize = ''
      const boxStyle = getComputedStyle(box)
      const available =
        box.clientHeight - parseFloat(boxStyle.paddingTop) - parseFloat(boxStyle.paddingBottom)
      const fits = () => text.scrollHeight <= available && text.scrollWidth <= text.clientWidth

      let size = parseFloat(getComputedStyle(text).fontSize)
      while (!fits() && size > minFontSize) {
        size = Math.max(minFontSize, size - step)
        text.style.fontSize = `${size}px`
      }
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(box)
    // Web fonts swapping in can change how much room the text needs.
    document.fonts?.ready.then(update)
    return () => observer.disconnect()
  }, [content, minFontSize, step])

  return ref
}

export default useShrinkToFit
