export async function askAI(userQuestion, context = '') {
  const key = import.meta.env.VITE_HACKCLUB_AI_KEY
  const res = await fetch('/ai-api/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen/qwen3-32b',
      messages: [
        {
          role: 'system',
          content: 'You are AstroLens, an AI space guide. Explain NASA data clearly and simply to curious teens. Keep answers under 4 sentences.'
        },
        {
          role: 'user',
          content: context
            ? `Context: ${context}\n\nQuestion: ${userQuestion}`
            : userQuestion
        }
      ]
    })
  })
  if (!res.ok) throw new Error(`AI API error: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}
