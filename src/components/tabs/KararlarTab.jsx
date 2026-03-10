import { useEffect, useRef } from 'react'
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

export default function KararlarTab({ data, isDark }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.konuDagilimi || !chartRef.current) return
    if (instanceRef.current) instanceRef.current.destroy()

    const textColor = isDark ? '#cbd5e1' : '#475569'
    instanceRef.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: data.konuDagilimi.labels,
        datasets: [{
          data: data.konuDagilimi.data,
          backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#cbd5e1'],
          borderWidth: 2,
          borderColor: isDark ? '#1e293b' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: textColor } } },
        cutout: '55%'
      }
    })
    return () => instanceRef.current?.destroy()
  }, [data, isDark])

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">
          {data?.konuDagilimi?.baslik || 'Gündem Dağılımı'}
        </h3>
        <div className="chart-container">
          <canvas ref={chartRef} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(data?.kararlar || []).map((k, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300">
                {i + 1}
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                {k.tip}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-2">{k.baslik}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{k.icerik}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
