import { useState, useEffect, useCallback } from 'react';
import { TruckLog, Expense } from '../types';

// In a real production app, this would be an environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;


export const useFleetData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [truckLogs, setTruckLogs] = useState<TruckLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [trucksResponse, expensesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/truck-logs`),
        fetch(`${API_BASE_URL}/expenses`),
      ]);

      if (!trucksResponse.ok || !expensesResponse.ok) {
        throw new Error('Falha ao carregar dados do servidor. Por favor, verifique se o servidor está rodando.');
      }
      
      const trucksData = await trucksResponse.json();
      const expensesData = await expensesResponse.json();
      
      setTruckLogs(trucksData);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTruckLog = useCallback(async (log: Omit<TruckLog, 'id'>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/truck-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Falha ao adicionar registro de viagem.');
      }
      
      const newLog = await response.json();
      setTruckLogs(prev => [newLog, ...prev]);
      setError(null);
    } catch (error) {
      console.error("Erro ao adicionar registro:", error);
      setError(error instanceof Error ? error.message : 'Erro ao adicionar registro de viagem');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Falha ao adicionar despesa.');
      }
      
      const newExpense = await response.json();
      setExpenses(prev => [newExpense, ...prev]);
      setError(null);
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      setError(error instanceof Error ? error.message : 'Erro ao adicionar despesa');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const deleteTruckLog = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/truck-logs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Falha ao excluir registro de viagem.');
      }
      
      setTruckLogs(prev => prev.filter(log => log.id !== id));
      setError(null);
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
      setError(error instanceof Error ? error.message : 'Erro ao excluir registro de viagem');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Falha ao excluir despesa.');
      }
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      setError(null);
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      setError(error instanceof Error ? error.message : 'Erro ao excluir despesa');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    truckLogs, 
    expenses, 
    addTruckLog, 
    addExpense, 
    deleteTruckLog, 
    deleteExpense,
    isLoading,
    error,
    refetch: fetchData
  };
};
