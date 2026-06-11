import { useEffect, useState } from 'react'
import { fetchJWST } from '../api/jwst'
import { askAI } from '../api/ai'

export default function JWSTPage() {
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [aiReply, setAiReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [search, setSearch] = useState('james webb space telescope')
  const [query, setQuery] = useState('james webb space telescope')

  useEffect(() => {
    setImages([])
    setError(null)
    fetchJWST(query).then(setImages).catch(e => setError(e.message))
  }, [query])

  async function explainImage(img) {
    setSelected(img)
    setAiReply('')
    setAiLoading(true)
    try {
      const reply = await askAI(
        'What is this space image showing? Explain simply for a curious teen.',
        `NASA image: ${img.title}. ${img.description?.slice(0, 300) ?? ''}`
      )
      setAiReply(reply)
    } catch (e) {
      setAiReply('AI unavailable — ' + e.message)
    }
    setAiLoading(false)
  }

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>NASA Image Library · JWST</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Space Image Gallery</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setQuery(search)}
          placeholder="Search NASA images..."
          style={{
            flex: 1, background: '#111827', border: '1px solid #1e2d4a',
            borderRadius: '10px', padding: '0.7rem 1rem', color: '#e2e8f0',
            fontSize: '0.88rem', outline: 'none'
          }}
        />
        <button onClick={() => setQuery(search)} style={{
          background: '#8b5cf6', border: 'none', borderRadius: '10px',
          padding: '0.7rem 1.4rem', color: 'white', fontWeight: 700,
          cursor: 'pointer', fontSize: '0.88rem'
        }}>Search</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['james webb nebula', 'black hole', 'galaxy', 'supernova', 'exoplanet', 'mars'].map(tag => (
          <button key={tag} onClick={() => { setSearch(tag); setQuery(tag) }} style={{
            background: query === tag ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.05)',
            border: `1px solid ${query === tag ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.2)'}`,
            borderRadius: '100px', padding: '0.3rem 0.8rem', color: '#a78bfa',
            fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600
          }}>{tag}</button>
        ))}
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5', marginBottom: '1rem' }}>{error}</div>}
      {!images.length && !error && <p style={{ color: '#64748b' }}>Loading images...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {images.map(img => (
          <div key={img.id} onClick={() => explainImage(img)} style={{
            background: '#111827', border: '1px solid #1e2d4a', borderRadius: '12px',
            overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d4a'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <img src={img.thumb} alt={img.title} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
              onError={e => e.target.style.display = 'none'} />
            <div style={{ padding: '0.8rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.2rem', lineHeight: 1.3 }}>{img.title?.slice(0, 60)}{img.title?.length > 60 ? '...' : ''}</p>
              <p style={{ fontSize: '0.65rem', color: '#64748b' }}>{img.date} · Click for AI explain</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem'
        }} onClick={() => { setSelected(null); setAiReply('') }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#111827', border: '1px solid #1e2d4a', borderRadius: '20px',
            maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto'
          }}>
            <img src={selected.thumb} alt={selected.title} style={{ width: '100%', borderRadius: '20px 20px 0 0', maxHeight: '350px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>{selected.title}</h2>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '1rem' }}>{selected.date}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>{selected.description?.slice(0, 400)}{selected.description?.length > 400 ? '...' : ''}</p>

              {aiLoading && <p style={{ color: '#8b5cf6', fontSize: '0.85rem', fontStyle: 'italic' }}>🤖 AstroLens is thinking...</p>}
              {aiReply && (
                <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '12px', padding: '1rem' }}>
                  <p style={{ fontSize: '0.62rem', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🤖 AstroLens AI</p>
                  <p style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.7 }}>{aiReply}</p>
                </div>
              )}
              <button onClick={() => { setSelected(null); setAiReply('') }} style={{
                marginTop: '1rem', background: 'transparent', border: '1px solid #1e2d4a',
                borderRadius: '8px', padding: '0.5rem 1rem', color: '#64748b',
                cursor: 'pointer', fontSize: '0.82rem'
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
