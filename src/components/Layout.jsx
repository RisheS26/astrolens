import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050810', color: '#e2e8f0' }}>
      <Navbar />
      <main style={{ paddingTop: '80px', maxWidth: '1000px', margin: '0 auto', padding: '80px 2rem 4rem' }}>
        {children}
      </main>
    </div>
  )
}
