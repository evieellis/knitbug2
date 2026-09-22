import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Home from './screens/Home/Home'
import FindOutWhatsWrong from './screens/FindOutWhatsWrong/FindOutWhatsWrong'
import GalleryOfMistakes from './screens/GalleryOfMistakes/GalleryOfMistakes'
import MistakeOverview from './screens/MistakeOverview/MistakeOverview'
import RepairOptions from './screens/RepairOptions/RepairOptions'
import TutorialOverview from './screens/TutorialOverview/TutorialOverview'
import TutorialStep from './screens/TutorialStep/TutorialStep'
import NotBuilt from './screens/NotBuilt/NotBuilt'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnose" element={<FindOutWhatsWrong />} />
        <Route path="/browse-mistakes" element={<GalleryOfMistakes />} />
        <Route path="/mistakes/:categoryId" element={<MistakeOverview />} />
        <Route path="/repair/:categoryId" element={<RepairOptions />} />
        <Route path="/tutorials/:categoryId/:methodNumber" element={<TutorialOverview />} />
        <Route path="/tutorials/:categoryId/:methodNumber/:stepNumber" element={<TutorialStep />} />
        <Route path="*" element={<NotBuilt />} />
      </Routes>
    </>
  )
}

export default App
