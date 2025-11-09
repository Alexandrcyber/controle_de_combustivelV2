// App.tsx
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FleetData } from './components/FleetData';
import { ReportView } from './components/ReportView';
import { DownloadIcon } from './components/icons';
import { useFleetData } from './hooks/useFleetData';
import { Alert } from './components/Alert';
// ✅ Importa a SUA função de gerar PDF
import { generateStyledPdf } from './services/pdfGenerator';

type View = 'dashboard' | 'truck-logs' | 'expenses';
type AlertState = { message: string; type: 'success' | 'error' } | null;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

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

  const handlePdfDownload = useCallback(async () => {
    if (isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setAlert({ message: 'Gerando seu relatório, por favor aguarde...', type: 'success' });

    // Espera o React renderizar o conteúdo do relatório no div escondido
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // ✅ Chama a sua função, passando o ID do container e o nome do arquivo
      await generateStyledPdf('pdf-render-target', 'Relatorio_Frota');
      setAlert({ message: 'Relatório PDF gerado com sucesso!', type: 'success' });
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Ocorreu um erro ao gerar o PDF.', type: 'error' });
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [isGeneratingPdf, truckLogs, expenses]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard truckLogs={truckLogs} expenses={expenses} />;
      case 'truck-logs':
        return <FleetData type="truck" data={truckLogs} onAdd={addTruckLog} onDelete={deleteTruckLog} />;
      case 'expenses':
        return <FleetData type="expense" data={expenses} onAdd={addExpense} onDelete={deleteExpense} />;
      default:
        return <Dashboard truckLogs={truckLogs} expenses={expenses} />;
    }
  };

  return (
    <>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

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
              <DownloadIcon />
              Baixar Relatório PDF
            </button>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
            {isLoading ? (
              <div>Carregando...</div>
             ) : error ? (
              <div>Erro: {error}</div>
            ) : (
              renderView()
            )}
          </main>
        </div>
      </div>
      
      {/* ✅ Container de renderização para o PDF. Fica escondido. */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
        {isGeneratingPdf && (
          <div id="pdf-render-target">
            <ReportView truckLogs={truckLogs} expenses={expenses} />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
