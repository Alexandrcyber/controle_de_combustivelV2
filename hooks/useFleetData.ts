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
    try {
      const [truckLogsResponse, expensesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/truck-logs`),
        fetch(`${API_BASE_URL}/expenses`)
      ]);
      if (!truckLogsResponse.ok) throw new Error('Falha ao buscar registros.');
      if (!expensesResponse.ok) throw new Error('Falha ao buscar despesas.');
      const truckLogsData = await truckLogsResponse.json();
      const expensesData = await expensesResponse.json();
      setTruckLogs(truckLogsData);
      setExpenses(expensesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTruckLog = async (log: Omit<TruckLog, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/truck-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error('Falha ao adicionar registro.');
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ NOVA FUNÇÃO DE ATUALIZAÇÃO
  const updateTruckLog = async (id: string, log: Partial<Omit<TruckLog, 'id'>>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/truck-logs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error('Falha ao atualizar registro.');
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTruckLog = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/truck-logs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao deletar registro.');
      await fetchData();
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
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ NOVA FUNÇÃO DE ATUALIZAÇÃO
  const updateExpense = async (id: string, expense: Partial<Omit<Expense, 'id'>>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error('Falha ao atualizar despesa.');
      await fetchData();
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
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { 
    truckLogs, 
    expenses, 
    isLoading, 
    error,
    addTruckLog,
    updateTruckLog, // ✅ Exporta a nova função
    deleteTruckLog,
    addExpense,
    updateExpense, // ✅ Exporta a nova função
    deleteExpense
  };
};
