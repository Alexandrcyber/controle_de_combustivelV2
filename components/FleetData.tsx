// components/FleetData.tsx
import React, { useState, useEffect } from 'react';
import { TruckLog, Expense } from '../types';
import { DeleteIcon, PlusIcon, EditIcon } from './icons';

type FleetDataType = 'truck' | 'expense';

interface FleetDataProps<T extends TruckLog | Expense> {
  type: FleetDataType;
  filteredData: T[];
  onAdd: (item: Omit<T, 'id'>) => void;
  onUpdate: (id: string, item: Partial<Omit<T, 'id'>>) => void;
  onDelete: (id: string) => void;
  onSearch: (term: string) => void;
  isPdfMode?: boolean;
}

const initialTruckLogFormState = {
  truckModel: '', licensePlate: '', month: new Date().toISOString().slice(0, 7),
  initialKm: '', finalKm: '', fuelPricePerLiter: '', litersFueled: '',
  idealKmLRoute: '', route: '', gasStation: ''
};

const initialExpenseFormState = {
  month: new Date().toISOString().slice(0, 7), supplier: '', description: '', cost: '',
};

const TruckLogForm: React.FC<{
  onAdd: (log: Omit<TruckLog, 'id'>) => void;
  onUpdate: (id: string, log: Partial<Omit<TruckLog, 'id'>>) => void;
  editingItem: TruckLog | null;
  close: () => void;
}> = ({ onAdd, onUpdate, editingItem, close }) => {
    const [formState, setFormState] = useState(initialTruckLogFormState);

    useEffect(() => {
      if (editingItem) {
        setFormState({
          truckModel: editingItem.truckModel,
          licensePlate: editingItem.licensePlate,
          month: editingItem.month,
          initialKm: String(editingItem.initialKm),
          finalKm: String(editingItem.finalKm),
          fuelPricePerLiter: String(editingItem.fuelPricePerLiter),
          litersFueled: String(editingItem.litersFueled),
          idealKmLRoute: String(editingItem.idealKmLRoute),
          route: editingItem.route,
          gasStation: editingItem.gasStation,
        });
      } else {
        setFormState(initialTruckLogFormState);
      }
    }, [editingItem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            ...formState,
            initialKm: parseFloat(formState.initialKm) || 0,
            finalKm: parseFloat(formState.finalKm) || 0,
            fuelPricePerLiter: parseFloat(formState.fuelPricePerLiter) || 0,
            litersFueled: parseFloat(formState.litersFueled) || 0,
            idealKmLRoute: parseFloat(formState.idealKmLRoute) || 0,
        };
        if (editingItem) {
          onUpdate(editingItem.id, formData);
        } else {
          onAdd(formData);
        }
        close();
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input name="truckModel" value={formState.truckModel} onChange={handleChange} placeholder="Modelo do Caminhão" required className="bg-slate-700 p-2 rounded" />
            <input name="licensePlate" value={formState.licensePlate} onChange={handleChange} placeholder="Placa" required className="bg-slate-700 p-2 rounded" />
            <input type="month" name="month" value={formState.month} onChange={handleChange} required className="bg-slate-700 p-2 rounded" />
            <input type="number" name="initialKm" value={formState.initialKm} onChange={handleChange} placeholder="KM Inicial" required className="bg-slate-700 p-2 rounded" />
            <input type="number" name="finalKm" value={formState.finalKm} onChange={handleChange} placeholder="KM Final" required className="bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="fuelPricePerLiter" value={formState.fuelPricePerLiter} onChange={handleChange} placeholder="Preço/Litro R$" required className="bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="litersFueled" value={formState.litersFueled} onChange={handleChange} placeholder="Litros Abastecidos" required className="bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="idealKmLRoute" value={formState.idealKmLRoute} onChange={handleChange} placeholder="Média Ideal Rota" required className="bg-slate-700 p-2 rounded" />
            <input name="route" value={formState.route} onChange={handleChange} placeholder="Rota" required className="bg-slate-700 p-2 rounded" />
            <input name="gasStation" value={formState.gasStation} onChange={handleChange} placeholder="Posto" required className="bg-slate-700 p-2 rounded" />
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2">
                <button type="button" onClick={close} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500">{editingItem ? 'Salvar Alterações' : 'Adicionar'}</button>
            </div>
        </form>
    );
};

