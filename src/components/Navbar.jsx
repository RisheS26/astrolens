import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠 Dashboard' },
  { to: '/apod', label: '🌌 APOD' },
  { to: '/jwst', label: '🔭 JWST' },
  { to: '/weather', label: '☀️ Weather' },
  { to: '/asteroids', label: '☄️ Asteroids' },
  { to: '/dsn', label: '📡 DSN' },
  { to: '/earth', label: '🌍 Earth' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,8,16,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e2d4a',
        display: 'flex', alignItems: 'center',
        padding: '0 1.5rem', height: '60px',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#60a5fa' }}>
          🔭 AstroLens
        </span>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}
          className="desktop-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              style={({ isActive }) => ({
                color: isActive ? '#60a5fa' : '#94a3b8',
                textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600,
                padding: '0.3rem 0.65rem', borderRadius: '8px', whiteSpace: 'nowrap',
                background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
              })}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} style={{
          display: 'none', background: 'transparent', border: '1px solid #1e2d4a',
          borderRadius: '8px', padding: '0.4rem 0.6rem', color: '#94a3b8',
          cursor: 'pointer', fontSize: '1rem'
        }} className="mobile-menu-btn">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99,
          background: 'rgba(5,8,16,0.98)', borderBottom: '1px solid #1e2d4a',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
        }} className="mobile-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? '#60a5fa' : '#94a3b8',
                textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                padding: '0.6rem 1rem', borderRadius: '10px',
                background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(59,130,246,0.3)' : '#1e2d4a'}`,
              })}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  )
}
