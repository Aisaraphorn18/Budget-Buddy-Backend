/**
 * Reports & Analytics Routes
 *
 * Defines HTTP endpoints for reports and analytics functionality in Budget Buddy.
 * All reports routes are protected and require JWT authentication.
 * These endpoints provide comprehensive financial reports and analytics.
 *
 * Routes:
 * - GET /reports/summary - Get financial summary report
 * - GET /reports/recent-transactions - Get recent transactions report
 * - GET /reports/income-vs-expense - Get income vs expense analysis
 * - GET /reports/expenses-by-category - Get expenses breakdown by category
 * - GET /reports/monthly-close - Get monthly financial close report
 *
 * Features:
 * - JWT authentication required for all endpoints
 * - User-scoped data access (own data + admin can access any user)
 * - Monthly/yearly period filtering
 * - Comprehensive financial analytics
 * - Budget vs actual comparisons
 *
 * Security:
 * - Bearer token authentication on all endpoints
 * - User isolation (users can only access their own data unless admin)
 * - Input sanitization and type validation
 */

import { Elysia, t } from 'elysia';
import { ReportsController } from '../controllers/reports.controller';
import { withAuth } from '../types/elysia.types';
import logger from '../utils/logger';

const reportsController = new ReportsController();

export const reportsRoutes = new Elysia({ prefix: '/api/v1/reports' })
  // Dashboard summary for home page cards
  .get(
    '/dashboard',
    async context => {
      try {
        return await reportsController.getDashboardSummary(withAuth(context));
      } catch (error) {
        logger.error('Error in dashboard summary route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve dashboard summary',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        month: t.Optional(
          t.String({
            pattern: '^\\d{4}-\\d{2}$',
            description: 'Month in YYYY-MM format (default: current month)',
            example: '2024-03',
          })
        ),
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get dashboard summary cards',
        description:
          'Retrieve income, expense, and balance cards for dashboard home page with monthly totals and comparisons',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Dashboard summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Dashboard summary retrieved successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        period: { type: 'string', example: 'March 2024' },
                        income_card: {
                          type: 'object',
                          properties: {
                            total: { type: 'number', example: 50000 },
                            formatted: { type: 'string', example: '+50,000 บาท' },
                            color: { type: 'string', example: '#10B981' },
                            icon: { type: 'string', example: 'trending-up' },
                          },
                        },
                        expense_card: {
                          type: 'object',
                          properties: {
                            total: { type: 'number', example: 35000 },
                            formatted: { type: 'string', example: '-35,000 บาท' },
                            color: { type: 'string', example: '#EF4444' },
                            icon: { type: 'string', example: 'trending-down' },
                          },
                        },
                        balance_card: {
                          type: 'object',
                          properties: {
                            total: { type: 'number', example: 15000 },
                            formatted: { type: 'string', example: '+15,000 บาท' },
                            color: { type: 'string', example: '#3B82F6' },
                            icon: { type: 'string', example: 'wallet' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid month format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Invalid month format. Use YYYY-MM format.',
                    },
                    error: { type: 'string', example: 'INVALID_DATE_FORMAT' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Authentication required' },
                    error: { type: 'string', example: 'UNAUTHORIZED' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    error: { type: 'string', example: 'INTERNAL_ERROR' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Enhanced financial summary report with comparisons
  .get(
    '/enhanced-financial-summary',
    async context => {
      try {
        return await reportsController.getEnhancedFinancialSummary(withAuth(context));
      } catch (error) {
        logger.error('Error in enhanced financial summary route:', error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to retrieve enhanced financial summary',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        year: t.Optional(
          t.Number({
            minimum: 2020,
            maximum: 2030,
            description: 'Year to retrieve data for (default: current year)',
            example: 2024,
          })
        ),
        month: t.Optional(
          t.Number({
            minimum: 1,
            maximum: 12,
            description: 'Month to retrieve data for (1-12, default: current month)',
            example: 3,
          })
        ),
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get enhanced financial summary with comparisons',
        description:
          'Retrieve comprehensive monthly financial summary with previous month comparisons and category breakdowns',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Enhanced financial summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Enhanced financial summary retrieved successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        overview: {
                          type: 'object',
                          properties: {
                            period: { type: 'string', example: 'March 2024' },
                            total_income: { type: 'number', example: 50000 },
                            total_expense: { type: 'number', example: 35000 },
                            net_income: { type: 'number', example: 15000 },
                            savings_rate: { type: 'number', example: 30.0 },
                          },
                        },
                        comparison: {
                          type: 'object',
                          properties: {
                            previous_month: {
                              type: 'object',
                              properties: {
                                income_change: { type: 'number', example: 5.2 },
                                expense_change: { type: 'number', example: -2.1 },
                                savings_change: { type: 'number', example: 12.5 },
                              },
                            },
                          },
                        },
                        breakdown: {
                          type: 'object',
                          properties: {
                            income_categories: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  category: { type: 'string', example: 'Salary' },
                                  amount: { type: 'number', example: 45000 },
                                  percentage: { type: 'number', example: 90.0 },
                                },
                              },
                            },
                            expense_categories: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  category: { type: 'string', example: 'Food' },
                                  amount: { type: 'number', example: 15000 },
                                  percentage: { type: 'number', example: 42.9 },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid month or year parameter',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Invalid month or year parameter' },
                    error: { type: 'string', example: 'INVALID_DATE_PARAMS' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Authentication required' },
                    error: { type: 'string', example: 'UNAUTHORIZED' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    error: { type: 'string', example: 'INTERNAL_ERROR' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Financial summary report
  .get(
    '/summary',
    async context => {
      try {
        return await reportsController.getSummaryReport(withAuth(context));
      } catch (error) {
        logger.error('Error in summary report route:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve summary report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        month: t.Optional(
          t.String({
            pattern: '^\\d{4}-\\d{2}$',
            description: 'Month in YYYY-MM format (default: current month)',
            example: '2024-03',
          })
        ),
        year: t.Optional(
          t.String({
            pattern: '^\\d{4}$',
            description: 'Year for annual breakdown (YYYY format)',
            example: '2024',
          })
        ),
        range: t.Optional(
          t.String({
            description: 'Set to "year" for annual breakdown suitable for bar charts',
            example: 'year',
          })
        ),
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get financial summary report',
        description:
          'Retrieve total income, total expense, and balance. Use range=year or year param for annual breakdown suitable for bar charts.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Financial summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Summary report retrieved successfully',
                    },
                    data: {
                      oneOf: [
                        {
                          title: 'Monthly Summary',
                          type: 'object',
                          properties: {
                            type: { type: 'string', example: 'monthly' },
                            total_income: { type: 'number', example: 50000 },
                            total_expense: { type: 'number', example: 35000 },
                            balance: { type: 'number', example: 15000 },
                            as_of: { type: 'string', example: '2024-03' },
                          },
                        },
                        {
                          title: 'Annual Summary',
                          type: 'object',
                          properties: {
                            type: { type: 'string', example: 'annual' },
                            year: { type: 'string', example: '2024' },
                            monthly_breakdown: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  month: { type: 'string', example: '2024-01' },
                                  month_name: { type: 'string', example: 'Jan' },
                                  total_income: { type: 'number', example: 45000 },
                                  total_expense: { type: 'number', example: 32000 },
                                  net_balance: { type: 'number', example: 13000 },
                                },
                              },
                            },
                            year_totals: {
                              type: 'object',
                              properties: {
                                total_income: { type: 'number', example: 600000 },
                                total_expense: { type: 'number', example: 420000 },
                                net_balance: { type: 'number', example: 180000 },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid date format or parameters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Invalid date format. Use YYYY-MM for month or YYYY for year.',
                    },
                    error: { type: 'string', example: 'INVALID_DATE_FORMAT' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Authentication required' },
                    error: { type: 'string', example: 'UNAUTHORIZED' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    error: { type: 'string', example: 'INTERNAL_ERROR' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Recent transactions report
  .get(
    '/recent-transactions',
    async context => {
      try {
        return await reportsController.getRecentTransactionsReport(withAuth(context));
      } catch (error) {
        logger.error('Error in recent transactions report route:', error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to retrieve recent transactions report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        limit: t.Optional(
          t.Number({
            minimum: 1,
            maximum: 100,
            description: 'Number of transactions to retrieve (default: 10, max: 100)',
            example: 10,
          })
        ),
        page: t.Optional(
          t.Number({
            minimum: 1,
            description: 'Page number for pagination (default: 1)',
            example: 1,
          })
        ),
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get recent transactions report with pagination',
        description:
          'Retrieve paginated list of recent transactions with transaction_id, category_name, type, amount, date, note formatted for table display',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Recent transactions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Recent transactions report retrieved successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        transactions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              transaction_id: { type: 'number', example: 1 },
                              category_name: { type: 'string', example: 'Food' },
                              category_note: { type: 'string', example: 'Lunch at restaurant' },
                              type: { type: 'string', example: 'expense' },
                              amount: { type: 'number', example: 350 },
                              formatted_amount: { type: 'string', example: '-350 Baht' },
                              amount_color: { type: 'string', example: '#EF4444' },
                              date: { type: 'string', example: '2024-03-15' },
                              formatted_date: { type: 'string', example: 'Mar 15, 2024' },
                              note: { type: 'string', example: 'Lunch at restaurant' },
                            },
                          },
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            current_page: { type: 'number', example: 1 },
                            total_pages: { type: 'number', example: 5 },
                            total_count: { type: 'number', example: 50 },
                            limit: { type: 'number', example: 10 },
                            has_next: { type: 'boolean', example: true },
                            has_previous: { type: 'boolean', example: false },
                          },
                        },
                        summary: {
                          type: 'object',
                          properties: {
                            showing: { type: 'number', example: 10 },
                            total: { type: 'number', example: 50 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid pagination parameters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Invalid pagination parameters' },
                    error: { type: 'string', example: 'INVALID_PAGINATION' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Authentication required' },
                    error: { type: 'string', example: 'UNAUTHORIZED' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    error: { type: 'string', example: 'INTERNAL_ERROR' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Income vs Expense analysis
  .get(
    '/income-vs-expense',
    async context => {
      try {
        return await reportsController.getIncomeVsExpenseReport(withAuth(context));
      } catch (error) {
        logger.error('Error in income vs expense report route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve income vs expense report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        period: t.Optional(
          t.String({
            description: 'Period type for analysis (year or month)',
            example: 'year',
          })
        ),
        year: t.Optional(
          t.String({
            pattern: '^\\d{4}$',
            description: 'Year for analysis (YYYY format)',
            example: '2024',
          })
        ),
        month: t.Optional(
          t.String({
            pattern: '^\\d{4}-\\d{2}$',
            description: 'Month for analysis (YYYY-MM format)',
            example: '2024-03',
          })
        ),
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get income vs expense analysis',
        description: 'Retrieve comparative analysis of income vs expense with labels and amounts',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Income vs expense analysis retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Income vs expense report retrieved successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        period: { type: 'string', example: 'March 2024' },
                        analysis: {
                          type: 'object',
                          properties: {
                            total_income: { type: 'number', example: 50000 },
                            total_expense: { type: 'number', example: 35000 },
                            net_difference: { type: 'number', example: 15000 },
                            income_percentage: { type: 'number', example: 58.8 },
                            expense_percentage: { type: 'number', example: 41.2 },
                          },
                        },
                        chart_data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              label: { type: 'string', example: 'Income' },
                              amount: { type: 'number', example: 50000 },
                              formatted_amount: { type: 'string', example: '+50,000 บาท' },
                              color: { type: 'string', example: '#10B981' },
                              percentage: { type: 'number', example: 58.8 },
                            },
                          },
                        },
                        insights: {
                          type: 'object',
                          properties: {
                            status: {
                              type: 'string',
                              enum: ['surplus', 'deficit', 'balanced'],
                              example: 'surplus',
                            },
                            message: {
                              type: 'string',
                              example: 'You have a healthy surplus this month!',
                            },
                            recommendation: {
                              type: 'string',
                              example: 'Consider increasing your savings or investments.',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid period or date parameters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example:
                        'Invalid period or date format. Use YYYY for year or YYYY-MM for month.',
                    },
                    error: { type: 'string', example: 'INVALID_PERIOD_FORMAT' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Authentication required' },
                    error: { type: 'string', example: 'UNAUTHORIZED' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    error: { type: 'string', example: 'INTERNAL_ERROR' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Expenses by category breakdown
  .get(
    '/expenses-by-category',
    async context => {
      try {
        return await reportsController.getExpensesByCategoryReport(withAuth(context));
      } catch (error) {
        logger.error('Error in expenses by category report route:', error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to retrieve expenses by category report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        month: t.Optional(
          t.String({
            pattern: '^\\d{4}-\\d{2}$',
            description: 'Month for analysis (YYYY-MM format, default: current month)',
            example: '2024-03',
          })
        ),
        min_amount: t.Optional(
          t.Number({
            minimum: 0,
            description: 'Minimum amount to include in analysis (default: 0)',
            example: 100,
          })
        ),
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get expenses breakdown by category',
        description:
          'Retrieve expenses analysis grouped by category with category_id, category_name, amount, and percentage for pie chart visualization',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Expenses by category analysis retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Expenses by category report retrieved successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        period: { type: 'string', example: 'March 2024' },
                        total_expense: { type: 'number', example: 35000 },
                        categories: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              category_id: { type: 'number', example: 1 },
                              category_name: { type: 'string', example: 'Food' },
                              amount: { type: 'number', example: 15000 },
                              percentage: { type: 'number', example: 42.9 },
                              color: { type: 'string', example: '#FF6B6B' },
                              transaction_count: { type: 'number', example: 45 },
                            },
                          },
                        },
                        chart_config: {
                          type: 'object',
                          properties: {
                            type: { type: 'string', example: 'pie' },
                            show_labels: { type: 'boolean', example: true },
                            show_percentages: { type: 'boolean', example: true },
                            min_slice_percentage: { type: 'number', example: 2.0 },
                          },
                        },
                        insights: {
                          type: 'object',
                          properties: {
                            top_category: {
                              type: 'object',
                              properties: {
                                name: { type: 'string', example: 'Food' },
                                percentage: { type: 'number', example: 42.9 },
                              },
                            },
                            categories_over_budget: { type: 'number', example: 2 },
                            diversity_score: {
                              type: 'number',
                              example: 0.75,
                              description: 'Spending diversity (0-1, higher = more diverse)',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid month format or minimum amount',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example:
                        'Invalid month format. Use YYYY-MM format or invalid minimum amount.',
                    },
                    error: { type: 'string', example: 'INVALID_PARAMETERS' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Authentication required' },
                    error: { type: 'string', example: 'UNAUTHORIZED' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    error: { type: 'string', example: 'INTERNAL_ERROR' },
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  // Monthly close report
  .get(
    '/monthly-close',
    async context => {
      try {
        return await reportsController.getMonthlyCloseReport(withAuth(context));
      } catch (error) {
        logger.error('Error in monthly close report route:', error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to retrieve monthly close report',
          data: null,
        };
      }
    },
    {
      query: t.Object({
        month: t.Optional(
          t.String({
            pattern: '^\\d{4}-\\d{2}$',
            description: 'Month for monthly close report (YYYY-MM format, default: current month)',
            example: '2024-03',
          })
        ),
        include_goals: t.Optional(
          t.Boolean({
            description: 'Include budget goals comparison (default: true)',
            example: true,
          })
        ),
      }),
      detail: {
        tags: ['Reports'],
        summary: 'Get monthly financial close report',
        description:
          'Retrieve comprehensive monthly summary including totals, category breakdowns, comparisons, goals, and insights for financial analysis',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Monthly close report retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Monthly close report retrieved successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        period: { type: 'string', example: 'March 2024' },
                        financial_summary: {
                          type: 'object',
                          properties: {
                            total_income: { type: 'number', example: 50000 },
                            total_expense: { type: 'number', example: 35000 },
                            net_income: { type: 'number', example: 15000 },
                            savings_rate: { type: 'number', example: 30.0 },
                            expense_ratio: { type: 'number', example: 70.0 },
                          },
                        },
                        category_breakdown: {
                          type: 'object',
                          properties: {
                            top_expenses: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  category: { type: 'string', example: 'Food' },
                                  amount: { type: 'number', example: 15000 },
                                  percentage: { type: 'number', example: 42.9 },
                                  transactions: { type: 'number', example: 45 },
                                },
                              },
                            },
                            income_sources: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  category: { type: 'string', example: 'Salary' },
                                  amount: { type: 'number', example: 45000 },
                                  percentage: { type: 'number', example: 90.0 },
                                },
                              },
                            },
                          },
                        },
                        comparison: {
                          type: 'object',
                          properties: {
                            vs_previous_month: {
                              type: 'object',
                              properties: {
                                income_change: { type: 'number', example: 5.2 },
                                expense_change: { type: 'number', example: -2.1 },
                                savings_change: { type: 'number', example: 12.5 },
                              },
                            },
                            vs_average: {
                              type: 'object',
                              properties: {
                                income_vs_avg: { type: 'number', example: 8.7 },
                                expense_vs_avg: { type: 'number', example: -5.3 },
                              },
                            },
                          },
                        },
                        goals: {
                          type: 'object',
                          properties: {
                            savings_goal: {
                              type: 'object',
                              properties: {
                                target: { type: 'number', example: 20000 },
                                actual: { type: 'number', example: 15000 },
                                achievement: { type: 'number', example: 75.0 },
                                status: {
                                  type: 'string',
                                  enum: ['on_target', 'below_target', 'above_target'],
                                  example: 'below_target',
                                },
                              },
                            },
                            expense_budget: {
                              type: 'object',
                              properties: {
                                target: { type: 'number', example: 30000 },
                                actual: { type: 'number', example: 35000 },
                                overspend: { type: 'number', example: 5000 },
                                status: {
                                  type: 'string',
                                  enum: ['within_budget', 'over_budget', 'under_budget'],
                                  example: 'over_budget',
                                },
                              },
                            },
                          },
                        },
                        insights: {
                          type: 'array',
                          items: {
                            type: 'string',
                            example: 'Food expenses increased 15% from last month',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid month format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Invalid month format. Use YYYY-MM format.',
                    },
                    error: { type: 'string', example: 'INVALID_MONTH_FORMAT' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Authentication required' },
                    error: { type: 'string', example: 'UNAUTHORIZED' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Internal server error' },
                    error: { type: 'string', example: 'INTERNAL_ERROR' },
                  },
                },
              },
            },
          },
        },
      },
    }
  );
