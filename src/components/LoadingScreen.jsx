import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(20)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => p < 95 ? p + 2 : p)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="loader mb-8" />
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analiz Ediliyor</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Yapay zeka sesinizi işliyor, lütfen bekleyin...</p>
      <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-2">{progress}%</p>
    </div>
  )
}
