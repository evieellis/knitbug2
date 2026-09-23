import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Home from './screens/Home/Home'
import FindOutWhatsWrong from './screens/FindOutWhatsWrong/FindOutWhatsWrong'
import GalleryOfMistakes from './screens/GalleryOfMistakes/GalleryOfMistakes'
import MistakeOverview from './screens/MistakeOverview/MistakeOverview'
import RepairOptions from './screens/RepairOptions/RepairOptions'
import TutorialOverview from './screens/TutorialOverview/TutorialOverview'
import TutorialStep from './screens/TutorialStep/TutorialStep'
import RepairComplete from './screens/RepairComplete/RepairComplete'
import QuestionnaireQuestion from './screens/QuestionnaireQuestion/QuestionnaireQuestion'
import QuestionnaireSidequest from './screens/QuestionnaireSidequest/QuestionnaireSidequest'
import QuestionnaireUncertain from './screens/QuestionnaireUncertain/QuestionnaireUncertain'
import QuestionnaireResults from './screens/QuestionnaireResults/QuestionnaireResults'
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
        <Route path="/tutorials/:categoryId/:methodId" element={<TutorialOverview />} />
        <Route path="/tutorials/:categoryId/:methodId/:stepNumber" element={<TutorialStep />} />
        <Route path="/repair-complete/:categoryId" element={<RepairComplete />} />
        <Route path="/questionnaire/sidequest-1" element={<QuestionnaireSidequest step="1" />} />
        <Route path="/questionnaire/sidequest-2" element={<QuestionnaireSidequest step="2" />} />
        <Route path="/questionnaire/uncertain" element={<QuestionnaireUncertain />} />
        <Route path="/questionnaire/results/:categoryId" element={<QuestionnaireResults />} />
        <Route path="/questionnaire/:questionId" element={<QuestionnaireQuestion />} />
        <Route path="*" element={<NotBuilt />} />
      </Routes>
    </>
  )
}

export default App
