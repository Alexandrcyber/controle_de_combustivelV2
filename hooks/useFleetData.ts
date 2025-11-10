// hooks/useFleetData.ts
import { useState, useEffect, useCallback } from 'react';
import { TruckLog, Expense } from '../types';

// ✅ --- INÍCIO DA CORREÇÃO ---
// Lê a URL base da API a partir das variáveis de ambiente do Vite.
// O Vite substitui 'import.meta.env.VITE_API_URL' pelo valor que você configurou no Netlify.
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
// ✅ --- FIM DA CORREÇÃO ---

// Validação: Garante que a variável de ambiente foi carregada.
if (!import.meta.env.VITE_API_URL) {
  throw new Error("A variável de ambiente VITE_API_URL não está definida. Verifique seu arquivo .env ou as configurações do Netlify.");
}

export const useFleetData = () => {
  const [truckLogs, setTruckLogs] = useState<TruckLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // As requisições agora usarão a URL correta vinda do Netlify
      const [truckLogsResponse, expensesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/truck-logs`),
        fetch(`${API_BASE_URL}/expenses`)
      ]);

      if (!truckLogsResponse.ok) {
        throw new Error(`Falha ao buscar registros de viagem: ${truckLogsResponse.statusText}`);
      }
      if (!expensesResponse.ok) {
        throw new Error(`Falha ao buscar despesas: ${expensesResponse.statusText}`);
      }

      const truckLogsData = await truckLogsResponse.json();
      const expensesData = await expensesResponse.json();

      setTruckLogs(truckLogsData);
      setExpenses(expensesData);

    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || 'Ocorreu um erro desconhecido ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // As funções de adicionar/deletar não precisam de mudança,
  // pois elas já dependem da `fetchData` ou usarão a `API_BASE_URL` que agora está correta.
  const addTruckLog = async (log: Omit<TruckLog, 'id'>) => {
    // ... sua lógica
    await fetchData();
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    // ... sua lógica
    await fetchData();
  };

  const deleteTruckLog = async (id: string) => {
    // ... sua lógica
    await fetchData();
  };
  
  const deleteExpense = async (id: string) => {
    // ... sua lógica
    await fetchData();
  };

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
