import React, { useMemo, useState } from 'react';
import { TruckLog, Expense } from '../types';
import { StatCard } from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  truckLogs: TruckLog[];
  expenses: Expense[];
  isPdfMode?: boolean;
}

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc'];

const initialFilterState = {
    month: '',
    truckModel: '',
    licensePlate: '',
    supplier: '',
};

export const Dashboard: React.FC<DashboardProps> = ({ truckLogs, expenses, isPdfMode = false }) => {
  const [filters, setFilters] = useState(initialFilterState);
  const [showFilters, setShowFilters] = useState(false);

  const { uniqueMonths, uniqueModels, uniquePlates, uniqueSuppliers } = useMemo(() => {
    const uniqueMonths = [...new Set([...truckLogs.map(l => l.month), ...expenses.map(e => e.month)])].sort((a, b) => b.localeCompare(a));
    const uniqueModels = [...new Set(truckLogs.map(l => l.truckModel))].sort();
    const uniquePlates = [...new Set(truckLogs.map(l => l.licensePlate))].sort();
    const uniqueSuppliers = [...new Set(expenses.map(e => e.supplier))].sort();
    return { uniqueMonths, uniqueModels, uniquePlates, uniqueSuppliers };
  }, [truckLogs, expenses]);

  const filteredData = useMemo(() => {
    const filteredTruckLogs = truckLogs.filter(log => {
      return (
        (filters.month === '' || log.month === filters.month) &&
        (filters.truckModel === '' || log.truckModel === filters.truckModel) &&
        (filters.licensePlate === '' || log.licensePlate === filters.licensePlate)
      );
    });

    const filteredExpenses = expenses.filter(expense => {
      return (
        (filters.month === '' || expense.month === filters.month) &&
        (filters.supplier === '' || expense.supplier === filters.supplier)
      );
    });
    
    return { filteredTruckLogs, filteredExpenses };

  }, [truckLogs, expenses, filters]);


  const {
    totalKm,
    totalFuelCost,
    totalExpenses,
    overallAvgKmL,
    monthlyData,
    expenseByCategory
  } = useMemo(() => {
    let totalKm = 0;
    let totalFuelCost = 0;
    let totalLiters = 0;

    const monthlyDataMap: { [key: string]: { km: number; fuel: number; expense: number } } = {};

    filteredData.filteredTruckLogs.forEach(log => {
      const km = log.finalKm - log.initialKm;
      const liters = log.totalFuelCost / log.fuelPricePerLiter;
      totalKm += km;
      totalFuelCost += log.totalFuelCost;
      totalLiters += liters;

      const month = log.month;
      if (!monthlyDataMap[month]) {
        monthlyDataMap[month] = { km: 0, fuel: 0, expense: 0 };
      }
      monthlyDataMap[month].km += km;
      monthlyDataMap[month].fuel += log.totalFuelCost;
    });

    const expenseByCategoryMap: { [key: string]: number } = {};
    let totalExpenses = 0;
    filteredData.filteredExpenses.forEach(expense => {
      totalExpenses += expense.cost;
      const month = expense.month;
      if (!monthlyDataMap[month]) {
        monthlyDataMap[month] = { km: 0, fuel: 0, expense: 0 };
      }
      monthlyDataMap[month].expense += expense.cost;

      const category = expense.supplier;
      if(!expenseByCategoryMap[category]) {
        expenseByCategoryMap[category] = 0;
      }
      expenseByCategoryMap[category] += expense.cost;
    });

    const monthlyData = Object.entries(monthlyDataMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const expenseByCategory = Object.entries(expenseByCategoryMap)
        .map(([name, value]) => ({name, value}))
        .sort((a,b) => b.value - a.value);

    const overallAvgKmL = totalLiters > 0 ? totalKm / totalLiters : 0;

    return { totalKm, totalFuelCost, totalExpenses, overallAvgKmL, monthlyData, expenseByCategory };
  }, [filteredData.filteredTruckLogs, filteredData.filteredExpenses]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        {!isPdfMode && (
           <button onClick={() => setShowFilters(!showFilters)} className="text-sm bg-secondary py-2 px-3 rounded-lg hover:bg-slate-500 transition-colors">
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        )}
      </div>
      
      {!isPdfMode && showFilters && (
        <div className="bg-surface p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <select name="month" value={filters.month} onChange={handleFilterChange} className="bg-slate-700 p-2 rounded w-full">
              <option value="">Todo Mês</option>
              {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select name="truckModel" value={filters.truckModel} onChange={handleFilterChange} className="bg-slate-700 p-2 rounded w-full">
              <option value="">Todo Modelo</option>
              {uniqueModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select name="licensePlate" value={filters.licensePlate} onChange={handleFilterChange} className="bg-slate-700 p-2 rounded w-full">
              <option value="">Toda Placa</option>
              {uniquePlates.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select name="supplier" value={filters.supplier} onChange={handleFilterChange} className="bg-slate-700 p-2 rounded w-full">
              <option value="">Todo Fornecedor</option>
              {uniqueSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setFilters(initialFilterState)} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors w-full">
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      {filteredData.filteredTruckLogs.length === 0 && filteredData.filteredExpenses.length === 0 ? (
        <div className="flex items-center justify-center bg-surface p-8 rounded-lg">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Nenhum dado encontrado</h3>
            <p className="text-text-secondary">
              {Object.values(filters).some(v => v !== '') 
                ? 'Tente ajustar os filtros para ver mais dados.'
                : 'Comece adicionando registros de viagens ou despesas.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="KM Rodados (Total)" value={totalKm.toLocaleString('pt-BR')} unit="km" />
          <StatCard title="Custo de Combustível (Total)" value={totalFuelCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <StatCard title="Despesas (Total)" value={totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <StatCard title="Média Geral de Consumo" value={overallAvgKmL.toFixed(2)} unit="km/l" />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Desempenho Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} 
                labelStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{color: '#f8fafc'}}/>
              <Bar dataKey="km" fill="#0284c7" name="KM Rodados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Custos Mensais (Combustível vs. Despesas)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{color: '#f8fafc'}}/>
              <Line type="monotone" dataKey="fuel" stroke="#38bdf8" name="Combustível (R$)" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#f43f5e" name="Despesas (R$)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-lg col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Despesas por Fornecedor</h2>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    />
                    <Legend wrapperStyle={{color: '#f8fafc'}}/>
                </PieChart>
             </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
