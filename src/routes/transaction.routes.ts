/**
 * Transaction Routes
 *
 * Defines HTTP endpoints for financial transaction management in Budget Buddy.
 * All transaction routes are protected and require JWT authentication.
 * Transactions are the core of the personal finance system, recording all
 * income and expense activities with proper categorization and tracking.
 *
 * Routes:
 * - POST /api/v1/transactions - Create new transaction
 * - GET /api/v1/transactions - Get transactions with filtering and pagination
 * - GET /api/v1/transactions/:id - Get specific transaction by ID
 * - GET /api/v1/transactions/user/:user_id - Get transactions by user ID (admin only)
 * - PUT /api/v1/transactions/:id - Update existing transaction
 * - DELETE /api/v1/transactions/:id - Delete transaction
 *
 * Features:
 * - JWT authentication required for all endpoints
 * - Input validation with Elysia schemas
 * - Advanced filtering (type, category, date range, amount)
 * - Pagination support for large datasets
 * - User-scoped access control (users can only access their own transactions)
 * - OpenAPI documentation integration
 * - Proper HTTP status codes and error handling
 *
 * Security:
 * - Bearer token authentication on all endpoints
 * - User isolation (transaction ownership validation)
 * - Input sanitization and type validation
 * - Protection against unauthorized access
 */

import { Elysia, t } from 'elysia';
import { TransactionController } from '../controllers/transaction.controller';
import { CreateTransactionSchema, UpdateTransactionSchema } from '../schemas/api.schema';
import { withAuth } from '../types/elysia.types';
import logger from '../utils/logger';

const transactionController = new TransactionController();

