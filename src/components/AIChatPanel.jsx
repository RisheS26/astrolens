import { useState, useRef, useEffect } from 'react'
import { askAI } from '../api/ai'

export default function AIChatPanel() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am AstroLens AI. Ask me anything about space, NASA missions, or what you see on this app!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setLoading(true)
    try {
      const reply = await askAI(q, 'The user is browsing AstroLens, a NASA data explorer app.')
      setMessages(m => [...m, { role: 'ai', text: reply }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Something went wrong. Check your AI API key.' }])
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 300,
        width: '56px', height: '56px', borderRadius: '50%',
        background: open ? '#1e293b' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        border: open ? '1px solid #1e2d4a' : 'none',
        color: 'white', fontSize: '1.4rem', cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s'
      }}>
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 299,
          width: '360px', height: '500px',
          background: '#0f1629', border: '1px solid #1e2d4a',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #1e2d4a', background: '#111827', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>AstroLens AI</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Ask me anything about space</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.6rem 0.9rem', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#1e293b',
                  border: m.role === 'ai' ? '1px solid #1e2d4a' : 'none',
                  fontSize: '0.82rem', lineHeight: 1.6, color: '#e2e8f0'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#1e293b', border: '1px solid #1e2d4a', borderRadius: '14px 14px 14px 4px', padding: '0.6rem 1rem', fontSize: '0.82rem', color: '#64748b' }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '0.8rem', borderTop: '1px solid #1e2d4a', display: 'flex', gap: '0.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about space..."
              style={{
                flex: 1, background: '#1e293b', border: '1px solid #1e2d4a',
                borderRadius: '10px', padding: '0.6rem 0.9rem',
                color: '#e2e8f0', fontSize: '0.82rem', outline: 'none'
              }}
            />
            <button onClick={send} disabled={loading} style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none', borderRadius: '10px', padding: '0.6rem 1rem',
              color: 'white', fontWeight: 700, cursor: 'pointer',
              fontSize: '0.82rem', opacity: loading ? 0.5 : 1
            }}>↑</button>
          </div>
        </div>
      )}
    </>
  )
}
