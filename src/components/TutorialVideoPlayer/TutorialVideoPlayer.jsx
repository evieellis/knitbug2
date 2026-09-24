import { useEffect, useState } from 'react'
import MediaViewer from '../MediaViewer/MediaViewer'
import PlaybackControls from '../PlaybackControls/PlaybackControls'
import { icons } from '../../content/icons'
import './TutorialVideoPlayer.css'

// Wraps MediaViewer + PlaybackControls together so the fullscreen toggle can
// blow both up to fill the viewport using CSS alone. Critically, MediaViewer
// itself is never unmounted or re-created when toggling — only its ancestor's
// positioning/size changes — so the same live YouTube player (and its
// playback position) survives entering and exiting fullscreen untouched.
function TutorialVideoPlayer({
  heading,
  media,
  containerRef,
  player,
  hasVideo,
  className,
  onPrevStep,
  onNextStep,
}) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!fullscreen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [fullscreen])

  return (
    <div
      className={`tutorial-video${fullscreen ? ' tutorial-video--fullscreen' : ''}${className ? ` ${className}` : ''}`}
      // Clicking the dimmed backdrop (not the video/controls themselves)
      // closes fullscreen, same as clicking outside any other popup here.
      onClick={(event) => {
        if (fullscreen && event.target === event.currentTarget) setFullscreen(false)
      }}
    >
      {fullscreen && (
        <button
          type="button"
          className="tutorial-video__close-btn"
          onClick={() => setFullscreen(false)}
          aria-label="Exit fullscreen"
        >
          <img src={icons.xClose} alt="" />
        </button>
      )}

      {/* Only rendered at all in fullscreen — TutorialOverview doesn't pass
          these (it has no steps to page through), and inline mode has no
          room beside a 380px-tall video for a 56px circular button anyway. */}
      <div className="tutorial-video__row">
        {fullscreen && onPrevStep && (
          <button
            type="button"
            className="tutorial-video__nav-btn tutorial-video__nav-btn--prev"
            onClick={onPrevStep}
            aria-label="Previous step"
          >
            <img src={icons.chevronLeft} alt="" />
          </button>
        )}

        <div className="tutorial-video__stage">
          <MediaViewer media={media} containerRef={containerRef} />
        </div>

        {fullscreen && onNextStep && (
          <button
            type="button"
            className="tutorial-video__nav-btn tutorial-video__nav-btn--next"
            onClick={onNextStep}
            aria-label="Next step"
          >
            <img src={icons.chevronRight} alt="" />
          </button>
        )}
      </div>

      <PlaybackControls
        heading={heading}
        isPlaying={player.isPlaying}
        currentTime={player.currentTime}
        duration={player.duration}
        playbackRate={player.playbackRate}
        onTogglePlay={player.togglePlay}
        onRewind={() => player.seekTo(0)}
        onSeek={player.seekTo}
        onSpeedChange={player.setPlaybackRate}
        disabled={!hasVideo}
        isFullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((value) => !value)}
      />
    </div>
  )
}

export default TutorialVideoPlayer
