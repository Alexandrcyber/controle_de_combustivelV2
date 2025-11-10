// services/pdfGenerator.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateStyledPdf = async (
  elementId: string,
  fileName: string
): Promise<void> => {
  try {
    // ✅ MUDANÇA: Pequeno delay para garantir que o React renderizou o elemento.
    await new Promise(resolve => setTimeout(resolve, 50));

    const sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
      throw new Error(`Elemento com id "${elementId}" não encontrado.`);
    }

    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;
    
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = `${A4_WIDTH_PX}px`;
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.top = '-9999px';
    pdfContainer.style.left = '0px';

    const contentClone = sourceElement.cloneNode(true) as HTMLElement;
    pdfContainer.appendChild(contentClone);
    document.body.appendChild(pdfContainer);
    
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null,
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
    });

    document.body.removeChild(pdfContainer);

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [A4_WIDTH_PX, A4_HEIGHT_PX],
      hotfixes: ['px_scaling'],
    });

    const imgData = canvas.toDataURL('image/png');
    const canvasAspectRatio = canvas.height / canvas.width;
    const imgHeight = A4_WIDTH_PX * canvasAspectRatio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, A4_WIDTH_PX, imgHeight);
    heightLeft -= A4_HEIGHT_PX;

    while (heightLeft > 0) {
      position -= A4_HEIGHT_PX;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, A4_WIDTH_PX, imgHeight);
      heightLeft -= A4_HEIGHT_PX;
    }

    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    pdf.save(`${fileName}_${date}.pdf`);

  } catch (error) {
    console.error('Erro ao gerar PDF estilizado:', error);
    throw error;
  }
};