const ExpenseForm: React.FC<{
  onAdd: (exp: Omit<Expense, 'id'>) => void;
  onUpdate: (id: string, exp: Partial<Omit<Expense, 'id'>>) => void;
  editingItem: Expense | null;
  close: () => void;
}> = ({ onAdd, onUpdate, editingItem, close }) => {
    const [formState, setFormState] = useState(initialExpenseFormState);

    useEffect(() => {
      if (editingItem) {
        setFormState({
          month: editingItem.month,
          supplier: editingItem.supplier,
          description: editingItem.description,
          cost: String(editingItem.cost),
        });
      } else {
        setFormState(initialExpenseFormState);
      }
    }, [editingItem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            ...formState,
            cost: parseFloat(formState.cost) || 0
        };
        if (editingItem) {
          onUpdate(editingItem.id, formData);
        } else {
          onAdd(formData);
        }
        close();
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="month" name="month" value={formState.month} onChange={handleChange} required className="bg-slate-700 p-2 rounded" />
            <input name="supplier" value={formState.supplier} onChange={handleChange} placeholder="Fornecedor" required className="bg-slate-700 p-2 rounded" />
            <input name="description" value={formState.description} onChange={handleChange} placeholder="Descrição do Serviço" required className="md:col-span-2 bg-slate-700 p-2 rounded" />
            <input type="number" step="0.01" name="cost" value={formState.cost} onChange={handleChange} placeholder="Valor do Serviço R$" required className="bg-slate-700 p-2 rounded" />
            <div className="md:col-span-2 flex justify-end gap-2">
                 <button type="button" onClick={close} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500">{editingItem ? 'Salvar Alterações' : 'Adicionar'}</button>
            </div>
        </form>
    );
};

export function FleetData<T extends TruckLog | Expense>({ type, filteredData, onAdd, onUpdate, onDelete, onSearch, isPdfMode = false }: FleetDataProps<T>) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const title = type === 'truck' ? 'Registros de Frota' : 'Controle de Despesas';
    const addButtonText = type === 'truck' ? 'Novo Registro' : 'Nova Despesa';

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleEdit = (item: T) => {
      setEditingItem(item);
      setIsFormOpen(true);
    };

    const handleCloseForm = () => {
      setIsFormOpen(false);
      setEditingItem(null);
    };

    const handleOpenForm = () => {
      setEditingItem(null); // Garante que está em modo de adição
      setIsFormOpen(true);
    };

    const renderTable = () => {
        if (type === 'truck') {
            const logs = filteredData as TruckLog[];
            return (
                <table className="w-full text-left">
                    <thead className="bg-secondary">
                        <tr>
                            <th className="p-3">Placa</th>
                            <th className="p-3 hidden sm:table-cell">KM Rodados</th>
                            <th className="p-3 hidden md:table-cell">Litros</th>
                            <th className="p-3">Total (R$)</th>
                            <th className="p-3 hidden lg:table-cell">Média (km/l)</th>
                            {!isPdfMode && <th className="p-3">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => {
                            const kmRodados = log.finalKm - log.initialKm;
                            const totalCost = log.litersFueled * log.fuelPricePerLiter;
                            const consumo = kmRodados > 0 && log.litersFueled > 0 ? kmRodados / log.litersFueled : 0;
                            return (
                                <tr key={log.id} className="border-b border-secondary hover:bg-surface">
                                    <td className="p-3 font-medium">{log.licensePlate}</td>
                                    <td className="p-3 hidden sm:table-cell">{kmRodados.toLocaleString('pt-BR')} km</td>
                                    <td className="p-3 hidden md:table-cell">{log.litersFueled.toLocaleString('pt-BR')} L</td>
                                    <td className="p-3">{totalCost.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                                    <td className="p-3 hidden lg:table-cell">{consumo.toFixed(2)} km/l</td>
                                    {!isPdfMode && (
                                      <td className="p-3 flex items-center gap-2">
                                          <button onClick={() => handleEdit(log)} className="text-blue-400 hover:text-blue-300 p-1"><EditIcon /></button>
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
                                  <td className="p-3 flex items-center gap-2">
                                      <button onClick={() => handleEdit(exp)} className="text-blue-400 hover:text-blue-300 p-1"><EditIcon /></button>
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
                  <button onClick={isFormOpen ? handleCloseForm : handleOpenForm} className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors w-full sm:w-auto">
                      <PlusIcon /> {isFormOpen ? 'Fechar Formulário' : addButtonText}
                  </button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-surface p-6 rounded-lg shadow-lg">
                    {type === 'truck' ? 
                        <TruckLogForm onAdd={onAdd as any} onUpdate={onUpdate as any} editingItem={editingItem as TruckLog | null} close={handleCloseForm} /> : 
                        <ExpenseForm onAdd={onAdd as any} onUpdate={onUpdate as any} editingItem={editingItem as Expense | null} close={handleCloseForm} />
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
                          onChange={handleSearchChange}
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
