import React, { useState, useMemo } from 'react';
import { TruckLog, Expense } from '../types';
import { DeleteIcon, PlusIcon } from './icons';

type FleetDataType = 'truck' | 'expense';

interface FleetDataProps<T extends TruckLog | Expense> {
  type: FleetDataType;
  data: T[];
  onAdd: (item: Omit<T, 'id'>) => void;
  onDelete: (id: string) => void;
  isPdfMode?: boolean;
}

const initialTruckLogFormState = {
  truckModel: '', licensePlate: '', month: new Date().toISOString().slice(0, 7),
  initialKm: '', finalKm: '', fuelPricePerLiter: '', totalFuelCost: '',
  idealKmLRoute: '', route: '', gasStation: ''
};

const initialExpenseFormState = {
  month: new Date().toISOString().slice(0, 7), supplier: '', description: '', cost: '',
};


const TruckLogForm: React.FC<{onAdd: (log: Omit<TruckLog, 'id'>) => void; close: () => void}> = ({ onAdd, close }) => {
    const [formState, setFormState] = useState(initialTruckLogFormState);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newLog: Omit<TruckLog, 'id'> = {
            ...formState,
            initialKm: parseFloat(formState.initialKm) || 0,
            finalKm: parseFloat(formState.finalKm) || 0,
            fuelPricePerLiter: parseFloat(formState.fuelPricePerLiter) || 0,
            totalFuelCost: parseFloat(formState.totalFuelCost) || 0,
            idealKmLRoute: parseFloat(formState.idealKmLRoute) || 0,
        };
        onAdd(newLog);
        setFormState(initialTruckLogFormState);
        close();
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input name="truckModel" value={formState.truckModel} onChange={handleChange} placeholder="Modelo do Caminhão (ex: Volvo FH)" required className="bg-slate-700 p-2 rounded" />
            <input name="licensePlate" value={formState.licensePlate} onChange={handleChange} placeholder="Placa (ex: ABC-1234)" required className="bg-slate-700 p-2 rounded" />
            <input type="month" name="month" value={formState.month} onChange={handleChange} required className="bg-slate-700 p-2 rounded" />
            <input type="number" name="initialKm" value={formState.initialKm} onChange={handleChange} placeholder="KM Inicial (ex: 100000)" required className="bg-slate-700 p-2 rounded" />
            <input type="number" name="finalKm" value={formState.finalKm} onChange={handleChange} placeholder="KM Final (ex: 105000)" required className="bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="fuelPricePerLiter" value={formState.fuelPricePerLiter} onChange={handleChange} placeholder="Preço/Litro R$ (ex: 5.50)" required className="bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="totalFuelCost" value={formState.totalFuelCost} onChange={handleChange} placeholder="Total Abastecido R$ (ex: 5500)" required className="bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="idealKmLRoute" value={formState.idealKmLRoute} onChange={handleChange} placeholder="Média Ideal Rota (ex: 2.8)" required className="bg-slate-700 p-2 rounded" />
            <input name="route" value={formState.route} onChange={handleChange} placeholder="Rota (ex: São Paulo - Rio de Janeiro)" required className="bg-slate-700 p-2 rounded" />
            <input name="gasStation" value={formState.gasStation} onChange={handleChange} placeholder="Posto (ex: Posto Shell)" required className="bg-slate-700 p-2 rounded" />
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2">
                <button type="button" onClick={close} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500">Adicionar</button>
            </div>
        </form>
    );
};


const ExpenseForm: React.FC<{onAdd: (exp: Omit<Expense, 'id'>) => void; close: () => void}> = ({ onAdd, close }) => {
    const [formState, setFormState] = useState(initialExpenseFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newExpense: Omit<Expense, 'id'> = {
            ...formState,
            cost: parseFloat(formState.cost) || 0
        };
        onAdd(newExpense);
        setFormState(initialExpenseFormState);
        close();
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="month" name="month" value={formState.month} onChange={handleChange} required className="bg-slate-700 p-2 rounded" />
            <input name="supplier" value={formState.supplier} onChange={handleChange} placeholder="Fornecedor (ex: Borracharia Zé)" required className="bg-slate-700 p-2 rounded" />
            <input name="description" value={formState.description} onChange={handleChange} placeholder="Descrição do Serviço (ex: Troca de Pneu)" required className="md:col-span-2 bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="cost" value={formState.cost} onChange={handleChange} placeholder="Valor do Serviço R$ (ex: 1200)" required className="bg-slate-700 p-2 rounded" />
            <div className="md:col-span-2 flex justify-end gap-2">
                 <button type="button" onClick={close} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500">Adicionar</button>
            </div>
        </form>
    );
};


