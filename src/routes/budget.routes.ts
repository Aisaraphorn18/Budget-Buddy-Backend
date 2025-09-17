/**
 * Budget Routes
 *
 * Defines HTTP endpoints for budget management in Budget Buddy.
 * All budget routes are protected and require JWT authentication.
 * Budgets help users set spending limits for different categories
 * and track their financial goals over monthly cycles.
 *
 * Routes:
 * - POST /api/v1/budgets - Create new budget
 * - GET /api/v1/budgets - Get budgets with filtering
 * - GET /api/v1/budgets/:id - Get specific budget by ID
 * - GET /api/v1/budgets/user/:user_id - Get budgets by user ID (admin only)
 * - PUT /api/v1/budgets/:id - Update existing budget
 * - DELETE /api/v1/budgets/:id - Delete budget
 *
 * Features:
 * - JWT authentication required for all endpoints
 * - Input validation with Elysia schemas
 * - Monthly budget cycle management (YYYY-MM format)
 * - Category-based budget filtering
 * - User-scoped access control (users can only access their own budgets)
 * - Duplicate prevention (one budget per category per month)
 * - OpenAPI documentation integration
 * - Proper HTTP status codes and error handling
 *
 * Security:
 * - Bearer token authentication on all endpoints
 * - User isolation (budget ownership validation)
 * - Input sanitization and type validation
 * - Protection against unauthorized access
 *
 * Business Rules:
 * - Each user can have one budget per category per month
 * - Budget amounts must be positive values
 * - Budget cycles are monthly-based for consistent tracking
 */

import { Elysia, t } from 'elysia';
import { BudgetController } from '../controllers/budget.controller';
import { CreateBudgetSchema, UpdateBudgetSchema } from '../schemas/api.schema';
import { withAuth } from '../types/elysia.types';
import logger from '../utils/logger';

const budgetController = new BudgetController();

