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

import { BudgetService } from '../services/budget.service';
import type { AuthContext } from '../types/elysia.types';
import type { CreateBudgetData, UpdateBudgetData } from '../models/budget.model';
import { BudgetFilters } from '../models/budget.model';
import logger from '../utils/logger';

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
  async getAllBudgets(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const filters: BudgetFilters = {
        cycle_month: Array.isArray(context.query.cycle_month)
          ? context.query.cycle_month[0]
          : context.query.cycle_month,
        category_id: context.query.category_id
          ? parseInt(
              Array.isArray(context.query.category_id)
                ? context.query.category_id[0]
                : context.query.category_id
            )
          : undefined,
      };

      const budgets = await this.budgetService.getAllBudgets(userId, filters);

      return {
        success: true,
        message: 'Budgets retrieved successfully',
        data: budgets,
      };
    } catch (error) {
      logger.error('Get all budgets error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to get budgets',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getBudgetById(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const budgetId = parseInt(context.params.id);

      if (isNaN(budgetId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid budget ID',
        };
      }

      const budget = await this.budgetService.getBudgetById(budgetId, userId);

      if (!budget) {
        context.set.status = 404;
        return {
          success: false,
          message: 'Budget not found',
        };
      }

      return {
        success: true,
        message: 'Budget retrieved successfully',
        data: budget,
      };
    } catch (error) {
      logger.error('Get budget by ID error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to get budget',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createBudget(context: AuthContext) {
    try {
      logger.info('🔍 Budget - Creating budget...');
      logger.info('🔍 Budget - Context user:', context.user);

      const userId = context.user?.user_id;
      if (!userId) {
        logger.info('❌ Budget - No user ID found');
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      logger.info('🔍 Budget - User ID:', userId);
      logger.info('🔍 Budget - Request body:', context.body);

      const { category_id, budget_amount, cycle_month } = context.body as CreateBudgetData;

      // แปลง cycle_month จาก YYYY-MM เป็น YYYY-MM-01 สำหรับ database date field
      const formattedCycleMonth = cycle_month.includes('-01') ? cycle_month : `${cycle_month}-01`;

      const budgetData = {
        user_id: userId,
        category_id,
        budget_amount,
        cycle_month: formattedCycleMonth,
      };

      logger.info('🔍 Budget - Budget data to create:', budgetData);

      const budget = await this.budgetService.createBudget(budgetData);

      logger.info('✅ Budget - Budget created successfully:', budget);

      context.set.status = 201;
      return {
        success: true,
        message: 'Budget created successfully',
        data: budget,
      };
    } catch (error) {
      logger.error('❌ Budget - Create budget error:', error);

      // Handle different error types with appropriate status codes
      if (error instanceof Error) {
        if (
          error.message.includes('Category ID is required') ||
          error.message.includes('Budget amount must be a positive number') ||
          error.message.includes('Budget cycle month is required') ||
          error.message.includes('Budget cycle month must be in YYYY-MM format') ||
          error.message.includes('Invalid category ID') ||
          error.message.includes('Invalid user ID') ||
          error.message.includes('Invalid data - check constraint violation')
        ) {
          context.set.status = 400;
          return {
            success: false,
            message: error.message,
            data: null,
          };
        }

        if (
          error.message.includes('already exists') ||
          error.message.includes('Duplicate budget')
        ) {
          context.set.status = 409; // Conflict
          return {
            success: false,
            message: error.message,
            data: null,
          };
        }
      }

      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to create budget',
        data: null,
      };
    }
  }

  async updateBudget(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const budgetId = parseInt(context.params.id);

      if (isNaN(budgetId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid budget ID',
        };
      }

      const updateData = context.body as UpdateBudgetData;

      // แปลง cycle_month จาก YYYY-MM เป็น YYYY-MM-01 สำหรับ database date field (ถ้ามีการส่งค่ามา)
      const formattedUpdateData = { ...updateData };
      if (updateData.cycle_month) {
        const originalCycleMonth = updateData.cycle_month;
        formattedUpdateData.cycle_month = updateData.cycle_month.includes('-01')
          ? updateData.cycle_month
          : `${updateData.cycle_month}-01`;
        logger.info(
          `🔄 Budget Update - Converting cycle_month: ${originalCycleMonth} → ${formattedUpdateData.cycle_month}`
        );
      }

      const budget = await this.budgetService.updateBudget(budgetId, userId, formattedUpdateData);

      if (!budget) {
        context.set.status = 404;
        return {
          success: false,
          message: 'Budget not found',
        };
      }

      return {
        success: true,
        message: 'Budget updated successfully',
        data: budget,
      };
    } catch (error) {
      logger.error('Update budget error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to update budget',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteBudget(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const budgetId = parseInt(context.params.id);

      if (isNaN(budgetId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid budget ID',
        };
      }

      const deleted = await this.budgetService.deleteBudget(budgetId, userId);

      if (!deleted) {
        context.set.status = 404;
        return {
          success: false,
          message: 'Budget not found',
        };
      }

      return {
        success: true,
        message: 'Budget deleted successfully',
      };
    } catch (error) {
      logger.error('Delete budget error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to delete budget',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all budgets for specific user (admin only)
   * Supports filtering by cycle_month and category_id
   *
   * @param context - Elysia context with user_id parameter and query parameters
   * @returns Array of budget records for the specified user
   */
  async getBudgetsByUserId(context: AuthContext) {
    try {
      // TODO: Add admin role validation here
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const targetUserId = parseInt(context.params.user_id);

      if (isNaN(targetUserId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid user ID',
        };
      }

      const filters: BudgetFilters = {
        cycle_month: Array.isArray(context.query.cycle_month)
          ? context.query.cycle_month[0]
          : context.query.cycle_month,
        category_id: context.query.category_id
          ? parseInt(
              Array.isArray(context.query.category_id)
                ? context.query.category_id[0]
                : context.query.category_id
            )
          : undefined,
      };

      const budgets = await this.budgetService.getAllBudgets(targetUserId, filters);

      return {
        success: true,
        message: 'User budgets retrieved successfully',
        data: budgets,
      };
    } catch (error) {
      logger.error('Get budgets by user ID error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to get user budgets',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
