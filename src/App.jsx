import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import APODPage from './pages/APODPage'
import SpaceWeather from './pages/SpaceWeather'
import Asteroids from './pages/Asteroids'
import DSNLive from './pages/DSNLive'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/apod" element={<APODPage />} />
        <Route path="/weather" element={<SpaceWeather />} />
        <Route path="/asteroids" element={<Asteroids />} />
        <Route path="/dsn" element={<DSNLive />} />
      </Routes>
    </Layout>
  )
}
