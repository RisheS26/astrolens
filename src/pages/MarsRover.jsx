import { useEffect, useState } from 'react'
import { askAI } from '../api/ai'

const ROVERS = ['curiosity', 'perseverance', 'opportunity']

export default function MarsRover() {
  const [rover, setRover] = useState('curiosity')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [aiReply, setAiReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [sol, setSol] = useState(1000)

  useEffect(() => { fetchPhotos(rover, sol) }, [rover])

  async function fetchPhotos(r, s) {
    setLoading(true)
    setError(null)
    setPhotos([])
    try {
      const res = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${r}/photos?sol=${s}&api_key=${import.meta.env.VITE_NASA_API_KEY}&page=1`
      )
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error('rate_limit')
      }
      if (data.error || !data.photos) throw new Error('rate_limit')
      if (!data.photos.length) {
        setError(`No photos for Sol ${s} — try another sol`)
      } else {
        setPhotos(data.photos.slice(0, 24))
      }
    } catch (e) {
      if (e.message === 'rate_limit') {
        setError('NASA rate limit reached — trying backup source...')
        fetchFallback(r, s)
      } else {
        setError(e.message)
      }
    }
    setLoading(false)
  }

  async function fetchFallback(r, s) {
    try {
      const res = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${r}/photos?sol=${s}&api_key=DEMO_KEY&page=1`
      )
      const text = await res.text()
      try {
        const data = JSON.parse(text)
        if (data.photos?.length) {
          setPhotos(data.photos.slice(0, 24))
          setError(null)
        } else {
          setError(`No photos found for ${r} Sol ${s}. Try Sol 500, 1500, or 3000.`)
        }
      } catch {
        setError(`Rate limit on both keys. Check your email from api.nasa.gov for your real key, then add it to Vercel env vars.`)
      }
    } catch (e) {
      setError(e.message)
    }
  }

  async function explainPhoto(photo) {
    setSelected(photo)
    setAiReply('')
    setAiLoading(true)
    try {
      const reply = await askAI(
        'What is this Mars rover photo showing? What camera took it and why is it interesting?',
        `Mars rover ${photo.rover.name} photo on Sol ${photo.sol} by ${photo.camera.full_name}`
      )
      setAiReply(reply)
    } catch { setAiReply('AI unavailable') }
    setAiLoading(false)
  }

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>NASA · Live</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Mars Rover Photos</h1>

      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        {ROVERS.map(r => (
          <button key={r} onClick={() => { setRover(r); fetchPhotos(r, sol) }} style={{
            background: rover === r ? 'rgba(239,68,68,0.2)' : 'transparent',
            border: `1px solid ${rover === r ? 'rgba(239,68,68,0.5)' : '#1e2d4a'}`,
            borderRadius: '100px', padding: '0.4rem 1rem',
            color: rover === r ? '#f87171' : '#64748b',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', textTransform: 'capitalize'
          }}>{r}</button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Sol:</label>
          <input type="number" value={sol}
            onChange={e => setSol(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchPhotos(rover, sol)}
            style={{ width: '80px', background: '#111827', border: '1px solid #1e2d4a', borderRadius: '8px', padding: '0.4rem 0.6rem', color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
          />
          <button onClick={() => fetchPhotos(rover, sol)} style={{ background: '#ef4444', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', color: 'white', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Go</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[100, 500, 1000, 2000, 3000].map(s => (
          <button key={s} onClick={() => { setSol(s); fetchPhotos(rover, s) }} style={{
            background: sol == s ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${sol == s ? 'rgba(239,68,68,0.4)' : '#1e2d4a'}`,
            borderRadius: '6px', padding: '0.25rem 0.6rem',
            color: sol == s ? '#f87171' : '#64748b',
            cursor: 'pointer', fontSize: '0.72rem'
          }}>Sol {s}</button>
        ))}
      </div>

      {loading && <p style={{ color: '#64748b' }}>Loading Mars photos...</p>}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '1rem', color: '#fca5a5', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
        {photos.map(photo => (
          <div key={photo.id} onClick={() => explainPhoto(photo)} style={{
            background: '#111827', border: '1px solid #1e2d4a', borderRadius: '12px',
            overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d4a'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <img src={photo.img_src} alt="Mars" style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              onError={e => e.target.style.display = 'none'} />
            <div style={{ padding: '0.6rem 0.8rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.1rem' }}>{photo.camera.full_name}</p>
              <p style={{ fontSize: '0.65rem', color: '#64748b' }}>Sol {photo.sol} · {photo.earth_date}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => { setSelected(null); setAiReply('') }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '20px', maxWidth: '650px', width: '100%', overflow: 'hidden' }}>
            <img src={selected.img_src} alt="Mars" style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />
            <div style={{ padding: '1.4rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{selected.camera.full_name}</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>{selected.rover.name} · Sol {selected.sol} · {selected.earth_date}</p>
              {aiLoading && <p style={{ color: '#ef4444', fontSize: '0.85rem', fontStyle: 'italic' }}>🤖 Analyzing...</p>}
              {aiReply && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.62rem', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>AstroLens AI</p>
                  <p style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.7 }}>{aiReply}</p>
                </div>
              )}
              <button onClick={() => { setSelected(null); setAiReply('') }} style={{ background: 'transparent', border: '1px solid #1e2d4a', borderRadius: '8px', padding: '0.5rem 1rem', color: '#64748b', cursor: 'pointer', fontSize: '0.82rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
