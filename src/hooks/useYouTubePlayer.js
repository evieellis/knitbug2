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
function useYouTubePlayer(containerRef, { youtubeId, startSeconds = 0 } = {}) {
  const playerRef = useRef(null)
  const intervalRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(startSeconds)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRateState] = useState(1)

  useEffect(() => {
    if (!youtubeId || !containerRef.current) return undefined
    let cancelled = false

    setIsReady(false)
    setIsPlaying(false)
    setCurrentTime(startSeconds)
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
            setDuration(event.target.getDuration())
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
    // startSeconds is intentionally excluded: it should only apply when the player
    // is (re)created for a given video, not re-run the whole effect if it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId, containerRef])

  // The IFrame API has no timeupdate event — poll while playing to drive the scrubber.
  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current)
      return undefined
    }
    intervalRef.current = setInterval(() => {
      const time = playerRef.current?.getCurrentTime?.()
      if (typeof time === 'number') setCurrentTime(time)
    }, 250)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying])

  const play = useCallback(() => playerRef.current?.playVideo?.(), [])
  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), [])
  const togglePlay = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const seekTo = useCallback(
    (seconds) => {
      const clamped = Math.max(0, Math.min(seconds, duration || seconds))
      playerRef.current?.seekTo?.(clamped, true)
      setCurrentTime(clamped)
    },
    [duration]
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
