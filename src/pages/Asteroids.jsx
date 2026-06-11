import { useEffect, useState } from 'react'
import { fetchAsteroids } from '../api/nasa'
import { askAI } from '../api/ai'

export default function Asteroids() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [aiReplies, setAiReplies] = useState({})
  const [loading, setLoading] = useState({})

  useEffect(() => {
    fetchAsteroids().then(setData).catch(e => setError(e.message))
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const asteroids = data?.near_earth_objects?.[today] ?? []

  async function explainAsteroid(asteroid) {
    const id = asteroid.id
    setLoading(l => ({ ...l, [id]: true }))
    const km = asteroid.close_approach_data[0]?.miss_distance?.kilometers
    const speed = asteroid.close_approach_data[0]?.relative_velocity?.kilometers_per_hour
    const context = `Asteroid ${asteroid.name}, diameter ${asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}km, passing Earth at ${parseFloat(km).toFixed(0)}km, speed ${parseFloat(speed).toFixed(0)}km/h, hazardous: ${asteroid.is_potentially_hazardous_asteroid}`
    try {
      const reply = await askAI('Should I be worried about this asteroid? Explain simply.', context)
      setAiReplies(r => ({ ...r, [id]: reply }))
    } catch {
      setAiReplies(r => ({ ...r, [id]: 'AI unavailable' }))
    }
    setLoading(l => ({ ...l, [id]: false }))
  }

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>NASA NeoWs · Live</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Near-Earth Asteroids</h1>
      <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Objects passing Earth today · {today}</p>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5', marginBottom: '1rem' }}>{error}</div>}
      {!data && !error && <p style={{ color: '#64748b' }}>Loading asteroid data...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {asteroids.sort((a, b) => b.is_potentially_hazardous_asteroid - a.is_potentially_hazardous_asteroid).map(asteroid => {
          const approach = asteroid.close_approach_data[0]
          const distKm = parseFloat(approach?.miss_distance?.kilometers ?? 0)
          const distMoon = parseFloat(approach?.miss_distance?.lunar ?? 0)
          const speed = parseFloat(approach?.relative_velocity?.kilometers_per_hour ?? 0)
          const diameter = asteroid.estimated_diameter.kilometers
          const isHazardous = asteroid.is_potentially_hazardous_asteroid

          return (
            <div key={asteroid.id} style={{
              background: '#111827',
              border: `1px solid ${isHazardous ? 'rgba(239,68,68,0.4)' : '#1e2d4a'}`,
              borderRadius: '14px', padding: '1.4rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{asteroid.name}</h3>
                    {isHazardous && <span style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '100px', padding: '0.15rem 0.6rem', fontSize: '0.65rem', fontWeight: 700 }}>⚠ HAZARDOUS</span>}
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.78rem' }}>ID: {asteroid.id}</p>
                </div>
                <button onClick={() => explainAsteroid(asteroid)} disabled={loading[asteroid.id]} style={{
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '8px', padding: '0.4rem 0.9rem', color: '#60a5fa',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                }}>
                  {loading[asteroid.id] ? 'Thinking...' : '🤖 Ask AI'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Miss Distance', value: `${(distKm / 1e6).toFixed(2)}M km`, sub: `${distMoon.toFixed(1)} lunar distances` },
                  { label: 'Speed', value: `${(speed / 1000).toFixed(1)}k km/h`, sub: 'relative velocity' },
                  { label: 'Diameter', value: `${diameter.estimated_diameter_max.toFixed(3)} km`, sub: 'estimated max' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#0f1629', borderRadius: '10px', padding: '0.8rem 1rem', minWidth: '140px' }}>
                    <div style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', margin: '0.2rem 0' }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {aiReplies[asteroid.id] && (
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '0.9rem', marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>AstroLens AI</p>
                  <p style={{ color: '#e2e8f0', fontSize: '0.83rem', lineHeight: 1.6 }}>{aiReplies[asteroid.id]}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
