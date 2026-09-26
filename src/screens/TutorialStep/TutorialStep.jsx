import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import TutorialVideoPlayer from '../../components/TutorialVideoPlayer/TutorialVideoPlayer'
import TutorialPhoto from '../../components/TutorialPhoto/TutorialPhoto'
import ChecklistItem from '../../components/ChecklistItem/ChecklistItem'
import ExitTutorialModal from '../../components/ExitTutorialModal/ExitTutorialModal'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { repairMethods } from '../../content/repairOptions'
import useYouTubePlayer from '../../hooks/useYouTubePlayer'
import { useReturnToHistoryEntry } from '../../hooks/useHistoryReturn'
import './TutorialStep.css'

function TutorialStep() {
  const { categoryId, methodId, stepNumber } = useParams()
  const navigate = useNavigate()
  const [exitModalOpen, setExitModalOpen] = useState(false)
  // Exit lands back on this method's Tutorial Overview, so Back from there
  // goes on to Repair Options rather than into the tutorial steps again.
  const exitTutorial = useReturnToHistoryEntry(
    `tutorial-overview/${categoryId}/${methodId}`,
    `/tutorials/${categoryId}/${methodId}`
  )
  const method = repairMethods.find((item) => item.id === methodId && item.categories.includes(categoryId))
  const tutorial = method?.tutorial

  const stepIndex = Number(stepNumber) - 1
  const step = Number.isInteger(stepIndex) ? tutorial?.steps[stepIndex] : undefined

  // Autoplay here (not on the Tutorial Overview trailer) — landing on a step,
  // whether via "Start Tutorial" or "Next Step", is itself the user's cue to
  // play, so the clip should already be rolling rather than sitting paused.
  const media =
    tutorial && step
      ? { ...tutorial.media, startSeconds: step.startSeconds, endSeconds: step.endSeconds, autoplay: true }
      : undefined
  const containerRef = useRef(null)
  const player = useYouTubePlayer(containerRef, media)

  if (!tutorial || !method || !step) return <NotBuilt />

  const hasVideo = media.type === 'youtube' && Boolean(media.youtubeId)
  // No video → a photo in its place (see TutorialOverview).
  const noVideo = media.type === 'none'
  const photo = media.image || method.image
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === tutorial.steps.length - 1
  const overviewHref = `/tutorials/${categoryId}/${methodId}`
  const nextHref = isLastStep ? `/repair-complete/${categoryId}` : `${overviewHref}/${stepIndex + 2}`

  return (
    <div className="tutorial-step">
      <Navbar />
      <main className="tutorial-step__content">
        <button
          type="button"
          className="btn btn--chip tutorial-step__exit-btn"
          onClick={() => setExitModalOpen(true)}
        >
          <img src={icons.xClose} className="btn__icon" alt="" />
          <span>Exit Tutorial</span>
        </button>

        <ExitTutorialModal
          open={exitModalOpen}
          onCancel={() => setExitModalOpen(false)}
          onExit={exitTutorial}
        />

        <div className="tutorial-step__header">
          <h1 className="tutorial-step__title">{method.title}</h1>
          <div className="tutorial-step__metadata">
            {method.timeLabel && (
              <span className="tutorial-step__meta-row">
                <img src={icons.clock} className="tutorial-step__meta-icon" alt="" />
                {method.timeLabel}
              </span>
            )}
            {method.neededLabel && (
              <span className="tutorial-step__meta-row">
                <img src={icons.shoppingBag} className="tutorial-step__meta-icon" alt="" />
                {method.neededLabel}
              </span>
            )}
          </div>
        </div>

        <div className="tutorial-step__split">
          {noVideo ? (
            photo && (
              <div className="tutorial-step__left-col">
                <TutorialPhoto src={photo} />
              </div>
            )
          ) : (
            <div className="tutorial-step__left-col">
              <TutorialVideoPlayer
                heading={`Step ${stepNumber}`}
                media={media}
                containerRef={containerRef}
                player={player}
                hasVideo={hasVideo}
                onPrevStep={() => navigate(-1)}
                onNextStep={() => navigate(nextHref)}
              />
            </div>
          )}

          <div className="tutorial-step__right-col">
            <div className="tutorial-step__heading-group">
              <span className="tutorial-step__badge">
                Step {stepNumber} of {tutorial.steps.length}
              </span>
              <p className="tutorial-step__heading">{step.heading}</p>
            </div>

            {step.checklist.length > 0 && (
              <div className="tutorial-step__checklist-section">
                <p className="tutorial-step__checklist-heading">Make Sure…</p>
                <div className="tutorial-step__checklist">
                  {step.checklist.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      status={item.status}
                      text={item.text}
                      detail={item.detail}
                      image={item.image}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="tutorial-step__nav">
              <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
                <img src={icons.chevronLeft} className="btn__icon" alt="" />
                <span>{isFirstStep ? 'Back to Overview' : 'Previous Step'}</span>
              </button>
              <Button
                href={nextHref}
                variant={isLastStep ? 'green' : 'gold'}
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
