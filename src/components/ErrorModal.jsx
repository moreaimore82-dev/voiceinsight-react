export default function ErrorModal({ message, onClose }) {
  if (!message) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Bilgi</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{message}</p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
          Tamam
        </button>
      </div>
    </div>
  )
}
