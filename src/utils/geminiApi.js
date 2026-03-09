const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

async function fetchWithRetry(url, options, maxRetries = 3) {
  const delays = [1000, 2000, 4000]
  let retries = 0
  while (retries <= maxRetries) {
    const response = await fetch(url, options)
    if (!response.ok) {
      const errText = await response.text()
      if (response.status === 401 || response.status === 403) {
        throw new Error(`HTTP ${response.status}: API yetkilendirme hatası. ${errText}`)
      }
      if (retries === maxRetries) throw new Error(`HTTP ${response.status}: ${errText}`)
      await new Promise(r => setTimeout(r, delays[retries]))
      retries++
      continue
    }
    return await response.json()
  }
}

const SYSTEM_PROMPT = `Sen uzman bir Sesli İçerik Analisti ve Strateji Uzmanısın. Sana gönderilen metin ve ses verisini dinle ve derinlemesine analiz et.

ÇOK ÖNEMLİ KURALLAR:
1. TRANSKRİPT: Ses kaydındaki konuşmaların TAMAMINI, kelimesi kelimesine (verbatim) yazmalısın. ASLA özetleme, atlama veya kısaltma yapma. Konuşmanın başından sonuna kadar tüm cümleleri döküm haline getir.
2. AKSİYONLAR: Konuşma sırasında geçen, ima edilen veya konuşmanın doğası gereği alınması gereken TÜM aksiyon maddelerini, görevleri ve eylem adımlarını eksiksiz çıkar.

Kesinlikle aşağıdaki JSON şemasına uygun, Türkçe bir yanıt ver. Çıktın SADECE geçerli bir JSON objesi olmalıdır.

Şema:
{
  "projeAdi": "Konuşmanın ana konusu",
  "ozetMaddeleri": ["En az 5 adet detaylı madde"],
  "transkript": [{ "kisi": "Konuşmacı", "metin": "Eksiksiz metin" }],
  "kararlar": [{ "baslik": "Karar", "icerik": "Detay", "tip": "Strateji/Finans vb." }],
  "konuDagilimi": { "baslik": "Gündem Dağılımı", "labels": ["Konu 1"], "data": [100] },
  "aksiyonlar": [{ "ekip": "Sorumlu", "sure": "Tarih", "gorev": "İş", "durum": "high-priority veya pending" }],
  "profiller": [{ "isim": "Kişi/Atmosfer", "duygu": "Duygu", "not": "Analiz", "metrics": [80,20,70,60] }],
  "podcastMetni": "1-2 dakikalık podcast metni."
}`

export async function analyzeAudio(base64Data, mimeType) {
  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { text: SYSTEM_PROMPT + '\n\nLütfen ekteki ses dosyasını yukarıdaki JSON kurallarına tam uyacak şekilde analiz et.' },
        { inlineData: { mimeType, data: base64Data } }
      ]
    }],
    generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 8192 }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`
  const result = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text
  if (!jsonText) throw new Error('Yapay zeka yanıt veremedi.')
  return JSON.parse(jsonText)
}

export async function generatePodcastAudio(podcastMetni) {
  const payload = {
    contents: [{ parts: [{ text: 'Neşeli ve enerjik bir ses tonuyla oku: ' + podcastMetni }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
    },
    model: 'gemini-2.5-flash-preview-tts'
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`
  const result = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const audioBase64 = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
  if (!audioBase64) throw new Error('Ses verisi alınamadı.')
  return audioBase64
}
