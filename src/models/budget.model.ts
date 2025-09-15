export interface Budget {
  budget_id: number;
  user_id: number;
  category_id: number;
  budget_amount: number;
  created_at: string;
  updated_at: string;
  cycle_month: string; // YYYY-MM format
}

export interface CreateBudgetData {
  user_id: number;
  category_id: number;
  budget_amount: number;
  cycle_month: string; // YYYY-MM format
}

export interface UpdateBudgetData {
  budget_amount?: number;
  cycle_month?: string;
}

export interface BudgetFilters {
  cycle_month?: string;
  category_id?: number;
}