import { useEffect, useRef } from 'react'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function DuyguTab({ data, isDark }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.profiller?.length || !chartRef.current) return
    if (instanceRef.current) instanceRef.current.destroy()

    const gridColor = isDark ? '#334155' : '#f1f5f9'
    const labelColor = isDark ? '#94a3b8' : '#475569'
    const metrics = data.profiller[0].metrics || [50, 50, 50, 50]

    instanceRef.current = new Chart(chartRef.current, {
      type: 'radar',
      data: {
        labels: ['Güven', 'Endişe', 'Sakinlik', 'Enerji / Heyecan'],
        datasets: [{
          label: 'Atmosfer Skoru',
          data: metrics,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { display: false },
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: { color: labelColor, font: { family: 'Inter', size: 11 } }
          }
        },
        plugins: { legend: { display: false } }
      }
    })
    return () => instanceRef.current?.destroy()
  }, [data, isDark])

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Atmosfer Analizi</h3>
        <div className="chart-container">
          <canvas ref={chartRef} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(data?.profiller || []).map((p, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              {p.isim.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">{p.isim}</h4>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">{p.duygu}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{p.not}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
