import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Gera um PDF estilizado em formato A4, com cabeçalho automático e quebra de páginas.
 * @param elementId ID do elemento HTML que será capturado.
 * @param fileName Nome base do arquivo PDF gerado.
 */
export const generateStyledPdf = async (
  elementId: string,
  fileName: string
): Promise<void> => {
  try {
    const input = document.getElementById(elementId);
    if (!input) throw new Error(`Elemento com id "${elementId}" não encontrado.`);

    // Aguarda o React terminar de montar o DOM
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;
    const MARGIN = 20;

    // Cabeçalho
    const header = document.createElement('div');
    header.style.cssText = `
      text-align: center;
      padding: 16px;
      background: #1e293b;
      color: #f8fafc;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 2px solid #38bdf8;
    `;
    const date = new Date().toLocaleDateString('pt-BR');
    header.innerHTML = `📊 Relatório de Frotas — ${date}`;

    // Clonar o conteúdo a ser impresso
    const clone = input.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      background-color: #0f172a;
      color: white;
      width: ${A4_WIDTH - MARGIN * 2}px;
      padding: ${MARGIN}px;
      font-family: sans-serif;
    `;
    wrapper.appendChild(header);
    wrapper.appendChild(clone);

    // Inserir fora da tela (visível para html2canvas)
    wrapper.style.position = 'fixed';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';
    document.body.appendChild(wrapper);

    const scale = 2;
    const canvas = await html2canvas(wrapper, {
      scale,
      useCORS: true,
      backgroundColor: '#0f172a',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'px', [A4_WIDTH, A4_HEIGHT]);

    const imgHeight = (canvas.height * A4_WIDTH) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, A4_WIDTH, imgHeight);
    heightLeft -= A4_HEIGHT;

    while (heightLeft > 0) {
      position -= A4_HEIGHT;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, A4_WIDTH, imgHeight);
      heightLeft -= A4_HEIGHT;
    }

    pdf.save(`${fileName}_${date}.pdf`);
    wrapper.remove();
  } catch (error) {
    console.error('Erro ao gerar PDF estilizado:', error);
    throw error;
  }
};
