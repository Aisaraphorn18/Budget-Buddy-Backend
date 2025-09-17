/**
 * Budget Model Interfaces
 *
 * Type definitions for budget management in Budget Buddy.
 * Budgets help users set spending limits for different categories
 * and track their financial goals over monthly cycles.
 *
 * Key Features:
 * - Monthly budget cycles (YYYY-MM format)
 * - Category-specific budget allocation
 * - User-scoped budget isolation
 * - Flexible budget amount management
 * - Update tracking with timestamps
 * - Filtering support for queries
 */

/**
 * Complete budget record
 * Represents a budget allocation for a specific category and month
 */
export interface Budget {
  budget_id: number;
  user_id: number;
  category_id: number;
  budget_amount: number; // Allocated budget amount
  created_at: string; // ISO timestamp of creation
  updated_at: string; // ISO timestamp of last update
  cycle_month: string; // Budget cycle in YYYY-MM format
}

/**
 * Data required to create a new budget
 * Used for budget creation endpoint validation
 */
export interface CreateBudgetData {
  user_id: number;
  category_id: number;
  budget_amount: number;
  cycle_month: string; // YYYY-MM format (e.g., "2024-01")
}

/**
 * Data for updating existing budget
 * All fields are optional to support partial updates
 */
export interface UpdateBudgetData {
  budget_amount?: number;
  cycle_month?: string;
}

/**
 * Filtering options for budget queries
 * Supports filtering by time period and category
 */
export interface BudgetFilters {
  cycle_month?: string; // Filter by specific month (YYYY-MM)
  category_id?: number; // Filter by category
}
