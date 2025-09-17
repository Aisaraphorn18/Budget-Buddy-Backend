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
 *
 * Security:
 * - JWT authentication required for all operations
 * - User isolation (users can only access their own data)
 * - All operations use user_id from authenticated token for security
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
   * Returns total income, total expense, and balance for specified month or year range
   */
  async getSummaryReport(context: AuthContext) {
    try {
      const { month, year, range } = context.query as {
        month?: string;
        year?: string;
        range?: string;
      };

      // Always use user_id from authenticated context for security
      const targetUserId = context.user.user_id;

      // If range=year or year is specified, return monthly breakdown for bar chart
      if (range === 'year' || year) {
        const targetYear = year || new Date().getFullYear().toString();
        const monthlyData = [];

        // Get data for each month of the year
        for (let monthNum = 1; monthNum <= 12; monthNum++) {
          const monthStr = `${targetYear}-${monthNum.toString().padStart(2, '0')}`;
          const summary = await this.transactionService.getFinancialSummary(
            parseInt(targetUserId.toString()),
            monthStr
          );

          monthlyData.push({
            month: monthStr,
            month_name: new Date(parseInt(targetYear), monthNum - 1).toLocaleString('en-US', {
              month: 'short',
            }),
            total_income: summary.total_income || 0,
            total_expense: summary.total_expense || 0,
            net_balance: (summary.total_income || 0) - (summary.total_expense || 0),
          });
        }

        // Calculate year totals
        const yearTotals = monthlyData.reduce(
          (acc, month) => ({
            total_income: acc.total_income + month.total_income,
            total_expense: acc.total_expense + month.total_expense,
            net_balance: acc.net_balance + month.net_balance,
          }),
          { total_income: 0, total_expense: 0, net_balance: 0 }
        );

        return {
          success: true,
          message: 'Annual summary report retrieved successfully',
          data: {
            type: 'annual',
            year: targetYear,
            monthly_breakdown: monthlyData,
            year_totals: yearTotals,
          },
        };
      }

      // Single month summary (for dashboard cards)
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
          type: 'monthly',
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
   * Returns list of recent transactions with details formatted for table view
   */
  async getRecentTransactionsReport(context: AuthContext) {
    try {
      const { limit = '10', page = '1' } = context.query as {
        limit?: string;
        page?: string;
      };

      // Always use user_id from authenticated context for security
      const targetUserId = context.user.user_id;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Use getAllTransactions with pagination support
      const result = await this.transactionService.getAllTransactions(
        parseInt(targetUserId.toString()),
        {
          page: pageNum,
          limit: limitNum,
        }
      );

      // Format response according to the specification for table display
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedTransactions = result.transactions.map((transaction: any) => ({
        transaction_id: transaction.transaction_id,
        category_name: transaction.category_name || 'Uncategorized',
        category_note: transaction.description || transaction.note || '',
        date: transaction.transaction_date || transaction.date,
        formatted_date: new Date(
          transaction.transaction_date || transaction.date
        ).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        type: transaction.type,
        amount: transaction.amount,
        formatted_amount:
          transaction.type === 'expense'
            ? `-${transaction.amount.toLocaleString()} Baht`
            : `+${transaction.amount.toLocaleString()} Baht`,
        amount_color: transaction.type === 'expense' ? '#EF4444' : '#10B981',
        note: transaction.note || '',
      }));

      const totalPages = Math.ceil(result.total / limitNum);

      return {
        success: true,
        message: 'Recent transactions report retrieved successfully',
        data: {
          transactions: formattedTransactions,
          pagination: {
            current_page: pageNum,
            total_pages: totalPages,
            total_count: result.total,
            limit: limitNum,
            has_next: pageNum < totalPages,
            has_previous: pageNum > 1,
          },
          summary: {
            showing: formattedTransactions.length,
            total: result.total,
          },
        },
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
      const { period, year, month } = context.query as {
        period?: string;
        year?: string;
        month?: string;
      };

      // Always use user_id from authenticated context for security
      const targetUserId = context.user.user_id;

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
   * Returns expenses analysis grouped by category with total amounts for pie chart
   */
  async getExpensesByCategoryReport(context: AuthContext) {
    try {
      const { month } = context.query as { month?: string };

      // Always use user_id from authenticated context for security
      const targetUserId = context.user.user_id;

      const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM

      // Calculate proper date range for the month
      const [targetYear, targetMonthNum] = currentMonth.split('-').map(Number);
      const lastDayOfMonth = new Date(targetYear, targetMonthNum, 0).getDate();
      const startDate = `${currentMonth}-01`;
      const endDate = `${currentMonth}-${lastDayOfMonth.toString().padStart(2, '0')}`;

      // Get transactions by category
      const categoryData = await this.transactionService.getAnalyticsByCategory(
        parseInt(targetUserId.toString()),
        startDate,
        endDate
      );

      // Calculate total expenses for percentage calculation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalExpenses = categoryData.reduce((sum: number, cat: any) => sum + cat.amount, 0);

      // Format response according to specification for pie chart
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData = categoryData.map((category: any) => ({
        category_id: category.category_id,
        category_name: category.category_name,
        amount: category.amount,
        percent: totalExpenses > 0 ? Math.round((category.amount / totalExpenses) * 100) : 0,
        color: category.color || this.getDefaultCategoryColor(category.category_name), // Add color for pie chart
      }));

      return {
        success: true,
        message: 'Expenses by category report retrieved successfully',
        data: {
          total_expenses: totalExpenses,
          as_of: currentMonth,
          breakdown: formattedData,
          // Summary for pie chart display
          summary: {
            total_amount: totalExpenses,
            currency: 'Baht', // or get from user preferences
            categories_count: formattedData.length,
          },
        },
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
   * Helper method to assign default colors for categories
   */
  private getDefaultCategoryColor(categoryName: string): string {
    const colorMap: { [key: string]: string } = {
      Investment: '#8B5CF6', // Purple
      Food: '#10B981', // Green
      Shopping: '#F59E0B', // Orange
      Others: '#EF4444', // Red
      'Food & Dining': '#10B981',
      'Food and Groceries': '#10B981',
      Travel: '#3B82F6', // Blue
      Entertainment: '#EC4899', // Pink
      Utilities: '#6B7280', // Gray
      Healthcare: '#14B8A6', // Teal
      Transportation: '#8B5CF6', // Purple
    };

    return colorMap[categoryName] || '#6B7280'; // Default gray
  }

  /**
   * Get enhanced financial summary with comparisons
   * Returns comprehensive monthly financial analysis with previous month comparison
   */
  async getEnhancedFinancialSummary(context: AuthContext) {
    try {
      const { year, month } = context.query as {
        year?: number;
        month?: number;
      };

      // Always use user_id from authenticated context for security
      const targetUserId = context.user.user_id;

      // Determine the target month/year
      const currentDate = new Date();
      const targetYear = year || currentDate.getFullYear();
      const targetMonth = month || currentDate.getMonth() + 1;
      const currentMonthStr = `${targetYear}-${targetMonth.toString().padStart(2, '0')}`;

      // Get current month data
      const currentSummary = await this.transactionService.getFinancialSummary(
        parseInt(targetUserId.toString()),
        currentMonthStr
      );

      // Get previous month for comparison
      const prevDate = new Date(targetYear, targetMonth - 2); // month - 2 because month is 1-indexed
      const prevMonthStr = `${prevDate.getFullYear()}-${(prevDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;

      const previousSummary = await this.transactionService.getFinancialSummary(
        parseInt(targetUserId.toString()),
        prevMonthStr
      );

      // Calculate percentage changes
      const incomeChange =
        previousSummary.total_income && previousSummary.total_income > 0
          ? (((currentSummary.total_income || 0) - previousSummary.total_income) /
              previousSummary.total_income) *
            100
          : 0;

      const expenseChange =
        previousSummary.total_expense && previousSummary.total_expense > 0
          ? (((currentSummary.total_expense || 0) - previousSummary.total_expense) /
              previousSummary.total_expense) *
            100
          : 0;

      const currentSavings =
        (currentSummary.total_income || 0) - (currentSummary.total_expense || 0);
      const previousSavings =
        (previousSummary.total_income || 0) - (previousSummary.total_expense || 0);
      const savingsChange =
        previousSavings !== 0
          ? ((currentSavings - previousSavings) / Math.abs(previousSavings)) * 100
          : 0;

      // Get category breakdowns for expenses
      const [currentYear, currentMonthNum] = currentMonthStr.split('-').map(Number);
      const lastDayOfMonth = new Date(currentYear, currentMonthNum, 0).getDate(); // Get last day of month
      const startDate = `${currentMonthStr}-01`;
      const endDate = `${currentMonthStr}-${lastDayOfMonth.toString().padStart(2, '0')}`;

      const categoryAnalytics = await this.transactionService.getAnalyticsByCategory(
        parseInt(targetUserId.toString()),
        startDate,
        endDate
      );

      // Process expense categories
      const expenseCategories = categoryAnalytics
        .filter(category => category.total_expense > 0)
        .map(category => ({
          category: category.category_name,
          amount: category.total_expense,
          percentage:
            currentSummary.total_expense && currentSummary.total_expense > 0
              ? (category.total_expense / currentSummary.total_expense) * 100
              : 0,
        }));

      // Process income categories
      const incomeCategories = categoryAnalytics
        .filter(category => category.total_income > 0)
        .map(category => ({
          category: category.category_name,
          amount: category.total_income,
          percentage:
            currentSummary.total_income && currentSummary.total_income > 0
              ? (category.total_income / currentSummary.total_income) * 100
              : 0,
        }));

      // Calculate savings rate
      const savingsRate =
        currentSummary.total_income && currentSummary.total_income > 0
          ? (currentSavings / currentSummary.total_income) * 100
          : 0;

      return {
        success: true,
        message: 'Enhanced financial summary retrieved successfully',
        data: {
          overview: {
            period: new Date(targetYear, targetMonth - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            }),
            total_income: currentSummary.total_income || 0,
            total_expense: currentSummary.total_expense || 0,
            net_income: currentSavings,
            savings_rate: Math.round(savingsRate * 100) / 100,
          },
          comparison: {
            previous_month: {
              income_change: Math.round(incomeChange * 100) / 100,
              expense_change: Math.round(expenseChange * 100) / 100,
              savings_change: Math.round(savingsChange * 100) / 100,
            },
          },
          breakdown: {
            income_categories: incomeCategories,
            expense_categories: expenseCategories,
          },
        },
      };
    } catch (error) {
      logger.error('Get enhanced financial summary error:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to retrieve enhanced financial summary',
        data: null,
      };
    }
  }

  /**
   * Get dashboard summary for home page cards
   * Returns current month's income, expense, and balance summary
   */
  async getDashboardSummary(context: AuthContext) {
    try {
      const { month } = context.query as { month?: string };

      // Always use user_id from authenticated context for security
      const targetUserId = context.user.user_id;

      const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM

      // Get financial summary for dashboard cards
      const summary = await this.transactionService.getFinancialSummary(
        parseInt(targetUserId.toString()),
        currentMonth
      );

      const totalIncome = summary.total_income || 0;
      const totalExpense = summary.total_expense || 0;
      const balance = totalIncome - totalExpense;

      return {
        success: true,
        message: 'Dashboard summary retrieved successfully',
        data: {
          cards: [
            {
              type: 'income',
              title: 'Income',
              amount: totalIncome,
              currency: 'B',
              color: '#10B981', // Green
              icon: 'income',
              formatted_amount: `${totalIncome.toLocaleString()} B`,
            },
            {
              type: 'expense',
              title: 'Expenses',
              amount: totalExpense,
              currency: 'B',
              color: '#EF4444', // Red
              icon: 'expenses',
              formatted_amount: `${totalExpense.toLocaleString()} B`,
            },
            {
              type: 'balance',
              title: 'Balance',
              amount: balance,
              currency: 'B',
              color: balance >= 0 ? '#3B82F6' : '#EF4444', // Blue if positive, Red if negative
              icon: 'balance',
              formatted_amount: `${balance.toLocaleString()} B`,
            },
          ],
          summary: {
            total_income: totalIncome,
            total_expense: totalExpense,
            net_balance: balance,
            as_of: currentMonth,
            currency: 'Baht',
          },
        },
      };
    } catch (error) {
      logger.error('Get dashboard summary error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve dashboard summary',
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
      const { month } = context.query as { month?: string };

      // Always use user_id from authenticated context for security
      const targetUserId = context.user.user_id;

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
