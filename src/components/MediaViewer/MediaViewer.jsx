import './MediaViewer.css'

// Thin presentational "stage" — owns no player state itself (see
// hooks/useYouTubePlayer.js for why). Branches only on media.type, so adding a
// future type (e.g. 'model3d' for an interactive viewer) is one new branch here;
// nothing else on the page needs to change.
function MediaViewer({ media, containerRef }) {
  if (media.type === 'youtube') {
    if (!media.youtubeId) {
      return (
        <div className="media-viewer media-viewer--placeholder">
          <p>Video coming soon</p>
        </div>
      )
    }
    return (
      <div className="media-viewer">
        <div ref={containerRef} className="media-viewer__stage" />
      </div>
    )
  }

  return (
    <div className="media-viewer media-viewer--placeholder">
      <p>Media not available</p>
    </div>
  )
}

export default MediaViewer