export const transactionRoutes = new Elysia({ prefix: '/api/v1/transactions' })
  // Create new transaction endpoint
  .post(
    '/',
    async context => {
      try {
        return await transactionController.createTransaction(withAuth(context));
      } catch (error) {
        logger.error('Error in transaction creation route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to create transaction',
          data: null,
        };
      }
    },
    {
      body: CreateTransactionSchema,
      detail: {
        tags: ['Transactions'],
        summary: 'Create new transaction',
        description:
          'Add a new income or expense transaction. Transactions are automatically linked to the authenticated user.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['category_id', 'type', 'amount'],
                properties: {
                  category_id: {
                    type: 'integer',
                    description: 'Category ID for transaction classification',
                    minimum: 1,
                    example: 1,
                  },
                  type: {
                    type: 'string',
                    enum: ['income', 'expense'],
                    description: 'Transaction type',
                    example: 'expense',
                  },
                  amount: {
                    type: 'number',
                    description: 'Transaction amount (must be positive)',
                    minimum: 0.01,
                    example: 25.5,
                  },
                  note: {
                    type: 'string',
                    description: 'Optional transaction note/description',
                    maxLength: 500,
                    example: 'Lunch at restaurant',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Transaction created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Transaction created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        transaction_id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', example: 1 },
                        category_id: { type: 'integer', example: 1 },
                        type: { type: 'string', example: 'expense' },
                        amount: { type: 'number', example: 25.5 },
                        note: { type: 'string', example: 'Lunch at restaurant' },
                        created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Invalid input or category not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Invalid category ID or validation error' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Invalid or missing JWT token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Unauthorized' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Get all transactions with filtering endpoint
  .get(
    '/',
    async context => {
      try {
        return await transactionController.getAllTransactions(withAuth(context));
      } catch (error) {
        logger.error('Error in get all transactions route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve transactions',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        type: t.Optional(t.Union([t.Literal('income'), t.Literal('expense')])),
        category_id: t.Optional(t.String()),
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Transactions'],
        summary: 'Get all transactions',
        description:
          "Retrieve user's transactions with optional filtering by type, category, date range, and pagination support",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: false,
            description: 'Filter by transaction type',
            schema: {
              type: 'string',
              enum: ['income', 'expense'],
              example: 'expense',
            },
          },
          {
            name: 'category_id',
            in: 'query',
            required: false,
            description: 'Filter by category ID',
            schema: {
              type: 'string',
              example: '1',
            },
          },
          {
            name: 'start_date',
            in: 'query',
            required: false,
            description: 'Filter from date (YYYY-MM-DD)',
            schema: {
              type: 'string',
              format: 'date',
              example: '2024-01-01',
            },
          },
          {
            name: 'end_date',
            in: 'query',
            required: false,
            description: 'Filter to date (YYYY-MM-DD)',
            schema: {
              type: 'string',
              format: 'date',
              example: '2024-01-31',
            },
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            description: 'Page number for pagination',
            schema: {
              type: 'string',
              example: '1',
            },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Number of transactions per page',
            schema: {
              type: 'string',
              example: '10',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully retrieved transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Transactions retrieved successfully' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          transaction_id: { type: 'integer', example: 1 },
                          user_id: { type: 'integer', example: 1 },
                          category_id: { type: 'integer', example: 1 },
                          category_name: { type: 'string', example: 'Food & Dining' },
                          type: { type: 'string', example: 'expense' },
                          amount: { type: 'number', example: 25.5 },
                          note: { type: 'string', example: 'Lunch at restaurant' },
                          created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Invalid or missing JWT token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Unauthorized' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Get specific transaction by ID endpoint
  .get(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid transaction ID. Must be a positive integer.',
            data: null,
          };
        }
        return await transactionController.getTransactionById(withAuth(context));
      } catch (error) {
        logger.error('Error in get transaction by ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve transaction',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Transactions'],
        summary: 'Get transaction by ID',
        description:
          'Retrieve a specific transaction by its unique identifier. Users can only access their own transactions.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Transaction ID',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully retrieved transaction',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Transaction retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        transaction_id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', example: 1 },
                        category_id: { type: 'integer', example: 1 },
                        category_name: { type: 'string', example: 'Food & Dining' },
                        type: { type: 'string', example: 'expense' },
                        amount: { type: 'number', example: 25.5 },
                        note: { type: 'string', example: 'Lunch at restaurant' },
                        created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Invalid or missing JWT token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Unauthorized' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Transaction belongs to another user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Access denied' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          404: {
            description: 'Transaction not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Transaction not found' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Update existing transaction endpoint
  .put(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid transaction ID. Must be a positive integer.',
            data: null,
          };
        }
        return await transactionController.updateTransaction(withAuth(context));
      } catch (error) {
        logger.error('Error in update transaction route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update transaction',
          data: null,
        };
      }
    },
    {
      body: UpdateTransactionSchema,
      detail: {
        tags: ['Transactions'],
        summary: 'Update transaction',
        description:
          'Modify an existing transaction. Users can only update their own transactions.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Transaction ID',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  category_id: {
                    type: 'integer',
                    description: 'Updated category ID',
                    minimum: 1,
                    example: 2,
                  },
                  type: {
                    type: 'string',
                    enum: ['income', 'expense'],
                    description: 'Updated transaction type',
                    example: 'income',
                  },
                  amount: {
                    type: 'number',
                    description: 'Updated transaction amount (must be positive)',
                    minimum: 0.01,
                    example: 50.0,
                  },
                  note: {
                    type: 'string',
                    description: 'Updated transaction note/description',
                    maxLength: 500,
                    example: 'Updated note',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Transaction updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Transaction updated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        transaction_id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', example: 1 },
                        category_id: { type: 'integer', example: 2 },
                        type: { type: 'string', example: 'income' },
                        amount: { type: 'number', example: 50.0 },
                        note: { type: 'string', example: 'Updated note' },
                        created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Invalid input',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Invalid category ID' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Invalid or missing JWT token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Unauthorized' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Transaction belongs to another user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Access denied' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          404: {
            description: 'Transaction not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Transaction not found' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Delete transaction endpoint
  .delete(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid transaction ID. Must be a positive integer.',
            data: null,
          };
        }
        return await transactionController.deleteTransaction(withAuth(context));
      } catch (error) {
        logger.error('Error in delete transaction route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to delete transaction',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Transactions'],
        summary: 'Delete transaction',
        description:
          'Remove a transaction permanently. Users can only delete their own transactions.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Transaction ID',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Transaction deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Transaction deleted successfully' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Invalid or missing JWT token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Unauthorized' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Transaction belongs to another user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Access denied' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          404: {
            description: 'Transaction not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Transaction not found' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Get transactions by user ID endpoint (admin only)
  .get(
    '/user/:user_id',
    async context => {
      try {
        // Validate user_id parameter
        const userId = context.params.user_id;
        if (!userId || userId.trim() === '') {
          return {
            success: false,
            message: 'Invalid user ID. User ID is required.',
            data: null,
          };
        }
        return await transactionController.getTransactionsByUserId(withAuth(context));
      } catch (error) {
        logger.error('Error in get transactions by user ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve transactions',
          data: null,
        };
      }
    },
    {
      params: t.Object({
        user_id: t.String({ description: 'User ID to get transactions for' }),
      }),
      query: t.Object({
        type: t.Optional(t.String()),
        category_id: t.Optional(t.String()),
        start_date: t.Optional(t.String()),
        end_date: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Transactions', 'Admin'],
        summary: '👑 [ADMIN ONLY] Get transactions by user ID',
        description:
          '🔒 ADMIN ONLY: Retrieve all transactions for a specific user with filtering and pagination. Requires admin privileges and user_id path parameter.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'user_id',
            in: 'path',
            required: true,
            description: '👑 ADMIN ONLY: User ID to get transactions for',
            schema: {
              type: 'string',
              example: '1',
            },
          },
          {
            name: 'type',
            in: 'query',
            required: false,
            description: 'Filter by transaction type',
            schema: {
              type: 'string',
              enum: ['income', 'expense'],
              example: 'expense',
            },
          },
          {
            name: 'category_id',
            in: 'query',
            required: false,
            description: 'Filter by category ID',
            schema: {
              type: 'string',
              example: '1',
            },
          },
          {
            name: 'start_date',
            in: 'query',
            required: false,
            description: 'Filter from date (YYYY-MM-DD)',
            schema: {
              type: 'string',
              format: 'date',
              example: '2024-01-01',
            },
          },
          {
            name: 'end_date',
            in: 'query',
            required: false,
            description: 'Filter to date (YYYY-MM-DD)',
            schema: {
              type: 'string',
              format: 'date',
              example: '2024-12-31',
            },
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            description: 'Page number for pagination',
            schema: {
              type: 'string',
              example: '1',
            },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Items per page (max 100)',
            schema: {
              type: 'string',
              example: '20',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully retrieved user transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'User transactions retrieved successfully',
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          transaction_id: { type: 'integer', example: 1 },
                          user_id: { type: 'integer', example: 1 },
                          category_id: { type: 'integer', example: 1 },
                          type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
                          amount: { type: 'number', example: 25.5 },
                          note: { type: 'string', example: 'Lunch at restaurant' },
                          created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 50 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 20 },
                        totalPages: { type: 'integer', example: 3 },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Admin access required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Admin access required' },
                  },
                },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'User not found' },
                  },
                },
              },
            },
          },
        },
      },
    }
  );
