/**
 * Budget Service
 *
 * Business logic layer for budget management in Budget Buddy.
 * Handles budget planning, tracking, and analysis operations for users.
 * Budgets help users set spending limits            return data;
    } catch (error) {
      logger.error('Error getting budgets with spending:', error);
      throw error;rn data;
          return data && data.length > 0;
    } catch (error) {
      logger.error('Error finding existing budget:', error);
      throw error;tch (error) {
      logger.error('Error creating budget:', error);
      throw error;category and monitor their financial goals.
 *
 * Key Features:
 * - User-scoped budget management (users can only access their own budgets)
 * - Monthly budget cycles with YYYY-MM format
 * - Category-based budget allocation
 * - Budget filtering by month and category
 * - CRUD operations for budget management
 * - Budget analysis and spending tracking
 * - Duplicate prevention (one budget per category per month)
 *
 * Business Rules:
 * - Each user can have one budget per category per month
 * - Budget amounts must be positive values
 * - Budget cycles are monthly-based for consistent tracking
 */

import { supabase } from '../config/supabase';
import {
  Budget,
  CreateBudgetData,
  UpdateBudgetData,
  BudgetFilters,
  BudgetWithCategory,
} from '../models/budget.model';
import logger from '../utils/logger';

export class BudgetService {
  /**
   * Retrieve all budgets for a user with optional filtering
   * Supports filtering by month and category for targeted budget views
   *
   * @param userId - The ID of the user whose budgets to retrieve
   * @param filters - Optional filters for cycle_month and category_id
   * @returns Array of budget records matching the criteria
   */
  async getAllBudgets(userId: number, filters: BudgetFilters = {}): Promise<Budget[]> {
    try {
      const { cycle_month, category_id } = filters;

      let query = supabase
        .from('Budget')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (cycle_month) {
        // หากได้รับ cycle_month ในรูปแบบ YYYY-MM ให้ค้นหาทุกวันในเดือนนั้น
        if (cycle_month.match(/^\d{4}-\d{2}$/)) {
          // ค้นหาทุกวันในเดือนนั้น เช่น 2025-12 จะค้นหา 2025-12-01 ถึง 2025-12-31
          const startDate = `${cycle_month}-01`;
          const year = parseInt(cycle_month.substring(0, 4));
          const month = parseInt(cycle_month.substring(5, 7));
          const lastDay = new Date(year, month, 0).getDate();
          const endDate = `${cycle_month}-${lastDay.toString().padStart(2, '0')}`;

          query = query.gte('cycle_month', startDate).lte('cycle_month', endDate);
        } else {
          // หากเป็น full date format แล้ว
          query = query.eq('cycle_month', cycle_month);
        }
      }
      if (category_id) {
        query = query.eq('category_id', category_id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting budgets:', error);
      throw error;
    }
  }

  /**
   * Retrieve a specific budget by ID
   * Ensures user can only access their own budgets through user_id validation
   *
   * @param budgetId - The ID of the budget to retrieve
   * @param userId - The ID of the user (for security validation)
   * @returns Budget object if found and belongs to user, null otherwise
   */
  async getBudgetById(budgetId: number, userId: number): Promise<Budget | null> {
    try {
      const { data, error } = await supabase
        .from('Budget')
        .select('*')
        .eq('budget_id', budgetId)
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
      logger.error('Error getting budget by ID:', error);
      throw error;
    }
  }

  async createBudget(budgetData: CreateBudgetData): Promise<Budget> {
    try {
      // Validate required fields
      if (!budgetData.category_id) {
        throw new Error('Category ID is required');
      }
      if (!budgetData.budget_amount || budgetData.budget_amount <= 0) {
        throw new Error('Budget amount must be a positive number');
      }
      if (!budgetData.cycle_month) {
        throw new Error('Budget cycle month is required');
      }
      // if (!budgetData.cycle_month.match(/^\d{4}-\d{2}$/)) {
      //   throw new Error("Budget cycle month must be in YYYY-MM format");
      // }

      // Check if budget already exists for this user, category, and cycle_month
      const existingBudget = await this.findExistingBudget(
        budgetData.user_id,
        budgetData.category_id,
        budgetData.cycle_month
      );

      if (existingBudget) {
        throw new Error('Budget already exists for this category and month');
      }

      const { data, error } = await supabase.from('Budget').insert([budgetData]).select().single();

      if (error) {
        logger.error('Database error creating budget:', error);

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
          throw new Error('Duplicate budget - budget already exists for this category and month');
        }
        if (error.code === '23514') {
          throw new Error('Invalid data - check constraint violation');
        }

        throw new Error(`Failed to create budget: ${error.message}`);
      }

      if (!data) {
        throw new Error('Budget was not created - no data returned');
      }

      return data;
    } catch (error) {
      logger.error('Error creating budget:', error);
      if (error instanceof Error) {
        throw error; // Re-throw our custom errors
      }
      throw new Error('Failed to create budget - unknown error occurred');
    }
  }

  async updateBudget(
    budgetId: number,
    userId: number,
    updateData: UpdateBudgetData
  ): Promise<Budget | null> {
    try {
      const { data, error } = await supabase
        .from('Budget')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('budget_id', budgetId)
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
      logger.error('Error updating budget:', error);
      throw error;
    }
  }

  async deleteBudget(budgetId: number, userId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('Budget')
        .delete()
        .eq('budget_id', budgetId)
        .eq('user_id', userId)
        .select();

      if (error) {
        throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      logger.error('Error deleting budget:', error);
      throw error;
    }
  }

  private async findExistingBudget(
    userId: number,
    categoryId: number,
    cycleMonth: string
  ): Promise<Budget | null> {
    try {
      let query = supabase
        .from('Budget')
        .select('*')
        .eq('user_id', userId)
        .eq('category_id', categoryId);

      // หากได้รับ cycle_month ในรูปแบบ YYYY-MM ให้ค้นหาทุกวันในเดือนนั้น
      if (cycleMonth.match(/^\d{4}-\d{2}$/)) {
        const startDate = `${cycleMonth}-01`;
        const year = parseInt(cycleMonth.substring(0, 4));
        const month = parseInt(cycleMonth.substring(5, 7));
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${cycleMonth}-${lastDay.toString().padStart(2, '0')}`;

        query = query.gte('cycle_month', startDate).lte('cycle_month', endDate);
      } else {
        query = query.eq('cycle_month', cycleMonth);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error finding existing budget:', error);
      throw error;
    }
  }

  async getBudgetsWithSpending(
    userId: number,
    cycleMonth: string
  ): Promise<
    {
      budget_id: number;
      category_id: number;
      category_name: string;
      budget_amount: number;
      spent_amount: number;
      remaining_amount: number;
      percentage_used: number;
    }[]
  > {
    try {
      // Get budgets for the specified month
      const { data: budgets, error: budgetError } = await supabase
        .from('Budget')
        .select(
          `
          budget_id,
          category_id,
          budget_amount,
          Category (
            category_name
          )
        `
        )
        .eq('user_id', userId)
        .eq('cycle_month', cycleMonth);

      if (budgetError) {
        throw budgetError;
      }

      if (!budgets || budgets.length === 0) {
        return [];
      }

      // Get spending for each category in the specified month
      const startDate = `${cycleMonth}-01`;
      const endDate = `${cycleMonth}-31`;

      const results = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        budgets.map(async (budget: any) => {
          // Cast to proper type for processing
          const budgetWithCategory: BudgetWithCategory = {
            budget_id: budget.budget_id,
            category_id: budget.category_id,
            budget_amount: budget.budget_amount,
            Category: {
              category_name: budget.Category[0]?.category_name || '',
            },
          };

          const { data: transactions, error: transactionError } = await supabase
            .from('Transaction')
            .select('amount')
            .eq('user_id', userId)
            .eq('category_id', budgetWithCategory.category_id)
            .eq('type', 'expense')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

          if (transactionError) {
            throw transactionError;
          }

          const spentAmount = (transactions || []).reduce(
            (sum, transaction) => sum + transaction.amount,
            0
          );

          const remainingAmount = budgetWithCategory.budget_amount - spentAmount;
          const percentageUsed =
            budgetWithCategory.budget_amount > 0
              ? (spentAmount / budgetWithCategory.budget_amount) * 100
              : 0;

          return {
            budget_id: budgetWithCategory.budget_id,
            category_id: budgetWithCategory.category_id,
            category_name: budgetWithCategory.Category?.category_name || 'Unknown',
            budget_amount: budgetWithCategory.budget_amount,
            spent_amount: spentAmount,
            remaining_amount: remainingAmount,
            percentage_used: Math.round(percentageUsed * 100) / 100,
          };
        })
      );

      return results;
    } catch (error) {
      logger.error('Error getting budgets with spending:', error);
      throw error;
    }
  }

  async getBudgetOverview(userId: number): Promise<{
    total_budgets: number;
    total_budget_amount: number;
    budgets_over_limit: number;
    average_utilization: number;
  }> {
    try {
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select(
          `
          *,
          transactions!inner(amount)
        `
        )
        .eq('user_id', userId);

      if (error) {
        logger.error('Error getting budget overview:', error);
        throw new Error(`Failed to get budget overview: ${error.message}`);
      }

      if (!budgets || budgets.length === 0) {
        return {
          total_budgets: 0,
          total_budget_amount: 0,
          budgets_over_limit: 0,
          average_utilization: 0,
        };
      }

      // Calculate spending for each budget
      const budgetOverview = budgets.map(budget => {
        const spending =
          budget.transactions
            ?.filter((t: { amount: number }) => t.amount < 0) // Only expense transactions
            .reduce((sum: number, t: { amount: number }) => sum + Math.abs(t.amount), 0) || 0;

        return {
          ...budget,
          spending,
          utilization: budget.amount > 0 ? (spending / budget.amount) * 100 : 0,
        };
      });

      const totalBudgets = budgetOverview.length;
      const totalBudgetAmount = budgetOverview.reduce((sum, b) => sum + b.amount, 0);
      const budgetsOverLimit = budgetOverview.filter(b => b.utilization > 100).length;
      const averageUtilization =
        totalBudgets > 0
          ? budgetOverview.reduce((sum, b) => sum + b.utilization, 0) / totalBudgets
          : 0;

      return {
        total_budgets: totalBudgets,
        total_budget_amount: totalBudgetAmount,
        budgets_over_limit: budgetsOverLimit,
        average_utilization: Math.round(averageUtilization * 100) / 100,
      };
    } catch (error) {
      logger.error('Error getting budget overview:', error);
      throw error;
    }
  }
}
