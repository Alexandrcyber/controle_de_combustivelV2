// services/pdfGenerator.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateStyledPdf = async (
  elementId: string,
  fileName: string
): Promise<void> => {
  try {
    // Dá ao React um momento para renderizar o conteúdo dentro do div de destino.
    await new Promise(resolve => setTimeout(resolve, 100));

    const targetElement = document.getElementById(elementId);
    if (!targetElement || targetElement.childElementCount === 0) {
      throw new Error(`Elemento com id "${elementId}" não foi encontrado ou está vazio.`);
    }

    // Dimensões padrão do A4 em pixels (px) a 96 DPI.
    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;
    
    // ✅ --- MUDANÇA PRINCIPAL: Renderiza o elemento original, sem clonagem ---
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      // Garante um fundo consistente, mesmo que o elemento não tenha um.
      backgroundColor: '#0f172a', 
      // Força o html2canvas a usar a largura total do conteúdo, que já está dentro de um container
      // com a largura correta no App.tsx (indiretamente).
      windowWidth: targetElement.scrollWidth,
      windowHeight: targetElement.scrollHeight,
    });

    // Se o canvas gerado tiver altura 0, significa que a renderização falhou.
    if (canvas.height === 0) {
      throw new Error("A renderização do conteúdo para o PDF falhou, resultando em uma imagem vazia.");
    }

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4', // Usar o formato 'a4' é mais padronizado
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
