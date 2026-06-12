import { useEffect, useState } from 'react'
import { askAI } from '../api/ai'

export default function EarthPage() {
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)
  const [aiReply, setAiReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const key = import.meta.env.VITE_NASA_API_KEY
    fetch(`https://api.nasa.gov/EPIC/api/natural/images?api_key=${key}`)
      .then(r => r.json())
      .then(data => setImages(data.slice(0, 12)))
      .catch(e => setError(e.message))
  }, [])

  async function handleAI() {
    setAiLoading(true)
    try {
      const reply = await askAI(
        'What is the DSCOVR EPIC camera and why are full-disc Earth images scientifically important?',
        'NASA EPIC camera on DSCOVR satellite takes daily full-disc photos of Earth from L1 Lagrange point, 1.5M km away'
      )
      setAiReply(reply)
    } catch { setAiReply('AI unavailable') }
    setAiLoading(false)
  }

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>NASA EPIC · DSCOVR Satellite</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Earth from Space</h1>
      <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Full-disc Earth photos from 1.5 million km away</p>

      <button onClick={handleAI} disabled={aiLoading} style={{
        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none',
        borderRadius: '10px', padding: '0.7rem 1.4rem', color: 'white',
        fontWeight: 700, cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.88rem'
      }}>
        {aiLoading ? '🤖 Thinking...' : '🤖 Why does this matter?'}
      </button>

      {aiReply && (
        <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.62rem', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>AstroLens AI</p>
          <p style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.7 }}>{aiReply}</p>
        </div>
      )}

      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.map(img => {
          const date = img.date.split(' ')[0].replaceAll('-', '/')
          const url = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${img.image}.png`
          return (
            <div key={img.identifier} style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={url} alt="Earth" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                onError={e => e.target.style.display = 'none'} />
              <div style={{ padding: '0.6rem 0.8rem' }}>
                <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{img.date}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
