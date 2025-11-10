// components/ReportView.tsx
import React from 'react';
import { Dashboard } from './Dashboard';
import { FleetData } from './FleetData';
import { TruckLog, Expense } from '../types';
import { FleetLogoIcon } from './icons';

interface ReportViewProps {
  truckLogs: TruckLog[];
  expenses: Expense[];
}

const ReportHeader: React.FC = () => {
  const reportDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="px-6 py-5 flex justify-between items-center border-b-2 border-slate-700 bg-slate-900 rounded-t-lg">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FleetLogoIcon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Relatório de Performance da Frota</h1>
          <p className="text-slate-400">Análise Consolidada de Operações e Custos</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-white text-sm">Data de Emissão</p>
        <p className="text-slate-400 text-xs">{reportDate}</p>
      </div>
    </div>
  );
};

// ✅ MUDANÇA: O componente agora recebe e usa as props
export const ReportView: React.FC<ReportViewProps> = ({ truckLogs, expenses }) => {
  // Adiciona uma verificação para evitar o crash se as props ainda forem undefined
  if (!truckLogs || !expenses) {
    return <div>Preparando dados para o relatório...</div>;
  }

  return (
    <div className="bg-slate-900 text-slate-200 font-sans">
      <div className="bg-slate-800/50 rounded-lg shadow-lg border border-slate-700">
        <ReportHeader />

        <main className="p-6">
          <section className="mb-8">
            {/* ✅ MUDANÇA: Repassa as props para o Dashboard */}
            <Dashboard truckLogs={truckLogs} expenses={expenses} isPdfMode={true} />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">
              Detalhes das Viagens
            </h2>
            {/* ✅ MUDANÇA: Repassa as props para o FleetData */}
            <FleetData 
              type="truck" 
              data={truckLogs}
              filteredData={truckLogs} // No PDF, data e filteredData são os mesmos
              isPdfMode={true}
              onAdd={() => {}}
              onDelete={() => {}}
              onSearch={() => {}}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">
              Detalhes das Despesas
            </h2>
            {/* ✅ MUDANÇA: Repassa as props para o FleetData */}
            <FleetData 
              type="expense" 
              data={expenses}
              filteredData={expenses} // No PDF, data e filteredData são os mesmos
              isPdfMode={true}
              onAdd={() => {}}
              onDelete={() => {}}
              onSearch={() => {}}
            />
          </section>
        </main>

        <footer className="text-center py-4 mt-6 border-t-2 border-slate-700">
          <p className="text-slate-500 text-sm">Relatório gerado pelo Sistema de Gestão de Frotas</p>
        </footer>
      </div>
    </div>
  );
};
