const isDev = import.meta.env.DEV

export async function askAI(userQuestion, context = '') {
  const endpoint = isDev ? '/ai-api/chat/completions' : '/api/ai'
  const key = import.meta.env.VITE_HACKCLUB_AI_KEY

  const headers = { 'Content-Type': 'application/json' }
  if (isDev) headers['Authorization'] = `Bearer ${key}`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'qwen/qwen3-32b',
      messages: [
        {
          role: 'system',
          content: 'You are AstroLens, an AI space guide. Explain NASA data clearly and simply to curious teens. Keep answers under 4 sentences.'
        },
        {
          role: 'user',
          content: context ? `Context: ${context}\n\nQuestion: ${userQuestion}` : userQuestion
        }
      ]
    })
  })

  if (!res.ok) throw new Error(`AI error: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}
