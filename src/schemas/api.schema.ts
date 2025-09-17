/**
 * API Validation Schemas
 *
 * Comprehensive collection of Elysia validation schemas for Budget Buddy API.
 * These schemas define the structure, types, and validation rules for all
 * API requests and responses, ensuring data integrity and type safety.
 *
 * Features:
 * - Strong typing with TypeScript integration
 * - Input validation and sanitization
 * - OpenAPI documentation generation
 * - Error message customization
 * - Min/max length and value constraints
 * - Optional field handling
 * - Union types for enums
 *
 * Schema Categories:
 * - Category schemas: For transaction categorization
 * - Transaction schemas: For financial transaction management
 * - Budget schemas: For budget planning and tracking
 * - User schemas: For authentication and profile management
 * - Response schemas: For standardized API responses
 *
 * Usage:
 * These schemas are used in route definitions to validate request bodies,
 * query parameters, and generate OpenAPI documentation automatically.
 */

import { t } from 'elysia';

// ==================== CATEGORY SCHEMAS ====================

/**
 * Category response schema
 * Defines the structure of category data returned by the API
 */
export const CategorySchema = t.Object({
  category_id: t.Number(),
  category_name: t.String(),
});

/**
 * Create category request schema
 * Validates data for creating new categories
 */
export const CreateCategorySchema = t.Object({
  category_name: t.String({
    minLength: 2,
    description: 'Category name (minimum 2 characters)',
  }),
});

// ==================== TRANSACTION SCHEMAS ====================

/**
 * Transaction response schema
 * Defines the complete structure of transaction data
 */
export const TransactionSchema = t.Object({
  transaction_id: t.Number(),
  user_id: t.Number(),
  category_id: t.Number(),
  type: t.Union([t.Literal('income'), t.Literal('expense')]),
  amount: t.Number({ minimum: 0 }),
  note: t.Optional(t.String()),
  created_at: t.String(),
});

/**
 * Create transaction request schema
 * Validates data for creating new transactions
 */
export const CreateTransactionSchema = t.Object({
  category_id: t.Number({
    minimum: 1,
    description: 'Category ID',
  }),
  type: t.Union([t.Literal('income'), t.Literal('expense')], {
    description: 'Transaction type: income or expense',
  }),
  amount: t.Number({
    minimum: 0.01,
    description: 'Transaction amount (must be positive)',
  }),
  note: t.Optional(
    t.String({
      description: 'Optional note for the transaction',
    })
  ),
});

export const UpdateTransactionSchema = t.Object({
  category_id: t.Optional(t.Number({ minimum: 1 })),
  type: t.Optional(t.Union([t.Literal('income'), t.Literal('expense')])),
  amount: t.Optional(t.Number({ minimum: 0.01 })),
  note: t.Optional(t.String()),
});

export const TransactionFiltersSchema = t.Object({
  type: t.Optional(t.Union([t.Literal('income'), t.Literal('expense')])),
  category_id: t.Optional(t.Number()),
  start_date: t.Optional(t.String({ format: 'date' })),
  end_date: t.Optional(t.String({ format: 'date' })),
  page: t.Optional(t.Number({ minimum: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
});

// ==================== BUDGET SCHEMAS ====================

/**
 * Budget response schema
 * Defines the complete structure of budget data
 */
export const BudgetSchema = t.Object({
  budget_id: t.Number(),
  user_id: t.Number(),
  category_id: t.Number(),
  budget_amount: t.Number({ minimum: 0 }),
  created_at: t.String(),
  updated_at: t.String(),
  cycle_month: t.String(),
});

/**
 * Create budget request schema
 * Validates data for creating new budgets
 */
export const CreateBudgetSchema = t.Object({
  category_id: t.Number({
    minimum: 1,
    description: 'Category ID',
  }),
  budget_amount: t.Number({
    minimum: 0.01,
    description: 'Budget amount (must be positive)',
  }),
  cycle_month: t.String({
    pattern: '^\\d{4}-\\d{2}$',
    description: 'Budget cycle month in YYYY-MM format',
  }),
});

export const UpdateBudgetSchema = t.Object({
  budget_amount: t.Optional(t.Number({ minimum: 0.01 })),
  cycle_month: t.Optional(t.String({ pattern: '^\\d{4}-\\d{2}$' })),
});

export const BudgetFiltersSchema = t.Object({
  cycle_month: t.Optional(t.String({ pattern: '^\\d{4}-\\d{2}$' })),
  category_id: t.Optional(t.Number()),
});

// Common response schemas
export const SuccessResponseSchema = t.Object({
  success: t.Literal(true),
  message: t.String(),
  data: t.Any(),
});

export const ErrorResponseSchema = t.Object({
  success: t.Literal(false),
  message: t.String(),
  error: t.Optional(t.String()),
});

export const PaginationResponseSchema = t.Object({
  success: t.Literal(true),
  message: t.String(),
  data: t.Any(),
  pagination: t.Object({
    total: t.Number(),
    page: t.Number(),
    limit: t.Number(),
    totalPages: t.Number(),
  }),
});

// Analytics schemas
export const SummarySchema = t.Object({
  total_income: t.Number(),
  total_expense: t.Number(),
  balance: t.Number(),
});

export const CategoryAnalyticsSchema = t.Object({
  category_id: t.Number(),
  category_name: t.String(),
  total_income: t.Number(),
  total_expense: t.Number(),
});

export const BudgetWithSpendingSchema = t.Object({
  budget_id: t.Number(),
  category_id: t.Number(),
  category_name: t.String(),
  budget_amount: t.Number(),
  spent_amount: t.Number(),
  remaining_amount: t.Number(),
  percentage_used: t.Number(),
});
