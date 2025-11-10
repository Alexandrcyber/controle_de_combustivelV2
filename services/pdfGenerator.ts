// services/pdfGenerator.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateStyledPdf = async (
  elementId: string,
  fileName: string
): Promise<void> => {
  try {
    // ✅ CORREÇÃO: Aumenta o delay para garantir a renderização completa dos SVGs dos gráficos.
    await new Promise(resolve => setTimeout(resolve, 300));

    const targetElement = document.getElementById(elementId);
    if (!targetElement || targetElement.childElementCount === 0) {
      throw new Error(`Elemento com id "${elementId}" não foi encontrado ou está vazio.`);
    }

    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0f172a',
      windowWidth: targetElement.scrollWidth,
      windowHeight: targetElement.scrollHeight,
    });

    if (canvas.height === 0) {
      throw new Error("A renderização do conteúdo para o PDF falhou, resultando em uma imagem vazia.");
    }

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgData = canvas.toDataURL('image/png');
    const canvasAspectRatio = canvas.height / canvas.width;
    const imgHeight = pdfWidth * canvasAspectRatio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    pdf.save(`${fileName}_${date}.pdf`);

  } catch (error) {
    console.error('Erro ao gerar PDF estilizado:', error);
    throw error;
  }
};
