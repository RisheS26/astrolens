export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const key = process.env.VITE_HACKCLUB_AI_KEY
  if (!key) return res.status(500).json({ error: 'Missing VITE_HACKCLUB_AI_KEY in Vercel env vars' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const response = await fetch('https://ai.hackclub.com/proxy/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const text = await response.text()

    try {
      const data = JSON.parse(text)
      return res.status(response.status).json(data)
    } catch {
      return res.status(500).json({ error: 'Upstream returned non-JSON', raw: text.slice(0, 200) })
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
