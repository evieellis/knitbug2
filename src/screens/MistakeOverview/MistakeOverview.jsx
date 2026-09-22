import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import MediaViewer from '../../components/MediaViewer/MediaViewer'
import PlaybackControls from '../../components/PlaybackControls/PlaybackControls'
import SignCard from '../../components/SignCard/SignCard'
import CategoryRow from '../../components/CategoryRow/CategoryRow'
import NotBuilt from '../NotBuilt/NotBuilt'
import { icons } from '../../content/icons'
import { backLink, examplesLabel, mistakeOverviews } from '../../content/mistakeOverview'
import { categories } from '../../content/galleryOfMistakes'
import useYouTubePlayer from '../../hooks/useYouTubePlayer'
import './MistakeOverview.css'

function MistakeOverview() {
  const { categoryId } = useParams()
  const overview = mistakeOverviews[categoryId]
  const category = categories.find((item) => item.id === categoryId)

  const containerRef = useRef(null)
  const player = useYouTubePlayer(containerRef, overview?.media)

  if (!overview || !category) return <NotBuilt />

  const hasVideo = overview.media.type === 'youtube' && Boolean(overview.media.youtubeId)

  return (
    <div className="mistake-overview">
      <Navbar />
      <main className="mistake-overview__content">
        <Button href={backLink.href} variant="chip" icon={icons.chevronLeft} iconPosition="leading">
          {backLink.label}
        </Button>

        <h1 className="mistake-overview__title">{overview.title}</h1>

        <div className="mistake-overview__split">
          <div className="mistake-overview__left-col">
            <div className="mistake-overview__media">
              <MediaViewer media={overview.media} containerRef={containerRef} />
            </div>
            <PlaybackControls
              heading="How It Happens"
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

          <div className="mistake-overview__right-col">
            <section className="mistake-overview__section">
              <p className="mistake-overview__section-heading">{overview.whatIsIt.heading}</p>
              <div className="mistake-overview__divider" role="presentation" />
              <p className="mistake-overview__body">{overview.whatIsIt.body || 'More detail coming soon.'}</p>
            </section>

            <section className="mistake-overview__section">
              <p className="mistake-overview__section-heading mistake-overview__section-heading--small">
                {overview.signs.heading}
              </p>
              <div className="mistake-overview__signs">
                {overview.signs.items.map((sign) => (
                  <SignCard key={sign.id} label={sign.label || 'More signs coming soon'} detail={sign.detail} />
                ))}
              </div>
            </section>

            <Button href={overview.cta.href} variant="gold" icon={icons.arrowRightBlack}>
              {overview.cta.label}
            </Button>
          </div>
        </div>

        <CategoryRow label={examplesLabel} swatches={category.swatches} showSeeMore={false} />
      </main>
    </div>
  )
}

export default MistakeOverview
