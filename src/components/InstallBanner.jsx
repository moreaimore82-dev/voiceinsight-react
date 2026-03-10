import { useState, useEffect } from 'react'

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Zaten kuruluysa gösterme
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    function handler(e) {
      e.preventDefault()
      setPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }

  if (installed || !prompt) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-lg">📲</span>
        <span>Uygulamayı telefonuna yükle</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Yükle
        </button>
        <button
          onClick={() => setPrompt(null)}
          className="text-indigo-200 hover:text-white text-lg leading-none px-1"
        >
          ×
        </button>
      </div>
    </div>
  )
}
