import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠 Dashboard' },
  { to: '/apod', label: '🌌 APOD' },
  { to: '/weather', label: '☀️ Space Weather' },
  { to: '/asteroids', label: '☄️ Asteroids' },
  { to: '/dsn', label: '📡 DSN Live' },
]

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e2d4a',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0 2rem', height: '60px'
    }}>
      <span style={{ fontWeight: 800, fontSize: '1.1rem', marginRight: '1.5rem', color: '#60a5fa' }}>
        🔭 AstroLens
      </span>
      {links.map(l => (
        <NavLink key={l.to} to={l.to} end={l.to === '/'}
          style={({ isActive }) => ({
            color: isActive ? '#60a5fa' : '#94a3b8',
            textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
            padding: '0.35rem 0.75rem', borderRadius: '8px',
            background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            transition: 'all 0.2s'
          })}>
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
