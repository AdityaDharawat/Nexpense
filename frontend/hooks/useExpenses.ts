import { useEffect, useState } from "react";
import { useExpenseStore } from "../store";
import { apiService } from "../services/api";
import type { Expense, ExpenseForm, ExpenseFilters } from "../types";
import toast from "react-hot-toast";

export function useExpenses(filters?: ExpenseFilters) {
  const { expenses, total, page, limit, isLoading, setExpenses, setLoading } = useExpenseStore();

  const fetchExpenses = async (filters?: ExpenseFilters) => {
    try {
      setLoading(true);
      const response = await apiService.getExpenses(filters);
      setExpenses(response.data.items, response.data.total, response.data.page, response.data.limit);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(filters);
  }, [filters?.page, filters?.limit, filters?.status, filters?.category, filters?.search]);

  const createExpense = async (data: {
    title: string;
    description?: string;
    amount: number;
    category: string;
    receipt?: File;
  }) => {
    try {
      const response = await apiService.createExpense(data);
      toast.success("Expense created successfully!");
      fetchExpenses(filters); // Refresh the list
      return response.data.expense;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create expense");
      throw error;
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseForm>) => {
    try {
      await apiService.updateExpense(id, data);
      toast.success("Expense updated successfully!");
      fetchExpenses(filters); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update expense");
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await apiService.deleteExpense(id);
      toast.success("Expense deleted successfully!");
      fetchExpenses(filters); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete expense");
      throw error;
    }
  };

  return {
    expenses,
    total,
    page,
    limit,
    isLoading,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: () => fetchExpenses(filters),
  };
}

export function useAllExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = async (filters?: ExpenseFilters) => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllExpenses(filters);
      setExpenses(response.data.items);
      setTotal(response.data.total);
      setPage(response.data.page);
      setLimit(response.data.limit);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(filters);
  }, [filters?.page, filters?.limit, filters?.status, filters?.category, filters?.search]);

  const approveExpense = async (id: string, status: "APPROVED" | "REJECTED", remark?: string) => {
    try {
      await apiService.approveExpense(id, status, remark);
      toast.success(`Expense ${status.toLowerCase()} successfully!`);
      fetchExpenses(filters); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update expense status");
      throw error;
    }
  };

  return {
    expenses,
    total,
    page,
    limit,
    isLoading,
    approveExpense,
    refetch: () => fetchExpenses(filters),
  };
}
