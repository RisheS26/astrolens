import { useEffect, useState } from 'react'
import { fetchAPOD } from '../api/nasa'
import { askAI } from '../api/ai'

export default function APODPage() {
  const [apod, setApod] = useState(null)
  const [error, setError] = useState(null)
  const [aiReply, setAiReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [question, setQuestion] = useState('')

  useEffect(() => {
    fetchAPOD().then(setApod).catch(e => setError(e.message))
  }, [])

  async function handleAsk(q) {
    const query = q || question || 'Explain this in simple terms for a curious teen.'
    if (!apod) return
    setAiLoading(true)
    setAiReply('')
    try {
      const reply = await askAI(query, `NASA APOD: ${apod.title}. ${apod.explanation}`)
      setAiReply(reply)
    } catch (e) {
      setAiReply('AI unavailable — ' + e.message)
    }
    setAiLoading(false)
  }

  const quickQuestions = [
    'How far away is this?',
    'What makes this special?',
    'Explain like I am 10',
    'What would happen if I went there?'
  ]

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>NASA · Daily</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Astronomy Picture of the Day</h1>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5', marginBottom: '1rem' }}>
        {error} — check NASA API key in .env
      </div>}

      {!apod && !error && <p style={{ color: '#64748b' }}>Loading...</p>}

      {apod && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
          <div>
            {apod.media_type === 'image'
              ? <img src={apod.url} alt={apod.title} style={{ width: '100%', borderRadius: '16px', border: '1px solid #1e2d4a', marginBottom: '1.5rem' }} />
              : <iframe src={apod.url} title={apod.title} style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', border: '1px solid #1e2d4a', marginBottom: '1.5rem' }} allowFullScreen />
            }
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.3rem' }}>{apod.title}</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>{apod.date}</p>
            <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.9rem' }}>{apod.explanation}</p>
          </div>

          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '16px', padding: '1.4rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🤖</span> AstroLens AI
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {quickQuestions.map(q => (
                  <button key={q} onClick={() => handleAsk(q)} style={{
                    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '8px', padding: '0.5rem 0.8rem', color: '#93c5fd',
                    fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                  }}>
                    {q}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAsk()}
                  placeholder="Ask anything about this..."
                  style={{
                    flex: 1, background: '#0f1629', border: '1px solid #1e2d4a',
                    borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#e2e8f0',
                    fontSize: '0.82rem', outline: 'none'
                  }}
                />
                <button onClick={() => handleAsk()} disabled={aiLoading} style={{
                  background: '#3b82f6', border: 'none', borderRadius: '8px',
                  padding: '0.6rem 1rem', color: 'white', fontWeight: 600,
                  cursor: 'pointer', fontSize: '0.82rem', opacity: aiLoading ? 0.5 : 1
                }}>
                  {aiLoading ? '...' : 'Ask'}
                </button>
              </div>

              {aiLoading && <p style={{ color: '#64748b', fontSize: '0.82rem', fontStyle: 'italic' }}>Thinking...</p>}

              {aiReply && (
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '1rem' }}>
                  <p style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>AI Response</p>
                  <p style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.7 }}>{aiReply}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
