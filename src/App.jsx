import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home/Home'
import FindOutWhatsWrong from './screens/FindOutWhatsWrong/FindOutWhatsWrong'
import NotBuilt from './screens/NotBuilt/NotBuilt'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/diagnose" element={<FindOutWhatsWrong />} />
      <Route path="*" element={<NotBuilt />} />
    </Routes>
  )
}

export default App
