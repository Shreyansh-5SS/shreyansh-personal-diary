import { Routes, Route, useNavigate } from 'react-router-dom'
import { Container, Button, Stack } from 'react-bootstrap'
import Home from './pages/Home'
import Work from './pages/Work'

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
      <Route path="/home" element={<Home />} />
      <Route path="/work" element={<Work />} />
    </Routes>
  )
}

export default App