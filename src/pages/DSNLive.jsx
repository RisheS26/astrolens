import { useEffect, useState } from 'react'
import { askAI } from '../api/ai'

export default function DSNLive() {
  const [dishes, setDishes] = useState([])
  const [error, setError] = useState(null)
  const [aiReplies, setAiReplies] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDSN()
    const interval = setInterval(fetchDSN, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchDSN() {
    try {
      const res = await fetch('https://eyes.nasa.gov/dsn/data/dsn.xml?r=' + Date.now())
      const text = await res.text()
      const parser = new DOMParser()
      const xml = parser.parseFromString(text, 'text/xml')
      const dishEls = xml.querySelectorAll('dish')
      const parsed = Array.from(dishEls).map(d => ({
        name: d.getAttribute('name'),
        azimuth: d.getAttribute('azimuthAngle'),
        elevation: d.getAttribute('elevationAngle'),
        targets: Array.from(d.querySelectorAll('target')).map(t => t.getAttribute('name')),
        signals: Array.from(d.querySelectorAll('upSignal, downSignal')).map(s => ({
          type: s.tagName, spacecraft: s.getAttribute('spacecraft'), dataRate: s.getAttribute('dataRate')
        }))
      }))
      setDishes(parsed)
    } catch (e) {
      setError('DSN feed unavailable — ' + e.message)
    }
  }

  async function explainDish(dish) {
    setLoading(dish.name)
    const context = `NASA Deep Space Network dish ${dish.name}, tracking: ${dish.targets.join(', ') || 'nothing'}, signals: ${dish.signals.map(s => `${s.type} to ${s.spacecraft}`).join(', ') || 'none'}`
    try {
      const reply = await askAI('What spacecraft is this dish talking to and what is that mission?', context)
      setAiReplies(r => ({ ...r, [dish.name]: reply }))
    } catch {
      setAiReplies(r => ({ ...r, [dish.name]: 'AI unavailable' }))
    }
    setLoading(null)
  }

  const active = dishes.filter(d => d.targets.length > 0)
  const idle = dishes.filter(d => d.targets.length === 0)

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>NASA DSN · Live Feed (updates every 5s)</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Deep Space Network</h1>
      <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Real-time dish tracking — which spacecraft NASA is talking to right now</p>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5', marginBottom: '1rem' }}>{error}</div>}
      {!dishes.length && !error && <p style={{ color: '#64748b' }}>Connecting to DSN feed...</p>}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1rem 1.4rem' }}>
          <div style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Dishes</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>{active.length}</div>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '12px', padding: '1rem 1.4rem' }}>
          <div style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Dishes</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e2e8f0' }}>{dishes.length}</div>
        </div>
      </div>

      <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#10b981' }}>🟢 Active — Tracking Spacecraft</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
        {active.map(dish => (
          <div key={dish.name} style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '14px', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>📡 {dish.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Az: {parseFloat(dish.azimuth).toFixed(1)}° · El: {parseFloat(dish.elevation).toFixed(1)}°</p>
              </div>
              <button onClick={() => explainDish(dish)} disabled={loading === dish.name} style={{
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '8px', padding: '0.35rem 0.8rem', color: '#6ee7b7',
                fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
              }}>
                {loading === dish.name ? 'Asking AI...' : '🤖 What mission?'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {dish.targets.map(t => (
                <span key={t} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
            {aiReplies[dish.name] && (
              <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '0.9rem', marginTop: '0.8rem' }}>
                <p style={{ fontSize: '0.62rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>AstroLens AI</p>
                <p style={{ color: '#e2e8f0', fontSize: '0.82rem', lineHeight: 1.6 }}>{aiReplies[dish.name]}</p>
              </div>
            )}
          </div>
        ))}
        {active.length === 0 && <p style={{ color: '#64748b', fontSize: '0.88rem' }}>No active tracking right now — check back soon.</p>}
      </div>

      {idle.length > 0 && <>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#64748b' }}>⚫ Idle Dishes</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {idle.map(dish => (
            <div key={dish.name} style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.82rem', color: '#64748b' }}>
              📡 {dish.name}
            </div>
          ))}
        </div>
      </>}
    </div>
  )
}
