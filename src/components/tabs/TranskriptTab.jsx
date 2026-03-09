export default function TranskriptTab({ data }) {
  const transkript = data?.transkript || []

  if (!transkript.length) {
    return <p className="text-slate-500 dark:text-slate-400 text-sm">Transkript metni oluşturulamadı.</p>
  }

  return (
    <div className="animate-fadeIn space-y-4">
      {transkript.map((t, idx) => {
        const isRight = idx % 2 === 0
        return (
          <div key={idx} className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} mb-4`}>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 mx-1">{t.kisi}</span>
            <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm ${
              isRight
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-tl-sm'
            }`}>
              {t.metin}
            </div>
          </div>
        )
      })}
    </div>
  )
}
