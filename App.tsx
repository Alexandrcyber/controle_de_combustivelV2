import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FleetData } from './components/FleetData';
import { ReportView } from './components/ReportView';
import { DownloadIcon } from './components/icons';
import { useFleetData } from './hooks/useFleetData';
import { generatePdf } from './services/pdfGenerator';

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
    deleteExpense 
  } = useFleetData();

  const handlePdfDownload = useCallback(() => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
  }, [isGeneratingPdf]);
  
  useEffect(() => {
    if (isGeneratingPdf) {
      // Use a timeout to ensure the DOM has been updated with the report view
      const timer = setTimeout(async () => {
        await generatePdf('pdf-container', 'fleet_report');
        setIsGeneratingPdf(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGeneratingPdf]);


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
            {renderView()}
          </main>
        </div>
      </div>
      {/* Off-screen container for PDF generation */}
      <div 
        style={{ 
            position: 'fixed', 
            left: '-9999px', 
            top: 0, 
            width: '1280px',
            color: '#f8fafc',
            fontFamily: 'sans-serif'
        }}
        className="bg-background"
      >
        {isGeneratingPdf && (
            <div id="pdf-container">
                <ReportView truckLogs={truckLogs} expenses={expenses} />
            </div>
        )}
      </div>
    </>
  );
};

export default App;
