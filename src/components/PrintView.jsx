import { forwardRef } from 'react'

// Gizli baskı görünümü - PDF için ekran görüntüsü alınır (mobil genişlik)
const PrintView = forwardRef(function PrintView({ data }, ref) {
  return (
    <div
      ref={ref}
      style={{ position: 'fixed', left: '-9999px', top: 0, width: '390px', backgroundColor: '#0f172a', color: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif', padding: '24px 20px' }}
    >
      {/* Başlık */}
      <div style={{ borderBottom: '2px solid #4f46e5', paddingBottom: '16px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🎙️</div>
          <div>
            <div style={{ fontSize: '9px', color: '#6366f1', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Voice Insight AI</div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0, lineHeight: '1.3' }}>{data?.projeAdi}</h1>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>📅 {data?.tarih}</div>
      </div>

      {/* Özet */}
      <Section title="📋 Genel Özet">
        {(data?.ozetMaddeleri || []).map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            <span style={{ color: '#6366f1', flexShrink: 0 }}>✓</span>
            <span>{m}</span>
          </div>
        ))}
      </Section>

      {/* Kararlar */}
      <Section title="⚖️ Kararlar">
        {(data?.kararlar || []).map((k, i) => (
          <div key={i} style={{ background: '#1e293b', borderRadius: '10px', padding: '12px', border: '1px solid #334155', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{i + 1}</div>
              <span style={{ fontSize: '9px', color: '#94a3b8', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155', textTransform: 'uppercase', fontWeight: '700' }}>{k.tip}</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#f1f5f9', marginBottom: '3px' }}>{k.baslik}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>{k.icerik}</div>
          </div>
        ))}
      </Section>

      {/* Aksiyon */}
      <Section title="✅ Aksiyon Planı">
        {(data?.aksiyonlar || []).map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {a.durum === 'high-priority'
                ? <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '2px' }} /></div>
                : <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #334155' }} />
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#f1f5f9' }}>{a.ekip}</span>
                <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 6px', borderRadius: '4px' }}>⏳ {a.sure}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.gorev}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Duygu */}
      <Section title="🧠 Duygu Analizi">
        {(data?.profiller || []).map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', background: '#1e293b', borderRadius: '10px', marginBottom: '8px', border: '1px solid #334155' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#818cf8', flexShrink: 0 }}>{p.isim.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{p.isim}</div>
              <div style={{ fontSize: '11px', color: '#6366f1', marginBottom: '3px' }}>{p.duygu}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '6px' }}>{p.not}</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Güven', 'Endişe', 'Sakinlik', 'Enerji'].map((label, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '1px' }}>{label}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>{p.metrics?.[idx] ?? 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* Footer */}
      <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '10px', color: '#475569' }}>
        Voice Insight AI • {data?.tarih}
      </div>
    </div>
  )
})

export default PrintView

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
        <div style={{ width: '3px', height: '16px', background: '#4f46e5', borderRadius: '2px' }} />
        <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}
