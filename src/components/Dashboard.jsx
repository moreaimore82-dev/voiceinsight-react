import { useState } from 'react'
import OzetTab from './tabs/OzetTab'
import TranskriptTab from './tabs/TranskriptTab'
import KararlarTab from './tabs/KararlarTab'
import AksiyonTab from './tabs/AksiyonTab'
import DuyguTab from './tabs/DuyguTab'
import ArsivTab from './tabs/ArsivTab'

const TABS = [
  { id: 'ozet', label: 'Genel Bakış', icon: '📊' },
  { id: 'transkript', label: 'Transkript', icon: '💬' },
  { id: 'kararlar', label: 'Kararlar', icon: '⚖️' },
  { id: 'aksiyon', label: 'Aksiyon', icon: '✅' },
  { id: 'duygu', label: 'Duygu Analizi', icon: '🧠' },
  { id: 'arsiv', label: 'Arşiv', icon: '🗂️' },
]

export default function Dashboard({ data, archive, isDark, onLoadFromArchive, onError }) {
  const [activeTab, setActiveTab] = useState('ozet')

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{data?.projeAdi || 'Ses Analizi'}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">📅 {data?.tarih}</p>
      </div>

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

      <div>
        {activeTab === 'ozet' && <OzetTab data={data} onError={onError} />}
        {activeTab === 'transkript' && <TranskriptTab data={data} />}
        {activeTab === 'kararlar' && <KararlarTab data={data} isDark={isDark} />}
        {activeTab === 'aksiyon' && <AksiyonTab data={data} />}
        {activeTab === 'duygu' && <DuyguTab data={data} isDark={isDark} />}
        {activeTab === 'arsiv' && (
          <ArsivTab
            archive={archive}
            onLoad={(id) => { onLoadFromArchive(id); setActiveTab('ozet') }}
          />
        )}
      </div>
    </div>
  )
}
