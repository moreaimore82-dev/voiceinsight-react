export default function AksiyonTab({ data }) {
  const aksiyonlar = data?.aksiyonlar || []

  if (!aksiyonlar.length) {
    return <p className="text-slate-500 dark:text-slate-400 text-sm">Aksiyon maddesi bulunamadı.</p>
  }

  return (
    <div className="animate-fadeIn bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {aksiyonlar.map((a, i) => (
        <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0">
          <div className="mt-1 flex-shrink-0">
            {a.durum === 'high-priority' ? (
              <div className="w-5 h-5 rounded-sm bg-red-100 dark:bg-red-900/30 border border-red-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-sm" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
              <h4 className="font-bold text-slate-800 dark:text-white">{a.ekip}</h4>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded mt-1 sm:mt-0">
                ⏳ {a.sure}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{a.gorev}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
