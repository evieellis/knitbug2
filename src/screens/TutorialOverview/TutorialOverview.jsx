import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import RepairBadge from '../../components/RepairBadge/RepairBadge'
import MediaViewer from '../../components/MediaViewer/MediaViewer'
import PlaybackControls from '../../components/PlaybackControls/PlaybackControls'
import ChecklistItem from '../../components/ChecklistItem/ChecklistItem'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { repairMethods } from '../../content/repairOptions'
import useYouTubePlayer from '../../hooks/useYouTubePlayer'
import './TutorialOverview.css'

function TutorialOverview() {
  const { categoryId, methodId } = useParams()
  const navigate = useNavigate()
  const method = repairMethods.find((item) => item.id === methodId && item.categories.includes(categoryId))
  const tutorial = method?.tutorial

  const containerRef = useRef(null)
  const player = useYouTubePlayer(containerRef, tutorial?.media)

  if (!tutorial || !method) return <NotBuilt />

  const hasVideo = tutorial.media.type === 'youtube' && Boolean(tutorial.media.youtubeId)
  // Same field the repair-options card already shows — reused as-is rather
  // than asking for a second copy of the same text.
  const bodyText = method.warningText || method.description

  return (
    <div className="tutorial-overview">
      <Navbar />
      <main className="tutorial-overview__content">
        <button type="button" className="btn btn--chip" onClick={() => navigate(-1)}>
          <img src={icons.chevronLeft} className="btn__icon" alt="" />
          <span>Back</span>
        </button>

        <div className="tutorial-overview__header">
          <div className="tutorial-overview__title-row">
            <RepairBadge badge={method.badge} />
            <h1 className="tutorial-overview__title">{tutorial.overviewTitle}</h1>
          </div>
          {bodyText && <p className="tutorial-overview__description">{bodyText}</p>}
          <div className="tutorial-overview__metadata">
            <span className="tutorial-overview__meta-row">
              <img src={icons.clock} className="tutorial-overview__meta-icon" alt="" />
              {method.timeLabel}
            </span>
            <span className="tutorial-overview__meta-row">
              <img src={icons.shoppingBag} className="tutorial-overview__meta-icon" alt="" />
              {method.neededLabel}
            </span>
          </div>
        </div>

        <div className="tutorial-overview__split">
          <div className="tutorial-overview__left-col">
            <div className="tutorial-overview__media">
              <MediaViewer media={tutorial.media} containerRef={containerRef} />
            </div>
            <PlaybackControls
              heading="Step-by-Step Overview Video"
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

          <div className="tutorial-overview__right-col">
            <section className="tutorial-overview__section">
              <p className="tutorial-overview__section-heading">Overview</p>
              <ol className="tutorial-overview__steps">
                {tutorial.overviewSteps.map((step, index) => (
                  <li key={index} className="tutorial-overview__step">
                    <span className="tutorial-overview__step-number">{index + 1}</span>
                    <p className="tutorial-overview__step-text">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="tutorial-overview__reasons">
              <div className="tutorial-overview__reasons-col">
                <p className="tutorial-overview__section-heading tutorial-overview__section-heading--small">
                  Good When
                </p>
                {method.goodWhen.length > 0 ? (
                  <div className="tutorial-overview__reasons-list">
                    {method.goodWhen.map((reason, index) => (
                      <ChecklistItem key={index} status="good" text={reason} />
                    ))}
                  </div>
                ) : (
                  <p className="tutorial-overview__reasons-empty">Reasons coming soon.</p>
                )}
              </div>

              {method.badFor.length > 0 && (
                <div className="tutorial-overview__reasons-col">
                  <p className="tutorial-overview__section-heading tutorial-overview__section-heading--small">
                    Bad For
                  </p>
                  <div className="tutorial-overview__reasons-list">
                    {method.badFor.map((reason, index) => (
                      <ChecklistItem key={index} status="warning" text={reason} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            <Button href={`/tutorials/${categoryId}/${methodId}/1`} variant="gold" icon={icons.arrowRightBlack}>
              Start Tutorial
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TutorialOverview
