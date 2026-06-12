export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px' }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, #111827 25%, #1e2d4a 50%, #111827 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    }} />
  )
}

export function CardSkeleton() {
  return (
    <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: '14px', padding: '1.4rem' }}>
      <Skeleton height="14px" width="60%" />
      <div style={{ margin: '0.8rem 0' }} />
      <Skeleton height="24px" width="40%" />
      <div style={{ margin: '0.5rem 0' }} />
      <Skeleton height="12px" width="80%" />
    </div>
  )
}
