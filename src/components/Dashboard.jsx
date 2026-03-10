import { useState, useRef } from 'react'
import OzetTab from './tabs/OzetTab'
import TranskriptTab from './tabs/TranskriptTab'
import KararlarTab from './tabs/KararlarTab'
import AksiyonTab from './tabs/AksiyonTab'
import DuyguTab from './tabs/DuyguTab'
import ArsivTab from './tabs/ArsivTab'
import PrintView from './PrintView'
import { downloadPdf, sharePdf } from '../utils/exportPdf'

const TABS = [
  { id: 'ozet', label: 'Genel Bakış', icon: '📊' },
  { id: 'kararlar', label: 'Kararlar', icon: '⚖️' },
  { id: 'aksiyon', label: 'Aksiyon', icon: '✅' },
  { id: 'duygu', label: 'Duygu Analizi', icon: '🧠' },
  { id: 'transkript', label: 'Transkript', icon: '💬' },
  { id: 'arsiv', label: 'Arşiv', icon: '🗂️' },
]

export default function Dashboard({ data, archive, isDark, onLoadFromArchive, onError }) {
  const [activeTab, setActiveTab] = useState('ozet')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const printRef = useRef(null)

  const filename = `${(data?.projeAdi || 'analiz').replace(/[^a-z0-9çğışöü]/gi, '_')}_voice_insight.pdf`

  async function handleDownloadPdf() {
    if (!printRef.current) return
    setPdfLoading(true)
    try {
      await downloadPdf(printRef.current, filename)
    } catch (e) {
      onError('PDF oluşturulamadı: ' + e.message)
    } finally {
      setPdfLoading(false)
    }
  }

  async function handleShare() {
    if (!printRef.current) return
    setShareLoading(true)
    try {
      await sharePdf(printRef.current, filename)
    } catch (e) {
      onError('Paylaşım başarısız: ' + e.message)
    } finally {
      setShareLoading(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Başlık + Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{data?.projeAdi || 'Ses Analizi'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">📅 {data?.tarih}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-md shadow-indigo-500/20"
          >
            {pdfLoading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> PDF...</>
              : <><span>📄</span> PDF İndir</>
            }
          </button>
          <button
            onClick={handleShare}
            disabled={shareLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-md shadow-emerald-500/20"
          >
            {shareLoading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Paylaş...</>
              : <><span>📤</span> Paylaş</>
            }
          </button>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* İçerik */}
      <div>
        {activeTab === 'ozet' && <OzetTab data={data} onError={onError} />}
        {activeTab === 'kararlar' && <KararlarTab data={data} isDark={isDark} />}
        {activeTab === 'aksiyon' && <AksiyonTab data={data} />}
        {activeTab === 'duygu' && <DuyguTab data={data} isDark={isDark} />}
        {activeTab === 'transkript' && <TranskriptTab data={data} />}
        {activeTab === 'arsiv' && (
          <ArsivTab
            archive={archive}
            onLoad={(id) => { onLoadFromArchive(id); setActiveTab('ozet') }}
          />
        )}
      </div>

      {/* Gizli PDF görünümü */}
      <PrintView ref={printRef} data={data} />
    </div>
  )
}