export const budgetRoutes = new Elysia({ prefix: '/api/v1/budgets' })
  // Create new budget endpoint
  .post(
    '/',
    async context => {
      try {
        return await budgetController.createBudget(withAuth(context));
      } catch (error) {
        logger.error('Error in budget creation route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to create budget',
          data: null,
        };
      }
    },
    {
      body: CreateBudgetSchema,
      detail: {
        tags: ['Budgets'],
        summary: 'Create new budget',
        description:
          'Set a budget for a category and month (unique constraint). Each user can have one budget per category per month.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['category_id', 'budget_amount', 'cycle_month'],
                properties: {
                  category_id: {
                    type: 'integer',
                    description: 'Category ID for budget allocation',
                    minimum: 1,
                    example: 1,
                  },
                  budget_amount: {
                    type: 'number',
                    description: 'Budget amount (must be positive)',
                    minimum: 0.01,
                    example: 500.0,
                  },
                  cycle_month: {
                    type: 'string',
                    pattern: '^\\d{4}-\\d{2}$',
                    description: 'Budget cycle month in YYYY-MM format',
                    example: '2024-01',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Budget created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Budget created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        budget_id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', example: 1 },
                        category_id: { type: 'integer', example: 1 },
                        budget_amount: { type: 'number', example: 500.0 },
                        cycle_month: { type: 'string', example: '2024-01' },
                        created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                        updated_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Invalid input, duplicate budget, or category not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Budget for this category and month already exists',
                    },
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
        },
      },
    }
  )

  // Get all budgets with filtering endpoint
  .get(
    '/',
    async context => {
      try {
        return await budgetController.getAllBudgets(withAuth(context));
      } catch (error) {
        logger.error('Error in get all budgets route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve budgets',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        cycle_month: t.Optional(t.String()),
        category_id: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Budgets'],
        summary: 'Get all budgets',
        description: "Retrieve user's budgets with optional filtering by month and category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'cycle_month',
            in: 'query',
            required: false,
            description: 'Filter by budget cycle month (YYYY-MM)',
            schema: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}$',
              example: '2024-01',
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
        ],
        responses: {
          200: {
            description: 'Successfully retrieved budgets',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Budgets retrieved successfully' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          budget_id: { type: 'integer', example: 1 },
                          user_id: { type: 'integer', example: 1 },
                          category_id: { type: 'integer', example: 1 },
                          category_name: { type: 'string', example: 'Food & Dining' },
                          budget_amount: { type: 'number', example: 500.0 },
                          cycle_month: { type: 'string', example: '2024-01' },
                          created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                          updated_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
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

  // Get specific budget by ID endpoint
  .get(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid budget ID. Must be a positive integer.',
            data: null,
          };
        }
        return await budgetController.getBudgetById(withAuth(context));
      } catch (error) {
        logger.error('Error in get budget by ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve budget',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Budgets'],
        summary: 'Get budget by ID',
        description:
          'Retrieve a specific budget by its unique identifier. Users can only access their own budgets.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Budget ID',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully retrieved budget',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Budget retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        budget_id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', example: 1 },
                        category_id: { type: 'integer', example: 1 },
                        category_name: { type: 'string', example: 'Food & Dining' },
                        budget_amount: { type: 'number', example: 500.0 },
                        cycle_month: { type: 'string', example: '2024-01' },
                        created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                        updated_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
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
            description: 'Forbidden - Budget belongs to another user',
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
            description: 'Budget not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Budget not found' },
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

  // Update existing budget endpoint
  .put(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid budget ID. Must be a positive integer.',
            data: null,
          };
        }
        return await budgetController.updateBudget(withAuth(context));
      } catch (error) {
        logger.error('Error in update budget route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update budget',
          data: null,
        };
      }
    },
    {
      body: UpdateBudgetSchema,
      detail: {
        tags: ['Budgets'],
        summary: 'Update budget',
        description: 'Modify an existing budget. Users can only update their own budgets.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Budget ID',
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
                  budget_amount: {
                    type: 'number',
                    description: 'Updated budget amount (must be positive)',
                    minimum: 0.01,
                    example: 750.0,
                  },
                  cycle_month: {
                    type: 'string',
                    pattern: '^\\d{4}-\\d{2}$',
                    description: 'Updated budget cycle month in YYYY-MM format',
                    example: '2024-02',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Budget updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Budget updated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        budget_id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', example: 1 },
                        category_id: { type: 'integer', example: 2 },
                        budget_amount: { type: 'number', example: 750.0 },
                        cycle_month: { type: 'string', example: '2024-02' },
                        created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                        updated_at: { type: 'string', example: '2024-01-15T11:45:00Z' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Invalid input or duplicate budget',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Budget for this category and month already exists',
                    },
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
            description: 'Forbidden - Budget belongs to another user',
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
            description: 'Budget not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Budget not found' },
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

  // Delete budget endpoint
  .delete(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid budget ID. Must be a positive integer.',
            data: null,
          };
        }
        return await budgetController.deleteBudget(withAuth(context));
      } catch (error) {
        logger.error('Error in delete budget route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to delete budget',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Budgets'],
        summary: 'Delete budget',
        description: 'Remove a budget permanently. Users can only delete their own budgets.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Budget ID',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Budget deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Budget deleted successfully' },
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
            description: 'Forbidden - Budget belongs to another user',
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
            description: 'Budget not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Budget not found' },
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

  // Get budgets by user ID endpoint (admin only)
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
        return await budgetController.getBudgetsByUserId(withAuth(context));
      } catch (error) {
        logger.error('Error in get budgets by user ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve budgets',
          data: null,
        };
      }
    },
    {
      params: t.Object({
        user_id: t.String({ description: 'User ID to get budgets for' }),
      }),
      query: t.Object({
        cycle_month: t.Optional(t.String()),
        category_id: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Budgets', 'Admin'],
        summary: '👑 [ADMIN ONLY] Get budgets by user ID',
        description:
          '🔒 ADMIN ONLY: Retrieve all budgets for a specific user with filtering. Requires admin privileges and user_id path parameter.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'user_id',
            in: 'path',
            required: true,
            description: '👑 ADMIN ONLY: User ID to get budgets for',
            schema: {
              type: 'string',
              example: '1',
            },
          },
          {
            name: 'cycle_month',
            in: 'query',
            required: false,
            description: 'Filter by budget cycle month (YYYY-MM)',
            schema: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}$',
              example: '2024-01',
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
        ],
        responses: {
          200: {
            description: 'Successfully retrieved user budgets',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User budgets retrieved successfully' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          budget_id: { type: 'integer', example: 1 },
                          user_id: { type: 'integer', example: 1 },
                          category_id: { type: 'integer', example: 1 },
                          budget_amount: { type: 'number', example: 500.0 },
                          cycle_month: { type: 'string', example: '2024-01' },
                          created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                          updated_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                        },
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
