import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FleetData } from './components/FleetData';
import { ReportView } from './components/ReportView';
import { DownloadIcon } from './components/icons';
import { useFleetData } from './hooks/useFleetData';
import { generateStyledPdf } from './services/pdfGenerator';
// no topo do App.tsx — adicione imports necessários
import ReactDOMClient from 'react-dom/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


type View = 'dashboard' | 'truck-logs' | 'expenses';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { 
    truckLogs, 
    expenses, 
    addTruckLog, 
    addExpense, 
    deleteTruckLog, 
    deleteExpense,
    isLoading,
    error
  } = useFleetData();

  const handlePdfDownload = useCallback(() => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
  }, [isGeneratingPdf]);
  
 useEffect(() => {
  if (!isGeneratingPdf) return;

  const createOffscreenAndGenerate = async () => {
    let rootContainer: HTMLDivElement | null = null;
    let reactRoot: ReactDOMClient.Root | null = null;
    try {
      // 1) criar div off-screen (visível pelo browser, mas fora da tela)
      rootContainer = document.createElement('div');
      rootContainer.style.position = 'fixed';
      rootContainer.style.top = '-99999px';
      rootContainer.style.left = '-99999px';
      rootContainer.style.width = '1280px';
      rootContainer.style.backgroundColor = '#0f172a';
      document.body.appendChild(rootContainer);

      // 2) criar root React separado e renderizar o ReportView nele
      reactRoot = ReactDOMClient.createRoot(rootContainer);
      reactRoot.render(
        <React.StrictMode>
          <ReportView truckLogs={truckLogs} expenses={expenses} isPdfMode={true} />
        </React.StrictMode>
      );

      // 3) aguardar montagem e layout estabilizarem
      // aguarda alguns frames (garante commit do React neste root)
      await new Promise<void>((resolve) => {
        // esperar 2 frames + 200ms para estilos aplicarem
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => resolve(), 200);
          });
        });
      });

      // 4) capturar com html2canvas
      const scale = Math.max(2, window.devicePixelRatio || 2);
      const canvas = await html2canvas(rootContainer, {
        scale,
        useCORS: true,
        backgroundColor: '#0f172a',
        logging: false
      });

      // 5) gerar PDF com jsPDF (A4 em px, relativo)
      const A4_WIDTH = 794; // px aprox @96dpi
      const A4_HEIGHT = 1123;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', [A4_WIDTH, A4_HEIGHT]);
      const imgWidth = A4_WIDTH;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= A4_HEIGHT;

      while (heightLeft > 0) {
        position -= A4_HEIGHT;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= A4_HEIGHT;
      }

      const date = new Date().toISOString().split('T')[0];
      pdf.save(`Relatorio_Frota_${date}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF (offscreen):', err);
      alert('Erro ao gerar PDF. Veja o console para detalhes.');
    } finally {
      // 6) desmontar e limpar
      try {
        if (reactRoot) reactRoot.unmount();
      } catch (e) {
        // ignore
      }
      if (rootContainer && rootContainer.parentNode) {
        rootContainer.parentNode.removeChild(rootContainer);
      }
      setIsGeneratingPdf(false);
    }
  };

  createOffscreenAndGenerate();
}, [isGeneratingPdf, truckLogs, expenses]);




  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard truckLogs={truckLogs} expenses={expenses} />;
      case 'truck-logs':
        return <FleetData 
                  type="truck" 
                  data={truckLogs} 
                  onAdd={addTruckLog} 
                  onDelete={deleteTruckLog}
                />;
      case 'expenses':
        return <FleetData 
                  type="expense" 
                  data={expenses} 
                  onAdd={addExpense} 
                  onDelete={deleteExpense}
                />;
      default:
        return <Dashboard truckLogs={truckLogs} expenses={expenses} />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-background text-text-primary font-sans">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-4 bg-surface shadow-md lg:justify-end">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              onClick={handlePdfDownload}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isGeneratingPdf ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando PDF...
                </>
              ) : (
                <>
                  <DownloadIcon />
                  Baixar Relatório PDF
                </>
              )}
            </button>
          </header>
          <main id="report-content" className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg font-medium">Carregando dados...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 max-w-lg">
                  <h3 className="text-red-500 font-semibold text-lg mb-2">Erro ao carregar dados</h3>
                  <p className="text-text-primary">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            ) : (
              renderView()
            )}
          </main>
        </div>
      </div>
      {/* Container invisível mas renderizável para o PDF */}
<div
  id="pdf-container-root"
  style={{
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    width: '1280px',
    opacity: 1,
    backgroundColor: '#0f172a',
    zIndex: -9999
  }}
>
  {isGeneratingPdf && (
    <div id="pdf-container">
      <ReportView
        truckLogs={truckLogs}
        expenses={expenses}
        isPdfMode={true}
      />
    </div>
  )}
</div>

    </>
  );
};

export default App;
