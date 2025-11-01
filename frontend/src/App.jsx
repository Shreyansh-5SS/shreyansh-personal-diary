import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { Container, Button, Stack } from 'react-bootstrap'
import HomeDiary from './pages/HomeDiary'
import AnimeList from './pages/AnimeList'
import Expenses from './pages/Expenses'
import Timetable from './pages/Timetable'
import HomeLayout from './layouts/HomeLayout'
import WorkLayout from './layouts/WorkLayout'
import WorkPortfolio from './pages/WorkPortfolio'
import WorkDesk from './pages/WorkDesk'

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <Stack direction="horizontal" gap={4}>
            <Button size="lg" onClick={() => navigate('/home')} style={{ width: '150px', height: '150px', fontSize: '24px' }}>
              HOME
            </Button>
            <Button size="lg" onClick={() => navigate('/work')} style={{ width: '150px', height: '150px', fontSize: '24px' }}>
              WORK
            </Button>
          </Stack>
        </Container>
      } />
      
      {/* Home section with nested routes */}
      <Route path="/home" element={<HomeLayout />}>
        <Route index element={<Navigate to="/home/diary" replace />} />
        <Route path="diary" element={<HomeDiary />} />
        <Route path="anime" element={<AnimeList />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="timetable" element={<Timetable />} />
      </Route>

      {/* Work section */}
      <Route path="/work" element={<WorkLayout />}>
        <Route index element={<Navigate to="/work/portfolio" replace />} />
        <Route path="portfolio" element={<WorkPortfolio />} />
        <Route path="desk" element={<WorkDesk />} />
      </Route>
    </Routes>
  )
}

export default App