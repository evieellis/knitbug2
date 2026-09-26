import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import RepairBadge from '../../components/RepairBadge/RepairBadge'
import TutorialVideoPlayer from '../../components/TutorialVideoPlayer/TutorialVideoPlayer'
import TutorialPhoto from '../../components/TutorialPhoto/TutorialPhoto'
import ChecklistItem from '../../components/ChecklistItem/ChecklistItem'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { repairMethods } from '../../content/repairOptions'
import useYouTubePlayer from '../../hooks/useYouTubePlayer'
import { useRememberHistoryEntry } from '../../hooks/useHistoryReturn'
import './TutorialOverview.css'

function TutorialOverview() {
  const { categoryId, methodId } = useParams()
  const navigate = useNavigate()
  const method = repairMethods.find((item) => item.id === methodId && item.categories.includes(categoryId))
  const tutorial = method?.tutorial

  const containerRef = useRef(null)
  const player = useYouTubePlayer(containerRef, tutorial?.media)
  // So Exit Tutorial can return here (see TutorialStep).
  useRememberHistoryEntry(`tutorial-overview/${categoryId}/${methodId}`)

  if (!tutorial || !method) return <NotBuilt />

  const hasVideo = tutorial.media.type === 'youtube' && Boolean(tutorial.media.youtubeId)
  // type 'none' means the method deliberately has no video (e.g. "Just leave
  // it?"), so a photo takes the player's place instead of "Video coming soon" —
  // the tutorial's own photo, or else the method's card photo.
  const noVideo = tutorial.media.type === 'none'
  const photo = tutorial.media.image || method.image
  // Same fields the repair-options card already shows — reused as-is rather
  // than asking for a second copy of the same text.
  const isNegativeWarning = method.badge === 'not-recommended'

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
          {method.description && <p className="tutorial-overview__description">{method.description}</p>}
          {method.warningText && (
            <p
              className={`tutorial-overview__warning${isNegativeWarning ? '' : ' tutorial-overview__warning--positive'}`}
            >
              <img
                src={isNegativeWarning ? icons.alertTriangle : icons.checkSage}
                className="tutorial-overview__warning-icon"
                alt=""
              />
              {method.warningText}
            </p>
          )}
          <div className="tutorial-overview__metadata">
            {method.timeLabel && (
              <span className="tutorial-overview__meta-row">
                <img src={icons.clock} className="tutorial-overview__meta-icon" alt="" />
                {method.timeLabel}
              </span>
            )}
            {method.neededLabel && (
              <span className="tutorial-overview__meta-row">
                <img src={icons.shoppingBag} className="tutorial-overview__meta-icon" alt="" />
                {method.neededLabel}
              </span>
            )}
          </div>
        </div>

        <div className="tutorial-overview__split">
          {noVideo ? (
            photo && (
              <div className="tutorial-overview__left-col">
                <TutorialPhoto src={photo} />
              </div>
            )
          ) : (
            <div className="tutorial-overview__left-col">
              <TutorialVideoPlayer
                heading="Step-by-Step Overview Video"
                media={tutorial.media}
                containerRef={containerRef}
                player={player}
                hasVideo={hasVideo}
              />
            </div>
          )}

          <div className="tutorial-overview__right-col">
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

            <section className="tutorial-overview__section">
              <p className="tutorial-overview__section-heading">Steps</p>
              <ol className="tutorial-overview__steps">
                {tutorial.overviewSteps.map((step, index) => (
                  <li key={index} className="tutorial-overview__step">
                    <span className="tutorial-overview__step-number">{index + 1}</span>
                    <p className="tutorial-overview__step-text">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Nothing to walk through step by step without a video. */}
            {!noVideo && (
              <Button href={`/tutorials/${categoryId}/${methodId}/1`} variant="gold" icon={icons.arrowRightBlack}>
                Start Tutorial
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TutorialOverview
