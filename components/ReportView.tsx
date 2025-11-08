import React from 'react';
import { Dashboard } from './Dashboard';
import { FleetData } from './FleetData';
import { TruckLog, Expense } from '../types';

interface ReportViewProps {
    truckLogs: TruckLog[];
    expenses: Expense[];
}

export const ReportView: React.FC<ReportViewProps> = ({ truckLogs, expenses }) => {
    return (
        <div className="p-8 space-y-12 bg-background">
            <header className="text-center mb-8 border-b-2 border-primary pb-4">
                <h1 className="text-4xl font-bold">Relatório de Frota</h1>
                <p className="text-text-secondary">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
            </header>
            
            <section>
                 <Dashboard truckLogs={truckLogs} expenses={expenses} isPdfMode={true} />
            </section>
            
            <div style={{ pageBreakBefore: 'always' }}></div>
            
            <section>
                <FleetData 
                    type="truck" 
                    data={truckLogs} 
                    onAdd={() => {}} 
                    onDelete={() => {}} 
                    isPdfMode={true} 
                />
            </section>
            
            <div style={{ pageBreakBefore: 'always' }}></div>

            <section>
                <FleetData 
                    type="expense" 
                    data={expenses} 
                    onAdd={() => {}} 
                    onDelete={() => {}} 
                    isPdfMode={true} 
                />
            </section>
        </div>
    );
};
