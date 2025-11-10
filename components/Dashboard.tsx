// components/Dashboard.tsx
import React from 'react';
import { useMemo } from 'react';
import { TruckLog, Expense } from '../types';
import { StatCard } from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TruckIcon, ExpensesIcon } from './icons';

interface DashboardProps {
  truckLogs: TruckLog[];
  expenses: Expense[];
  isPdfMode?: boolean;
}

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#a5f3fc'];

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const Dashboard: React.FC<DashboardProps> = ({ truckLogs, expenses, isPdfMode = false }) => {

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

    truckLogs.forEach(log => {
      const km = log.finalKm - log.initialKm;
      const fuelCost = log.litersFueled * log.fuelPricePerLiter;
      
      totalKm += km;
      totalFuelCost += fuelCost;
      totalLiters += log.litersFueled;

      const month = log.month;
      if (!monthlyDataMap[month]) {
        monthlyDataMap[month] = { km: 0, fuel: 0, expense: 0 };
      }
      monthlyDataMap[month].km += km;
      monthlyDataMap[month].fuel += fuelCost;
    });

    const expenseByCategoryMap: { [key: string]: number } = {};
    let totalExpenses = 0;
    expenses.forEach(expense => {
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
  }, [truckLogs, expenses]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
      
      {truckLogs.length === 0 && expenses.length === 0 ? (
        <div className="flex items-center justify-center bg-surface p-8 rounded-lg">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Nenhum dado encontrado para os filtros aplicados</h3>
            <p className="text-text-secondary">Tente limpar os filtros ou adicione novos registros.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="KM Rodados (Total)" value={`${totalKm.toLocaleString('pt-BR')} km`} icon={<TruckIcon />} color="text-cyan-400" />
            <StatCard title="Custo de Combustível (Total)" value={formatCurrency(totalFuelCost)} icon={<ExpensesIcon />} color="text-amber-400" />
            <StatCard title="Despesas (Total)" value={formatCurrency(totalExpenses)} icon={<ExpensesIcon />} color="text-rose-400" />
            <StatCard title="Média Geral de Consumo" value={`${overallAvgKmL.toFixed(2)} km/l`} icon={<TruckIcon />} color="text-green-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Desempenho Mensal</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} isAnimationActive={!isPdfMode}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} labelStyle={{ color: '#f8fafc' }} />
                  <Legend wrapperStyle={{color: '#f8fafc'}}/>
                  <Bar dataKey="km" fill="#0284c7" name="KM Rodados" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Custos Mensais (Combustível vs. Despesas)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} isAnimationActive={!isPdfMode}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} labelStyle={{ color: '#f8fafc' }} />
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
                        {/* ✅ CORREÇÃO APLICADA AQUI */}
                        <Pie
                            data={expenseByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            isAnimationActive={!isPdfMode} // Desativa a animação principal
                            animationDuration={0} // Força a renderização imediata
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {expenseByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <Legend wrapperStyle={{color: '#f8fafc'}}/>
                    </PieChart>
                 </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