export function FleetData<T extends TruckLog | Expense>({ type, data, onAdd, onDelete, isPdfMode = false }: FleetDataProps<T>) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const title = type === 'truck' ? 'Registros de Frota' : 'Controle de Despesas';
    const addButtonText = type === 'truck' ? 'Novo Registro' : 'Nova Despesa';
    
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item => 
            Object.values(item).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);


    const renderTable = () => {
        if (type === 'truck') {
            const logs = filteredData as TruckLog[];
            return (
                <table className="w-full text-left">
                    <thead className="bg-secondary">
                        <tr>
                            <th className="p-3">Placa</th>
                            <th className="p-3 hidden md:table-cell">Modelo</th>
                            <th className="p-3 hidden lg:table-cell">Mês</th>
                            <th className="p-3 hidden sm:table-cell">KM Rodados</th>
                            <th className="p-3">Total Abastecido (R$)</th>
                            <th className="p-3 hidden lg:table-cell">Preço/Litro (R$)</th>
                            <th className="p-3 hidden md:table-cell">Média (km/l)</th>
                            {!isPdfMode && <th className="p-3">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => {
                            const kmRodados = log.finalKm - log.initialKm;
                            const litros = log.totalFuelCost > 0 && log.fuelPricePerLiter > 0 ? log.totalFuelCost / log.fuelPricePerLiter : 0;
                            const consumo = kmRodados > 0 && litros > 0 ? kmRodados / litros : 0;
                            return (
                                <tr key={log.id} className="border-b border-secondary hover:bg-surface">
                                    <td className="p-3 font-medium">{log.licensePlate}</td>
                                    <td className="p-3 hidden md:table-cell">{log.truckModel}</td>
                                    <td className="p-3 hidden lg:table-cell">{log.month}</td>
                                    <td className="p-3 hidden sm:table-cell">{kmRodados.toLocaleString('pt-BR')} km</td>
                                    <td className="p-3">{log.totalFuelCost.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                                    <td className="p-3 hidden lg:table-cell">{log.fuelPricePerLiter.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                                    <td className="p-3 hidden md:table-cell">{consumo.toFixed(2)} km/l</td>
                                    {!isPdfMode && (
                                      <td className="p-3">
                                          <button onClick={() => onDelete(log.id)} className="text-red-500 hover:text-red-400 p-1"><DeleteIcon /></button>
                                      </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        } else {
            const expenses = filteredData as Expense[];
            return (
                <table className="w-full text-left">
                    <thead className="bg-secondary">
                        <tr>
                            <th className="p-3">Mês</th>
                            <th className="p-3">Fornecedor</th>
                            <th className="p-3 hidden sm:table-cell">Descrição</th>
                            <th className="p-3">Valor</th>
                            {!isPdfMode && <th className="p-3">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(exp => (
                            <tr key={exp.id} className="border-b border-secondary hover:bg-surface">
                                <td className="p-3">{exp.month}</td>
                                <td className="p-3 font-medium">{exp.supplier}</td>
                                <td className="p-3 hidden sm:table-cell">{exp.description}</td>
                                <td className="p-3">{exp.cost.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                                {!isPdfMode && (
                                  <td className="p-3">
                                      <button onClick={() => onDelete(exp.id)} className="text-red-500 hover:text-red-400 p-1"><DeleteIcon /></button>
                                  </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
                {!isPdfMode && (
                  <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors w-full sm:w-auto">
                      <PlusIcon /> {isFormOpen ? 'Fechar Formulário' : addButtonText}
                  </button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-surface p-6 rounded-lg shadow-lg">
                    {type === 'truck' ? 
                        <TruckLogForm onAdd={onAdd as (log: Omit<TruckLog, 'id'>) => void} close={() => setIsFormOpen(false)} /> : 
                        <ExpenseForm onAdd={onAdd as (exp: Omit<Expense, 'id'>) => void} close={() => setIsFormOpen(false)} />
                    }
                </div>
            )}
            
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                {!isPdfMode && (
                  <div className="mb-4">
                       <input 
                          type="text"
                          placeholder="Pesquisar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full sm:w-1/2 lg:w-1/3 bg-slate-700 p-2 rounded"
                      />
                  </div>
                )}
                <div className="overflow-x-auto">
                    {filteredData.length > 0 ? renderTable() : <p className="text-center text-text-secondary py-8">Nenhum dado encontrado.</p>}
                </div>
            </div>
        </div>
    );
}