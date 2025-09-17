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

import { supabase } from '../config/supabase';
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionFilters,
} from '../models/transaction.model';
import logger from '../utils/logger';

export class TransactionService {
  async getAllTransactions(
    userId: number,
    filters: TransactionFilters = {}
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      // Validate userId
      if (!userId || userId <= 0) {
        throw new Error('Valid user ID is required');
      }

      const { type, category_id, start_date, end_date, page = 1, limit = 20 } = filters;

      // Validate pagination parameters
      if (page <= 0) {
        throw new Error('Page number must be greater than 0');
      }
      if (limit <= 0 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      let query = supabase
        .from('Transaction')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters with validation
      if (type) {
        if (!['income', 'expense'].includes(type)) {
          throw new Error("Type must be 'income' or 'expense'");
        }
        query = query.eq('type', type);
      }
      if (category_id) {
        const categoryId = typeof category_id === 'string' ? parseInt(category_id) : category_id;
        if (isNaN(categoryId) || categoryId <= 0) {
          throw new Error('Category ID must be a positive integer');
        }
        query = query.eq('category_id', categoryId);
      }
      if (start_date) {
        if (isNaN(Date.parse(start_date))) {
          throw new Error('Start date must be a valid date format');
        }
        query = query.gte('created_at', start_date);
      }
      if (end_date) {
        if (isNaN(Date.parse(end_date))) {
          throw new Error('End date must be a valid date format');
        }
        query = query.lte('created_at', end_date);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Database error getting transactions:', error);
        throw new Error(`Failed to retrieve transactions: ${error.message}`);
      }

      return {
        transactions: data || [],
        total: count || 0,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Error getting transactions:', error);
      if (error instanceof Error) {
        throw error; // Re-throw our custom errors
      }
      throw new Error('Failed to retrieve transactions - unknown error occurred');
    }
  }

  async getTransactionById(transactionId: number, userId: number): Promise<Transaction | null> {
    try {
      // Validate input parameters
      if (!transactionId || transactionId <= 0) {
        throw new Error('Valid transaction ID is required');
      }
      if (!userId || userId <= 0) {
        throw new Error('Valid user ID is required');
      }

      const { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq('transaction_id', transactionId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        logger.error('Database error getting transaction by ID:', error);
        throw new Error(`Failed to retrieve transaction: ${error.message}`);
      }

      return data;
    } catch (error) {
      logger.error('Error getting transaction by ID:', error);
      if (error instanceof Error) {
        throw error; // Re-throw our custom errors
      }
      throw new Error('Failed to retrieve transaction - unknown error occurred');
    }
  }

  async createTransaction(transactionData: CreateTransactionData): Promise<Transaction> {
    try {
      // Validate required fields
      if (!transactionData.category_id) {
        throw new Error('Category ID is required');
      }
      if (!transactionData.type || !['income', 'expense'].includes(transactionData.type)) {
        throw new Error("Transaction type must be 'income' or 'expense'");
      }
      if (!transactionData.amount || transactionData.amount <= 0) {
        throw new Error('Amount must be a positive number');
      }

      const { data, error } = await supabase
        .from('Transaction')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        logger.error('Database error creating transaction:', error);

        // Handle specific database errors
        if (error.code === '23503') {
          if (error.message.includes('category_id')) {
            throw new Error('Invalid category ID - category does not exist');
          }
          if (error.message.includes('user_id')) {
            throw new Error('Invalid user ID - user does not exist');
          }
          throw new Error('Invalid reference - related record does not exist');
        }
        if (error.code === '23505') {
          throw new Error('Duplicate transaction - this transaction already exists');
        }
        if (error.code === '23514') {
          throw new Error('Invalid data - check constraint violation');
        }

        throw new Error(`Failed to create transaction: ${error.message}`);
      }

      if (!data) {
        throw new Error('Transaction was not created - no data returned');
      }

      return data;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      if (error instanceof Error) {
        throw error; // Re-throw our custom errors
      }
      throw new Error('Failed to create transaction - unknown error occurred');
    }
  }

  async updateTransaction(
    transactionId: number,
    userId: number,
    updateData: UpdateTransactionData
  ): Promise<Transaction | null> {
    try {
      // Validate input parameters
      if (!transactionId || transactionId <= 0) {
        throw new Error('Valid transaction ID is required');
      }
      if (!userId || userId <= 0) {
        throw new Error('Valid user ID is required');
      }
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error('Update data is required');
      }

      // Validate update data
      if (updateData.type && !['income', 'expense'].includes(updateData.type)) {
        throw new Error("Transaction type must be 'income' or 'expense'");
      }
      if (updateData.amount !== undefined && updateData.amount <= 0) {
        throw new Error('Amount must be a positive number');
      }

      const { data, error } = await supabase
        .from('Transaction')
        .update(updateData)
        .eq('transaction_id', transactionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows affected - transaction not found or belongs to different user
          return null;
        }

        logger.error('Database error updating transaction:', error);

        // Handle specific database errors
        if (error.code === '23503') {
          if (error.message.includes('category_id')) {
            throw new Error('Invalid category ID - category does not exist');
          }
          throw new Error('Invalid reference - related record does not exist');
        }
        if (error.code === '23514') {
          throw new Error('Invalid data - check constraint violation');
        }

        throw new Error(`Failed to update transaction: ${error.message}`);
      }

      return data;
    } catch (error) {
      logger.error('Error updating transaction:', error);
      if (error instanceof Error) {
        throw error; // Re-throw our custom errors
      }
      throw new Error('Failed to update transaction - unknown error occurred');
    }
  }

  async deleteTransaction(transactionId: number, userId: number): Promise<boolean> {
    try {
      // Validate input parameters
      if (!transactionId || transactionId <= 0) {
        throw new Error('Valid transaction ID is required');
      }
      if (!userId || userId <= 0) {
        throw new Error('Valid user ID is required');
      }

      const { data, error } = await supabase
        .from('Transaction')
        .delete()
        .eq('transaction_id', transactionId)
        .eq('user_id', userId)
        .select();

      if (error) {
        logger.error('Database error deleting transaction:', error);
        throw new Error(`Failed to delete transaction: ${error.message}`);
      }

      if (!data || data.length === 0) {
        // No rows deleted - transaction not found or belongs to different user
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      if (error instanceof Error) {
        throw error; // Re-throw our custom errors
      }
      throw new Error('Failed to delete transaction - unknown error occurred');
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
      logger.error('Error getting recent transactions:', error);
      throw error;
    }
  }

  async getTransactionsSummary(
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    total_income: number;
    total_expense: number;
    balance: number;
  }> {
    try {
      let query = supabase.from('Transaction').select('type, amount').eq('user_id', userId);

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
      logger.error('Error getting transactions summary:', error);
      throw error;
    }
  }

  async getTransactionsByCategory(
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<
    {
      category_id: number;
      category_name: string;
      total_income: number;
      total_expense: number;
    }[]
  > {
    try {
      let query = supabase
        .from('Transaction')
        .select(
          `
          category_id,
          type,
          amount,
          Category (
            category_name
          )
        `
        )
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data || []).forEach((transaction: any) => {
        const categoryId = transaction.category_id;
        const categoryName = transaction.Category?.category_name || 'Unknown';

        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            category_id: categoryId,
            category_name: categoryName,
            total_income: 0,
            total_expense: 0,
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
      logger.error('Error getting transactions by category:', error);
      throw error;
    }
  }

  /**
   * Get financial summary for user
   * Calculates total income, expense, and balance with optional date filtering
   */
  async getFinancialSummary(
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    total_income: number;
    total_expense: number;
    balance: number;
  }> {
    try {
      let query = supabase.from('Transaction').select('type, amount').eq('user_id', userId);

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
      logger.error('Error getting financial summary:', error);
      throw error;
    }
  }

  /**
   * Get analytics breakdown by category
   * Returns spending and income analysis grouped by categories
   */
  async getAnalyticsByCategory(
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<
    Array<{
      category_id: number;
      category_name: string;
      total_income: number;
      total_expense: number;
    }>
  > {
    try {
      let query = supabase
        .from('Transaction')
        .select(
          `
          category_id,
          type,
          amount,
          Category (
            category_name
          )
        `
        )
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const categoryName = (transaction as any).Category?.category_name || 'Unknown';

        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            category_id: categoryId,
            category_name: categoryName,
            total_income: 0,
            total_expense: 0,
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
      logger.error('Error getting analytics by category:', error);
      throw error;
    }
  }
}
