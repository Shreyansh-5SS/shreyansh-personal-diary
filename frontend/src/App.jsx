import { Routes, Route, useNavigate } from 'react-router-dom'
import { Container, Button, Stack } from 'react-bootstrap'
import Home from './pages/Home'
import Work from './pages/Work'
import HomeDiary from './pages/HomeDiary'
import AnimeList from './pages/AnimeList'
import Expenses from './pages/Expenses'

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <Stack direction="horizontal" gap={4}>
            <Stack gap={4}>
              <Button size="lg" onClick={() => navigate('/home')} style={{ width: '150px', height: '150px', fontSize: '24px' }}>
                HOME
              </Button>
              <Button size="lg" onClick={() => navigate('/anime')} style={{ width: '150px', height: '150px', fontSize: '20px' }}>
                ANIME
              </Button>
            </Stack>
            <Stack gap={4}>
              <Button size="lg" onClick={() => navigate('/work')} style={{ width: '150px', height: '150px', fontSize: '24px' }}>
                WORK
              </Button>
              <Button size="lg" onClick={() => navigate('/expenses')} style={{ width: '150px', height: '150px', fontSize: '20px' }}>
                EXPENSES
              </Button>
            </Stack>
          </Stack>
        </Container>
      } />
      <Route path="/home" element={<HomeDiary />} />
      <Route path="/work" element={<Work />} />
      <Route path="/anime" element={<AnimeList />} />
      <Route path="/expenses" element={<Expenses />} />
    </Routes>
  )
}

export default App