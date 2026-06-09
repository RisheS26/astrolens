import { useEffect, useState } from 'react'
import { fetchAPOD } from './api/nasa'
import { askAI } from './api/ai'

function App() {
  const [apod, setApod] = useState(null)
  const [error, setError] = useState(null)
  const [aiReply, setAiReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchAPOD()
      .then(setApod)
      .catch((e) => setError(e.message))
  }, [])

  async function handleExplain() {
    if (!apod) return
    setAiLoading(true)
    setAiReply('')
    try {
      const reply = await askAI(
        'Explain this in simple terms for a curious teen.',
        `NASA APOD: ${apod.title}. ${apod.explanation}`
      )
      setAiReply(reply)
    } catch (e) {
      setAiReply('AI unavailable — check your API key.')
    }
    setAiLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white p-8">
      <h1 className="text-4xl font-bold mb-2">🔭 AstroLens</h1>
      <p className="text-slate-400 mb-8 text-sm">
        Live NASA data + AI explainer
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300">
          Error: {error} — check your NASA API key in .env
        </div>
      )}

      {!apod && !error && (
        <p className="text-slate-500 animate-pulse">
          Loading NASA data...
        </p>
      )}

      {apod && (
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-1">{apod.title}</h2>
          <p className="text-slate-400 text-xs mb-4">{apod.date}</p>

          {apod.media_type === 'image' ? (
            <img
              src={apod.url}
              alt={apod.title}
              className="w-full rounded-2xl mb-6 border border-slate-700"
            />
          ) : (
            <iframe
              src={apod.url}
              title={apod.title}
              className="w-full aspect-video rounded-2xl mb-6"
              allowFullScreen
            />
          )}

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {apod.explanation}
          </p>

          <button
            onClick={handleExplain}
            disabled={aiLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all mb-4"
          >
            {aiLoading ? '🤖 Thinking...' : '🤖 Explain with AI'}
          </button>

          {aiReply && (
            <div className="bg-slate-800/60 border border-blue-500/30 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
              <p className="text-blue-400 text-xs font-bold mb-2 uppercase tracking-wider">
                AstroLens AI
              </p>
              {aiReply}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
