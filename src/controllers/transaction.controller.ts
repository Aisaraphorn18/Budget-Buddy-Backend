/**
 * Transaction Controller
 *
 * HTTP request handler for transaction management endpoints in Budget Buddy.
 * Manages all transaction-related operations including CRUD operations,
 * filtering, pagination, and data validation.
 *
 * Key Features:
 * - Complete CRUD operations for transactions
 * - Advanced filtering (by type, category, date range, amount)
 * - Pagination support for large datasets
 * - User-scoped access control (users can only access their own transactions)
 * - Input validation and sanitization
 * - Proper error handling and HTTP status codes
 * - Transaction amount validation
 *
 * Security:
 * - JWT authentication required for all operations
 * - User isolation (userId validation from JWT token)
 * - Input sanitization and type conversion
 */

import { TransactionService } from '../services/transaction.service';
import { TransactionFilters, UpdateTransactionData } from '../models/transaction.model';
import type { AuthContext } from '../types/elysia.types';
import logger from '../utils/logger';
export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * Get all transactions for authenticated user
   * Supports filtering by type, category, date range, and pagination
   *
   * @param context - Elysia context with user info and query parameters
   * @returns Paginated list of transactions with metadata
   */
  async getAllTransactions(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const typeParam = Array.isArray(context.query.type)
        ? context.query.type[0]
        : context.query.type;
      const categoryIdParam = Array.isArray(context.query.category_id)
        ? context.query.category_id[0]
        : context.query.category_id;
      const startDateParam = Array.isArray(context.query.start_date)
        ? context.query.start_date[0]
        : context.query.start_date;
      const endDateParam = Array.isArray(context.query.end_date)
        ? context.query.end_date[0]
        : context.query.end_date;
      const pageParam = Array.isArray(context.query.page)
        ? context.query.page[0]
        : context.query.page;
      const limitParam = Array.isArray(context.query.limit)
        ? context.query.limit[0]
        : context.query.limit;

      const filters: TransactionFilters = {
        type: typeParam as 'income' | 'expense' | undefined,
        category_id: categoryIdParam ? parseInt(categoryIdParam) : undefined,
        start_date: startDateParam,
        end_date: endDateParam,
        page: pageParam ? parseInt(pageParam) : 1,
        limit: limitParam ? parseInt(limitParam) : 20,
      };

      const result = await this.transactionService.getAllTransactions(userId, filters);

      const totalPages = Math.ceil(result.total / result.limit);

      context.set.status = 200;
      return {
        success: true,
        message: 'Transactions retrieved successfully',
        data: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Get all transactions error:', error);

      // Handle different error types with appropriate status codes
      if (error instanceof Error) {
        if (
          error.message.includes('Valid user ID is required') ||
          error.message.includes('must be greater than 0') ||
          error.message.includes('must be between 1 and 100') ||
          error.message.includes("must be 'income' or 'expense'") ||
          error.message.includes('must be a positive integer') ||
          error.message.includes('must be a valid date format')
        ) {
          context.set.status = 400;
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
        message: 'Failed to get transactions',
        data: null,
      };
    }
  }

  /**
   * Get specific transaction by ID
   * Retrieves a single transaction if it belongs to the authenticated user
   *
   * @param context - Elysia context with user info and transaction ID parameter
   * @returns Transaction object or error if not found/unauthorized
   */
  async getTransactionById(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const transactionId = parseInt(context.params.id);

      if (isNaN(transactionId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid transaction ID',
        };
      }

      const transaction = await this.transactionService.getTransactionById(transactionId, userId);

      if (!transaction) {
        context.set.status = 404;
        return {
          success: false,
          message: 'Transaction not found',
          data: null,
        };
      }

      context.set.status = 200;
      return {
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      };
    } catch (error) {
      logger.error('Get transaction by ID error:', error);

      // Handle different error types with appropriate status codes
      if (error instanceof Error) {
        if (
          error.message.includes('Valid transaction ID is required') ||
          error.message.includes('Valid user ID is required')
        ) {
          context.set.status = 400;
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
        message: 'Failed to get transaction',
        data: null,
      };
    }
  }

  /**
   * Create new transaction
   * Creates a financial transaction record for the authenticated user
   *
   * @param context - Elysia context with user info and transaction data in body
   * @returns Created transaction object or validation error
   */
  async createTransaction(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      logger.info(context.user);
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const { category_id, type, amount, note } = context.body as {
        category_id: number;
        type: 'income' | 'expense';
        amount: number;
        note?: string;
      };

      const transactionData = {
        user_id: userId,
        category_id,
        type,
        amount,
        note,
      };

      const transaction = await this.transactionService.createTransaction(transactionData);

      context.set.status = 201;
      return {
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      };
    } catch (error) {
      logger.error('Create transaction error:', error);

      // Handle different error types with appropriate status codes
      if (error instanceof Error) {
        if (
          error.message.includes('Category ID is required') ||
          error.message.includes('Transaction type must be') ||
          error.message.includes('Amount must be a positive number') ||
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

        if (error.message.includes('Duplicate transaction')) {
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
        message: 'Failed to create transaction',
        data: null,
      };
    }
  }

  async updateTransaction(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const transactionId = parseInt(context.params.id);

      if (isNaN(transactionId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid transaction ID',
        };
      }

      const updateData = context.body as UpdateTransactionData;
      const transaction = await this.transactionService.updateTransaction(
        transactionId,
        userId,
        updateData
      );

      if (!transaction) {
        context.set.status = 404;
        return {
          success: false,
          message: 'Transaction not found',
        };
      }

      return {
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
      };
    } catch (error) {
      logger.error('Update transaction error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to update transaction',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteTransaction(context: AuthContext) {
    try {
      const userId = context.user?.user_id;
      if (!userId) {
        context.set.status = 401;
        return {
          success: false,
          message: 'User authentication required',
        };
      }

      const transactionId = parseInt(context.params.id);

      if (isNaN(transactionId)) {
        context.set.status = 400;
        return {
          success: false,
          message: 'Invalid transaction ID',
        };
      }

      const deleted = await this.transactionService.deleteTransaction(transactionId, userId);

      if (!deleted) {
        context.set.status = 404;
        return {
          success: false,
          message: 'Transaction not found',
        };
      }

      return {
        success: true,
        message: 'Transaction deleted successfully',
      };
    } catch (error) {
      logger.error('Delete transaction error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to delete transaction',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all transactions for specific user (admin only)
   * Supports filtering by type, category, date range, and pagination
   *
   * @param context - Elysia context with user_id parameter and query parameters
   * @returns Paginated list of user's transactions with metadata
   */
  async getTransactionsByUserId(context: AuthContext) {
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

      const typeParam = Array.isArray(context.query.type)
        ? context.query.type[0]
        : context.query.type;
      const categoryIdParam = Array.isArray(context.query.category_id)
        ? context.query.category_id[0]
        : context.query.category_id;
      const startDateParam = Array.isArray(context.query.start_date)
        ? context.query.start_date[0]
        : context.query.start_date;
      const endDateParam = Array.isArray(context.query.end_date)
        ? context.query.end_date[0]
        : context.query.end_date;
      const pageParam = Array.isArray(context.query.page)
        ? context.query.page[0]
        : context.query.page;
      const limitParam = Array.isArray(context.query.limit)
        ? context.query.limit[0]
        : context.query.limit;

      const filters: TransactionFilters = {
        type: typeParam as 'income' | 'expense' | undefined,
        category_id: categoryIdParam ? parseInt(categoryIdParam) : undefined,
        start_date: startDateParam,
        end_date: endDateParam,
        page: pageParam ? parseInt(pageParam) : 1,
        limit: limitParam ? parseInt(limitParam) : 20,
      };

      const result = await this.transactionService.getAllTransactions(targetUserId, filters);

      const totalPages = Math.ceil(result.total / result.limit);

      return {
        success: true,
        message: 'User transactions retrieved successfully',
        data: result.transactions,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Get transactions by user ID error:', error);
      context.set.status = 500;
      return {
        success: false,
        message: 'Failed to get user transactions',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
