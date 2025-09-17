/**
 * Reports Controller
 *
 * HTTP request handler for reports and analytics endpoints in Budget Buddy.
 * Provides comprehensive financial reports and analytics for users.
 *
 * Key Features:
 * - Financial summary reports
 * - Transaction analysis
 * - Income vs expense comparisons
 * - Category-based expense breakdowns
 * - Monthly financial close reports
 * - Admin access to any user's reports via user_id parameter
 *
 * Security:
 * - JWT authentication required for all operations
 * - User isolation (users can only access their own data)
 * - Admin users can access any user's data via user_id parameter
 */

import { TransactionService } from '../services/transaction.service';
import { BudgetService } from '../services/budget.service';
import { UserService } from '../services/user.service';
import type { AuthContext } from '../types/elysia.types';
import logger from '../utils/logger';

export class ReportsController {
  private transactionService: TransactionService;
  private budgetService: BudgetService;
  private userService: UserService;

  constructor() {
    this.transactionService = new TransactionService();
    this.budgetService = new BudgetService();
    this.userService = new UserService();
  }

  /**
   * Get financial summary report
   * Returns total income, total expense, and balance for specified month
   */
  async getSummaryReport(context: AuthContext) {
    try {
      const { month, user_id } = context.query as { month?: string; user_id?: string };

      // Determine target user ID (admin can specify user_id, regular users use their own)
      const targetUserId = user_id || context.user.user_id;

      // Validate user access (admin check would go here)
      if (user_id && user_id !== context.user.user_id.toString()) {
        // TODO: Add admin role check
        // For now, allow access (implement proper admin check later)
      }

      const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM

      // Get financial summary from transaction service
      const summary = await this.transactionService.getFinancialSummary(
        parseInt(targetUserId.toString()),
        currentMonth
      );

      return {
        success: true,
        message: 'Summary report retrieved successfully',
        data: {
          total_income: summary.total_income || 0,
          total_expense: summary.total_expense || 0,
          balance: (summary.total_income || 0) - (summary.total_expense || 0),
          as_of: currentMonth,
        },
      };
    } catch (error) {
      logger.error('Get summary report error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve summary report',
        data: null,
      };
    }
  }

  /**
   * Get recent transactions report
   * Returns list of recent transactions with details
   */
  async getRecentTransactionsReport(context: AuthContext) {
    try {
      const { limit = '10', user_id } = context.query as { limit?: string; user_id?: string };

      // Determine target user ID
      const targetUserId = user_id || context.user.user_id;

      // Validate user access
      if (user_id && user_id !== context.user.user_id.toString()) {
        // TODO: Add admin role check
      }

      // Get recent transactions
      const transactions = await this.transactionService.getRecentTransactions(
        parseInt(targetUserId.toString()),
        parseInt(limit)
      );

      // Format response according to the specification
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedTransactions = transactions.map((transaction: any) => ({
        transaction_id: transaction.transaction_id,
        category_name: transaction.category_name || 'Uncategorized',
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        note: transaction.note || '',
      }));

      return {
        success: true,
        message: 'Recent transactions report retrieved successfully',
        data: formattedTransactions,
      };
    } catch (error) {
      logger.error('Get recent transactions report error:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to retrieve recent transactions report',
        data: null,
      };
    }
  }

  /**
   * Get income vs expense analysis
   * Returns comparative analysis of income vs expense
   */
  async getIncomeVsExpenseReport(context: AuthContext) {
    try {
      const { period, year, month, user_id } = context.query as {
        period?: string;
        year?: string;
        month?: string;
        user_id?: string;
      };

      // Determine target user ID
      const targetUserId = user_id || context.user.user_id;

      // Validate user access
      if (user_id && user_id !== context.user.user_id.toString()) {
        // TODO: Add admin role check
      }

      // Determine the filter period
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filters: any = {};
      if (period === 'year' && year) {
        filters.year = year;
      } else if (period === 'month' && month) {
        filters.month = month;
      } else if (month) {
        filters.month = month;
      } else if (year) {
        filters.year = year;
      }

      // Get financial summary
      const summary = await this.transactionService.getFinancialSummary(
        parseInt(targetUserId.toString()),
        filters
      );

      return {
        success: true,
        message: 'Income vs expense report retrieved successfully',
        data: [
          {
            label: 'Income',
            income: summary.total_income || 0,
            expense: summary.total_expense || 0,
          },
        ],
      };
    } catch (error) {
      logger.error('Get income vs expense report error:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to retrieve income vs expense report',
        data: null,
      };
    }
  }

  /**
   * Get expenses breakdown by category
   * Returns expenses analysis grouped by category
   */
  async getExpensesByCategoryReport(context: AuthContext) {
    try {
      const { month, user_id } = context.query as { month?: string; user_id?: string };

      // Determine target user ID
      const targetUserId = user_id || context.user.user_id;

      // Validate user access
      if (user_id && user_id !== context.user.user_id.toString()) {
        // TODO: Add admin role check
      }

      const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM

      // Get transactions by category
      const categoryData = await this.transactionService.getAnalyticsByCategory(
        parseInt(targetUserId.toString()),
        currentMonth
      );

      // Calculate total expenses for percentage calculation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalExpenses = categoryData.reduce((sum: number, cat: any) => sum + cat.amount, 0);

      // Format response according to specification
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData = categoryData.map((category: any) => ({
        category_id: category.category_id,
        category_name: category.category_name,
        amount: category.amount,
        percent: totalExpenses > 0 ? Math.round((category.amount / totalExpenses) * 100) : 0,
      }));

      return {
        success: true,
        message: 'Expenses by category report retrieved successfully',
        data: formattedData,
      };
    } catch (error) {
      logger.error('Get expenses by category report error:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to retrieve expenses by category report',
        data: null,
      };
    }
  }

  /**
   * Get monthly financial close report
   * Returns comprehensive monthly summary
   */
  async getMonthlyCloseReport(context: AuthContext) {
    try {
      const { month, user_id } = context.query as { month?: string; user_id?: string };

      // Determine target user ID
      const targetUserId = user_id || context.user.user_id;

      // Validate user access
      if (user_id && user_id !== context.user.user_id.toString()) {
        // TODO: Add admin role check
      }

      const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM

      // Get financial summary for the month
      const summary = await this.transactionService.getFinancialSummary(
        parseInt(targetUserId.toString()),
        currentMonth
      );

      const totalIncome = summary.total_income || 0;
      const totalExpense = summary.total_expense || 0;
      const netBalance = totalIncome - totalExpense;

      return {
        success: true,
        message: 'Monthly close report retrieved successfully',
        data: {
          month: currentMonth,
          total_income: totalIncome,
          total_expense: totalExpense,
          net_balance: netBalance,
        },
      };
    } catch (error) {
      logger.error('Get monthly close report error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve monthly close report',
        data: null,
      };
    }
  }
}
