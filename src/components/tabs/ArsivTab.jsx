export default function ArsivTab({ archive, onLoad }) {
  if (!archive.length) {
    return (
      <div className="animate-fadeIn text-center py-12">
        <div className="text-5xl mb-4">🗂️</div>
        <p className="text-slate-500 dark:text-slate-400">Henüz geçmiş analiz bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 gap-4">
      {archive.map(a => (
        <div
          key={a.id}
          onClick={() => onLoad(a.id)}
          className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer"
        >
          <h4 className="font-bold text-slate-800 dark:text-white truncate">{a.projeAdi}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">📅 {a.tarih}</p>
        </div>
      ))}
    </div>
  )
}
