export function getFallbackData() {
  return {
    id: Date.now(),
    tarih: new Date().toLocaleString('tr-TR'),
    projeAdi: 'Demo Analiz (API Kısıtlaması)',
    ozetMaddeleri: [
      'Bu bir demo analizdir. Gerçek ses verisi API kısıtlaması nedeniyle işlenemedi.',
      'Uygulamayı kendi ortamınıza (Netlify vb.) taşıdığınızda gerçek zamanlı ses analiziniz eksiksiz çalışacaktır.',
      'Panelin dinamik grafiklerini ve fonksiyonlarını bu örnek veriler üzerinden test edebilirsiniz.',
      'Gemini API anahtarınızı .env dosyasına ekleyerek uygulamayı aktif hale getirebilirsiniz.',
      'Uygulama MP3, WAV, M4A, AAC, FLAC ve OGG formatlarını desteklemektedir.'
    ],
    transkript: [
      { kisi: 'Sistem', metin: 'API anahtarı eksik veya geçersiz olduğu için ses dosyası işlenemedi.' },
      { kisi: 'Sistem', metin: 'Fakat uygulamanın UI ve UX süreçleri mükemmel bir şekilde çalışmaya devam ediyor.' }
    ],
    kararlar: [
      { baslik: 'API Anahtarı Gerekli', icerik: 'Gerçek analiz için VITE_GEMINI_API_KEY ortam değişkeni ayarlanmalıdır.', tip: 'Sistem' },
      { baslik: 'Demo Modu Aktif', icerik: 'Uygulamanın çökmemesi için hata yakalanıp demo veriye geçildi.', tip: 'Geliştirme' }
    ],
    konuDagilimi: {
      baslik: 'Gündem Dağılımı',
      labels: ['Demo Konu A', 'Demo Konu B'],
      data: [60, 40]
    },
    aksiyonlar: [
      { ekip: 'Geliştirici', sure: 'Hemen', gorev: 'VITE_GEMINI_API_KEY değerini .env dosyasına ekleyin.', durum: 'high-priority' }
    ],
    profiller: [
      { isim: 'Sistem Bilgilendirmesi', duygu: 'Bilgilendirici', not: 'Demo modu aktif.', metrics: [90, 10, 80, 50] }
    ],
    podcastMetni: 'Merhaba! Bu bir demo yayınıdır. API anahtarınızı ekledikten sonra gerçek ses analiziniz başlayacak!'
  }
}
