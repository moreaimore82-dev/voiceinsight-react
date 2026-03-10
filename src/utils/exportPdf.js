import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function generatePdf(element, filename) {
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#0f172a',
    logging: false,
    windowWidth: 390,
  })

  const imgData = canvas.toDataURL('image/png')
  const imgWidth = 210 // A4 mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  let yPos = 0
  const pageHeight = 297

  // Çok sayfalı PDF için böl
  while (yPos < imgHeight) {
    if (yPos > 0) pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, -yPos, imgWidth, imgHeight)
    yPos += pageHeight
  }

  return { pdf, blob: pdf.output('blob'), filename }
}

export async function downloadPdf(element, filename) {
  const { pdf } = await generatePdf(element, filename)
  pdf.save(filename)
}

export async function sharePdf(element, filename) {
  const { blob } = await generatePdf(element, filename)
  const file = new File([blob], filename, { type: 'application/pdf' })

  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: filename.replace('.pdf', ''),
      files: [file],
    })
    return true
  }
  // Fallback: indir
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return false
}
