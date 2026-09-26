import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Linking "back" to a page that's already in the history (e.g. Exit Tutorial
// → Tutorial Overview) by pushing it again leaves the pages in between behind
// it — so the browser's Back from there goes into the tutorial again, and Back
// from the tutorial comes back out, in a loop. Instead, the page remembers
// where it sits in this tab's history, and returning goes *back* to that
// entry, so Back afterwards continues to whatever came before it.
//
// React Router keeps each entry's position as `idx` on window.history.state.
const storageKey = (key) => `historyIdx:${key}`
const currentIdx = () => window.history.state?.idx

// Call from the page that can be returned to.
export function useRememberHistoryEntry(key) {
  useEffect(() => {
    const idx = currentIdx()
    if (typeof idx !== 'number') return
    try {
      sessionStorage.setItem(storageKey(key), String(idx))
    } catch {
      // Storage blocked — returning just falls back to a plain replace below.
    }
  }, [key])
}

// Returns a function that takes the user back to that page (`href`).
export function useReturnToHistoryEntry(key, href) {
  const navigate = useNavigate()

  return useCallback(() => {
    let savedIdx = NaN
    try {
      savedIdx = Number(sessionStorage.getItem(storageKey(key)) ?? NaN)
    } catch {
      // Fall through to the replace.
    }
    const idx = currentIdx()
    if (Number.isInteger(savedIdx) && typeof idx === 'number' && savedIdx < idx) {
      navigate(savedIdx - idx)
    } else {
      // Arrived without passing through that page (e.g. a shared link): swap
      // this page for it rather than stacking on top of it.
      navigate(href, { replace: true })
    }
  }, [key, href, navigate])
}
