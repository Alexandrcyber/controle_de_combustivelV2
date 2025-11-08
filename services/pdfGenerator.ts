
// This assumes jspdf and html2canvas are loaded from a CDN.
// We declare them to satisfy TypeScript.
declare const jspdf: any;
declare const html2canvas: any;

export const generatePdf = async (elementId: string, fileName: string): Promise<void> => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }
  
  // To get a better quality of the image
  const scale = 2;
  const canvas = await html2canvas(input, {
    scale: scale,
    useCORS: true,
    backgroundColor: '#0f172a' // slate-900, same as our background
  });

  const imgData = canvas.toDataURL('image/png');
  
  const { jsPDF } = jspdf;
  // Use A4 paper size, portrait orientation
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  
  const ratio = imgWidth / imgHeight;
  const widthInPdf = pdfWidth;
  const heightInPdf = widthInPdf / ratio;
  
  let heightLeft = heightInPdf;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, widthInPdf, heightInPdf);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = position - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, widthInPdf, heightInPdf);
    heightLeft -= pdfHeight;
  }
  
  // Format date for filename
  const date = new Date().toISOString().split('T')[0];
  pdf.save(`${fileName}_${date}.pdf`);
};
