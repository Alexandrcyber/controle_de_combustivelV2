// App.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FleetData } from './components/FleetData';
import { ReportView } from './components/ReportView';
import { DownloadIcon } from './components/icons';
import { useFleetData } from './hooks/useFleetData';
import { Alert } from './components/Alert';
import { generateStyledPdf } from './services/pdfGenerator';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TruckLog, Expense } from './types';

type View = 'dashboard' | 'truck-logs' | 'expenses';
type AlertState = { message: string; type: 'success' | 'error' } | null;

const initialFilterState = {
    month: '',
    truckModel: '',
    licensePlate: '',
    supplier: '',
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);
  const [filters, setFilters] = useState(initialFilterState);
  const [searchTerm, setSearchTerm] = useState('');

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

  const { filteredTruckLogs, filteredExpenses } = useMemo(() => {
    const baseFilteredLogs = truckLogs.filter(log => 
      (filters.month === '' || log.month === filters.month) &&
      (filters.truckModel === '' || log.truckModel === filters.truckModel) &&
      (filters.licensePlate === '' || log.licensePlate === filters.licensePlate)
    );

    const baseFilteredExpenses = expenses.filter(exp => 
      (filters.month === '' || exp.month === filters.month) &&
      (filters.supplier === '' || exp.supplier === filters.supplier)
    );

    const searchFilteredLogs = !searchTerm ? baseFilteredLogs : baseFilteredLogs.filter(log =>
      Object.values(log).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const searchFilteredExpenses = !searchTerm ? baseFilteredExpenses : baseFilteredExpenses.filter(exp =>
      Object.values(exp).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return { filteredTruckLogs: searchFilteredLogs, filteredExpenses: searchFilteredExpenses };
  }, [truckLogs, expenses, filters, searchTerm]);

  const handlePdfDownload = useCallback(async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setAlert({ message: 'Gerando seu relatório...', type: 'success' });
    
    try {
      await generateStyledPdf('pdf-render-target', 'Relatorio_Frota');
      setAlert({ message: 'Relatório PDF gerado com sucesso!', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setAlert({ message: err.message || 'Ocorreu um erro ao gerar o PDF.', type: 'error' });
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [isGeneratingPdf, filteredTruckLogs, filteredExpenses]);

  const clearAllFilters = () => {
    setFilters(initialFilterState);
    setSearchTerm('');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard truckLogs={filteredTruckLogs} expenses={filteredExpenses} />;
      case 'truck-logs':
        return (
          <FleetData
            type="truck"
            data={truckLogs}
            filteredData={filteredTruckLogs}
            onAdd={addTruckLog}
            onDelete={deleteTruckLog}
            onSearch={setSearchTerm}
          />
        );
      case 'expenses':
        return (
          <FleetData
            type="expense"
            data={expenses}
            filteredData={filteredExpenses}
            onAdd={addExpense}
            onDelete={deleteExpense}
            onSearch={setSearchTerm}
          />
        );
      default:
        return <Dashboard truckLogs={filteredTruckLogs} expenses={filteredExpenses} />;
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
          clearFilters={clearAllFilters}
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
              disabled={isGeneratingPdf || isLoading}
              className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              <DownloadIcon />
              Baixar Relatório PDF
            </button>
          </header>
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
            {isLoading ? (
              <LoadingSpinner message="Conectando ao servidor... Isso pode demorar até 1 minuto. Obrigado pela sua paciência!" />
               ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-lg text-center">
                  <h3 className="text-red-400 font-semibold text-xl mb-3">Falha ao Carregar Dados</h3>
                  <p className="text-text-primary mb-2">Não foi possível conectar ao servidor. Isso pode ser devido a um erro de rede ou à configuração do servidor.</p>
                  <p className="text-slate-400 text-sm">Erro: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            ) : (
              renderView()
            )}
          </main>
        </div>
      </div>
      
      <div id="pdf-render-target" style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
        {isGeneratingPdf && (
          // ✅ --- CORREÇÃO APLICADA AQUI ---
          // Garante que o ReportView receba os dados JÁ FILTRADOS
          <ReportView truckLogs={filteredTruckLogs} expenses={filteredExpenses} />
        )}
      </div>
    </>
  );
};

export default App;
