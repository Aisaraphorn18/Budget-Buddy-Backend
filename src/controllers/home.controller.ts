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
}