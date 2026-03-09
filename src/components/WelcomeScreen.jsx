export default function WelcomeScreen({ onRecord, onUpload, onArchive, hasArchive }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fadeIn">
      <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-4xl mb-6 shadow-lg shadow-indigo-500/30">🎙️</div>
      <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">Voice Insight <span className="text-indigo-500">AI</span></h2>
      <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mb-10">
        Toplantılarınızı, notlarınızı ve sunumlarınızı yapay zeka ile analiz edin.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onUpload}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-200 font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <span className="text-2xl">📁</span>
          <span>Dosya Yükle</span>
        </button>
        <button
          onClick={onRecord}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
        >
          <span className="text-2xl">🎙️</span>
          <span>Kayıt Yap</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-6">MP3, WAV, M4A, AAC, FLAC, OGG desteklenir</p>

      {hasArchive && (
        <button
          onClick={onArchive}
          className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors"
        >
          <span>🗂️</span> Geçmiş Analizleri Görüntüle
        </button>
      )}
    </div>
  )
}
