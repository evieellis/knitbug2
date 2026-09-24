import { useEffect, useRef, useState } from 'react'
import { icons } from '../../content/icons'
import './PlaybackControls.css'

const SPEEDS = [0.25, 0.5, 1, 1.5, 2]

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 4V20M16 4V20" stroke="#D29797" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M9 4H4V9M20 9V4H15M15 20H20V15M4 15V20H9"
        stroke="#35302F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 9H9V4M20 9H15V4M15 20V15H20M9 20V15H4"
        stroke="#35302F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function seekFromPointer(event, track, duration) {
  const rect = track.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  return ratio * duration
}

function PlaybackControls({
  heading,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  onTogglePlay,
  onRewind,
  onSeek,
  onSpeedChange,
  disabled = false,
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const trackRef = useRef(null)
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dragging, setDragging] = useState(false)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    if (!menuOpen) return undefined
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!dragging) return undefined
    const handleMove = (event) => {
      if (trackRef.current) onSeek(seekFromPointer(event, trackRef.current, duration))
    }
    const handleUp = () => setDragging(false)
    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', handleUp)
    return () => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', handleUp)
    }
  }, [dragging, duration, onSeek])

  const handleTrackPointerDown = (event) => {
    if (disabled || !trackRef.current) return
    onSeek(seekFromPointer(event, trackRef.current, duration))
    setDragging(true)
  }

  const handleTrackKeyDown = (event) => {
    if (disabled) return
    if (event.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5))
    if (event.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5))
  }

  return (
    <div className={`playback-controls${disabled ? ' playback-controls--disabled' : ''}`}>
      <p className="playback-controls__heading">{heading}</p>

      <div
        ref={trackRef}
        className="playback-controls__timeline"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Video position"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime || 0}
        aria-disabled={disabled}
        onPointerDown={handleTrackPointerDown}
        onKeyDown={handleTrackKeyDown}
      >
        <div className="playback-controls__timeline-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="playback-controls__strip">
        <button
          type="button"
          className="playback-controls__icon-btn"
          onClick={onRewind}
          disabled={disabled}
          aria-label="Restart from the beginning"
        >
          <img src={icons.rewind} alt="" />
        </button>

        <button
          type="button"
          className="playback-controls__play-btn"
          onClick={onTogglePlay}
          disabled={disabled}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <img src={icons.play} alt="" />}
        </button>

        <div className="playback-controls__speed" ref={menuRef}>
          <button
            type="button"
            className="playback-controls__speed-btn"
            onClick={() => setMenuOpen((open) => !open)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
          >
            {playbackRate}x Speed
          </button>
          {menuOpen && (
            <ul className="playback-controls__speed-menu" role="listbox">
              {SPEEDS.map((speed) => (
                <li key={speed}>
                  <button
                    type="button"
                    className={`playback-controls__speed-option${speed === playbackRate ? ' playback-controls__speed-option--active' : ''}`}
                    role="option"
                    aria-selected={speed === playbackRate}
                    onClick={() => {
                      onSpeedChange(speed)
                      setMenuOpen(false)
                    }}
                  >
                    {speed}x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {onToggleFullscreen && (
          <button
            type="button"
            className="playback-controls__icon-btn playback-controls__fullscreen-btn"
            onClick={onToggleFullscreen}
            disabled={disabled}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        )}
      </div>
    </div>
  )
}

export default PlaybackControls
