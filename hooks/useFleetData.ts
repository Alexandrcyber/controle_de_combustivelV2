import { useState, useEffect, useCallback } from 'react';
import { TruckLog, Expense } from '../types';

// In a real production app, this would be an environment variable
const API_BASE_URL = 'http://localhost:3001/api'; 

export const useFleetData = () => {
  const [truckLogs, setTruckLogs] = useState<TruckLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [trucksResponse, expensesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/truck-logs`),
        fetch(`${API_BASE_URL}/expenses`),
      ]);

      if (!trucksResponse.ok || !expensesResponse.ok) {
        throw new Error('Failed to fetch data from the server.');
      }
      
      const trucksData = await trucksResponse.json();
      const expensesData = await expensesResponse.json();
      
      setTruckLogs(trucksData);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // You could set an error state here to display a message in the UI
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTruckLog = useCallback(async (log: Omit<TruckLog, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/truck-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error('Failed to add truck log.');
      const newLog = await response.json();
      setTruckLogs(prev => [newLog, ...prev]);
    } catch (error) {
      console.error("Error adding truck log:", error);
    }
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error('Failed to add expense.');
      const newExpense = await response.json();
      setExpenses(prev => [newExpense, ...prev]);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  }, []);
  
  const deleteTruckLog = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/truck-logs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete truck log.');
      setTruckLogs(prev => prev.filter(log => log.id !== id));
    } catch (error)      {
      console.error("Error deleting truck log:", error);
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense.');
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }, []);

  return { truckLogs, expenses, addTruckLog, addExpense, deleteTruckLog, deleteExpense };
};
