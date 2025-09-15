/**
 * Transaction Service
 * 
 * Business logic layer for transaction management in Budget Buddy.
 * Handles all database operations related to financial transactions including:
 * 
 * Features:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Advanced filtering by date, category, type, and amount
 * - Pagination support for large datasets
 * - User-scoped data access (users can only access their own transactions)
 * - Data validation and error handling
 * - Database transaction integrity
 * 
 * This service acts as an abstraction layer between controllers and the database,
 * ensuring clean separation of concerns and reusable business logic.
 */

import { supabase } from "../config/supabase";
import { 
  Transaction, 
  CreateTransactionData, 
  UpdateTransactionData, 
  TransactionFilters 
} from "../models/transaction.model";

export class TransactionService {
  async getAllTransactions(userId: number, filters: TransactionFilters = {}): Promise<{
    transactions: Transaction[],
    total: number,
    page: number,
    limit: number
  }> {
    try {
      const { type, category_id, start_date, end_date, page = 1, limit = 20 } = filters;
      
      let query = supabase
        .from('Transaction')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (type) {
        query = query.eq('type', type);
      }
      if (category_id) {
        query = query.eq('category_id', category_id);
      }
      if (start_date) {
        query = query.gte('created_at', start_date);
      }
      if (end_date) {
        query = query.lte('created_at', end_date);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        transactions: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error("Error getting transactions:", error);
      throw error;
    }
  }

  async getTransactionById(transactionId: number, userId: number): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq('transaction_id', transactionId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error getting transaction by ID:", error);
      throw error;
    }
  }

  async createTransaction(transactionData: CreateTransactionData): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async updateTransaction(transactionId: number, userId: number, updateData: UpdateTransactionData): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .update(updateData)
        .eq('transaction_id', transactionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }

  async deleteTransaction(transactionId: number, userId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .delete()
        .eq('transaction_id', transactionId)
        .eq('user_id', userId)
        .select();

      if (error) {
        throw error;
      }

      return (data && data.length > 0);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  async getRecentTransactions(userId: number, limit: number = 10): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error getting recent transactions:", error);
      throw error;
    }
  }

  async getTransactionsSummary(userId: number, startDate?: string, endDate?: string): Promise<{
    total_income: number,
    total_expense: number,
    balance: number
  }> {
    try {
      let query = supabase
        .from('Transaction')
        .select('type, amount')
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const summary = (data || []).reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.total_income += transaction.amount;
          } else if (transaction.type === 'expense') {
            acc.total_expense += transaction.amount;
          }
          return acc;
        },
        { total_income: 0, total_expense: 0, balance: 0 }
      );

      summary.balance = summary.total_income - summary.total_expense;

      return summary;
    } catch (error) {
      console.error("Error getting transactions summary:", error);
      throw error;
    }
  }

  async getTransactionsByCategory(userId: number, startDate?: string, endDate?: string): Promise<{
    category_id: number,
    category_name: string,
    total_income: number,
    total_expense: number
  }[]> {
    try {
      let query = supabase
        .from('Transaction')
        .select(`
          category_id,
          type,
          amount,
          Category (
            category_name
          )
        `)
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Group by category
      const categoryMap = new Map();
      
      (data || []).forEach((transaction: any) => {
        const categoryId = transaction.category_id;
        const categoryName = transaction.Category?.category_name || 'Unknown';
        
        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            category_id: categoryId,
            category_name: categoryName,
            total_income: 0,
            total_expense: 0
          });
        }

        const category = categoryMap.get(categoryId);
        if (transaction.type === 'income') {
          category.total_income += transaction.amount;
        } else if (transaction.type === 'expense') {
          category.total_expense += transaction.amount;
        }
      });

      return Array.from(categoryMap.values());
    } catch (error) {
      console.error("Error getting transactions by category:", error);
      throw error;
    }
  }

  /**
   * Get financial summary for user
   * Calculates total income, expense, and balance with optional date filtering
   */
  async getFinancialSummary(userId: number, startDate?: string, endDate?: string): Promise<{
    total_income: number,
    total_expense: number,
    balance: number
  }> {
    try {
      let query = supabase
        .from('Transaction')
        .select('type, amount')
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data: transactions, error } = await query;

      if (error) {
        throw error;
      }

      const summary = transactions?.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.total_income += transaction.amount;
          } else if (transaction.type === 'expense') {
            acc.total_expense += transaction.amount;
          }
          return acc;
        },
        { total_income: 0, total_expense: 0, balance: 0 }
      ) || { total_income: 0, total_expense: 0, balance: 0 };

      summary.balance = summary.total_income - summary.total_expense;

      return summary;
    } catch (error) {
      console.error("Error getting financial summary:", error);
      throw error;
    }
  }

  /**
   * Get analytics breakdown by category
   * Returns spending and income analysis grouped by categories
   */
  async getAnalyticsByCategory(userId: number, startDate?: string, endDate?: string): Promise<Array<{
    category_id: number,
    category_name: string,
    total_income: number,
    total_expense: number
  }>> {
    try {
      let query = supabase
        .from('Transaction')
        .select(`
          category_id,
          type,
          amount,
          Category (
            category_name
          )
        `)
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data: transactions, error } = await query;

      if (error) {
        throw error;
      }

      // Group by category and calculate totals
      const categoryMap = new Map();

      transactions?.forEach(transaction => {
        const categoryId = transaction.category_id;
        const categoryName = (transaction as any).Category?.category_name || 'Unknown';

        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            category_id: categoryId,
            category_name: categoryName,
            total_income: 0,
            total_expense: 0
          });
        }

        const category = categoryMap.get(categoryId);
        if (transaction.type === 'income') {
          category.total_income += transaction.amount;
        } else if (transaction.type === 'expense') {
          category.total_expense += transaction.amount;
        }
      });

      return Array.from(categoryMap.values());
    } catch (error) {
      console.error("Error getting analytics by category:", error);
      throw error;
    }
  }
}