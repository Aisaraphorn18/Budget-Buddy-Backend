/**
 * User Management Routes
 *
 * Admin endpoints for user management in Budget Buddy.
 * These routes provide administrative functionality for managing users,
 * viewing user data, and performing user-related operations.
 *
 * Routes:
 * - GET /api/v1/users - Get all users (admin only)
 * - GET /api/v1/users/:id - Get specific user by ID (admin only)
 * - DELETE /api/v1/users/:id - Delete user account (admin only)
 *
 * Features:
 * - Admin-only access control
 * - User data retrieval and management
 * - Proper pagination for large user lists
 * - Input validation and sanitization
 * - OpenAPI documentation integration
 *
 * Security:
 * - JWT authentication required for all endpoints
 * - Admin role validation
 * - User isolation and access control
 * - Protected sensitive user data
 */

import { Elysia, t } from 'elysia';
import { UserController } from '../controllers/user.controller';
import { withAuth } from '../types/elysia.types';

const userController = new UserController();

export const userRoutes = new Elysia({ prefix: '/api/v1/users' })
  // Get all users endpoint (admin only)
  .get('/', async context => await userController.getAllUsers(withAuth(context)), {
    query: t.Object({
      page: t.Optional(t.String({ description: 'Page number for pagination' })),
      limit: t.Optional(t.String({ description: 'Items per page (max 100)' })),
      search: t.Optional(t.String({ description: 'Search by username or name' })),
    }),
    detail: {
      tags: ['User Management'],
      summary: 'Get all users',
      description: 'Retrieve all users with pagination and search functionality (admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Page number for pagination (default: 1)',
          schema: {
            type: 'string',
            example: '1',
          },
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Items per page (default: 20, max: 100)',
          schema: {
            type: 'string',
            example: '20',
          },
        },
        {
          name: 'search',
          in: 'query',
          required: false,
          description: 'Search by username, first_name, or last_name',
          schema: {
            type: 'string',
            example: 'john',
          },
        },
      ],
      responses: {
        200: {
          description: 'Successfully retrieved users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Users retrieved successfully' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        user_id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'johndoe' },
                        first_name: { type: 'string', example: 'John' },
                        last_name: { type: 'string', example: 'Doe' },
                        created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                      },
                    },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer', example: 150 },
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 20 },
                      totalPages: { type: 'integer', example: 8 },
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
                  message: { type: 'string', example: 'Admin access required' },
                },
              },
            },
          },
        },
      },
    },
  })

  // Get specific user by ID endpoint (admin only)
  .get('/:id', async context => await userController.getUserById(withAuth(context)), {
    params: t.Object({
      id: t.String({ description: 'User ID' }),
    }),
    detail: {
      tags: ['User Management'],
      summary: 'Get user by ID',
      description: 'Retrieve specific user information by ID (admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'User ID',
          schema: {
            type: 'string',
            example: '1',
          },
        },
      ],
      responses: {
        200: {
          description: 'Successfully retrieved user',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'User retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      user_id: { type: 'integer', example: 1 },
                      username: { type: 'string', example: 'johndoe' },
                      first_name: { type: 'string', example: 'John' },
                      last_name: { type: 'string', example: 'Doe' },
                      created_at: { type: 'string', example: '2024-01-15T10:30:00Z' },
                      stats: {
                        type: 'object',
                        properties: {
                          total_transactions: { type: 'integer', example: 25 },
                          total_budgets: { type: 'integer', example: 5 },
                          last_login: { type: 'string', example: '2024-01-20T14:30:00Z' },
                        },
                      },
                    },
                  },
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
  })

  // Delete user endpoint (admin only)
  .delete('/:id', async context => await userController.deleteUser(withAuth(context)), {
    params: t.Object({
      id: t.String({ description: 'User ID' }),
    }),
    detail: {
      tags: ['User Management'],
      summary: 'Delete user',
      description: 'Delete user account and all associated data (admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'User ID to delete',
          schema: {
            type: 'string',
            example: '1',
          },
        },
      ],
      responses: {
        200: {
          description: 'User deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'User deleted successfully' },
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
  });
