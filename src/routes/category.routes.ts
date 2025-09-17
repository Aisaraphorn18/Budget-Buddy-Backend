/**
 * Category Routes
 *
 * Defines HTTP endpoints for category management in Budget Buddy.
 * Categories are used to organize financial transactions into meaningful
 * groups such as Food, Transportation, Entertainment, etc.
 *
 * Routes:
 * - GET /protected/api/v1/categories - Get all available categories
 * - GET /protected/api/v1/categories/:id - Get specific category by ID
 * - POST /protected/api/v1/categories - Create new category
 * - PUT /protected/api/v1/categories/:id - Update existing category
 * - DELETE /protected/api/v1/categories/:id - Delete category
 *
 * Features:
 * - Protected access (JWT authentication required for all operations)
 * - OpenAPI documentation integration
 * - Consistent response formatting
 * - Error handling for invalid category IDs
 * - Business logic validation (prevent deletion of categories with dependencies)
 * - Optimized for frontend category management components
 *
 * Note: All category operations now require authentication to ensure
 * proper access control and user-specific category management.
 */

import { Elysia } from 'elysia';
import { CategoryController } from '../controllers/category.controller';
import { withAuth } from '../types/elysia.types';
import logger from '../utils/logger';

const categoryController = new CategoryController();

export const categoryRoutes = new Elysia({ prefix: '/api/v1/categories' })
  // Get all categories endpoint (protected)
  .get(
    '/',
    async context => {
      try {
        return await categoryController.getAllCategories(withAuth(context));
      } catch (error) {
        logger.error('Error in get all categories route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve categories',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Categories'],
        summary: 'Get all categories',
        description:
          'Retrieve all available categories for transaction classification. Returns a complete list of categories ordered by ID.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Successfully retrieved all categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Categories retrieved successfully' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          category_id: { type: 'integer', example: 1 },
                          category_name: { type: 'string', example: 'Food & Dining' },
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

  // Get category by ID endpoint (protected)
  .get(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid category ID. Must be a positive integer.',
            data: null,
          };
        }
        return await categoryController.getCategoryById(withAuth(context));
      } catch (error) {
        logger.error('Error in get category by ID route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve category',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Categories'],
        summary: 'Get category by ID',
        description: 'Retrieve a specific category by its unique identifier',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Category ID',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully retrieved category',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        category_id: { type: 'integer', example: 1 },
                        category_name: { type: 'string', example: 'Food & Dining' },
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
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Category not found' },
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

  // Create new category endpoint (protected)
  .post(
    '/',
    async context => {
      try {
        return await categoryController.createCategory(withAuth(context));
      } catch (error) {
        logger.error('Error in create category route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to create category',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Categories'],
        summary: 'Create new category',
        description:
          'Create a new category for transaction classification. Category names must be unique.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['category_name'],
                properties: {
                  category_name: {
                    type: 'string',
                    description: 'Category name (must be unique)',
                    example: 'Food & Dining',
                    minLength: 1,
                    maxLength: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        category_id: { type: 'integer', example: 1 },
                        category_name: { type: 'string', example: 'Food & Dining' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Invalid input or category name already exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Category name already exists' },
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

  // Update category endpoint (protected)
  .put(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid category ID. Must be a positive integer.',
            data: null,
          };
        }
        return await categoryController.updateCategory(withAuth(context));
      } catch (error) {
        logger.error('Error in update category route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update category',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Categories'],
        summary: 'Update category',
        description: 'Update an existing category by its ID. Only category name can be updated.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Category ID',
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
                  category_name: {
                    type: 'string',
                    description: 'Updated category name (must be unique)',
                    example: 'Food & Beverages',
                    minLength: 1,
                    maxLength: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category updated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        category_id: { type: 'integer', example: 1 },
                        category_name: { type: 'string', example: 'Food & Beverages' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Invalid input or category name already exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Category name already exists' },
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
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Category not found' },
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

  // Delete category endpoint (protected)
  .delete(
    '/:id',
    async context => {
      try {
        // Validate ID parameter
        const id = parseInt(context.params.id);
        if (isNaN(id) || id <= 0) {
          return {
            success: false,
            message: 'Invalid category ID. Must be a positive integer.',
            data: null,
          };
        }
        return await categoryController.deleteCategory(withAuth(context));
      } catch (error) {
        logger.error('Error in delete category route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to delete category',
          data: null,
        };
      }
    },
    {
      detail: {
        tags: ['Categories'],
        summary: 'Delete category',
        description:
          'Delete a category by its ID. Categories cannot be deleted if they have associated transactions or budgets (foreign key constraint).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Category ID',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Category deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category deleted successfully' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Category has dependencies',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Cannot delete category with existing transactions or budgets',
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
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Category not found' },
                    data: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
        },
      },
    }
  );
