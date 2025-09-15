import { TransactionService } from "../services/transaction.service";
import { TransactionFilters } from "../models/transaction.model";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async getAllTransactions(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const filters: TransactionFilters = {
        type: context.query.type,
        category_id: context.query.category_id ? parseInt(context.query.category_id) : undefined,
        start_date: context.query.start_date,
        end_date: context.query.end_date,
        page: context.query.page ? parseInt(context.query.page) : 1,
        limit: context.query.limit ? parseInt(context.query.limit) : 20
      };

      const result = await this.transactionService.getAllTransactions(userId, filters);
      
      const totalPages = Math.ceil(result.total / result.limit);

      return {
        success: true,
        message: "Transactions retrieved successfully",
        data: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages
        }
      };
    } catch (error) {
      console.error("Get all transactions error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get transactions",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getTransactionById(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const transactionId = parseInt(context.params.id);
      
      if (isNaN(transactionId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid transaction ID"
        };
      }

      const transaction = await this.transactionService.getTransactionById(transactionId, userId);
      
      if (!transaction) {
        context.set.status = 404;
        return {
          success: false,
          message: "Transaction not found"
        };
      }

      return {
        success: true,
        message: "Transaction retrieved successfully",
        data: transaction
      };
    } catch (error) {
      console.error("Get transaction by ID error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to get transaction",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async createTransaction(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const { category_id, type, amount, note } = context.body;

      const transactionData = {
        user_id: userId,
        category_id,
        type,
        amount,
        note
      };

      const transaction = await this.transactionService.createTransaction(transactionData);

      context.set.status = 201;
      return {
        success: true,
        message: "Transaction created successfully",
        data: transaction
      };
    } catch (error) {
      console.error("Create transaction error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to create transaction",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async updateTransaction(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const transactionId = parseInt(context.params.id);
      
      if (isNaN(transactionId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid transaction ID"
        };
      }

      const updateData = context.body;
      const transaction = await this.transactionService.updateTransaction(transactionId, userId, updateData);
      
      if (!transaction) {
        context.set.status = 404;
        return {
          success: false,
          message: "Transaction not found"
        };
      }

      return {
        success: true,
        message: "Transaction updated successfully",
        data: transaction
      };
    } catch (error) {
      console.error("Update transaction error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to update transaction",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async deleteTransaction(context: any) {
    try {
      const userId = context.user?.userId;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: "User authentication required"
        };
      }

      const transactionId = parseInt(context.params.id);
      
      if (isNaN(transactionId)) {
        context.set.status = 400;
        return {
          success: false,
          message: "Invalid transaction ID"
        };
      }

      const deleted = await this.transactionService.deleteTransaction(transactionId, userId);
      
      if (!deleted) {
        context.set.status = 404;
        return {
          success: false,
          message: "Transaction not found"
        };
      }

      return {
        success: true,
        message: "Transaction deleted successfully"
      };
    } catch (error) {
      console.error("Delete transaction error:", error);
      context.set.status = 500;
      return {
        success: false,
        message: "Failed to delete transaction",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}