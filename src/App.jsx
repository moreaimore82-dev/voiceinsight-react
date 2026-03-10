import { useState, useRef, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import RecordingScreen from './components/RecordingScreen'
import LoadingScreen from './components/LoadingScreen'
import Dashboard from './components/Dashboard'
import ErrorModal from './components/ErrorModal'
import InstallBanner from './components/InstallBanner'
import { analyzeAudio } from './utils/geminiApi'
import { getMimeType } from './utils/audioUtils'
import { getFallbackData } from './utils/fallbackData'

const ARCHIVE_KEY = 'sesAnalizArsiv'

function loadArchive() {
  try { return JSON.parse(localStorage.getItem(ARCHIVE_KEY)) || [] } catch { return [] }
}

function saveArchive(arr) {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(arr))
}

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [data, setData] = useState(null)
  const [archive, setArchive] = useState(loadArchive)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isDark, setIsDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  function showError(msg) { setErrorMsg(msg) }
  function closeError() { setErrorMsg(null) }

  function addToArchive(item) {
    const updated = [item, ...archive]
    setArchive(updated)
    saveArchive(updated)
    return updated
  }

  async function processAudio(base64Data, mimeType) {
    setScreen('loading')
    try {
      const result = await analyzeAudio(base64Data, mimeType)
      result.id = Date.now()
      result.tarih = new Date().toLocaleString('tr-TR')
      addToArchive(result)
      setData(result)
      setScreen('dashboard')
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('403') || err.message.includes('400')) {
        showError('API kısıtlaması algılandı. Demo veriler yükleniyor...')
        setTimeout(() => {
          closeError()
          const demo = getFallbackData()
          addToArchive(demo)
          setData(demo)
          setScreen('dashboard')
        }, 3000)
      } else {
        setScreen('welcome')
        showError('Ses dosyası işlenirken hata: ' + err.message)
      }
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    const mimeType = getMimeType(file)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1]
      processAudio(base64, mimeType)
    }
    reader.onerror = () => showError('Dosya okunamadı.')
    reader.readAsDataURL(file)
  }

  function loadFromArchive(id) {
    const found = archive.find(a => a.id === id)
    if (found) { setData(found); setScreen('dashboard') }
  }

  function goHome() { setScreen('welcome'); setMobileMenuOpen(false) }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-300">
      {/* PWA Install Banner */}
      <InstallBanner />

      {/* Top Navbar - Mobile */}
      <header className="md:hidden bg-slate-900 dark:bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 onClick={goHome} className="text-xl font-bold cursor-pointer">
            Voice Insight<span className="text-indigo-400"> AI</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(d => !d)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 px-4 py-2 flex flex-col gap-1 bg-slate-900">
            {screen === 'dashboard' && (
              <button onClick={() => { fileInputRef.current?.click(); setMobileMenuOpen(false) }} className="text-left text-slate-300 hover:bg-slate-800 px-3 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                📁 Yeni Dosya Yükle
              </button>
            )}
            {screen === 'dashboard' && (
              <button onClick={() => { setScreen('recording'); setMobileMenuOpen(false) }} className="text-left text-slate-300 hover:bg-slate-800 px-3 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                🎙️ Yeni Kayıt
              </button>
            )}
            {archive.length > 0 && (
              <button onClick={() => { setData(archive[0]); setScreen('dashboard'); setMobileMenuOpen(false) }} className="text-left text-slate-300 hover:bg-slate-800 px-3 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                🗂️ Arşiv
              </button>
            )}
          </div>
        )}
      </header>

      <div className="flex flex-1 md:flex-row flex-col">
        {/* Sidebar - Desktop only */}
        <nav className="hidden md:flex w-64 bg-slate-900 dark:bg-slate-950 text-slate-100 flex-col shadow-xl z-10 sticky top-0 h-screen border-r border-slate-800">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h1 onClick={goHome} className="text-2xl font-bold tracking-tight text-white cursor-pointer hover:opacity-80 transition-opacity">
              Voice Insight<span className="text-indigo-400"> AI</span>
            </h1>
            <button
              onClick={() => setIsDark(d => !d)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="p-3 flex flex-col gap-2">
            <button onClick={goHome} className="w-full text-left text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
              🏠 Ana Sayfa
            </button>
            {screen === 'dashboard' && (
              <button onClick={() => fileInputRef.current?.click()} className="w-full text-left text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                📁 Yeni Dosya
              </button>
            )}
            {screen === 'dashboard' && (
              <button onClick={() => setScreen('recording')} className="w-full text-left text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                🎙️ Yeni Kayıt
              </button>
            )}
            {archive.length > 0 && (
              <button onClick={() => { setData(archive[0]); setScreen('dashboard') }} className="w-full text-left text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                🗂️ Arşiv
              </button>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-4xl mx-auto">
          <input ref={fileInputRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.webm,.mp4" className="hidden" onChange={handleFileUpload} />

          {screen === 'welcome' && (
            <WelcomeScreen
              onRecord={() => setScreen('recording')}
              onUpload={() => fileInputRef.current?.click()}
              onArchive={() => { setData(archive[0]); setScreen('dashboard') }}
              hasArchive={archive.length > 0}
            />
          )}
          {screen === 'recording' && (
            <RecordingScreen onBack={() => setScreen('welcome')} onProcess={processAudio} />
          )}
          {screen === 'loading' && <LoadingScreen />}
          {screen === 'dashboard' && data && (
            <Dashboard
              data={data}
              archive={archive}
              isDark={isDark}
              onLoadFromArchive={loadFromArchive}
              onError={showError}
            />
          )}
        </main>
      </div>

      <ErrorModal message={errorMsg} onClose={closeError} />
    </div>
  )
}
