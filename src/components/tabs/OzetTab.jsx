import { useState } from 'react'
import { generatePodcastAudio } from '../../utils/geminiApi'
import { pcm16ToMp3, createSilentMp3Blob } from '../../utils/audioUtils'

export default function OzetTab({ data, onError }) {
  const [podcastState, setPodcastState] = useState('idle') // idle | loading | ready
  const [audioUrl, setAudioUrl] = useState(null)
  const [downloadName, setDownloadName] = useState('')

  async function handleGeneratePodcast() {
    if (!data?.podcastMetni) return
    setPodcastState('loading')
    try {
      const audioBase64 = await generatePodcastAudio(data.podcastMetni)
      const mp3Blob = pcm16ToMp3(audioBase64, 24000)
      const url = URL.createObjectURL(mp3Blob)
      setAudioUrl(url)
      setDownloadName(`${data.projeAdi.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_podcast.mp3`)
      setPodcastState('ready')
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('403') || err.message.includes('400')) {
        onError('API kısıtlaması: Podcast oluşturulamadı. Demo ses yükleniyor...')
        setTimeout(() => {
          const blob = createSilentMp3Blob()
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          setDownloadName('Demo_Podcast.mp3')
          setPodcastState('ready')
        }, 2000)
      } else {
        setPodcastState('idle')
        onError('Podcast oluşturulamadı: ' + err.message)
      }
    }
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-indigo-500">📋</span> Özet
        </h3>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          {(data?.ozetMaddeleri || []).map((m, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5 flex-shrink-0">✓</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-indigo-500">🎙️</span> AI Podcast Özeti
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 italic leading-relaxed">
          "{data?.podcastMetni}"
        </p>

        {podcastState === 'idle' && (
          <button
            onClick={handleGeneratePodcast}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-md shadow-indigo-500/20"
          >
            <span>▶</span> Podcast Oluştur
          </button>
        )}

        {podcastState === 'loading' && (
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Ses sentezleniyor...
          </div>
        )}

        {podcastState === 'ready' && audioUrl && (
          <div className="space-y-3">
            <audio controls src={audioUrl} className="w-full" />
            <a
              href={audioUrl}
              download={downloadName}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
              ⬇ MP3 İndir
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
