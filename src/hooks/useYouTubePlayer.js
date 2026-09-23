import { useCallback, useEffect, useRef, useState } from 'react'

// Loaded once for the whole app, regardless of how many players are created.
let apiPromise = null

function loadYouTubeApi() {
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      resolve(window.YT)
    }

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    }
  })

  return apiPromise
}

// Drives a YouTube IFrame player with fully custom controls (native chrome hidden
// via playerVars.controls: 0). Returns a stable shape — { isReady, isPlaying,
// currentTime, duration, playbackRate, play, pause, togglePlay, seekTo, setPlaybackRate }
// — so a future non-video media type (e.g. an interactive 3D viewer) can be driven
// by a differently-implemented hook without PlaybackControls changing at all.
//
// `startSeconds`/`endSeconds` scope playback to a clip within the full video (a
// tutorial step replaying just its own small section) — everything this hook
// exposes (currentTime, duration, seekTo(...)) is relative to that clip, not the
// underlying video, so PlaybackControls needs no awareness of clips at all: 0 is
// always "the start of this clip" and `duration` is always "this clip's length".
function useYouTubePlayer(containerRef, { youtubeId, startSeconds = 0, endSeconds } = {}) {
  const playerRef = useRef(null)
  const intervalRef = useRef(null)
  const rawDurationRef = useRef(0)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRateState] = useState(1)

  // A misconfigured or not-yet-set endSeconds (null, or <= startSeconds) just
  // means "no clip end" — plays to the end of the underlying video, as before.
  const clipEndFor = useCallback(
    (rawDuration) =>
      typeof endSeconds === 'number' && endSeconds > startSeconds ? Math.min(endSeconds, rawDuration) : rawDuration,
    [startSeconds, endSeconds]
  )

  useEffect(() => {
    if (!youtubeId || !containerRef.current) return undefined
    let cancelled = false

    setIsReady(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setPlaybackRateState(1)

    loadYouTubeApi().then((YT) => {
      if (cancelled || !containerRef.current) return

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          start: Math.floor(startSeconds),
        },
        events: {
          onReady: (event) => {
            if (cancelled) return
            setIsReady(true)
            const rawDuration = event.target.getDuration()
            rawDurationRef.current = rawDuration
            setDuration(Math.max(0, clipEndFor(rawDuration) - startSeconds))
          },
          onStateChange: (event) => {
            if (cancelled) return
            setIsPlaying(event.data === YT.PlayerState.PLAYING)
          },
        },
      })
    })

    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
    // Recreated per clip (start/end included) rather than redirecting a live
    // player: routing between tutorial steps normally keeps this component
    // mounted, so without this the video would just keep playing past the
    // step it was cued for instead of cueing up the new step's clip.
  }, [youtubeId, startSeconds, endSeconds, containerRef, clipEndFor])

  // The IFrame API has no timeupdate event — poll while playing to drive the
  // scrubber, and to notice when playback has reached this clip's own end.
  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current)
      return undefined
    }
    intervalRef.current = setInterval(() => {
      const rawTime = playerRef.current?.getCurrentTime?.()
      if (typeof rawTime !== 'number') return
      const clipEnd = clipEndFor(rawDurationRef.current)
      if (rawTime >= clipEnd) {
        // Stop at the end of this step's clip and rewind it, rather than
        // playing on into whatever footage comes after it — pressing play
        // again replays the clip fresh.
        playerRef.current?.pauseVideo?.()
        playerRef.current?.seekTo?.(startSeconds, true)
        setCurrentTime(0)
        return
      }
      setCurrentTime(Math.max(0, rawTime - startSeconds))
    }, 250)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, startSeconds, clipEndFor])

  const play = useCallback(() => playerRef.current?.playVideo?.(), [])
  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), [])
  const togglePlay = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const seekTo = useCallback(
    (relativeSeconds) => {
      const clipLength = Math.max(0, clipEndFor(rawDurationRef.current) - startSeconds)
      const clamped = Math.max(0, Math.min(relativeSeconds, clipLength))
      playerRef.current?.seekTo?.(startSeconds + clamped, true)
      setCurrentTime(clamped)
    },
    [startSeconds, clipEndFor]
  )

  const setPlaybackRate = useCallback((rate) => {
    playerRef.current?.setPlaybackRate?.(rate)
    setPlaybackRateState(rate)
  }, [])

  return {
    isReady,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    play,
    pause,
    togglePlay,
    seekTo,
    setPlaybackRate,
  }
}

export default useYouTubePlayer
