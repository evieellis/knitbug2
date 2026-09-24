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
function useYouTubePlayer(containerRef, { youtubeId, startSeconds = 0, endSeconds, autoplay = false } = {}) {
  const playerRef = useRef(null)
  const intervalRef = useRef(null)
  const rawDurationRef = useRef(0)
  const isFirstClipRef = useRef(true)
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

  const refreshDuration = useCallback(
    (rawDuration) => {
      rawDurationRef.current = rawDuration
      setDuration(Math.max(0, clipEndFor(rawDuration) - startSeconds))
    },
    [startSeconds, clipEndFor]
  )

  // Creates the underlying player once per video id (not per clip) — a
  // tutorial step used to get a brand-new player (and so a brand-new iframe
  // going through its own YouTube load screen) every single time, which is
  // exactly what flashed YouTube's own loading UI before controls:0 finished
  // taking hold. Moving between steps of the SAME video now reuses this one
  // already-initialized player instead (see the effect below).
  useEffect(() => {
    if (!youtubeId || !containerRef.current) return undefined
    let cancelled = false
    isFirstClipRef.current = true

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
          autoplay: autoplay ? 1 : 0,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return
            setIsReady(true)
            refreshDuration(event.target.getDuration())
            // Belt-and-suspenders alongside playerVars.autoplay above — more
            // reliable across browsers than the playerVar alone, and safe to
            // call even where autoplay is blocked (it just quietly no-ops).
            if (autoplay) event.target.playVideo()
          },
          onStateChange: (event) => {
            if (cancelled) return
            setIsPlaying(event.data === YT.PlayerState.PLAYING)
            // Catch the real end-of-video the instant it happens, rather than
            // waiting for the polling loop below (up to 250ms later) — that
            // gap was enough time for YouTube's own "more videos" end-screen
            // to flash up before our rewind-to-start logic ever ran. This
            // only ever fires when a video has no endSeconds clip cutoff
            // (e.g. the Tutorial Overview trailer): a step's clip always
            // gets paused by the polling check well before its true end.
            if (event.data === YT.PlayerState.ENDED) {
              event.target.seekTo(startSeconds, true)
              event.target.pauseVideo()
              setCurrentTime(0)
            }
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
    // startSeconds/endSeconds/autoplay are intentionally excluded — the
    // effect below reacts to those changing without rebuilding the player.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId, containerRef])

  // Moving to a different clip of the SAME video (e.g. the next tutorial
  // step) re-points the already-live player instead of tearing it down —
  // loadVideoById/cueVideoById just change what the existing iframe is
  // showing, with no reload and so no chance for YouTube's own chrome to
  // flash up again.
  useEffect(() => {
    if (isFirstClipRef.current) {
      // The creation effect above already loads the first clip — this just
      // skips redoing that on initial mount.
      isFirstClipRef.current = false
      return
    }
    if (!playerRef.current || !isReady) return
    setCurrentTime(0)
    // Same underlying video, so its raw duration hasn't changed — only this
    // clip's relative window has, which refreshDuration recomputes from it.
    refreshDuration(rawDurationRef.current)
    if (autoplay) {
      playerRef.current.loadVideoById({ videoId: youtubeId, startSeconds: Math.floor(startSeconds) })
    } else {
      playerRef.current.cueVideoById({ videoId: youtubeId, startSeconds: Math.floor(startSeconds) })
    }
    // youtubeId changing is handled entirely by the creation effect above
    // (it rebuilds the player); this one only needs to react to the clip
    // window moving within that same video.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSeconds, endSeconds, autoplay])

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
