import { supabase } from "../config/supabase";
import { Budget, CreateBudgetData, UpdateBudgetData, BudgetFilters } from "../models/budget.model";

export class BudgetService {
  async getAllBudgets(userId: number, filters: BudgetFilters = {}): Promise<Budget[]> {
    try {
      const { cycle_month, category_id } = filters;
      
      let query = supabase
        .from('Budget')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (cycle_month) {
        query = query.eq('cycle_month', cycle_month);
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
      console.error("Error getting budgets:", error);
      throw error;
    }
  }

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
      console.error("Error getting budget by ID:", error);
      throw error;
    }
  }

  async createBudget(budgetData: CreateBudgetData): Promise<Budget> {
    try {
      // Check if budget already exists for this user, category, and cycle_month
      const existingBudget = await this.findExistingBudget(
        budgetData.user_id,
        budgetData.category_id,
        budgetData.cycle_month
      );

      if (existingBudget) {
        throw new Error('Budget already exists for this category and month');
      }

      const { data, error } = await supabase
        .from('Budget')
        .insert([budgetData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  }

  async updateBudget(budgetId: number, userId: number, updateData: UpdateBudgetData): Promise<Budget | null> {
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
      console.error("Error updating budget:", error);
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

      return (data && data.length > 0);
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  }

  private async findExistingBudget(userId: number, categoryId: number, cycleMonth: string): Promise<Budget | null> {
    try {
      const { data, error } = await supabase
        .from('Budget')
        .select('*')
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .eq('cycle_month', cycleMonth)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error finding existing budget:", error);
      throw error;
    }
  }

  async getBudgetsWithSpending(userId: number, cycleMonth: string): Promise<{
    budget_id: number,
    category_id: number,
    category_name: string,
    budget_amount: number,
    spent_amount: number,
    remaining_amount: number,
    percentage_used: number
  }[]> {
    try {
      // Get budgets for the specified month
      const { data: budgets, error: budgetError } = await supabase
        .from('Budget')
        .select(`
          budget_id,
          category_id,
          budget_amount,
          Category (
            category_name
          )
        `)
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
        budgets.map(async (budget: any) => {
          const { data: transactions, error: transactionError } = await supabase
            .from('Transaction')
            .select('amount')
            .eq('user_id', userId)
            .eq('category_id', budget.category_id)
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

          const remainingAmount = budget.budget_amount - spentAmount;
          const percentageUsed = budget.budget_amount > 0 
            ? (spentAmount / budget.budget_amount) * 100 
            : 0;

          return {
            budget_id: budget.budget_id,
            category_id: budget.category_id,
            category_name: budget.Category?.category_name || 'Unknown',
            budget_amount: budget.budget_amount,
            spent_amount: spentAmount,
            remaining_amount: remainingAmount,
            percentage_used: Math.round(percentageUsed * 100) / 100
          };
        })
      );

      return results;
    } catch (error) {
      console.error("Error getting budgets with spending:", error);
      throw error;
    }
  }
}