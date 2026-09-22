import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home/Home'
import FindOutWhatsWrong from './screens/FindOutWhatsWrong/FindOutWhatsWrong'
import GalleryOfMistakes from './screens/GalleryOfMistakes/GalleryOfMistakes'
import NotBuilt from './screens/NotBuilt/NotBuilt'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/diagnose" element={<FindOutWhatsWrong />} />
      <Route path="/browse-mistakes" element={<GalleryOfMistakes />} />
      <Route path="*" element={<NotBuilt />} />
    </Routes>
  )
}

export default App
