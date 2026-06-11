export async function fetchJWST(query = 'james webb space telescope', page = 1) {
  const res = await fetch(
    `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page=${page}&page_size=20`
  )
  if (!res.ok) throw new Error('JWST API failed')
  const data = await res.json()
  return data.collection.items.map(item => ({
    id: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description,
    date: item.data[0].date_created?.split('T')[0],
    thumb: item.links?.[0]?.href
  })).filter(i => i.thumb)
}
