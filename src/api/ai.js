export async function askAI(userQuestion, context = '') {
  const key = import.meta.env.VITE_HACKCLUB_AI_KEY
  const res = await fetch(
    'https://ai.hackclub.com/proxy/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content:
              'You are AstroLens, an AI space guide. Explain NASA data clearly and simply to curious teens. Keep answers under 4 sentences.'
          },
          {
            role: 'user',
            content: context
              ? `Context: ${context}\n\nQuestion: ${userQuestion}`
              : userQuestion
          }
        ]
      })
    }
  )
  if (!res.ok) throw new Error('AI API failed')
  const data = await res.json()
  return data.choices[0].message.content
}
