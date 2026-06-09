export async function fetchAPOD() {
  const key = import.meta.env.VITE_NASA_API_KEY
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${key}`
  )
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
  const end = new Date().toISOString().split('T')[0]
  const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0]
  const res = await fetch(
    `https://api.nasa.gov/DONKI/FLR?startDate=${start}&endDate=${end}&api_key=${key}`
  )
  if (!res.ok) throw new Error('DONKI API failed')
  return res.json()
}
