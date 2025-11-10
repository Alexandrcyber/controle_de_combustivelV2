// hooks/useFleetData.ts
import { useState, useEffect, useCallback } from 'react';
import { TruckLog, Expense } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

if (!import.meta.env.VITE_API_URL) {
  throw new Error("A variável de ambiente VITE_API_URL não está definida.");
}

export const useFleetData = () => {
  const [truckLogs, setTruckLogs] = useState<TruckLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Não precisa mudar o estado de loading aqui se já for feito no início
    try {
      const [truckLogsResponse, expensesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/truck-logs`),
        fetch(`${API_BASE_URL}/expenses`)
      ]);

      if (!truckLogsResponse.ok) throw new Error(`Falha ao buscar registros: ${truckLogsResponse.statusText}`);
      if (!expensesResponse.ok) throw new Error(`Falha ao buscar despesas: ${expensesResponse.statusText}`);

      const truckLogsData = await truckLogsResponse.json();
      const expensesData = await expensesResponse.json();

      setTruckLogs(truckLogsData);
      setExpenses(expensesData);

    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ --- INÍCIO DA CORREÇÃO ---

  const addTruckLog = async (log: Omit<TruckLog, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/truck-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error('Falha ao adicionar registro de frota.');
      await fetchData(); // Recarrega os dados para mostrar o novo item
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error('Falha ao adicionar despesa.');
      await fetchData(); // Recarrega os dados
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTruckLog = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/truck-logs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao deletar registro de frota.');
      await fetchData(); // Recarrega os dados para remover o item da UI
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao deletar despesa.');
      await fetchData(); // Recarrega os dados
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ --- FIM DA CORREÇÃO ---

  return { 
    truckLogs, 
    expenses, 
    isLoading, 
    error,
    addTruckLog,
    addExpense,
    deleteTruckLog,
    deleteExpense
  };
};
