import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAPOD, fetchAsteroids, fetchSpaceWeather } from '../api/nasa'

function StatCard({ emoji, title, value, sub, onClick, color = '#3b82f6' }) {
  return (
    <div onClick={onClick} style={{
      background: '#111827', border: `1px solid #1e2d4a`,
      borderRadius: '14px', padding: '1.4rem', cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s', flex: 1, minWidth: '200px'
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = color}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2d4a'}>
      <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{emoji}</div>
      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{title}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.2rem' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{sub}</div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [apod, setApod] = useState(null)
  const [asteroids, setAsteroids] = useState(null)
  const [flares, setFlares] = useState(null)

  useEffect(() => {
    fetchAPOD().then(setApod).catch(() => {})
    fetchAsteroids().then(setAsteroids).catch(() => {})
    fetchSpaceWeather().then(setFlares).catch(() => {})
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const asteroidCount = asteroids?.near_earth_objects?.[today]?.length ?? '...'
  const hazardous = asteroids?.near_earth_objects?.[today]?.filter(a => a.is_potentially_hazardous_asteroid).length ?? 0
  const flareCount = flares?.length ?? '...'

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.72rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
          Mission Control
        </p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Space Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <StatCard emoji="🌌" title="Today's APOD" value={apod?.title ?? 'Loading...'} sub="Click to view + AI explain" onClick={() => navigate('/apod')} color="#8b5cf6" />
        <StatCard emoji="☄️" title="Near-Earth Asteroids" value={asteroidCount} sub={`${hazardous} potentially hazardous`} onClick={() => navigate('/asteroids')} color="#f59e0b" />
        <StatCard emoji="☀️" title="Solar Flares (7d)" value={flareCount} sub="DONKI space weather data" onClick={() => navigate('/weather')} color="#ef4444" />
        <StatCard emoji="📡" title="DSN Live" value="Active" sub="Deep Space Network status" onClick={() => navigate('/dsn')} color="#10b981" />
      </div>

      {apod && (
        <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => navigate('/apod')}>
          <div style={{ position: 'relative' }}>
            <img src={apod.url} alt={apod.title} style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,8,16,0.95) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>NASA Astronomy Picture of the Day</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.3rem' }}>{apod.title}</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{apod.date} · Click to explore + AI explain</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
