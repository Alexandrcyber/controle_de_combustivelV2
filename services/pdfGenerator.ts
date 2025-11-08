
// This assumes jspdf and html2canvas are loaded from a CDN.
// We declare them to satisfy TypeScript.
// We'll dynamically import html2canvas and jspdf to avoid relying on global CDN variables
export const generatePdf = async (elementId: string, fileName: string): Promise<void> => {
  try {
    const input = document.getElementById(elementId);
    if (!input) {
      console.error(`Element with id "${elementId}" not found.`);
      return;
    }

    // Dynamic imports so we can ship the dependencies with the app (and let bundlers optimize)
    const [{ default: html2canvas }, jspdfModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);

    const { jsPDF } = jspdfModule;

    // To get a better quality of the image
    const scale = 2;
    // Use a white background to avoid color bleeding/overlay issues
    const canvas = await html2canvas(input as HTMLElement, {
      scale: scale,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');

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
  } catch (err) {
    // Surface the error to the console so the UI can handle it
    console.error('Error generating PDF:', err);
    throw err;
  }
};
