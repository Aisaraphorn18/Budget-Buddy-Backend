/**
 * Budget Controller
 * 
 * HTTP request handler for budget management endpoints in Budget Buddy.
 * Manages budget planning, tracking, and analysis operations for users.
 * Budgets help users set spending limits and monitor financial goals.
 * 
 * Key Features:
 * - Complete CRUD operations for budgets
 * - Monthly budget cycle management (YYYY-MM format)
 * - Category-based budget filtering
 * - User-scoped access control (users can only access their own budgets)
 * - Duplicate prevention (one budget per category per month)
 * - Input validation and sanitization
 * - Proper error handling and HTTP status codes
 * 
 * Security:
 * - JWT authentication required for all operations
 * - User isolation (userId validation from JWT token)
 * - Budget ownership validation for updates/deletes
 */

import { BudgetService } from "../services/budget.service";
import { BudgetFilters } from "../models/budget.model";

export class BudgetController {
  private budgetService: BudgetService;

  constructor() {
    this.budgetService = new BudgetService();
  }

  /**
   * Get all budgets for authenticated user
   * Supports filtering by cycle_month and category_id
   * 
   * @param context - Elysia context with user info and query parameters
   * @returns Array of budget records matching the criteria
   */
  async getAllBudgets(context: any) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const filters: BudgetFilters = {
        cycle_month: context.query.cycle_month,
        category_id: context.query.category_id ? parseInt(context.query.category_id) : undefined
      };

      const budgets = await this.budgetService.getAllBudgets(userId, filters);

      return {
        success: true,
        message: "Budgets retrieved successfully",
        data: budgets
      };
    } catch (error) {
      console.error("Get all budgets error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get budgets",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getBudgetById(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const budgetId = parseInt(context.params.id);
      
      if (isNaN(budgetId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid budget ID"
        };
      }

      const budget = await this.budgetService.getBudgetById(budgetId, userId);
      
      if (!budget) {
        context.set.status = 404;
        return {
          success: false,
          message: "Budget not found"
        };
      }

      return {
        success: true,
        message: "Budget retrieved successfully",
        data: budget
      };
    } catch (error) {
      console.error("Get budget by ID error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get budget",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async createBudget(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const { category_id, budget_amount, cycle_month } = context.body;

      const budgetData = {
        user_id: userId,
        category_id,
        budget_amount,
        cycle_month
      };

      const budget = await this.budgetService.createBudget(budgetData);

      context.set.status = 201;
      return {
        success: true,
        message: "Budget created successfully",
        data: budget
      };
    } catch (error) {
      console.error("Create budget error:", error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        context.set.status = 409;
        return {
          success: false,
          message: "Budget already exists for this category and month"
        };
      }

      context.set.status = 500;
      return {
        success: false,
        message: "Failed to create budget",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async updateBudget(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const budgetId = parseInt(context.params.id);
      
      if (isNaN(budgetId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid budget ID"
        };
      }

      const updateData = context.body;
      const budget = await this.budgetService.updateBudget(budgetId, userId, updateData);
      
      if (!budget) {
        context.set.status = 404;
        return {
          success: false,
          message: "Budget not found"
        };
      }

      return {
        success: true,
        message: "Budget updated successfully",
        data: budget
      };
    } catch (error) {
      console.error("Update budget error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to update budget",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async deleteBudget(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const budgetId = parseInt(context.params.id);
      
      if (isNaN(budgetId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid budget ID"
        };
      }

      const deleted = await this.budgetService.deleteBudget(budgetId, userId);
      
      if (!deleted) {
        context.set.status = 404;
        return {
          success: false,
          message: "Budget not found"
        };
      }

      return {
        success: true,
        message: "Budget deleted successfully"
      };
    } catch (error) {
      console.error("Delete budget error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to delete budget",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}