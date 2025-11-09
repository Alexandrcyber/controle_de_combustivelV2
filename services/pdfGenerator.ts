import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Gera um PDF A4 responsivo a partir de um elemento HTML.
 * A chave é renderizar o elemento em um container com a largura fixa do A4
 * ANTES de usar html2canvas, forçando os estilos responsivos (Tailwind) a se adaptarem.
 * @param elementId ID do elemento HTML a ser capturado.
 * @param fileName Nome base do arquivo PDF.
 */
export const generateStyledPdf = async (
  elementId: string,
  fileName: string
): Promise<void> => {
  try {
    const sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
      throw new Error(`Elemento com id "${elementId}" não encontrado.`);
    }

    // Aguardar um ciclo de renderização para garantir que o React renderizou tudo.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Dimensões padrão do A4 em pixels (px) com 96 DPI, que é o padrão do CSS.
    // A4: 210mm x 297mm. Polegadas: ~8.27in x 11.69in. Pixels: 8.27*96 x 11.69*96
    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;
    
    // 1. Criar um container temporário com a largura exata da página A4.
    // Este é o passo mais importante para a responsividade.
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = `${A4_WIDTH_PX}px`;
    // Posicionar fora da tela para não ser visível ao usuário.
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.top = '-9999px';
    pdfContainer.style.left = '0px';

    // 2. Clonar o conteúdo alvo para dentro do nosso container dimensionado.
    // O navegador irá refazer o layout do conteúdo para caber na largura de 794px.
    const contentClone = sourceElement.cloneNode(true) as HTMLElement;
    pdfContainer.appendChild(contentClone);
    document.body.appendChild(pdfContainer);
    
    // Pequeno delay para garantir que o navegador aplicou os estilos e o layout.
    await new Promise(resolve => setTimeout(resolve, 100));

    // 3. Renderizar o container com html2canvas.
    // As opções 'width' e 'windowWidth' reforçam a simulação de um viewport estreito.
    const canvas = await html2canvas(pdfContainer, {
      scale: 2, // Aumentar escala melhora a qualidade do texto e das imagens.
      useCORS: true,
      logging: false,
      backgroundColor: null, // Usar o fundo do elemento.
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
    });

    // 4. Limpar o DOM, removendo o container temporário.
    document.body.removeChild(pdfContainer);

    // 5. Configurar o jsPDF e adicionar a imagem do canvas.
    const pdf = new jsPDF({
      orientation: 'p', // 'portrait'
      unit: 'px',
      format: [A4_WIDTH_PX, A4_HEIGHT_PX],
      hotfixes: ['px_scaling'], // Melhora a consistência de unidades 'px'.
    });

    const imgData = canvas.toDataURL('image/png');
    const canvasAspectRatio = canvas.height / canvas.width;
    const imgHeight = A4_WIDTH_PX * canvasAspectRatio;

    let heightLeft = imgHeight;
    let position = 0;

    // Adiciona a primeira página
    pdf.addImage(imgData, 'PNG', 0, position, A4_WIDTH_PX, imgHeight);
    heightLeft -= A4_HEIGHT_PX;

    // Adiciona páginas subsequentes se o conteúdo for mais longo que uma página
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
    // Re-lançar o erro para que o chamador (App.tsx) possa tratá-lo (ex: mostrar alerta).
    throw error;
  }
};
