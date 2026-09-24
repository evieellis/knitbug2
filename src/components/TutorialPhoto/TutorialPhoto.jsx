import './TutorialPhoto.css'

// Stands in for the video player on tutorials with no video (media type
// 'none'), at the same size so the layout doesn't shift between the two.
function TutorialPhoto({ src }) {
  return <img src={src} className="tutorial-photo" alt="" />
}

export default TutorialPhoto
