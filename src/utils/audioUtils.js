export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function getMimeType(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const mimeMap = {
    mp3: 'audio/mp3',
    wav: 'audio/wav',
    aac: 'audio/aac',
    m4a: 'audio/mp4',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    webm: 'audio/webm',
    adts: 'audio/aac'
  }
  let mimeType = mimeMap[ext] || file.type || 'audio/mp3'
  if (mimeType.includes('adts')) mimeType = 'audio/aac'
  if (mimeType.includes('mpeg')) mimeType = 'audio/mp3'
  return mimeType
}

export function pcm16ToMp3(base64Str, sampleRate) {
  // lamejs is loaded globally via script tag or import
  // eslint-disable-next-line no-undef
  if (typeof lamejs === 'undefined') throw new Error('LameJS yüklenemedi.')

  const binaryStr = atob(base64Str)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  const samples = new Int16Array(bytes.buffer)
  // eslint-disable-next-line no-undef
  const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128)
  const mp3Data = []
  const blockSize = 1152
  for (let i = 0; i < samples.length; i += blockSize) {
    const chunk = samples.subarray(i, i + blockSize)
    const buf = mp3encoder.encodeBuffer(chunk)
    if (buf.length > 0) mp3Data.push(new Int8Array(buf))
  }
  const flush = mp3encoder.flush()
  if (flush.length > 0) mp3Data.push(new Int8Array(flush))
  return new Blob(mp3Data, { type: 'audio/mp3' })
}

export function createSilentMp3Blob() {
  // eslint-disable-next-line no-undef
  if (typeof lamejs === 'undefined') return new Blob([], { type: 'audio/mp3' })
  // eslint-disable-next-line no-undef
  const mp3encoder = new lamejs.Mp3Encoder(1, 24000, 128)
  const silent = new Int16Array(24000)
  const mp3Data = []
  const buf = mp3encoder.encodeBuffer(silent)
  if (buf.length > 0) mp3Data.push(new Int8Array(buf))
  const flush = mp3encoder.flush()
  if (flush.length > 0) mp3Data.push(new Int8Array(flush))
  return new Blob(mp3Data, { type: 'audio/mp3' })
}
