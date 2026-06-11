import { useEffect, useState } from 'react'
import { fetchSpaceWeather } from '../api/nasa'
import { askAI } from '../api/ai'

const classColors = { X: '#ef4444', M: '#f97316', C: '#f59e0b', B: '#10b981' }

export default function SpaceWeather() {
  const [flares, setFlares] = useState(null)
  const [error, setError] = useState(null)
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchSpaceWeather().then(setFlares).catch(e => setError(e.message))
  }, [])

  async function getAISummary() {
    setAiLoading(true)
    const context = flares?.length
      ? `Solar flares in past 7 days: ${flares.map(f => `${f.classType} flare on ${f.beginTime}`).join(', ')}`
      : 'No solar flares detected in past 7 days'
    try {
      const reply = await askAI('Summarize this space weather activity and what it means for Earth and satellites.', context)
      setAiSummary(reply)
    } catch {
      setAiSummary('AI unavailable')
    }
    setAiLoading(false)
  }

  const alertLevel = !flares ? 'Loading' : flares.length === 0 ? 'Quiet' : flares.some(f => f.classType?.startsWith('X')) ? 'Severe' : flares.some(f => f.classType?.startsWith('M')) ? 'Moderate' : 'Minor'
  const alertColor = { Quiet: '#10b981', Minor: '#f59e0b', Moderate: '#f97316', Severe: '#ef4444', Loading: '#64748b' }[alertLevel]

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>NASA DONKI · 7-day window</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Space Weather</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#111827', border: `1px solid ${alertColor}44`, borderRadius: '14px', padding: '1.4rem', flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Alert Level</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: alertColor }}>{alertLevel}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>Based on last 7 days</div>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '14px', padding: '1.4rem', flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Solar Flares</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e2e8f0' }}>{flares?.length ?? '...'}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>Past 7 days</div>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '14px', padding: '1.4rem', flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <button onClick={getAISummary} disabled={aiLoading || !flares} style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none',
            borderRadius: '10px', padding: '0.8rem 1.2rem', color: 'white',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', opacity: aiLoading ? 0.6 : 1
          }}>
            {aiLoading ? '🤖 Analyzing...' : '🤖 AI Weather Briefing'}
          </button>
        </div>
      </div>

      {aiSummary && (
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '14px', padding: '1.4rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>🤖 AstroLens AI Briefing</p>
          <p style={{ color: '#e2e8f0', lineHeight: 1.7, fontSize: '0.9rem' }}>{aiSummary}</p>
        </div>
      )}

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5', marginBottom: '1rem' }}>{error}</div>}

      {flares?.length === 0 && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#6ee7b7' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
        <div style={{ fontWeight: 700 }}>All quiet — no solar flares in the past 7 days</div>
      </div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {flares?.map((flare, i) => {
          const cls = flare.classType?.[0] ?? 'B'
          const color = classColors[cls] ?? '#64748b'
          return (
            <div key={i} style={{ background: '#111827', border: `1px solid #1e2d4a`, borderRadius: '12px', padding: '1.2rem', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: '10px', padding: '0.6rem 0.9rem', minWidth: '60px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color, fontSize: '1.1rem' }}>{flare.classType}</div>
                <div style={{ fontSize: '0.6rem', color: '#64748b' }}>class</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                  {new Date(flare.beginTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Source: {flare.sourceLocation ?? 'Unknown'} · Peak: {flare.peakTime ? new Date(flare.peakTime).toLocaleTimeString() : 'N/A'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
