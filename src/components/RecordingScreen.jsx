import { useState, useRef } from 'react'
import { blobToBase64 } from '../utils/audioUtils'

export default function RecordingScreen({ onBack, onProcess }) {
  const [status, setStatus] = useState('idle') // idle | recording
  const [timer, setTimer] = useState('Hazır')
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const secondsRef = useRef(0)

  function tick() {
    secondsRef.current++
    const m = String(Math.floor(secondsRef.current / 60)).padStart(2, '0')
    const s = String(secondsRef.current % 60).padStart(2, '0')
    setTimer(`${m}:${s}`)
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      secondsRef.current = 0
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        clearInterval(timerRef.current)
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const b64 = await blobToBase64(blob)
        stream.getTracks().forEach(t => t.stop())
        onProcess(b64, 'audio/webm')
      }
      mr.start()
      mediaRecorderRef.current = mr
      setStatus('recording')
      setTimer('00:00')
      timerRef.current = setInterval(tick, 1000)
    } catch {
      alert('Mikrofona erişilemedi. Tarayıcı izinlerini kontrol edin.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setStatus('idle')
  }

  const isRecording = status === 'recording'

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <button onClick={onBack} className="self-start mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm transition-colors">
        ← Geri
      </button>

      <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl mb-6 transition-all duration-300 ${
        isRecording
          ? 'bg-red-100 dark:bg-red-900/50 animate-pulseRed'
          : 'bg-slate-200 dark:bg-slate-800'
      }`}>
        🎙️
      </div>

      <div className={`text-4xl font-mono font-bold mb-3 ${isRecording ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
        {timer}
      </div>

      <p className={`text-sm mb-8 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`}>
        {isRecording ? 'Kayıt alınıyor...' : 'Kayda başlamak için butona tıklayın.'}
      </p>

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all"
        >
          <span>▶</span> Kaydı Başlat
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-500/30 transition-all"
        >
          <span>■</span> Kaydı Durdur
        </button>
      )}
    </div>
  )
}
