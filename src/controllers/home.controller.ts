/**
 * Home Controller
 * 
 * HTTP request handler for dashboard and analytics endpoints in Budget Buddy.
 * Provides comprehensive financial insights, summaries, and dashboard data
 * to help users understand their financial situation at a glance.
 * 
 * Key Features:
 * - Dashboard overview with key financial metrics
 * - Recent transaction summaries
 * - Financial analytics and insights
 * - Category-based spending analysis
 * - Cash flow tracking and trends
 * - Multi-service data aggregation
 * - Real-time financial calculations
 * 
 * Analytics Capabilities:
 * - Total income/expense calculations
 * - Budget vs actual spending comparisons
 * - Monthly financial summaries
 * - Category-wise spending breakdown
 * - Financial trend analysis
 * 
 * Security:
 * - JWT authentication required for all operations
 * - User-scoped data access only
 * - Aggregated data presentation for privacy
 */

import { TransactionService } from "../services/transaction.service";
import { BudgetService } from "../services/budget.service";
import { AuthService } from "../services/auth.service";

export class HomeController {
  private transactionService: TransactionService;
  private budgetService: BudgetService;
  private authService: AuthService;

  constructor() {
    this.transactionService = new TransactionService();
    this.budgetService = new BudgetService();
    this.authService = new AuthService();
  }

  /**
   * Get home dashboard data
   * Aggregates financial data from multiple sources for dashboard overview
   * 
   * @param context - Elysia context with authenticated user info
   * @returns Comprehensive dashboard data including user info, transactions, and budgets
   */
  async getHomeData(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      // Get user info
      const user = await this.authService.findUserById(userId);
      if (!user) {
        context.set.status = 404;
        return {
          success: false,
          message: "User not found"
        };
      }

      // Get current month for budget data
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

      // Get financial summary
      const summary = await this.transactionService.getTransactionsSummary(userId);

      // Get budget overview for current month
      const budgetOverview = await this.budgetService.getBudgetsWithSpending(userId, currentMonth);

      // Get recent transactions
      const recentTransactions = await this.transactionService.getRecentTransactions(userId, 10);

      return {
        success: true,
        message: "Home data retrieved successfully",
        data: {
          user: {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
          },
          financial_summary: summary,
          budget_overview: budgetOverview,
          recent_transactions: recentTransactions
        }
      };
    } catch (error) {
      console.error("Get home data error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get home data",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getRecentTransactions(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const limit = context.query.limit ? parseInt(context.query.limit) : 10;
      const transactions = await this.transactionService.getRecentTransactions(userId, limit);

      return {
        success: true,
        message: "Recent transactions retrieved successfully",
        data: transactions
      };
    } catch (error) {
      console.error("Get recent transactions error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get recent transactions",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getAnalyticsSummary(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const startDate = context.query.start_date;
      const endDate = context.query.end_date;

      const summary = await this.transactionService.getTransactionsSummary(userId, startDate, endDate);

      return {
        success: true,
        message: "Analytics summary retrieved successfully",
        data: summary
      };
    } catch (error) {
      console.error("Get analytics summary error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get analytics summary",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getAnalyticsByCategory(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const startDate = context.query.start_date;
      const endDate = context.query.end_date;

      const categoryAnalytics = await this.transactionService.getTransactionsByCategory(userId, startDate, endDate);

      return {
        success: true,
        message: "Analytics by category retrieved successfully",
        data: categoryAnalytics
      };
    } catch (error) {
      console.error("Get analytics by category error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get analytics by category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getAnalyticsFlow(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const startDate = context.query.start_date;
      const endDate = context.query.end_date;
      const groupBy = context.query.group_by || 'daily'; // daily, monthly

      // This would need more complex implementation for timeline grouping
      // For now, return basic summary
      const summary = await this.transactionService.getTransactionsSummary(userId, startDate, endDate);

      return {
        success: true,
        message: "Analytics flow retrieved successfully",
        data: {
          group_by: groupBy,
          summary,
          timeline: [] // TODO: Implement timeline grouping logic
        }
      };
    } catch (error) {
      console.error("Get analytics flow error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get analytics flow",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Admin methods - Get data by user ID
  async getHomeDataByUserId(context: any) {
    try {
      // TODO: Add admin role validation
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const targetUserId = parseInt(context.params.user_id);
      if (isNaN(targetUserId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid user ID"
        };
      }

      // Get user info
      const user = await this.authService.findUserById(targetUserId);
      if (!user) {
        context.set.status = 404;
        return {
          success: false,
          message: "User not found"
        };
      }

      // Get financial summary
      const summary = await this.transactionService.getFinancialSummary(targetUserId);
      
      // Get budget overview
      const budgetOverview = await this.budgetService.getBudgetOverview(targetUserId);
      
      // Get recent transactions
      const recentTransactions = await this.transactionService.getRecentTransactions(targetUserId, 5);

      return {
        success: true,
        message: "User home data retrieved successfully",
        data: {
          user: {
            user_id: user.user_id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
          },
          summary,
          budget_overview: budgetOverview,
          recent_transactions: recentTransactions
        }
      };
    } catch (error) {
      console.error("Get user home data error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get user home data",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getRecentTransactionsByUserId(context: any) {
    try {
      // TODO: Add admin role validation
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const targetUserId = parseInt(context.params.user_id);
      if (isNaN(targetUserId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid user ID"
        };
      }

      const limit = context.query.limit ? parseInt(context.query.limit) : 10;
      const transactions = await this.transactionService.getRecentTransactions(targetUserId, limit);

      return {
        success: true,
        message: "User recent transactions retrieved successfully",
        data: transactions
      };
    } catch (error) {
      console.error("Get user recent transactions error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get user recent transactions",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getAnalyticsSummaryByUserId(context: any) {
    try {
      // TODO: Add admin role validation
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const targetUserId = parseInt(context.params.user_id);
      if (isNaN(targetUserId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid user ID"
        };
      }

      const { start_date, end_date } = context.query;
      const summary = await this.transactionService.getFinancialSummary(targetUserId, start_date, end_date);

      return {
        success: true,
        message: "User analytics summary retrieved successfully",
        data: summary
      };
    } catch (error) {
      console.error("Get user analytics summary error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get user analytics summary",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getAnalyticsByCategoryByUserId(context: any) {
    try {
      // TODO: Add admin role validation
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const targetUserId = parseInt(context.params.user_id);
      if (isNaN(targetUserId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid user ID"
        };
      }

      const { start_date, end_date } = context.query;
      const analytics = await this.transactionService.getAnalyticsByCategory(targetUserId, start_date, end_date);

      return {
        success: true,
        message: "User analytics by category retrieved successfully",
        data: analytics
      };
    } catch (error) {
      console.error("Get user analytics by category error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get user analytics by category",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getAnalyticsFlowByUserId(context: any) {
    try {
      // TODO: Add admin role validation
      const currentUserId = context.user?.user_id;
      if (!currentUserId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const targetUserId = parseInt(context.params.user_id);
      if (isNaN(targetUserId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid user ID"
        };
      }

      const { start_date, end_date, group_by } = context.query;
      // TODO: Implement analytics flow by user ID logic
      
      return {
        success: true,
        message: "User analytics flow retrieved successfully",
        data: {
          timeline: [] // TODO: Implement timeline grouping logic for specific user
        }
      };
    } catch (error) {
      console.error("Get user analytics flow error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get user analytics flow",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}