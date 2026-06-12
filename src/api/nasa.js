export async function fetchAPOD() {
  const key = import.meta.env.VITE_NASA_API_KEY
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}`)
  if (!res.ok) throw new Error('NASA API failed')
  return res.json()
}

export async function fetchAsteroids() {
  const key = import.meta.env.VITE_NASA_API_KEY
  const today = new Date().toISOString().split('T')[0]
  const res = await fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${key}`
  )
  if (!res.ok) throw new Error('NeoWs API failed')
  return res.json()
}

export async function fetchSpaceWeather() {
  const key = import.meta.env.VITE_NASA_API_KEY
  const end = new Date()
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const fmt = (d) => d.toISOString().split('T')[0]

  try {
    const res = await fetch(
      `https://api.nasa.gov/DONKI/FLR?startDate=${fmt(start)}&endDate=${fmt(end)}&api_key=${key}`
    )
    if (!res.ok) return []
    const text = await res.text()
    if (!text || text === 'null') return []
    const data = JSON.parse(text)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
