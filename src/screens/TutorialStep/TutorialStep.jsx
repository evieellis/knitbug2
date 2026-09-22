import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import TutorialHeader from '../../components/TutorialHeader/TutorialHeader'
import Button from '../../components/Button/Button'
import MediaViewer from '../../components/MediaViewer/MediaViewer'
import PlaybackControls from '../../components/PlaybackControls/PlaybackControls'
import ChecklistItem from '../../components/ChecklistItem/ChecklistItem'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { tutorials } from '../../content/tutorials'
import useYouTubePlayer from '../../hooks/useYouTubePlayer'
import './TutorialStep.css'

function TutorialStep() {
  const { categoryId, methodNumber, stepNumber } = useParams()
  const methodId = `${categoryId}-method-${methodNumber}`
  const tutorial = tutorials[methodId]

  const stepIndex = Number(stepNumber) - 1
  const step = Number.isInteger(stepIndex) ? tutorial?.steps[stepIndex] : undefined

  const media = tutorial && step ? { ...tutorial.media, startSeconds: step.startSeconds } : undefined
  const containerRef = useRef(null)
  const player = useYouTubePlayer(containerRef, media)

  if (!tutorial || !step) return <NotBuilt />

  const hasVideo = media.type === 'youtube' && Boolean(media.youtubeId)
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === tutorial.steps.length - 1
  const exitHref = `/repair/${categoryId}`
  const overviewHref = `/tutorials/${categoryId}/${methodNumber}`
  const prevHref = isFirstStep ? overviewHref : `${overviewHref}/${stepIndex}`
  const nextHref = isLastStep ? '/repair-complete' : `${overviewHref}/${stepIndex + 2}`

  return (
    <div className="tutorial-step">
      <TutorialHeader exitHref={exitHref} />
      <main className="tutorial-step__content">
        <h1 className="tutorial-step__title">{tutorial.title}</h1>

        <div className="tutorial-step__split">
          <div className="tutorial-step__left-col">
            <div className="tutorial-step__media">
              <MediaViewer media={media} containerRef={containerRef} />
            </div>
            <PlaybackControls
              heading={`Step ${stepNumber}`}
              isPlaying={player.isPlaying}
              currentTime={player.currentTime}
              duration={player.duration}
              playbackRate={player.playbackRate}
              onTogglePlay={player.togglePlay}
              onRewind={() => player.seekTo(0)}
              onSeek={player.seekTo}
              onSpeedChange={player.setPlaybackRate}
              disabled={!hasVideo}
            />
          </div>

          <div className="tutorial-step__right-col">
            <div className="tutorial-step__heading-group">
              <span className="tutorial-step__badge">
                Step {stepNumber} of {tutorial.steps.length}
              </span>
              <p className="tutorial-step__heading">{step.heading}</p>
            </div>

            <div className="tutorial-step__checklist-section">
              <p className="tutorial-step__checklist-heading">Make Sure…</p>
              <div className="tutorial-step__checklist">
                {step.checklist.map((item) => (
                  <ChecklistItem key={item.id} status={item.status} text={item.text} detail={item.detail} />
                ))}
              </div>
            </div>

            <div className="tutorial-step__nav">
              <Button href={prevHref} variant="ghost" icon={icons.chevronLeft} iconPosition="leading">
                {isFirstStep ? 'Back to Overview' : 'Previous Step'}
              </Button>
              <Button
                href={nextHref}
                variant="gold"
                icon={icons.chevronRight}
                className="tutorial-step__next-btn"
              >
                {isLastStep ? 'Complete Repair' : 'Next Step'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TutorialStep
